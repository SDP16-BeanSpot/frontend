import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { LocaleConfig } from 'react-native-calendars';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as SecureStore from 'expo-secure-store';

import CalendarHeader, { MonthSelectorButton } from '../../../components/features/calendar/CalendarHeader';
import CalendarView from '../../../components/features/calendar/CalendarView';
import ScheduleSection from '../../../components/features/calendar/ScheduleSection';
import DiaryModal from '../../../components/features/calendar/DiaryModal';
import MonthPicker from '../../../components/features/calendar/MonthPicker';
import WelcomePopup from '../../../components/features/calendar/WelcomePopup';
import { SCHEDULE_DATA } from '../../../features/calendar/mock';

LocaleConfig.locales['kr'] = {
  monthNames: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'],
  monthNamesShort: ['1.','2.','3.','4.','5.','6.','7.','8.','9.','10.','11.','12.'],
  dayNames: ['일요일','월요일','화요일','수요일','목요일','금요일','토요일'],
  dayNamesShort: ['일','월','화','수','목','금','토'],
};
LocaleConfig.defaultLocale = 'kr';

const WELCOME_KEY = 'calendar_welcome_shown';

const formatDate = (date: Date) => {
  const y = date.getFullYear();
  const m = (date.getMonth() + 1).toString().padStart(2, '0');
  const d = date.getDate().toString().padStart(2, '0');
  return `${y}-${m}-${d}`;
};

export default function CalendarScreen() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isPickerVisible, setPickerVisible] = useState(false);
  const [isDiaryVisible, setDiaryVisible] = useState(false);
  const [isWelcomeVisible, setWelcomeVisible] = useState(false);

  // 첫 진입 팝업
  useEffect(() => {
    SecureStore.getItemAsync(WELCOME_KEY).then((val) => {
      if (!val) setWelcomeVisible(true);
    }).catch(() => setWelcomeVisible(true));
  }, []);

  const handleWelcomeClose = async () => {
    setWelcomeVisible(false);
    await SecureStore.setItemAsync(WELCOME_KEY, 'true').catch(() => {});
  };

  const handlePickerConfirm = (year: number, month: number) => {
    const next = new Date(selectedDate);
    next.setFullYear(year);
    next.setMonth(month - 1);
    next.setDate(1);
    setSelectedDate(next);
    setPickerVisible(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <CalendarHeader
        selectedDate={selectedDate}
        onOpenPicker={() => setPickerVisible(true)}
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <MonthSelectorButton
          selectedDate={selectedDate}
          onPress={() => setPickerVisible(true)}
        />

        <CalendarView
          current={formatDate(selectedDate)}
          selectedDate={formatDate(selectedDate)}
          onDayPress={(day) => setSelectedDate(new Date(day.dateString + 'T00:00:00'))}
          scheduleData={SCHEDULE_DATA}
        />

        <ScheduleSection
          selectedDate={formatDate(selectedDate)}
          onDiaryPress={() => setDiaryVisible(true)}
        />
      </ScrollView>

      {/* 월 선택 피커 */}
      <MonthPicker
        visible={isPickerVisible}
        selectedDate={selectedDate}
        onConfirm={handlePickerConfirm}
        onCancel={() => setPickerVisible(false)}
      />

      {/* 일기 모달 */}
      <DiaryModal
        visible={isDiaryVisible}
        onClose={() => setDiaryVisible(false)}
      />

      {/* 첫 진입 팝업 */}
      <WelcomePopup
        visible={isWelcomeVisible}
        onClose={handleWelcomeClose}
        onGoRegister={handleWelcomeClose}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scroll: { paddingBottom: 100 },
});
