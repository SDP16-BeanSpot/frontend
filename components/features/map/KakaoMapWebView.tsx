import React, { useRef, useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';
import type { WebViewMessageEvent } from 'react-native-webview';
import type { MapMarker, BeanSpotKakaoMapViewProps } from './BeanSpotKakaoMapView';

const APP_KEY = process.env.EXPO_PUBLIC_KAKAO_MAP_KEY ?? '';

function buildHtml(markers: MapMarker[], camera: { lat: number; lng: number; zoomLevel?: number }) {
  const markersJson = JSON.stringify(
    markers.map((m) => ({
      id: m.id,
      lat: m.latitude,
      lng: m.longitude,
      title: m.title ?? '',
      category: m.category ?? '',
    })),
  );

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
<script src="https://dapi.kakao.com/v2/maps/sdk.js?appkey=${APP_KEY}&autoload=false"></script>
<script>
kakao.maps.load(function() {
  var container = document.getElementById('map');
  var options = {
    center: new kakao.maps.LatLng(${camera.lat}, ${camera.lng}),
    level: ${camera.zoomLevel ?? 3}
  };
  var map = new kakao.maps.Map(container, options);

  var markers = ${markersJson};
  markers.forEach(function(m) {
    var position = new kakao.maps.LatLng(m.lat, m.lng);
    var marker = new kakao.maps.Marker({ position: position, map: map });

    kakao.maps.event.addListener(marker, 'click', function() {
      window.ReactNativeWebView.postMessage(JSON.stringify({
        type: 'markerPress',
        id: m.id
      }));
    });
  });

  // 카메라 이동 메시지 수신
  window.addEventListener('message', function(e) {
    try {
      var msg = JSON.parse(e.data);
      if (msg.type === 'moveCamera') {
        var latlng = new kakao.maps.LatLng(msg.lat, msg.lng);
        map.setCenter(latlng);
        if (msg.zoomLevel) map.setLevel(msg.zoomLevel);
      }
    } catch(_) {}
  });

  // 맵 준비 완료 알림
  window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'mapReady' }));
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
  initialCamera = { lat: 37.4979, lng: 126.8291, zoomLevel: 3 },
  style,
}) => {
  const webViewRef = useRef<WebView>(null);

  const html = buildHtml(markers, initialCamera);

  const handleMessage = useCallback(
    (e: WebViewMessageEvent) => {
      try {
        const msg = JSON.parse(e.nativeEvent.data);
        if (msg.type === 'markerPress' && onMarkerPress) {
          onMarkerPress({ nativeEvent: { id: msg.id } } as any);
        }
        if (msg.type === 'mapReady' && onMapReady) {
          onMapReady();
        }
      } catch (_) {}
    },
    [onMarkerPress, onMapReady],
  );

  if (!APP_KEY || APP_KEY === 'your_kakao_map_javascript_key_here') {
    return (
      <View style={[styles.placeholder, style]}>
      </View>
    );
  }

  return (
    <WebView
      ref={webViewRef}
      style={[styles.webview, style]}
      source={{ html }}
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
  placeholder: { flex: 1, backgroundColor: '#F0F0F0' },
});

export default KakaoMapWebView;
