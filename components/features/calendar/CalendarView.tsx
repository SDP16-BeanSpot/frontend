import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';
import { Feather } from '@expo/vector-icons';
import {
  scheduleColorOf,
  type CalendarSchedule,
} from '../../../features/calendar/types';

interface CalendarViewProps {
  current?: string;
  selectedDate: string;
  onDayPress: (date: DateData) => void;
  /** 관심 공고 일정(활동기간). 각 날짜에 칠할 막대는 여기서 펼쳐서 계산합니다 */
  schedules: CalendarSchedule[];
  onOpenPicker: () => void;
}

const toDate = (s: string) => new Date(s + 'T00:00:00');

const pad = (n: number) => String(n).padStart(2, '0');
const toKey = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

function buildMarkedDates(schedules: CalendarSchedule[], selectedDate: string) {
  const marks: Record<string, any> = {};

  const addMark = (dateStr: string, period: any) => {
    if (!marks[dateStr]) marks[dateStr] = { periods: [] };
    marks[dateStr].periods.push(period);
  };

  // 활동기간(startDate~endDate)을 날짜별로 펼쳐서 막대를 칠함
  schedules.forEach((schedule) => {
    const color = scheduleColorOf(schedule.announcementId);
    const cursor = toDate(schedule.startDate);
    const end = toDate(schedule.endDate);

    while (cursor <= end) {
      const key = toKey(cursor);
      addMark(key, {
        startingDay: key === schedule.startDate,
        endingDay: key === schedule.endDate,
        color,
      });
      cursor.setDate(cursor.getDate() + 1);
    }
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
  schedules,
  onOpenPicker,
}) => {
  const markedDates = buildMarkedDates(schedules, selectedDate);

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
