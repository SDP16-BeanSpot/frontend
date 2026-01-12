import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const MonthPicker = () => {
  return (
    <TouchableOpacity style={styles.monthPicker}>
      <Text style={styles.monthPickerText}>2025년 12월</Text>
      <Ionicons name="chevron-down" size={18} color="#333" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  monthPicker: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  monthPickerText: {
    fontSize: 18,
    fontWeight: '600',
    marginRight: 5,
  },
});

export default MonthPicker;
