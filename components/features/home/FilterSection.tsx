import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

const FilterSection = () => {
  return (
    <View style={styles.filterBar}>
      <TouchableOpacity style={styles.filterChipActive}>
        <Text style={styles.filterTextActive}>인기순 ✕</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.filterChip}>
        <Text style={styles.filterText}>관심 주제 ∨</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.filterChip}>
        <Text style={styles.filterText}>지역 ∨</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  filterBar: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginTop: 25,
    gap: 8,
  },
  filterChipActive: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#76E24E',
  },
  filterTextActive: {
    color: '#76E24E',
    fontSize: 13,
    fontWeight: '600',
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#EEE',
  },
  filterText: {
    color: '#999',
    fontSize: 13,
  },
});

export default FilterSection;
