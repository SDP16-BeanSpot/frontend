import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { Href, useRouter } from 'expo-router';

import { fetchMonthlySchedules, fetchTodosByDate, toggleTodoStatus } from '../../../features/calendar/api';
import { DIARY_DATA } from '../../../features/calendar/mock';
import {
  coversDate,
  toCampaignSchedule,
  type CampaignSchedule,
  type TodoItem,
} from '../../../features/calendar/types';
import DiaryFace from './DiaryFace';

const DAY_NAMES = ['일', '월', '화', '수', '목', '금', '토'];

interface ScheduleSectionProps {
  selectedDate: string;
  onDiaryPress: () => void;
}

const ScheduleSection: React.FC<ScheduleSectionProps> = ({ selectedDate, onDiaryPress }) => {
  const router = useRouter();
  const diary = DIARY_DATA[selectedDate];
  const [schedules, setSchedules] = useState<CampaignSchedule[]>([]);
  const [loading, setLoading] = useState(true);

  // 선택 날짜가 바뀌면 그 달의 일정 + 그 날짜의 할 일을 다시 불러옴
  const load = useCallback(async () => {
    const [year, month] = selectedDate.split('-').map(Number);
    setLoading(true);
    const [monthly, todos] = await Promise.all([
      fetchMonthlySchedules(year, month),
      fetchTodosByDate(selectedDate),
    ]);
    setSchedules(
      monthly
        .filter((s) => coversDate(s, selectedDate))
        .map((s) => toCampaignSchedule(s, todos)),
    );
    setLoading(false);
  }, [selectedDate]);

  useEffect(() => {
    void load();
  }, [load]);

  const toggleTodo = async (todo: TodoItem) => {
    // 낙관적 업데이트 후 서버 반영, 실패하면 되돌림
    const apply = (value: boolean) =>
      setSchedules((prev) =>
        prev.map((s) => ({
          ...s,
          todos: s.todos.map((t) => (t.id === todo.id ? { ...t, isCompleted: value } : t)),
        })),
      );

    apply(!todo.isCompleted);
    const result = await toggleTodoStatus(todo.id);
    if (!result.ok && !result.skipped) apply(todo.isCompleted);
  };

  // 요일 동적 계산
  const dateObj = new Date(selectedDate + 'T00:00:00');
  const day = dateObj.getDate();
  const dayName = DAY_NAMES[dateObj.getDay()];

  return (
    <View style={styles.wrap}>
      {/* 날짜 헤더 */}
      <View style={styles.dateHeader}>
        <Text style={styles.dateLabel}>{day}. {dayName}</Text>
        <TouchableOpacity style={styles.diaryRow} onPress={onDiaryPress}>
          {diary ? (
            <DiaryFace emotion={diary.emotionType} character={diary.characterType} size={28} />
          ) : (
            <>
              <Text style={styles.diaryHint}>오늘의 일기를 써보아요</Text>
              <MaterialCommunityIcons name="emoticon-happy-outline" size={24} color="#CCC" />
            </>
          )}
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loading}>
          <ActivityIndicator color="#4CAF50" />
        </View>
      ) : schedules.length > 0 ? (
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

                {campaign.todos.map((todo) => (
                  <TouchableOpacity
                    key={todo.id}
                    style={styles.todoItem}
                    onPress={() => toggleTodo(todo)}
                    activeOpacity={0.7}
                  >
                    <View style={[styles.checkbox, todo.isCompleted && styles.checkedBox]}>
                      {todo.isCompleted && <Feather name="check" size={12} color="#fff" />}
                    </View>
                    <Text style={[styles.todoText, todo.isCompleted && styles.completedText]}>
                      {todo.content}
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
          <TouchableOpacity
            style={styles.emptyBtn}
            onPress={() => router.push('/(tabs)/home' as Href)}
          >
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
  loading: { paddingVertical: 48, alignItems: 'center' },
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
