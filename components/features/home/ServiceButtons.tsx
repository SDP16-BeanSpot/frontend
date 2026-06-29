import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

type Category = {
  id: string;
  label: string;
  icon: string;
  color: string;
  bg: string;
};

const CATEGORIES: Category[] = [
  { id: 'campaign', label: '캠페인/이벤트', icon: 'leaf',          color: '#4CAF50', bg: '#E8F5E4' },
  { id: 'activity', label: '대외활동',       icon: 'bullhorn',       color: '#7D6A5A', bg: '#F5EFE9' },
  { id: 'contest',  label: '공모전',         icon: 'trophy-outline', color: '#F9A825', bg: '#FFF8E1' },
  { id: 'edu',      label: '교육/체험',      icon: 'book-open-variant', color: '#1976D2', bg: '#E3F2FD' },
  { id: 'volunteer',label: '봉사활동',       icon: 'hand-heart',     color: '#E53935', bg: '#FFEBEE' },
];

interface ServiceButtonsProps {
  onSelect?: (id: string) => void;
  selected?: string;
}

const ServiceButtons = ({ onSelect, selected }: ServiceButtonsProps) => {
  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>테마별 모아보기</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {CATEGORIES.map((cat) => {
          const isActive = selected === cat.id;
          return (
            <TouchableOpacity
              key={cat.id}
              style={[styles.chip, isActive && styles.chipActive]}
              onPress={() => onSelect?.(cat.id)}
              activeOpacity={0.75}
            >
              <View style={[styles.iconWrap, { backgroundColor: cat.bg }]}>
                <MaterialCommunityIcons name={cat.icon as any} size={20} color={cat.color} />
              </View>
              <Text style={[styles.chipLabel, isActive && styles.chipLabelActive]}>
                {cat.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: { marginTop: 28 },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
    paddingHorizontal: 20,
    marginBottom: 14,
  },
  scrollContent: { paddingHorizontal: 20, gap: 10 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 30,
    backgroundColor: '#F5F5F5',
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  chipActive: {
    borderColor: '#4CAF50',
    backgroundColor: '#F0FAF0',
  },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chipLabel: { fontSize: 13, fontWeight: '600', color: '#444' },
  chipLabelActive: { color: '#4CAF50' },
});

export default ServiceButtons;
