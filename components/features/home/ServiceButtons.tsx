// components/features/home/ServiceButtons.tsx

import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

export const ServiceButtons = () => {
  return (
    <View style={styles.serviceButtonsContainer}>
      <TouchableOpacity style={styles.serviceButton}>
        <Image source={{ uri: 'https-via-placeholder-com-50x50-png-?text=Icon1' }} style={styles.serviceIcon} />
        <Text style={styles.serviceText}>텃밭 빌리기</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.serviceButton}>
        <Image source={{ uri: 'https-via-placeholder-com-50x50-png-?text=Icon2' }} style={styles.serviceIcon} />
        <Text style={styles.serviceText}>텃밭 등록하기</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  serviceButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
    paddingVertical: 20,
    backgroundColor: 'white',
  },
  serviceButton: {
    width: '48%',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  serviceIcon: {
    width: 50,
    height: 50,
    marginBottom: 10,
  },
  serviceText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});