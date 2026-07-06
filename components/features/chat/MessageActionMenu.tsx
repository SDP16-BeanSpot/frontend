import React from 'react';
import { Modal, Pressable, StyleSheet, Text, TouchableOpacity, View, Dimensions } from 'react-native';
import { MaterialCommunityIcons, Feather, Ionicons } from '@expo/vector-icons';
import { REACTION_ICON_NAMES, REACTION_TYPES, type ReactionType } from '../../../features/chat/types';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const MENU_WIDTH = 220;
const MENU_HEIGHT = 120;

interface MessageActionMenuProps {
  visible: boolean;
  /** 롱프레스 발생 지점 (nativeEvent.pageX/pageY) */
  anchor: { x: number; y: number } | null;
  /** 내가 보낸 메시지면 신고하기를 숨김 */
  canReport: boolean;
  onSelectReaction: (type: ReactionType) => void;
  onReply: () => void;
  onReport: () => void;
  onClose: () => void;
}

const MessageActionMenu = ({
  visible,
  anchor,
  canReport,
  onSelectReaction,
  onReply,
  onReport,
  onClose,
}: MessageActionMenuProps) => {
  if (!visible || !anchor) return null;

  const left = Math.min(Math.max(anchor.x - MENU_WIDTH / 2, 12), SCREEN_WIDTH - MENU_WIDTH - 12);
  const top = Math.min(Math.max(anchor.y - MENU_HEIGHT - 12, 60), SCREEN_HEIGHT - MENU_HEIGHT - 100);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose} />
      <View style={[styles.menu, { left, top }]}>
        {/* 이모지 리액션 5종 */}
        <View style={styles.reactionRow}>
          {REACTION_TYPES.map((type) => (
            <TouchableOpacity
              key={type}
              style={styles.reactionBtn}
              onPress={() => onSelectReaction(type)}
              hitSlop={{ top: 6, bottom: 6, left: 4, right: 4 }}
            >
              <MaterialCommunityIcons
                name={REACTION_ICON_NAMES[type] as any}
                size={26}
                color="#7D5A44"
              />
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.divider} />

        <TouchableOpacity style={styles.actionRow} onPress={onReply}>
          <Feather name="corner-up-left" size={16} color="#333" />
          <Text style={styles.actionText}>답글쓰기</Text>
        </TouchableOpacity>

        {canReport && (
          <TouchableOpacity style={styles.actionRow} onPress={onReport}>
            <Ionicons name="alert-circle-outline" size={16} color="#E53935" />
            <Text style={[styles.actionText, { color: '#E53935' }]}>신고하기</Text>
          </TouchableOpacity>
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.15)' },
  menu: {
    position: 'absolute',
    width: MENU_WIDTH,
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 10,
  },
  reactionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  reactionBtn: { padding: 2 },
  divider: { height: 1, backgroundColor: '#F0F0F0', marginHorizontal: 8 },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 11,
  },
  actionText: { fontSize: 13, fontWeight: '600', color: '#333' },
});

export default MessageActionMenu;
