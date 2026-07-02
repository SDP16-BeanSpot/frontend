import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { Href, useRouter } from 'expo-router';

interface CalendarHeaderProps {
  selectedDate: Date;
  onOpenPicker: () => void;
}

const CalendarHeader: React.FC<CalendarHeaderProps> = () => {
  const router = useRouter();
  return (
    <View style={styles.header}>
      <Text style={styles.title}>캘린더</Text>
      <View style={styles.icons}>
        <TouchableOpacity style={styles.iconBtn}>
          <MaterialCommunityIcons name="book-open-variant-outline" size={24} color="#333" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconBtn} onPress={() => router.push('/notifications' as Href)}>
          <Feather name="bell" size={24} color="#333" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

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
});

export default CalendarHeader;
