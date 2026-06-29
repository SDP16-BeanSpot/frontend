import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { SCHEDULE_DATA, DIARY_DATA } from '../../../features/calendar/mock';
import type { CampaignSchedule, TodoItem } from '../../../features/calendar/types';

const DAY_NAMES = ['일', '월', '화', '수', '목', '금', '토'];

interface ScheduleSectionProps {
  selectedDate: string;
  onDiaryPress: () => void;
}

const ScheduleSection: React.FC<ScheduleSectionProps> = ({ selectedDate, onDiaryPress }) => {
  const hasDiary = !!DIARY_DATA[selectedDate];
  const [schedules, setSchedules] = useState<CampaignSchedule[]>(
    SCHEDULE_DATA[selectedDate] ?? [],
  );

  // 선택 날짜가 바뀌면 일정 갱신
  React.useEffect(() => {
    setSchedules(SCHEDULE_DATA[selectedDate] ?? []);
  }, [selectedDate]);

  // 요일 동적 계산
  const dateObj = new Date(selectedDate + 'T00:00:00');
  const day = dateObj.getDate();
  const dayName = DAY_NAMES[dateObj.getDay()];

  const toggleTodo = (scheduleId: string, todoId: string) => {
    setSchedules((prev) =>
      prev.map((s) =>
        s.id !== scheduleId
          ? s
          : {
              ...s,
              todos: s.todos.map((t) =>
                t.id === todoId ? { ...t, completed: !t.completed } : t,
              ),
            },
      ),
    );
  };

  return (
    <View style={styles.wrap}>
      {/* 날짜 헤더 */}
      <View style={styles.dateHeader}>
        <Text style={styles.dateLabel}>{day}. {dayName}</Text>
        <TouchableOpacity style={styles.diaryRow} onPress={onDiaryPress}>
          {hasDiary ? (
            <MaterialCommunityIcons name="emoticon-happy" size={28} color="#4CAF50" />
          ) : (
            <>
              <Text style={styles.diaryHint}>오늘의 일기를 써보아요</Text>
              <MaterialCommunityIcons name="emoticon-happy-outline" size={24} color="#CCC" />
            </>
          )}
        </TouchableOpacity>
      </View>

      {schedules.length > 0 ? (
        schedules.map((campaign) => (
          <View key={campaign.id} style={styles.campaignCard}>
            {/* 제목 + 기간 */}
            <View style={[styles.titleBar, { borderLeftColor: campaign.color }]}>
              <Text style={styles.campaignTitle}>{campaign.title}</Text>
              <Text style={styles.campaignDuration}>{campaign.duration}</Text>
            </View>

            {/* To-Do 박스 */}
            {campaign.todos.length > 0 && (
              <View style={styles.todoBox}>
                <Text style={styles.todoBoxLabel}>To-Do List</Text>

                {/* 할 일 추가 버튼 */}
                <TouchableOpacity style={styles.addRow}>
                  <View style={styles.plusBox}>
                    <Feather name="plus" size={14} color="#999" />
                  </View>
                  <Text style={styles.addText}>할 일 추가하기</Text>
                </TouchableOpacity>

                {campaign.todos.map((todo: TodoItem) => (
                  <TouchableOpacity
                    key={todo.id}
                    style={styles.todoItem}
                    onPress={() => toggleTodo(campaign.id, todo.id)}
                    activeOpacity={0.7}
                  >
                    <View style={[styles.checkbox, todo.completed && styles.checkedBox]}>
                      {todo.completed && <Feather name="check" size={12} color="#fff" />}
                    </View>
                    <Text style={[styles.todoText, todo.completed && styles.completedText]}>
                      {todo.task}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        ))
      ) : (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>해당 일자에 등록된 일정이 없어요.</Text>
          <TouchableOpacity style={styles.emptyBtn}>
            <Text style={styles.emptyBtnText}>+ 관심 공고 등록하러 가기</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    marginTop: 8,
    paddingHorizontal: 20,
  },
  dateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 18,
  },
  dateLabel: { fontSize: 18, fontWeight: 'bold', color: '#222' },
  diaryRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  diaryHint: { fontSize: 14, color: '#CCC' },
  campaignCard: { marginBottom: 28 },
  titleBar: { borderLeftWidth: 4, paddingLeft: 12, marginBottom: 12 },
  campaignTitle: { fontSize: 16, fontWeight: '700', color: '#222', marginBottom: 2 },
  campaignDuration: { fontSize: 12, color: '#888' },
  todoBox: {
    backgroundColor: '#F8F9FA',
    borderRadius: 14,
    padding: 14,
  },
  todoBoxLabel: { fontSize: 11, color: '#AAA', marginBottom: 10, fontWeight: '600' },
  addRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  plusBox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  addText: { fontSize: 13, color: '#BBB' },
  todoItem: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1.5,
    borderColor: '#DDD',
    borderRadius: 5,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkedBox: { backgroundColor: '#4CAF50', borderColor: '#4CAF50' },
  todoText: { fontSize: 14, color: '#333' },
  completedText: { color: '#AAA', textDecorationLine: 'line-through' },
  empty: { alignItems: 'center', paddingVertical: 48 },
  emptyText: { color: '#999', fontSize: 14, marginBottom: 20 },
  emptyBtn: {
    backgroundColor: '#F0FAF0',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
  },
  emptyBtnText: { color: '#4CAF50', fontWeight: '700', fontSize: 14 },
});

export default ScheduleSection;
