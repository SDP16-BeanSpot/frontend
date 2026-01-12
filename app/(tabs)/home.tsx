import React from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Text,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';

import HomeHeader from '../../components/features/home/HomeHeader';
import BannerCarousel from '../../components/features/home/BannerCarousel';
import ServiceButtons from '../../components/features/home/ServiceButtons';
import FilterSection from '../../components/features/home/FilterSection';
import GardenCard from '../../components/features/home/GardenCard';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <HomeHeader />

      <ScrollView showsVerticalScrollIndicator={false}>
        <BannerCarousel />

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>지금 인기있는 공고만 모았어요</Text>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalScrollContent}
        >
          {[1, 2, 3].map(item => (
            <View key={item} style={styles.popularCard}>
              <View style={styles.cardImagePlaceholder}>
                <View style={styles.statusTag}>
                  <Text style={styles.statusText}>캠페인</Text>
                </View>
                <TouchableOpacity style={styles.cardHeart}>
                  <Feather name="heart" size={18} color="#666" />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>

        <ServiceButtons />

        <FilterSection />

        <View style={styles.listContainer}>
          {[1, 2, 3].map(i => (
            <GardenCard key={i} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
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
  horizontalScrollContent: {
    paddingLeft: 20,
    paddingRight: 5,
  },
  popularCard: {
    width: 150,
    height: 200,
    backgroundColor: '#F0F0F0',
    borderRadius: 15,
    marginRight: 15,
    overflow: 'hidden',
  },
  cardImagePlaceholder: {
    flex: 1,
    padding: 10,
    justifyContent: 'space-between',
  },
  statusTag: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.8)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 10,
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  cardHeart: {
    alignSelf: 'flex-end',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 6,
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 100,
  },
});
