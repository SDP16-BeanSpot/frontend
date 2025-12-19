// components/features/home/FilterSection.tsx

import React from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// 필터 아이템 렌더링
const renderFilterItem = ({ item, activeId, onPress }: { item: any, activeId: string, onPress: (id: string) => void }) => {
  const isActive = item.id === activeId;
  return (
    <TouchableOpacity
      style={[styles.filterButton, isActive && styles.filterButtonActive]}
      onPress={() => onPress(item.id)}
    >
      <Text style={[styles.filterText, isActive && styles.filterTextActive]}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );
};

export const FilterSection = ({ data, activeId, onFilterPress }: { data: any[], activeId: string, onFilterPress: (id: string) => void }) => {
  return (
    <View style={styles.filterSection}>
      <TouchableOpacity style={styles.locationPicker}>
        <Ionicons name="location-outline" size={20} color="black" />
        <Text style={styles.locationText}>성수동</Text>
        <Ionicons name="chevron-down-outline" size={16} color="black" />
      </TouchableOpacity>
      <Text style={styles.sectionTitle}>이런 텃밭이 가까이 있어요</Text>
      <FlatList
        data={data}
        renderItem={({ item }) => renderFilterItem({ item, activeId, onPress: onFilterPress })}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  filterSection: { 
    paddingHorizontal: 16, 
    paddingTop: 10, 
    backgroundColor: 'white' 
  },
  locationPicker: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  locationText: { fontSize: 18, fontWeight: 'bold', marginLeft: 8, marginRight: 4 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 16 },
  filterList: { marginBottom: 10 },
  filterButton: { paddingVertical: 8, paddingHorizontal: 16, backgroundColor: '#F5F5F5', borderRadius: 20, marginRight: 10 },
  filterButtonActive: { backgroundColor: 'green' },
  filterText: { fontSize: 14, color: 'black' },
  filterTextActive: { color: 'white', fontWeight: 'bold' },
});