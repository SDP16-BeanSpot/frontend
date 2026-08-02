import React, { useRef, useCallback, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { WebView } from 'react-native-webview';
import type { WebViewMessageEvent } from 'react-native-webview';
import type { MapMarker, BeanSpotKakaoMapViewProps } from './BeanSpotKakaoMapView';

/**
 * iOS 용 Kakao 지도. 앱 자체 네이티브 컴포넌트(BeanSpotKakaoMapView)는 Android 에만
 * 있어서, iOS 에서는 Kakao Maps JS SDK 를 WebView 로 띄웁니다.
 *
 * HTML 은 최초 1회만 만들고, 이후 마커·카메라 변경은 injectJavaScript 로 전달합니다.
 * (source 를 갈아끼우면 WebView 가 통째로 리로드되면서 지도 위치가 초기값으로
 *  돌아가고, 그게 다시 onCameraChange → 재조회 → 리로드 루프를 만듭니다.)
 */

const APP_KEY = process.env.EXPO_PUBLIC_KAKAO_MAP_KEY ?? '';

/**
 * Kakao JS SDK 는 요청 Referer 를 개발자 콘솔 [앱 설정 > 플랫폼 > Web]에 등록된
 * 사이트 도메인과 대조합니다. baseUrl 없이 HTML 을 주입하면 WKWebView 의 origin 이
 * about:blank 라 인증에 실패하고 지도가 빈 화면으로 뜹니다.
 * 콘솔에 등록한 도메인과 반드시 같은 값을 넣으세요.
 */
const WEB_ORIGIN = process.env.EXPO_PUBLIC_KAKAO_MAP_WEB_ORIGIN ?? 'https://localhost';

const DEFAULT_CAMERA = { lat: 37.4979, lng: 126.8291, zoomLevel: 3 };

interface SerializedMarker {
  id: string;
  lat: number;
  lng: number;
  title: string;
  category: string;
}

const serializeMarkers = (markers: MapMarker[]): SerializedMarker[] =>
  markers.map((m) => ({
    id: m.id,
    lat: m.latitude,
    lng: m.longitude,
    title: m.title ?? '',
    category: m.category ?? '',
  }));

/** JS 소스에 그대로 끼워 넣어도 안전하도록 줄바꿈 취급되는 유니코드를 이스케이프 */
const toJsLiteral = (value: unknown): string =>
  JSON.stringify(value).replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029');

function buildHtml(camera: { lat: number; lng: number; zoomLevel?: number }) {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no"/>
  <style>
    * { margin:0; padding:0; box-sizing:border-box; }
    html, body, #map { width:100%; height:100%; }
  </style>
</head>
<body>
<div id="map"></div>
<script>
  function post(payload) {
    window.ReactNativeWebView.postMessage(JSON.stringify(payload));
  }
  window.onerror = function (message) {
    post({ type: 'error', message: String(message) });
  };
</script>
<script
  src="https://dapi.kakao.com/v2/maps/sdk.js?appkey=${APP_KEY}&autoload=false"
  onerror="post({ type: 'error', message: 'Kakao Maps SDK 를 불러오지 못했습니다. 네트워크와 앱키를 확인하세요.' })"
></script>
<script>
kakao.maps.load(function() {
  var map = new kakao.maps.Map(document.getElementById('map'), {
    center: new kakao.maps.LatLng(${camera.lat}, ${camera.lng}),
    level: ${camera.zoomLevel ?? DEFAULT_CAMERA.zoomLevel}
  });

  var markerObjects = [];

  // 마커 전체 교체. RN 쪽 markers prop 이 바뀔 때마다 호출됩니다.
  window.__setMarkers = function(items) {
    markerObjects.forEach(function(m) { m.setMap(null); });
    markerObjects = items.map(function(item) {
      var marker = new kakao.maps.Marker({
        position: new kakao.maps.LatLng(item.lat, item.lng),
        map: map
      });
      kakao.maps.event.addListener(marker, 'click', function() {
        post({ type: 'markerPress', id: item.id });
      });
      return marker;
    });
  };

  window.__moveCamera = function(lat, lng, zoomLevel) {
    map.setCenter(new kakao.maps.LatLng(lat, lng));
    if (zoomLevel) map.setLevel(zoomLevel);
  };

  // 보이는 영역이 바뀌면 알림 (지도 범위 내 공고만 목록에 표시하기 위함)
  function postBounds() {
    var b = map.getBounds();
    var sw = b.getSouthWest();
    var ne = b.getNorthEast();
    post({
      type: 'cameraChange',
      minLat: sw.getLat(),
      maxLat: ne.getLat(),
      minLng: sw.getLng(),
      maxLng: ne.getLng()
    });
  }
  kakao.maps.event.addListener(map, 'idle', postBounds);

  // 맵 준비 완료 알림 (최초 표시 영역도 함께 전달)
  post({ type: 'mapReady' });
  postBounds();
});
</script>
</body>
</html>`;
}

interface KakaoMapWebViewProps extends Omit<BeanSpotKakaoMapViewProps, 'markerImage'> {
  camera?: { lat: number; lng: number; zoomLevel?: number };
}

const KakaoMapWebView: React.FC<KakaoMapWebViewProps> = ({
  markers = [],
  onMarkerPress,
  onMapReady,
  onCameraChange,
  initialCamera,
  camera,
  style,
}) => {
  const webViewRef = useRef<WebView>(null);
  const readyRef = useRef(false);

  // 최신 값을 mapReady 시점에 한 번에 밀어 넣기 위해 보관
  const markersRef = useRef(markers);
  markersRef.current = markers;
  const cameraRef = useRef(camera);
  cameraRef.current = camera;

  // HTML 은 마운트 시 딱 한 번만 생성 (리로드 방지)
  const htmlRef = useRef<string | null>(null);
  if (htmlRef.current === null) {
    htmlRef.current = buildHtml(initialCamera ?? DEFAULT_CAMERA);
  }

  const inject = useCallback((script: string) => {
    // injectJavaScript 는 마지막 표현식을 iOS 로 되돌려 보내므로 true 로 끝내야 경고가 없습니다.
    webViewRef.current?.injectJavaScript(`${script} true;`);
  }, []);

  const pushMarkers = useCallback(
    (items: MapMarker[]) => inject(`window.__setMarkers(${toJsLiteral(serializeMarkers(items))});`),
    [inject],
  );

  const pushCamera = useCallback(
    (next: { lat: number; lng: number; zoomLevel?: number }) =>
      inject(`window.__moveCamera(${next.lat}, ${next.lng}, ${next.zoomLevel ?? 0});`),
    [inject],
  );

  useEffect(() => {
    if (readyRef.current) pushMarkers(markers);
  }, [markers, pushMarkers]);

  useEffect(() => {
    if (readyRef.current && camera) pushCamera(camera);
  }, [camera, pushCamera]);

  const handleMessage = useCallback(
    (e: WebViewMessageEvent) => {
      let msg: any;
      try {
        msg = JSON.parse(e.nativeEvent.data);
      } catch {
        return;
      }

      switch (msg.type) {
        case 'mapReady':
          readyRef.current = true;
          // 지도가 준비되기 전에 도착한 마커·카메라를 지금 반영
          pushMarkers(markersRef.current);
          if (cameraRef.current) pushCamera(cameraRef.current);
          onMapReady?.();
          break;
        case 'markerPress':
          onMarkerPress?.({ nativeEvent: { id: msg.id } } as any);
          break;
        case 'cameraChange':
          onCameraChange?.({
            nativeEvent: {
              minLat: msg.minLat,
              maxLat: msg.maxLat,
              minLng: msg.minLng,
              maxLng: msg.maxLng,
            },
          } as any);
          break;
        case 'error':
          console.warn('[KakaoMapWebView]', msg.message);
          break;
      }
    },
    [onMapReady, onMarkerPress, onCameraChange, pushMarkers, pushCamera],
  );

  if (!APP_KEY || APP_KEY === 'your_kakao_map_javascript_key_here') {
    return (
      <View style={[styles.placeholder, style]}>
        <Text style={styles.placeholderText}>
          지도를 불러올 수 없습니다.{'\n'}
          .env 에 EXPO_PUBLIC_KAKAO_MAP_KEY(카카오 JavaScript 키)를 설정해주세요.
        </Text>
      </View>
    );
  }

  return (
    <WebView
      ref={webViewRef}
      style={[styles.webview, style]}
      source={{ html: htmlRef.current, baseUrl: WEB_ORIGIN }}
      onMessage={handleMessage}
      javaScriptEnabled
      domStorageEnabled
      originWhitelist={['*']}
      scrollEnabled={false}
    />
  );
};

const styles = StyleSheet.create({
  webview: { flex: 1 },
  placeholder: {
    flex: 1,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  placeholderText: {
    fontSize: 13,
    color: '#757575',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default KakaoMapWebView;
