import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';

const GardenCard = () => {
  return (
    <TouchableOpacity style={styles.listItem}>
      <View style={styles.listImagePlaceholder} />
      <View style={styles.listContent}>
        <View style={styles.tagRow}>
          <View style={styles.dDayBadge}>
            <Text style={styles.dDayText}>마감 D-12</Text>
          </View>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryBadgeText}>캠페인/이벤트</Text>
          </View>
        </View>
        <Text style={styles.itemTitle} numberOfLines={1}>
          내 나무 갖기 캠페인
        </Text>
        <Text style={styles.itemDate}>활동기간 2025.12.21</Text>
        <View style={styles.locationRow}>
          <Text style={styles.locationTag}>성동구</Text>
          <Text style={styles.locationTag}>오프라인</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.listHeart}>
        <Feather name="heart" size={20} color="#ccc" />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  listItem: {
    flexDirection: 'row',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  listImagePlaceholder: {
    width: 90,
    height: 110,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
  },
  listContent: {
    flex: 1,
    marginLeft: 15,
    justifyContent: 'center',
  },
  tagRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 6,
  },
  dDayBadge: {
    backgroundColor: '#FFF0F0',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  dDayText: {
    color: '#FF5252',
    fontSize: 10,
    fontWeight: 'bold',
  },
  categoryBadge: {
    backgroundColor: '#F0FFF0',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  categoryBadgeText: {
    color: '#4CAF50',
    fontSize: 10,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
  },
  itemDate: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },
  locationRow: {
    flexDirection: 'row',
    marginTop: 8,
    gap: 6,
  },
  locationTag: {
    fontSize: 11,
    color: '#999',
    backgroundColor: '#F8F8F8',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  listHeart: {
    justifyContent: 'center',
  },
});

export default GardenCard;
