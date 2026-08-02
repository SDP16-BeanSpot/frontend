//
// Use this file to import your target's public headers that you would like to expose to Swift.
//

// 카카오톡 앱 전환 로그인 콜백(kakao{네이티브앱키}:// 스킴)을 AppDelegate.swift 에서
// 처리하기 위해 노출합니다. @react-native-kakao/core 의 Expo config plugin 이 이 작업을
// 대신 해주지만 Objective-C AppDelegate 만 지원하므로 직접 연결합니다.
#import <RNCKakaoUser/RNCKakaoUserUtil.h>
