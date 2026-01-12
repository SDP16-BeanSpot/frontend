import React, { useState } from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { LocaleConfig } from 'react-native-calendars';
import { SafeAreaView } from 'react-native-safe-area-context';

// Import refactored components
import CalendarHeader from '../../components/features/calendar/CalendarHeader';
import CalendarView from '../../components/features/calendar/CalendarView';
import ScheduleSection from '../../components/features/calendar/ScheduleSection';
import DiaryModal from '../../components/features/calendar/DiaryModal';

// --- Language Configuration ---
LocaleConfig.locales['kr'] = {
  monthNames: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
  monthNamesShort: ['1.', '2.', '3.', '4.', '5.', '6.', '7.', '8.', '9.', '10.', '11.', '12.'],
  dayNames: ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'],
  dayNamesShort: ['일', '월', '화', '수', '목', '금', '토'],
};
LocaleConfig.defaultLocale = 'kr';

const formatDate = (date: Date) => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const CalendarScreen: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date('2025-12-19'));
  const [isModalVisible, setModalVisible] = useState<boolean>(false);

  const handleMonthChange = (month: number) => {
    setSelectedDate(prevDate => {
      const newDate = new Date(prevDate);
      newDate.setMonth(newDate.getMonth() + month);
      return newDate;
    });
  };

  const handleDayPress = (dateString: string) => {
    setSelectedDate(new Date(dateString));
  };

  return (
    <SafeAreaView style={styles.container}>
      <CalendarHeader
        selectedDate={selectedDate}
        onMonthChange={handleMonthChange}
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>
        <CalendarView
          current={formatDate(selectedDate)}
          selectedDate={formatDate(selectedDate)}
          onDayPress={(day) => handleDayPress(day.dateString)}
        />
        <ScheduleSection
          selectedDate={formatDate(selectedDate)}
          onDiaryPress={() => setModalVisible(true)}
        />
      </ScrollView>

      <DiaryModal
        visible={isModalVisible}
        onClose={() => setModalVisible(false)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    paddingBottom: 100,
  },
});

export default CalendarScreen;