import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import { Feather } from '@expo/vector-icons';

interface WelcomePopupProps {
  visible: boolean;
  onClose: () => void;
  onGoRegister: () => void;
}

const WelcomePopup: React.FC<WelcomePopupProps> = ({ visible, onClose, onGoRegister }) => {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose} />
      <View style={styles.center}>
        <View style={styles.card}>
          {/* 닫기 */}
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Feather name="x" size={22} color="#888" />
          </TouchableOpacity>

          {/* 타이틀 */}
          <Text style={styles.title}>Green Records in Calender</Text>
          <Text style={styles.subtitle}>
            빈스팟님의 초록 발자취를{'\n'}
            <Text style={styles.highlight}>빈스팟 캘린더</Text>에 남겨세요.
          </Text>

          {/* CTA 버튼 */}
          <TouchableOpacity style={styles.ctaBtn} onPress={onGoRegister}>
            <Feather name="plus" size={16} color="#fff" style={{ marginRight: 6 }} />
            <Text style={styles.ctaText}>관심 공고 등록하러 가기</Text>
          </TouchableOpacity>

          <Text style={styles.hint}>관심 공고를 등록하면 자동으로 캘린더에 추가돼요!</Text>

          {/* 마스코트 이미지 */}
          <View style={styles.mascotRow}>
            <Image
              source={require('../../../assets/images/icon.png')}
              style={styles.mascot}
              resizeMode="contain"
            />
            <Image
              source={require('../../../assets/images/icon.png')}
              style={[styles.mascot, { tintColor: '#7D5A44' }]}
              resizeMode="contain"
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  center: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 28,
  },
  card: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 20,
    alignItems: 'center',
  },
  closeBtn: { position: 'absolute', top: 16, right: 16, padding: 4 },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#222',
    marginBottom: 12,
    marginTop: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  highlight: { color: '#4CAF50', fontWeight: '700' },
  ctaBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 24,
    marginBottom: 12,
    width: '100%',
    justifyContent: 'center',
  },
  ctaText: { fontSize: 15, fontWeight: '700', color: '#fff' },
  hint: { fontSize: 12, color: '#AAA', marginBottom: 20 },
  mascotRow: { flexDirection: 'row', gap: 16, justifyContent: 'center' },
  mascot: { width: 72, height: 72 },
});

export default WelcomePopup;
