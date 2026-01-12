import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';

interface CalendarHeaderProps {
  selectedDate: Date;
  onMonthChange: (month: number) => void;
}

const CalendarHeader: React.FC<CalendarHeaderProps> = ({ selectedDate, onMonthChange }) => {
  return (
    <View style={styles.header}>
      <View style={styles.monthContainer}>
        <TouchableOpacity testID="prev-month" onPress={() => onMonthChange(-1)}>
          <Feather name="chevron-left" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{`${selectedDate.getFullYear()}년 ${selectedDate.getMonth() + 1}월`}</Text>
        <TouchableOpacity testID="next-month" onPress={() => onMonthChange(1)}>
          <Feather name="chevron-right" size={24} color="#333" />
        </TouchableOpacity>
      </View>
      <View style={styles.headerIcons}>
        <TouchableOpacity>
          <MaterialCommunityIcons name="book-open-variant" size={24} color="#333" />
        </TouchableOpacity>
        <TouchableOpacity>
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
    padding: 20,
  },
  monthContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  headerIcons: {
    flexDirection: 'row',
    gap: 15,
  },
});

export default CalendarHeader;