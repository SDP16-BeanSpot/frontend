import { Alert, Linking } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

/**
 * 카메라/앨범 이미지 선택 공용 헬퍼.
 *
 * 네이티브 권한(Android CAMERA / iOS NSCameraUsageDescription)은
 * AndroidManifest.xml, ios/BeanSpot/Info.plist, app.config.js 세 곳에 선언되어 있습니다.
 * (bare 워크플로라 android/·ios/ 가 저장소에 커밋돼 있어 prebuild 없이도 반영되도록 직접 관리)
 */

export interface PickedImage {
  uri: string;
  name: string;
  type: string;
}

const PICKER_OPTIONS: ImagePicker.ImagePickerOptions = {
  mediaTypes: ['images'],
  quality: 0.85,
};

const toPickedImage = (
  asset: ImagePicker.ImagePickerAsset,
  fallbackName: string,
): PickedImage => ({
  uri: asset.uri,
  name: asset.fileName ?? fallbackName,
  type: asset.mimeType ?? 'image/jpeg',
});

/** 권한이 영구 거부된 경우 설정 앱으로 유도 */
const alertPermissionDenied = (label: string, canAskAgain: boolean) => {
  if (canAskAgain) {
    Alert.alert('알림', `${label} 권한이 필요합니다.`);
    return;
  }
  Alert.alert('알림', `${label} 권한이 거부되어 있습니다. 설정에서 권한을 허용해주세요.`, [
    { text: '취소', style: 'cancel' },
    { text: '설정 열기', onPress: () => Linking.openSettings() },
  ]);
};

/** 카메라로 촬영. 취소하거나 권한이 없으면 null */
export const takePhoto = async (fallbackName = 'photo.jpg'): Promise<PickedImage | null> => {
  const permission = await ImagePicker.requestCameraPermissionsAsync();
  if (!permission.granted) {
    alertPermissionDenied('카메라', permission.canAskAgain);
    return null;
  }
  const result = await ImagePicker.launchCameraAsync(PICKER_OPTIONS);
  if (result.canceled || !result.assets[0]) return null;
  return toPickedImage(result.assets[0], fallbackName);
};

/** 앨범에서 선택. 취소하거나 권한이 없으면 null */
export const pickFromLibrary = async (
  fallbackName = 'image.jpg',
): Promise<PickedImage | null> => {
  const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!permission.granted) {
    alertPermissionDenied('사진 접근', permission.canAskAgain);
    return null;
  }
  const result = await ImagePicker.launchImageLibraryAsync(PICKER_OPTIONS);
  if (result.canceled || !result.assets[0]) return null;
  return toPickedImage(result.assets[0], fallbackName);
};
