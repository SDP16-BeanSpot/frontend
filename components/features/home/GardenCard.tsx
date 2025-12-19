// components/features/home/GardenCard.tsx

import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

// 임시 데이터 타입을 정의합니다. (props로 받기 위함)
type GardenItem = {
  id: string;
  name: string;
  distance: string;
  area: string;
  duration: string;
  size: string;
  image: string;
};

// 'item'을 prop으로 받습니다.
export const GardenCard = ({ item }: { item: GardenItem }) => {
  return (
    <TouchableOpacity style={styles.gardenCard}>
      <Image source={{ uri: item.image }} style={styles.gardenImage} />
      <Text style={styles.gardenTitle}>{item.name}</Text>
      <Text style={styles.gardenLocation}>{item.distance} 서울 {item.area}</Text>
      <View style={styles.tagContainer}>
        <Text style={styles.tag}>{item.duration}</Text>
        <Text style={styles.tag}>{item.size}</Text>
      </View>
    </TouchableOpacity>
  );
};

// GardenCard에만 해당하는 스타일을 여기에 둡니다.
const styles = StyleSheet.create({
  gardenCard: {
    width: '100%', // 너비는 FlatList의 numColumns가 관리
    marginBottom: 20,
  },
  gardenImage: {
    width: '100%',
    height: 120,
    borderRadius: 12,
    backgroundColor: '#EEEEEE',
  },
  gardenTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
  },
  gardenLocation: {
    fontSize: 13,
    color: 'gray',
    marginVertical: 4,
  },
  tagContainer: {
    flexDirection: 'row',
    marginTop: 4,
  },
  tag: {
    fontSize: 12,
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 6,
    overflow: 'hidden',
  },
});