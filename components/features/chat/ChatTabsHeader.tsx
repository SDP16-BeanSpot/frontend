import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { ChatGroup } from '../../../features/chat/types';

interface ChatTabsHeaderProps {
  activeTab: ChatGroup;
  onTabChange: (tab: ChatGroup) => void;
}

const TABS: { key: ChatGroup; label: string }[] = [
  { key: 'interest', label: '관심 공고' },
  { key: 'recent',   label: '최근 본 공고' },
];

const ChatTabsHeader = ({ activeTab, onTabChange }: ChatTabsHeaderProps) => (
  <View style={styles.container}>
    <Text style={styles.title}>채팅</Text>
    <View style={styles.tabRow}>
      {TABS.map((tab) => {
        const isActive = activeTab === tab.key;
        return (
          <TouchableOpacity
            key={tab.key}
            style={[styles.chip, isActive && styles.chipActive]}
            onPress={() => onTabChange(tab.key)}
            activeOpacity={0.75}
          >
            <Text style={[styles.chipText, isActive && styles.chipTextActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  </View>
);

export default ChatTabsHeader;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 4,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 14,
  },
  tabRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 4,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
  },
  chipActive: {
    backgroundColor: '#4CAF50',
  },
  chipText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#888',
  },
  chipTextActive: {
    color: '#fff',
  },
});
