import React from 'react';
import { Image, ImageSourcePropType, ImageStyle, StyleProp } from 'react-native';

import type { CharacterType, EmotionType } from '../../../features/calendar/types';

/** 일기 감정 아바타 (Figma 추출 에셋). 캐릭터(푸콩/꾸콩) x 감정 6종 = 12종 */
const FACES: Record<CharacterType, Record<EmotionType, ImageSourcePropType>> = {
  GREEN: {
    HAPPY: require('../../../assets/images/diaryGreenHappy.png'),
    TIRED: require('../../../assets/images/diaryGreenTired.png'),
    ANGRY: require('../../../assets/images/diaryGreenAngry.png'),
    SURPRISED: require('../../../assets/images/diaryGreenSurprised.png'),
    CALM: require('../../../assets/images/diaryGreenCalm.png'),
    SAD: require('../../../assets/images/diaryGreenSad.png'),
  },
  BROWN: {
    HAPPY: require('../../../assets/images/diaryBrownHappy.png'),
    TIRED: require('../../../assets/images/diaryBrownTired.png'),
    ANGRY: require('../../../assets/images/diaryBrownAngry.png'),
    SURPRISED: require('../../../assets/images/diaryBrownSurprised.png'),
    CALM: require('../../../assets/images/diaryBrownCalm.png'),
    SAD: require('../../../assets/images/diaryBrownSad.png'),
  },
};

interface DiaryFaceProps {
  emotion: EmotionType;
  character?: CharacterType;
  size?: number;
  style?: StyleProp<ImageStyle>;
}

const DiaryFace = ({ emotion, character = 'GREEN', size = 32, style }: DiaryFaceProps) => (
  <Image
    source={FACES[character][emotion]}
    style={[{ width: size, height: size }, style]}
    resizeMode="contain"
  />
);

export default DiaryFace;
