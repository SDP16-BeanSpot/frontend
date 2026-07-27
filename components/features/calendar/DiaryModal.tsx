import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  Image,
  ImageSourcePropType,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import {
  DIARY_MAX_LENGTH,
  EMOTION_ORDER,
  type CharacterType,
  type DiaryData,
  type EmotionType,
} from '../../../features/calendar/types';
import DiaryFace from './DiaryFace';

export interface DiarySubmitPayload {
  characterType: CharacterType;
  emotionType: EmotionType;
  content: string;
}

interface DiaryModalProps {
  visible: boolean;
  onClose: () => void;
  /** 표시할 날짜 (yyyy-MM-dd). 없으면 헤더의 날짜 줄을 숨김 */
  date?: string;
  /** 기존 일기가 있으면 그 값으로 초기화 (수정 모드) */
  initialDiary?: DiaryData | null;
  onSubmit?: (payload: DiarySubmitPayload) => void;
}

const CHARACTERS: { type: CharacterType; image: ImageSourcePropType }[] = [
  { type: 'BROWN', image: require('../../../assets/images/beanBrown.png') },
  { type: 'GREEN', image: require('../../../assets/images/beanGreen.png') },
];

const formatKoreanDate = (date: string) => {
  const [y, m, d] = date.split('-');
  return `${y}년 ${Number(m)}월 ${Number(d)}일`;
};

const DiaryModal: React.FC<DiaryModalProps> = ({
  visible,
  onClose,
  date,
  initialDiary,
  onSubmit,
}) => {
  const [selectedChar, setSelectedChar] = useState<CharacterType>('GREEN');
  const [selectedEmotion, setSelectedEmotion] = useState<EmotionType>('HAPPY');
  const [diaryText, setDiaryText] = useState<string>('');

  // 모달이 열릴 때마다 대상 날짜의 기존 일기로 초기화 (없으면 기본값)
  useEffect(() => {
    if (!visible) return;
    setSelectedChar(initialDiary?.characterType ?? 'GREEN');
    setSelectedEmotion(initialDiary?.emotionType ?? 'HAPPY');
    setDiaryText(initialDiary?.content ?? '');
  }, [visible, initialDiary]);

  const handleSubmit = () => {
    onSubmit?.({
      characterType: selectedChar,
      emotionType: selectedEmotion,
      content: diaryText.trim(),
    });
    onClose();
  };

  return (
    <Modal animationType="fade" transparent visible={visible} onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={28} color="#333" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>일기</Text>
            <TouchableOpacity onPress={handleSubmit}>
              <Ionicons name="checkmark" size={28} color="#333" />
            </TouchableOpacity>
          </View>

          {date && <Text style={styles.dateLabel}>{formatKoreanDate(date)}</Text>}

          {/* 캐릭터 선택 (꾸콩 / 푸콩) */}
          <View style={styles.charSelectionRow}>
            {CHARACTERS.map((c) => (
              <TouchableOpacity
                key={c.type}
                style={[styles.charTab, selectedChar === c.type && styles.activeCharTab]}
                onPress={() => setSelectedChar(c.type)}
              >
                <Image source={c.image} style={styles.charImage} resizeMode="contain" />
              </TouchableOpacity>
            ))}
          </View>

          {/* 감정 선택 */}
          <View style={styles.emojiRow}>
            {EMOTION_ORDER.map((emotion) => {
              const isSelected = selectedEmotion === emotion;
              return (
                <TouchableOpacity key={emotion} onPress={() => setSelectedEmotion(emotion)}>
                  <DiaryFace
                    emotion={emotion}
                    character={selectedChar}
                    size={isSelected ? 40 : 32}
                  />
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              placeholder="일기를 작성해보세요."
              placeholderTextColor="#BBB"
              multiline
              maxLength={DIARY_MAX_LENGTH}
              value={diaryText}
              onChangeText={setDiaryText}
            />
            <Text style={styles.charCount}>
              {diaryText.length}/{DIARY_MAX_LENGTH}
            </Text>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '92%',
    backgroundColor: '#fff',
    borderRadius: 30,
    padding: 20,
    alignItems: 'center',
  },
  modalHeader: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  modalTitle: { fontSize: 18, fontWeight: 'bold' },
  dateLabel: {
    alignSelf: 'flex-start',
    fontSize: 15,
    fontWeight: '700',
    color: '#222',
    marginBottom: 16,
  },
  charSelectionRow: { flexDirection: 'row', gap: 30, marginBottom: 24 },
  charTab: {
    width: 63,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
  activeCharTab: {
    backgroundColor: '#F2F2F2',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
      },
      android: { elevation: 5 },
    }),
  },
  charImage: { width: 42, height: 52 },
  emojiRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    height: 48,
    marginBottom: 25,
  },
  inputContainer: {
    width: '100%',
    backgroundColor: '#F8F9FA',
    borderRadius: 20,
    padding: 20,
    minHeight: 180,
  },
  textInput: { flex: 1, fontSize: 15, color: '#333', textAlignVertical: 'top' },
  charCount: { alignSelf: 'flex-end', color: '#BBB', fontSize: 12 },
});

export default DiaryModal;
