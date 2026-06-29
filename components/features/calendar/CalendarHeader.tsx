import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';

interface CalendarHeaderProps {
  selectedDate: Date;
  onOpenPicker: () => void;
}

const CalendarHeader: React.FC<CalendarHeaderProps> = ({ selectedDate, onOpenPicker }) => {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>캘린더</Text>
      <View style={styles.icons}>
        <TouchableOpacity style={styles.iconBtn}>
          <MaterialCommunityIcons name="book-open-variant-outline" size={24} color="#333" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconBtn}>
          <Feather name="bell" size={24} color="#333" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

// 별도 월 선택 버튼 (캘린더 그리드 위에 배치)
export const MonthSelectorButton: React.FC<{
  selectedDate: Date;
  onPress: () => void;
}> = ({ selectedDate, onPress }) => (
  <TouchableOpacity style={styles.monthBtn} onPress={onPress} activeOpacity={0.7}>
    <Text style={styles.monthText}>
      {selectedDate.getFullYear()}년 {selectedDate.getMonth() + 1}월
    </Text>
    <Feather name="chevron-down" size={18} color="#333" />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  title: { fontSize: 22, fontWeight: 'bold', color: '#222' },
  icons: { flexDirection: 'row', gap: 12 },
  iconBtn: { padding: 4 },
  monthBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  monthText: { fontSize: 18, fontWeight: '700', color: '#222' },
});

export default CalendarHeader;
