import React from 'react';
import {
  Platform,
  requireNativeComponent,
  type ViewProps,
  type NativeSyntheticEvent,
} from 'react-native';
import KakaoMapWebView from './KakaoMapWebView';

export interface MapMarker {
  id: string;
  title?: string;
  latitude: number;
  longitude: number;
  category?: string;
}

export interface MarkerPressEvent {
  id: string;
}

export interface BeanSpotKakaoMapViewProps extends ViewProps {
  markers: MapMarker[];
  markerImage?: string;
  camera?: { lat: number; lng: number; zoomLevel?: number };
  onMarkerPress?: (event: NativeSyntheticEvent<MarkerPressEvent>) => void;
  onMapReady?: () => void;
  initialCamera?: {
    lat: number;
    lng: number;
    zoomLevel?: number;
  };
}

const NativeBeanSpotKakaoMapView =
  requireNativeComponent<BeanSpotKakaoMapViewProps>('BeanSpotKakaoMapView');

const BeanSpotKakaoMapView = ({
  markers,
  markerImage,
  camera,
  onMarkerPress,
  onMapReady,
  initialCamera,
  ...rest
}: BeanSpotKakaoMapViewProps) => {
  if (Platform.OS !== 'android') {
    // iOS: WebView 기반 Kakao Map JS SDK 사용
    // @react-native-kakao/map의 iOS 구현이 비어있어 WebView로 대체
    return (
      <KakaoMapWebView
        markers={markers}
        onMarkerPress={onMarkerPress}
        onMapReady={onMapReady}
        initialCamera={initialCamera}
        camera={camera}
        {...rest}
      />
    );
  }

  return (
    <NativeBeanSpotKakaoMapView
      markers={markers}
      markerImage={markerImage}
      camera={camera}
      onMarkerPress={onMarkerPress}
      onMapReady={onMapReady}
      {...rest}
    />
  );
};

export default BeanSpotKakaoMapView;
