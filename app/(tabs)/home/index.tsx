import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';

import HomeHeader from '../../../components/features/home/HomeHeader';
import BannerCarousel from '../../../components/features/home/BannerCarousel';
import ServiceButtons from '../../../components/features/home/ServiceButtons';
import FilterSection from '../../../components/features/home/FilterSection';
import GardenCard from '../../../components/features/home/GardenCard';

import {
  fetchBanners,
  fetchGardens,
  fetchPopularGardens,
  toggleFavoriteGarden,
} from '../../../features/home/api';
import type { Banner, Garden } from '../../../features/home/types';

export default function HomeScreen() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [popularGardens, setPopularGardens] = useState<Garden[]>([]);
  const [gardens, setGardens] = useState<Garden[]>([]);

  useEffect(() => {
    const loadHomeData = async () => {
      const bannerData = await fetchBanners();
      setBanners(bannerData);

      const popularData = await fetchPopularGardens();
      setPopularGardens(popularData);

      const gardenData = await fetchGardens();
      setGardens(gardenData);
    };

    loadHomeData();
  }, []);

  const handleToggleFavorite = async (id: string, isFavorite: boolean) => {
    // Optimistic update
    const updater = (items: Garden[]) =>
      items.map(item => (item.id === id ? { ...item, isFavorite } : item));
    setGardens(updater);
    setPopularGardens(updater);

    await toggleFavoriteGarden(id, isFavorite);
    // Here you might want to re-fetch or handle API errors
  };

  return (
    <SafeAreaView style={styles.container}>
      <HomeHeader />

      <ScrollView showsVerticalScrollIndicator={false}>
        <BannerCarousel banners={banners} />

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>지금 인기있는 공고만 모았어요</Text>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalScrollContent}
        >
          {popularGardens.map(garden => (
            <TouchableOpacity key={garden.id} style={styles.popularCard}>
              <ImageBackground source={{ uri: garden.imageUrl }} style={styles.cardImagePlaceholder}>
                <View style={styles.statusTag}>
                  <Text style={styles.statusText}>{garden.category}</Text>
                </View>
                <TouchableOpacity
                  style={styles.cardHeart}
                  onPress={() => handleToggleFavorite(garden.id, !garden.isFavorite)}
                >
                  <Feather name="heart" size={18} color={garden.isFavorite ? '#FF5252' : '#666'} />
                </TouchableOpacity>
              </ImageBackground>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <ServiceButtons />

        <FilterSection />

        <View style={styles.listContainer}>
          {gardens.map(garden => (
            <GardenCard
              key={garden.id}
              garden={garden}
              onToggleFavorite={handleToggleFavorite}
            />
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
