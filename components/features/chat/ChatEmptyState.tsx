import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import type { ChatGroup } from '../../../features/chat/types';

interface ChatEmptyStateProps {
  activeTab: ChatGroup;
}

const COPY = {
  interest: {
    title: '앗 아직 찜한 공고가 없어요.',
    cta: '공고 둘러보기',
  },
  recent: {
    title: '앗 아직 최근 본 공고가 없어요.',
    cta: '공고 둘러보기',
  },
};

const ChatEmptyState = ({ activeTab }: ChatEmptyStateProps) => {
  const copy = COPY[activeTab];

  return (
    <View style={styles.container}>
      <Image
        source={require('../../../assets/images/icon.png')}
        style={styles.mascot}
        resizeMode="contain"
      />
      <Text style={styles.title}>{copy.title}</Text>
      <TouchableOpacity style={styles.ctaBtn}>
        <Text style={styles.ctaText}>{copy.cta}</Text>
        <Feather name="chevron-right" size={14} color="#555" />
      </TouchableOpacity>
    </View>
  );
};

export default ChatEmptyState;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 80,
    gap: 14,
  },
  mascot: {
    width: 90,
    height: 90,
    opacity: 0.5,
    marginBottom: 4,
  },
  title: {
    fontSize: 15,
    color: '#666',
    fontWeight: '500',
  },
  ctaBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#CCC',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    gap: 4,
  },
  ctaText: {
    fontSize: 14,
    color: '#555',
    fontWeight: '600',
  },
});
