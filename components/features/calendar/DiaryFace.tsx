import React from 'react';
import { Image, StyleSheet, View, ImageStyle, StyleProp } from 'react-native';

import type { CharacterType, EmotionType } from '../../../features/calendar/types';

/**
 * 일기 감정 아바타.
 *
 * ⚠️ 현재 Figma 에서 추출된 표정 에셋은 GREEN(푸콩) 6종뿐입니다.
 *    BROWN(꾸콩) 표정 6종은 아직 없어, BROWN 선택 시에도 같은 표정 에셋을 쓰되
 *    배경색으로 캐릭터를 구분합니다. 꾸콩 표정 에셋을 추출하면 FACES 를 캐릭터별로 분기하세요.
 */
const FACES: Record<EmotionType, ReturnType<typeof require>> = {
  HAPPY: require('../../../assets/images/diaryFaceHappy.png'),
  TIRED: require('../../../assets/images/diaryFaceTired.png'),
  ANGRY: require('../../../assets/images/diaryFaceAngry.png'),
  SURPRISED: require('../../../assets/images/diaryFaceSurprised.png'),
  CALM: require('../../../assets/images/diaryFaceCalm.png'),
  SAD: require('../../../assets/images/diaryFaceSad.png'),
};

interface DiaryFaceProps {
  emotion: EmotionType;
  character?: CharacterType;
  size?: number;
  style?: StyleProp<ImageStyle>;
}

const DiaryFace = ({ emotion, character = 'GREEN', size = 32, style }: DiaryFaceProps) => (
  <View
    style={[
      styles.wrap,
      { width: size, height: size, borderRadius: size / 2 },
      character === 'BROWN' && styles.brown,
    ]}
  >
    <Image
      source={FACES[emotion]}
      style={[{ width: size, height: size }, style]}
      resizeMode="contain"
    />
  </View>
);

const styles = StyleSheet.create({
  wrap: { overflow: 'hidden', alignItems: 'center', justifyContent: 'center' },
  // 꾸콩 전용 표정 에셋이 준비되기 전까지의 임시 구분
  brown: { backgroundColor: '#7D5A44' },
});

export default DiaryFace;
