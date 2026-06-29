import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';

type SortOption = { id: string; label: string };

const SORT_OPTIONS: SortOption[] = [
  { id: 'latest',   label: '최신순' },
  { id: 'popular',  label: '인기순' },
  { id: 'deadline', label: '마감순' },
];

interface FilterSectionProps {
  onFilterChange?: (sort: string, region: string | null, method: string | null) => void;
}

const FilterSection = ({ onFilterChange }: FilterSectionProps) => {
  const [activeSort, setActiveSort] = useState('latest');
  const [region, setRegion]   = useState<string | null>(null);
  const [method, setMethod]   = useState<string | null>(null);

  const handleSort = (id: string) => {
    setActiveSort(id);
    onFilterChange?.(id, region, method);
  };

  return (
    <View style={styles.wrap}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}
      >
        {/* 필터 아이콘 */}
        <TouchableOpacity style={styles.filterIconBtn}>
          <Feather name="sliders" size={16} color="#555" />
        </TouchableOpacity>

        {/* 정렬 옵션 */}
        {SORT_OPTIONS.map((opt) => {
          const isActive = activeSort === opt.id;
          return (
            <TouchableOpacity
              key={opt.id}
              style={[styles.chip, isActive && styles.chipActive]}
              onPress={() => handleSort(opt.id)}
            >
              <Text style={[styles.chipText, isActive && styles.chipTextActive]}>
                {opt.label}
              </Text>
              {isActive ? (
                <Feather name="x" size={13} color="#4CAF50" style={styles.chipIcon} />
              ) : (
                <Feather name="chevron-down" size={13} color="#999" style={styles.chipIcon} />
              )}
            </TouchableOpacity>
          );
        })}

        {/* 지역 */}
        <TouchableOpacity
          style={[styles.chip, region && styles.chipActive]}
          onPress={() => setRegion(region ? null : '서울')}
        >
          <Text style={[styles.chipText, region && styles.chipTextActive]}>
            {region ?? '지역'}
          </Text>
          {region ? (
            <Feather name="x" size={13} color="#4CAF50" style={styles.chipIcon} />
          ) : (
            <Feather name="chevron-down" size={13} color="#999" style={styles.chipIcon} />
          )}
        </TouchableOpacity>

        {/* 방식 */}
        <TouchableOpacity
          style={[styles.chip, method && styles.chipActive]}
          onPress={() => setMethod(method ? null : '오프라인')}
        >
          <Text style={[styles.chipText, method && styles.chipTextActive]}>
            {method ?? '방식'}
          </Text>
          {method ? (
            <Feather name="x" size={13} color="#4CAF50" style={styles.chipIcon} />
          ) : (
            <Feather name="chevron-down" size={13} color="#999" style={styles.chipIcon} />
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: { marginTop: 24, marginBottom: 4 },
  row: { paddingHorizontal: 20, gap: 8, alignItems: 'center' },
  filterIconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#DDD',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 36,
    paddingHorizontal: 12,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#DDD',
    backgroundColor: '#fff',
  },
  chipActive: {
    borderColor: '#4CAF50',
    backgroundColor: '#F0FAF0',
  },
  chipText: { fontSize: 13, color: '#555' },
  chipTextActive: { color: '#4CAF50', fontWeight: '600' },
  chipIcon: { marginLeft: 4 },
});

export default FilterSection;
