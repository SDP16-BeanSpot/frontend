import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';

const RecentlyViewed = () => {
  return (
    <View style={styles.recentSectionCard}>
      <TouchableOpacity style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>빈스팟님이 최근 본 공고에요!</Text>
        <Feather name="chevron-right" size={20} color="#333" />
      </TouchableOpacity>
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        contentContainerStyle={styles.recentScrollContent}
      >
        {[
          { id: 1, tag: '캠페인', color: '#E0F2F1' },
          { id: 2, tag: '공모전', color: '#E8F5E9' },
          { id: 3, tag: '체험', color: '#F1F8E9' }
        ].map((item) => (
          <View key={item.id} style={[styles.recentCard, { backgroundColor: item.color }]}>
            <View style={styles.cardTag}>
              <Text style={styles.cardTagText}>{item.tag}</Text>
            </View>
            <TouchableOpacity style={styles.cardHeart}>
              <Ionicons name="heart-outline" size={18} color="#666" />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  recentSectionCard: {
    backgroundColor: '#F8F9FA',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 25,
    paddingVertical: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#555' },
  recentScrollContent: { paddingLeft: 20, paddingRight: 5 },
  recentCard: {
    width: 105,
    height: 135,
    borderRadius: 12,
    marginRight: 12,
    padding: 8,
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#EEE',
  },
  cardTag: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 5,
  },
  cardTagText: { fontSize: 10, color: '#4CAF50', fontWeight: 'bold' },
  cardHeart: {
    alignSelf: 'flex-end',
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 5,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
});

export default RecentlyViewed;