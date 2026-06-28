import React from 'react';
import {
  Platform,
  requireNativeComponent,
  type ViewProps,
  type NativeSyntheticEvent,
} from 'react-native';
import { View } from 'react-native';

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
  onMarkerPress,
  onMapReady,
  initialCamera,
  ...rest
}: BeanSpotKakaoMapViewProps) => {
  if (Platform.OS !== 'android') {
    let IOSKakaoMapView: React.ComponentType<any> | null = null;
    try {
      const { KakaoMapView } = require('@react-native-kakao/map');
      IOSKakaoMapView = KakaoMapView;
    } catch (_) {
      IOSKakaoMapView = null;
    }

    if (!IOSKakaoMapView) {
      return <View {...rest} />;
    }

    return (
      <IOSKakaoMapView
        initialCamera={initialCamera}
        {...rest}
      />
    );
  }

  return (
    <NativeBeanSpotKakaoMapView
      markers={markers}
      markerImage={markerImage}
      onMarkerPress={onMarkerPress}
      onMapReady={onMapReady}
      {...rest}
    />
  );
};

export default BeanSpotKakaoMapView;
