import React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type ChatExitModalProps = {
  visible: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

const ChatExitModal = ({ visible, onCancel, onConfirm }: ChatExitModalProps) => (
  <Modal
    visible={visible}
    transparent
    animationType="fade"
    onRequestClose={onCancel}
  >
    <View style={styles.modalBackdrop}>
      <View style={styles.modalCard}>
        <Text style={styles.modalTitle}>채팅방을 나가시겠습니까?</Text>
        <Text style={styles.modalDesc}>
          대화 내용이 삭제되고 복구할 수 없어요.
        </Text>
        <View style={styles.modalActions}>
          <TouchableOpacity style={styles.modalCancel} onPress={onCancel}>
            <Text style={styles.modalCancelText}>취소</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.modalConfirm} onPress={onConfirm}>
            <Text style={styles.modalConfirmText}>나가기</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </Modal>
);

export default ChatExitModal;

const styles = StyleSheet.create({
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  modalCard: {
    width: '100%',
    maxWidth: 320,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 20,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#212121',
  },
  modalDesc: {
    marginTop: 8,
    fontSize: 12,
    color: '#757575',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 16,
  },
  modalCancel: {
    flex: 1,
    backgroundColor: '#E0E0E0',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalCancelText: {
    color: '#424242',
    fontWeight: '700',
  },
  modalConfirm: {
    flex: 1,
    backgroundColor: '#2DB400',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalConfirmText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});
