import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';
import { Feather } from '@expo/vector-icons';
import type { CampaignSchedule } from '../../../features/calendar/types';

interface CalendarViewProps {
  current?: string;
  selectedDate: string;
  onDayPress: (date: DateData) => void;
  scheduleData: Record<string, CampaignSchedule[]>;
  onOpenPicker: () => void;
}

const toDate = (s: string) => new Date(s + 'T00:00:00');

function buildMarkedDates(
  scheduleData: Record<string, CampaignSchedule[]>,
  selectedDate: string,
) {
  const marks: Record<string, any> = {};

  const addMark = (dateStr: string, period: any) => {
    if (!marks[dateStr]) marks[dateStr] = { periods: [] };
    marks[dateStr].periods.push(period);
  };

  Object.entries(scheduleData).forEach(([dateStr, schedules]) => {
    schedules.forEach((s) => {
      addMark(dateStr, { startingDay: true, endingDay: true, color: s.color });
    });
  });

  if (!marks[selectedDate]) marks[selectedDate] = { periods: [] };
  marks[selectedDate].selected = true;
  marks[selectedDate].selectedColor = '#222';

  return marks;
}

const dayTextColor = (dayIndex: number) => {
  if (dayIndex === 0) return '#F44336';
  if (dayIndex === 6) return '#2196F3';
  return '#222';
};

const CalendarView: React.FC<CalendarViewProps> = ({
  current,
  selectedDate,
  onDayPress,
  scheduleData,
  onOpenPicker,
}) => {
  const markedDates = buildMarkedDates(scheduleData, selectedDate);

  // current에서 연월 추출
  const [y, m] = (current ?? selectedDate).split('-');

  return (
    <View>
      {/* 연월 버튼 — 캘린더 상단 왼쪽 */}
      <TouchableOpacity style={header.btn} onPress={onOpenPicker} activeOpacity={0.7}>
        <Text style={header.text}>{parseInt(y)}년 {parseInt(m)}월</Text>
        <Feather name="chevron-down" size={18} color="#222" />
      </TouchableOpacity>

      <Calendar
        current={current}
        onDayPress={onDayPress}
        markingType="multi-period"
        markedDates={markedDates}
        hideArrows
        renderHeader={() => null}
        theme={{
          backgroundColor: '#fff',
          calendarBackground: '#fff',
          textSectionTitleColor: '#999',
          dayTextColor: '#222',
          textDisabledColor: '#C8C8C8',
          todayTextColor: '#222',
          selectedDayBackgroundColor: '#222',
          selectedDayTextColor: '#fff',
          dotColor: '#4CAF50',
        }}
        dayComponent={({ date, state, marking }: any) => {
          if (!date) return null;
          const dow = toDate(date.dateString).getDay();
          const isSelected = date.dateString === selectedDate;
          const isToday = state === 'today';
          const disabled = state === 'disabled';

          const textColor = disabled
            ? '#C8C8C8'
            : isSelected
            ? '#fff'
            : isToday
            ? '#222'
            : dayTextColor(dow);

          const periods: any[] = marking?.periods ?? [];
          const visiblePeriods = periods.slice(0, 2);
          const overflow = periods.length > 2;

          return (
            <View style={day.cell}>
              <View style={[day.dot, isSelected && day.dotSelected, isToday && !isSelected && day.dotToday]}>
                <Text style={[day.num, { color: textColor }]}>{date.day}</Text>
              </View>
              {visiblePeriods.map((p: any, i: number) => (
                <View key={i} style={[day.bar, { backgroundColor: p.color }]} />
              ))}
              {overflow && <Text style={day.overflow}>+{periods.length - 2}</Text>}
            </View>
          );
        }}
      />
    </View>
  );
};

const header = StyleSheet.create({
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 20,
    paddingTop: 4,
    paddingBottom: 8,
  },
  text: { fontSize: 18, fontWeight: '700', color: '#222' },
});

const day = StyleSheet.create({
  cell: { width: 46, minHeight: 70, alignItems: 'center', paddingTop: 4 },
  dot: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 3,
  },
  dotSelected: { backgroundColor: '#222' },
  dotToday: { backgroundColor: '#F5F5F5' },
  num: { fontSize: 14, fontWeight: '600' },
  bar: { width: 42, height: 14, borderRadius: 3, marginBottom: 2 },
  overflow: { fontSize: 10, color: '#999', marginTop: 1 },
});

export default CalendarView;
