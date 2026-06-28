import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import type { Garden } from '../../../features/home/types';

interface GardenCardProps {
  garden: Garden;
  onToggleFavorite?: (id: string, isFavorite: boolean) => void;
}

const GardenCard: React.FC<GardenCardProps> = ({ garden, onToggleFavorite }) => {
  return (
    <TouchableOpacity style={styles.listItem}>
      <Image source={{ uri: garden.imageUrl }} style={styles.listImagePlaceholder} />
      <View style={styles.listContent}>
        <View style={styles.tagRow}>
          <View style={styles.dDayBadge}>
            <Text style={styles.dDayText}>{garden.dDay}</Text>
          </View>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryBadgeText}>{garden.category}</Text>
          </View>
        </View>
        <Text style={styles.itemTitle} numberOfLines={1}>
          {garden.title}
        </Text>
        <Text style={styles.itemDate}>{garden.activityPeriod}</Text>
        <View style={styles.locationRow}>
          {garden.locationTags.map(tag => (
            <Text key={tag} style={styles.locationTag}>{tag}</Text>
          ))}
        </View>
      </View>
      <TouchableOpacity 
        style={styles.listHeart}
        onPress={() => onToggleFavorite?.(garden.id, !garden.isFavorite)}
      >
        <Feather name="heart" size={20} color={garden.isFavorite ? '#FF5252' : '#ccc'} />
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
