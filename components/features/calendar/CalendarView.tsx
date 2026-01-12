import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';

interface CalendarViewProps {
  current?: string;
  selectedDate: string;
  onDayPress: (date: DateData) => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({ current, selectedDate, onDayPress }) => {
  return (
    <Calendar
      current={current}
      onDayPress={onDayPress}
      theme={{
        textSectionTitleColor: '#000',
        selectedDayBackgroundColor: '#A0A0A0',
        selectedDayTextColor: '#fff',
        todayTextColor: '#00adf5',
        arrowColor: 'blue',
      }}
      markedDates={{
        [selectedDate]: { selected: true, selectedColor: '#A0A0A0' },
      }}
    />
  );
};

export default CalendarView;