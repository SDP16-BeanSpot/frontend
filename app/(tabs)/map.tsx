import React from 'react';
import { WebView } from 'react-native-webview';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Constants from 'expo-constants';

// kakao-map.html 파일의 내용을 문자열로 불러옵니다.
// require는 번들링 시 파일 내용을 가져오므로, .toString()은 실제로는 필요하지 않을 수 있으나,
// 확실하게 문자열로 다루기 위해 명시적으로 추가해볼 수 있습니다. (실제 동작은 환경에 따라 다름)
// 더 안정적인 방법은 metro.config.js에서 assetPlugins를 설정하는 것이지만, 우선 이 방법으로 시도합니다.
const mapHtml = require('@/assets/html/kakao-map.html');

// [중요] 카카오 개발자 콘솔에서 발급받은 JavaScript 키를 사용해야 합니다.
// 현재는 임시로 useKakaoAuth.ts에 있던 REST API 키를 사용합니다.
const KAKAO_MAPS_API_KEY = 'dcc3060fb81d292dabe5c0e380d3525f'; 

export default function MapScreen() {
  const injectedJavaScript = `
    (function() {
      window.kakaoMapsApiKey = "${KAKAO_MAPS_API_KEY}";
    })();
  `;

  return (
    <SafeAreaView style={styles.container}>
      <WebView
        originWhitelist={['*']}
        source={mapHtml} // require로 가져온 파일은 객체 그대로 전달
        style={styles.webview}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        injectedJavaScript={injectedJavaScript}
        onMessage={() => {}} // onMessage 핸들러가 필요할 수 있음
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: Constants.statusBarHeight,
  },
  webview: {
    flex: 1,
  },
});
