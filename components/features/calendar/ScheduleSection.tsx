import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { SCHEDULE_DATA, DIARY_DATA } from './data';

interface ScheduleSectionProps {
  selectedDate: string;
  onDiaryPress: () => void;
}

const ScheduleSection: React.FC<ScheduleSectionProps> = ({ selectedDate, onDiaryPress }) => {
  const hasDiary = !!DIARY_DATA[selectedDate];
  const activeSchedules = SCHEDULE_DATA[selectedDate] || [];

  return (
    <View style={styles.sheetArea}>
      <View style={styles.sheetHeader}>
        <Text style={styles.dateLabel}>{selectedDate.split('-')[2]}. 목</Text>
        {/* Note: Day name (e.g., '목') is hardcoded for now */}
        
        {hasDiary ? (
          <TouchableOpacity style={styles.customIconContainer} onPress={onDiaryPress}>
            <Image source={{ uri: 'https://via.placeholder.com/44' }} style={styles.customDiaryIcon} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.diaryLink} onPress={onDiaryPress}>
            <Text style={styles.diaryText}>오늘의 일기를 써보아요</Text>
            <MaterialCommunityIcons name="emoticon-happy-outline" size={24} color="#CCC" />
          </TouchableOpacity>
        )}
      </View>

      {activeSchedules.length > 0 ? (
        activeSchedules.map((campaign) => (
          <View key={campaign.id} style={styles.campaignContainer}>
            <View style={[styles.titleSection, { borderLeftColor: campaign.color }]}>
              <Text style={styles.campaignTitle}>{campaign.title}</Text>
              <Text style={styles.campaignDuration}>{campaign.duration}</Text>
            </View>
            <View style={styles.todoBox}>
              <Text style={styles.todoBoxTitle}>To-Do List</Text>
              <TouchableOpacity style={styles.addTodoItem}>
                <View style={styles.plusIconBox}><Feather name="plus" size={16} color="#999" /></View>
                <Text style={styles.addTodoText}>할 일 추가하기</Text>
              </TouchableOpacity>
              {campaign.todos.map((todo) => (
                <View key={todo.id} style={styles.todoItem}>
                  <View style={[styles.checkbox, todo.completed && styles.checkedBox]}>
                    {todo.completed && <Feather name="check" size={14} color="#fff" />}
                  </View>
                  <Text style={[styles.todoText, todo.completed && styles.completedTodoText]}>{todo.task}</Text>
                </View>
              ))}
            </View>
          </View>
        ))
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>해당 일자에 등록된 일정이 없어요.</Text>
          <TouchableOpacity style={styles.addBtn}>
            <Text style={styles.addBtnText}>+ 관심 공고 등록하러 가기</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  sheetArea: { borderTopWidth: 1, borderTopColor: '#F0F0F0', marginTop: 10, paddingHorizontal: 20 },
  sheetHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 20 },
  dateLabel: { fontSize: 18, fontWeight: 'bold' },
  diaryLink: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  diaryText: { fontSize: 14, color: '#CCC' },
  customIconContainer: { width: 44, height: 44, borderRadius: 22, overflow: 'hidden' },
  customDiaryIcon: { width: '100%', height: '100%' },
  campaignContainer: { marginBottom: 30 },
  titleSection: { borderLeftWidth: 4, paddingLeft: 12, marginBottom: 15 },
  campaignTitle: { fontSize: 17, fontWeight: 'bold' },
  campaignDuration: { fontSize: 13, color: '#666' },
  todoBox: { backgroundColor: '#F8F9FA', borderRadius: 15, padding: 15 },
  todoBoxTitle: { fontSize: 12, color: '#999', marginBottom: 10 },
  addTodoItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  plusIconBox: { width: 20, height: 20, borderWidth: 1, borderColor: '#DDD', borderRadius: 4, justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  addTodoText: { fontSize: 14, color: '#999' },
  todoItem: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
  checkbox: { width: 20, height: 20, borderWidth: 1.5, borderColor: '#DDD', borderRadius: 5, marginRight: 10, justifyContent: 'center', alignItems: 'center' },
  checkedBox: { backgroundColor: '#888', borderColor: '#888' },
  todoText: { fontSize: 14 },
  completedTodoText: { color: '#888', textDecorationLine: 'line-through' },
  emptyContainer: { alignItems: 'center', marginTop: 40 },
  emptyText: { color: '#999', marginBottom: 20 },
  addBtn: { backgroundColor: '#F0F9F0', paddingVertical: 12, paddingHorizontal: 20, borderRadius: 25 },
  addBtnText: { color: '#4CAF50', fontWeight: 'bold' },
});

export default ScheduleSection;