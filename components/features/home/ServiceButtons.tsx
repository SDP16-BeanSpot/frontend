import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const ServiceButtons = () => {
  return (
    <>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>테마별 모아보기</Text>
      </View>
      <View style={styles.categoryContainer}>
        <TouchableOpacity
          style={[styles.categoryItem, { backgroundColor: '#F0F9F0' }]}
        >
          <MaterialCommunityIcons name="leaf" size={24} color="#4CAF50" />
          <Text style={styles.categoryName}>캠페인/이벤트</Text>
          <Text style={styles.categoryCount}>+ 124개</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.categoryItem, { backgroundColor: '#F9F4F0' }]}
        >
          <MaterialCommunityIcons name="megaphone" size={24} color="#7D6A5A" />
          <Text style={styles.categoryName}>대외활동</Text>
          <Text style={styles.categoryCount}>+ 84개</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  sectionHeader: {
    paddingHorizontal: 20,
    marginTop: 30,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  categoryContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
  },
  categoryItem: {
    flex: 1,
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
  },
  categoryName: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: 8,
    color: '#444',
  },
  categoryCount: {
    fontSize: 11,
    color: '#4CAF50',
    marginTop: 2,
  },
});

export default ServiceButtons;
