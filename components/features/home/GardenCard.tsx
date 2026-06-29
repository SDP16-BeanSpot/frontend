import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import type { Garden } from '../../../features/home/types';

interface GardenCardProps {
  garden: Garden;
  onToggleFavorite?: (id: string, isFavorite: boolean) => void;
}

const CATEGORY_COLORS: Record<string, { text: string; bg: string }> = {
  '캠페인/이벤트': { text: '#4CAF50', bg: '#F0FFF0' },
  '대외활동':       { text: '#7D6A5A', bg: '#F5EFE9' },
  '공모전':         { text: '#F9A825', bg: '#FFF8E1' },
  '교육/체험':      { text: '#1976D2', bg: '#E3F2FD' },
  '봉사활동':       { text: '#E53935', bg: '#FFEBEE' },
};

const GardenCard: React.FC<GardenCardProps> = ({ garden, onToggleFavorite }) => {
  const catStyle = CATEGORY_COLORS[garden.category] ?? { text: '#888', bg: '#F5F5F5' };

  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.85}>
      {/* Thumbnail */}
      <View style={styles.thumb}>
        {garden.imageUrl ? (
          <Image source={{ uri: garden.imageUrl }} style={styles.thumbImg} />
        ) : (
          <View style={[styles.thumbImg, styles.thumbPlaceholder]}>
            <Feather name="image" size={24} color="#DDD" />
          </View>
        )}
      </View>

      {/* Content */}
      <View style={styles.content}>
        <View style={styles.tagRow}>
          <View style={styles.dDayBadge}>
            <Text style={styles.dDayText}>{garden.dDay}</Text>
          </View>
          <View style={[styles.catBadge, { backgroundColor: catStyle.bg }]}>
            <Text style={[styles.catText, { color: catStyle.text }]}>{garden.category}</Text>
          </View>
        </View>

        <Text style={styles.title} numberOfLines={2}>
          {garden.title}
        </Text>

        <Text style={styles.period}>{garden.activityPeriod}</Text>

        <View style={styles.locationRow}>
          {garden.locationTags.map((tag) => (
            <Text key={tag} style={styles.locationTag}>{tag}</Text>
          ))}
        </View>
      </View>

      {/* Heart */}
      <TouchableOpacity
        style={styles.heart}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        onPress={() => onToggleFavorite?.(garden.id, !garden.isFavorite)}
      >
        <Feather
          name={garden.isFavorite ? 'heart' : 'heart'}
          size={20}
          color={garden.isFavorite ? '#FF5252' : '#DDD'}
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    alignItems: 'flex-start',
  },
  thumb: { marginRight: 14 },
  thumbImg: {
    width: 88,
    height: 110,
    borderRadius: 12,
    backgroundColor: '#F5F5F5',
  },
  thumbPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: { flex: 1 },
  tagRow: { flexDirection: 'row', gap: 6, marginBottom: 6, flexWrap: 'wrap' },
  dDayBadge: {
    backgroundColor: '#FFF0F0',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 5,
  },
  dDayText: { color: '#FF5252', fontSize: 10, fontWeight: '700' },
  catBadge: {
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 5,
  },
  catText: { fontSize: 10, fontWeight: '600' },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: '#222',
    lineHeight: 21,
    marginBottom: 4,
  },
  period: { fontSize: 12, color: '#888', marginBottom: 8 },
  locationRow: { flexDirection: 'row', gap: 6, flexWrap: 'wrap' },
  locationTag: {
    fontSize: 11,
    color: '#777',
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 5,
  },
  heart: { justifyContent: 'flex-start', paddingTop: 4 },
});

export default GardenCard;
