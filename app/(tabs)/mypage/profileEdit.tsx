import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function ProfileEditScreen() {
  const router = useRouter();
  const [nickname, setNickname] = useState('');
  const [showImageSheet, setShowImageSheet] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>프로필 수정</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Profile Image */}
      <View style={styles.avatarWrap}>
        <View style={styles.avatarCircle}>
          <Image
            source={require('../../../assets/images/icon.png')}
            style={styles.avatarImage}
            resizeMode="contain"
          />
        </View>
        <TouchableOpacity
          style={styles.cameraBtn}
          onPress={() => setShowImageSheet(true)}
        >
          <Feather name="camera" size={14} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Nickname Input */}
      <View style={styles.inputSection}>
        <Text style={styles.inputLabel}>닉네임</Text>
        <TextInput
          style={styles.input}
          placeholder="변경할 닉네임을 입력해주세요"
          placeholderTextColor="#BDBDBD"
          value={nickname}
          onChangeText={setNickname}
          maxLength={20}
        />
      </View>

      {/* Bottom Buttons */}
      <View style={styles.bottomButtons}>
        <TouchableOpacity
          style={styles.cancelBtn}
          onPress={() => router.back()}
        >
          <Text style={styles.cancelText}>취소</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.confirmBtn, !nickname.trim() && styles.confirmBtnDisabled]}
          onPress={() => {
            if (nickname.trim()) router.back();
          }}
        >
          <Text style={styles.confirmText}>완료</Text>
        </TouchableOpacity>
      </View>

      {/* Image Picker Bottom Sheet */}
      <Modal
        visible={showImageSheet}
        transparent
        animationType="slide"
        onRequestClose={() => setShowImageSheet(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowImageSheet(false)}
        />
        <View style={styles.sheet}>
          <TouchableOpacity
            style={styles.sheetItem}
            onPress={() => setShowImageSheet(false)}
          >
            <Text style={styles.sheetItemText}>기본 사진으로</Text>
          </TouchableOpacity>
          <View style={styles.sheetDivider} />
          <TouchableOpacity
            style={styles.sheetItem}
            onPress={() => setShowImageSheet(false)}
          >
            <Text style={styles.sheetItemText}>앨범에서 선택</Text>
          </TouchableOpacity>
          <View style={styles.sheetDivider} />
          <TouchableOpacity
            style={styles.sheetItem}
            onPress={() => setShowImageSheet(false)}
          >
            <Text style={[styles.sheetItemText, styles.sheetClose]}>닫기</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: '#F5F5F5',
  },
  backBtn: { padding: 4 },
  headerTitle: { fontSize: 17, fontWeight: '700', color: '#333' },
  avatarWrap: {
    alignSelf: 'center',
    marginTop: 32,
    marginBottom: 40,
  },
  avatarCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: '#E8F5E4',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  avatarImage: { width: 64, height: 64 },
  cameraBtn: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#888',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#F5F5F5',
  },
  inputSection: { paddingHorizontal: 24 },
  inputLabel: { fontSize: 14, color: '#555', marginBottom: 8 },
  input: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: '#333',
  },
  bottomButtons: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingBottom: 36,
    paddingTop: 12,
    gap: 12,
    backgroundColor: '#F5F5F5',
  },
  cancelBtn: {
    flex: 1,
    height: 52,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  cancelText: { fontSize: 16, fontWeight: '600', color: '#4CAF50' },
  confirmBtn: {
    flex: 2,
    height: 52,
    borderRadius: 14,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmBtnDisabled: { backgroundColor: '#A5D6A7' },
  confirmText: { fontSize: 16, fontWeight: '700', color: '#fff' },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 34,
  },
  sheetItem: {
    paddingVertical: 18,
    alignItems: 'center',
  },
  sheetItemText: { fontSize: 16, color: '#333', fontWeight: '500' },
  sheetDivider: { height: 1, backgroundColor: '#F0F0F0', marginHorizontal: 20 },
  sheetClose: { color: '#999' },
});
