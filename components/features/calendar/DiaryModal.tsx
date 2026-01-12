import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  Animated,
  Platform,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { CharacterType } from './types';

interface DiaryModalProps {
  visible: boolean;
  onClose: () => void;
}

const DiaryModal: React.FC<DiaryModalProps> = ({ visible, onClose }) => {
  const [selectedChar, setSelectedChar] = useState<CharacterType>('BROWN');
  const [selectedEmojiIndex, setSelectedEmojiIndex] = useState<number>(0);
  const [diaryText, setDiaryText] = useState<string>('');

  // Animation
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (visible) {
      scaleAnim.setValue(1);
      Animated.spring(scaleAnim, {
        toValue: 1.25,
        friction: 4,
        tension: 40,
        useNativeDriver: true,
      }).start();
    }
  }, [selectedEmojiIndex, visible]);

  const getEmojis = (type: CharacterType) => {
    const color = type === 'BROWN' ? '#7D5A44' : '#76E24E';
    return [
      { id: '1', icon: 'emoticon-happy' },
      { id: '2', icon: 'emoticon-neutral' },
      { id: '3', icon: 'emoticon-angry' },
      { id: '4', icon: 'emoticon-confused' },
      { id: '5', icon: 'emoticon-kiss' },
      { id: '6', icon: 'emoticon-cry' },
    ].map(e => ({ ...e, color }));
  };

  return (
    <Modal animationType="fade" transparent visible={visible} onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={onClose}><Ionicons name="close" size={28} color="#333" /></TouchableOpacity>
            <Text style={styles.modalTitle}>일기</Text>
            <TouchableOpacity onPress={onClose}><Ionicons name="checkmark" size={28} color="#333" /></TouchableOpacity>
          </View>

          <View style={styles.charSelectionRow}>
            <TouchableOpacity style={[styles.charTab, selectedChar === 'BROWN' && styles.activeCharTab]} onPress={() => setSelectedChar('BROWN')}>
              <MaterialCommunityIcons name="bird" size={40} color="#7D5A44" />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.charTab, selectedChar === 'GREEN' && styles.activeCharTab]} onPress={() => setSelectedChar('GREEN')}>
              <MaterialCommunityIcons name="bird" size={40} color="#76E24E" />
            </TouchableOpacity>
          </View>

          <View style={styles.emojiRow}>
            {getEmojis(selectedChar).map((emoji, index) => {
              const isSelected = selectedEmojiIndex === index;
              return (
                <TouchableOpacity key={emoji.id} onPress={() => setSelectedEmojiIndex(index)}>
                  <Animated.View style={[styles.emojiCircle, isSelected && { transform: [{ scale: scaleAnim }] }]}>
                    <MaterialCommunityIcons name={emoji.icon as any} size={32} color={emoji.color} />
                  </Animated.View>
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={styles.inputContainer}>
            <TextInput style={styles.textInput} placeholder="일기를 작성해보세요." multiline maxLength={200} value={diaryText} onChangeText={setDiaryText} />
            <Text style={styles.charCount}>{diaryText.length}/200</Text>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: '92%', backgroundColor: '#fff', borderRadius: 30, padding: 20, alignItems: 'center' },
  modalHeader: { width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 18, fontWeight: 'bold' },
  charSelectionRow: { flexDirection: 'row', gap: 30, marginBottom: 30 },
  charTab: { width: 80, height: 60, justifyContent: 'center', alignItems: 'center', borderRadius: 20 },
  activeCharTab: { backgroundColor: '#fff', ...Platform.select({ ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 6 }, android: { elevation: 5 } }) },
  emojiRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', height: 60, marginBottom: 25 },
  emojiCircle: { width: 48, height: 48, justifyContent: 'center', alignItems: 'center' },
  inputContainer: { width: '100%', backgroundColor: '#F8F9FA', borderRadius: 20, padding: 20, minHeight: 180 },
  textInput: { flex: 1, fontSize: 16, textAlignVertical: 'top' },
  charCount: { alignSelf: 'flex-end', color: '#BBB', fontSize: 12 },
});

export default DiaryModal;
