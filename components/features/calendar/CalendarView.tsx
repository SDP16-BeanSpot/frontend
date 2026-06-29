import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';
import type { CampaignSchedule } from '../../../features/calendar/types';

interface CalendarViewProps {
  current?: string;
  selectedDate: string;
  onDayPress: (date: DateData) => void;
  scheduleData: Record<string, CampaignSchedule[]>;
}

// 날짜 문자열 → Date
const toDate = (s: string) => new Date(s + 'T00:00:00');

// 공고 기간을 multi-period markedDates 형태로 변환
function buildMarkedDates(
  scheduleData: Record<string, CampaignSchedule[]>,
  selectedDate: string,
) {
  const marks: Record<string, any> = {};

  const addMark = (dateStr: string, period: any) => {
    if (!marks[dateStr]) marks[dateStr] = { periods: [] };
    marks[dateStr].periods.push(period);
  };

  // 각 날짜의 일정들 → 기간 바 추가
  Object.entries(scheduleData).forEach(([dateStr, schedules]) => {
    schedules.forEach((s) => {
      addMark(dateStr, { startingDay: true, endingDay: true, color: s.color });
    });
  });

  // 선택된 날짜 표시
  if (!marks[selectedDate]) marks[selectedDate] = { periods: [] };
  marks[selectedDate].selected = true;
  marks[selectedDate].selectedColor = '#222';

  return marks;
}

// 요일 인덱스 → 색상
const dayTextColor = (dayIndex: number) => {
  if (dayIndex === 0) return '#F44336'; // 일
  if (dayIndex === 6) return '#2196F3'; // 토
  return '#222';
};

const CalendarView: React.FC<CalendarViewProps> = ({
  current,
  selectedDate,
  onDayPress,
  scheduleData,
}) => {
  const markedDates = buildMarkedDates(scheduleData, selectedDate);

  return (
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
        'stylesheet.calendar.header': {
          week: {
            marginTop: 4,
            marginBottom: 4,
            flexDirection: 'row',
            justifyContent: 'space-around',
          },
          dayHeader: {
            fontSize: 13,
            fontWeight: '600',
          },
        },
      }}
      // 요일 헤더 커스텀 (일=빨강, 토=파랑)
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
            {/* 날짜 숫자 */}
            <View style={[day.dot, isSelected && day.dotSelected, isToday && !isSelected && day.dotToday]}>
              <Text style={[day.num, { color: textColor }]}>{date.day}</Text>
            </View>

            {/* 이벤트 바들 */}
            {visiblePeriods.map((p: any, i: number) => (
              <View key={i} style={[day.bar, { backgroundColor: p.color }]}>
                <Text style={day.barText} numberOfLines={1}>
                  {/* 시작일에만 타이틀 표시 (데이터 구조상 항상 single-day) */}
                </Text>
              </View>
            ))}
            {overflow && <Text style={day.overflow}>+{periods.length - 2}</Text>}
          </View>
        );
      }}
    />
  );
};

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
  bar: {
    width: 42,
    height: 14,
    borderRadius: 3,
    marginBottom: 2,
  },
  barText: { fontSize: 9, color: '#fff', paddingHorizontal: 3 },
  overflow: { fontSize: 10, color: '#999', marginTop: 1 },
});

export default CalendarView;
