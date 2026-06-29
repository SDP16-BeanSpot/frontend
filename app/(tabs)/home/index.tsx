import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  Image,
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
  const [banners, setBanners]               = useState<Banner[]>([]);
  const [popularGardens, setPopularGardens] = useState<Garden[]>([]);
  const [gardens, setGardens]               = useState<Garden[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>();

  useEffect(() => {
    (async () => {
      const [bannerData, popularData, gardenData] = await Promise.all([
        fetchBanners(),
        fetchPopularGardens(),
        fetchGardens(),
      ]);
      setBanners(bannerData);
      setPopularGardens(popularData);
      setGardens(gardenData);
    })();
  }, []);

  const handleToggleFavorite = async (id: string, isFavorite: boolean) => {
    const updater = (items: Garden[]) =>
      items.map((item) => (item.id === id ? { ...item, isFavorite } : item));
    setGardens(updater);
    setPopularGardens(updater);
    await toggleFavoriteGarden(id, isFavorite);
  };

  return (
    <SafeAreaView style={styles.container}>
      <HomeHeader />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* 서비스 안내 배너 */}
        <BannerCarousel banners={banners} />

        {/* 인기 공고 */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>지금 인기있는 공고만 모았어요</Text>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.popularScroll}
        >
          {popularGardens.map((garden) => (
            <TouchableOpacity key={garden.id} style={styles.popularCard} activeOpacity={0.85}>
              {garden.imageUrl ? (
                <Image source={{ uri: garden.imageUrl }} style={styles.popularImg} />
              ) : (
                <View style={[styles.popularImg, styles.popularImgPlaceholder]}>
                  <Feather name="image" size={28} color="#DDD" />
                </View>
              )}
              <View style={styles.popularTagRow}>
                <View style={styles.popularTag}>
                  <Text style={styles.popularTagText}>{garden.category}</Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.popularHeart}
                onPress={() => handleToggleFavorite(garden.id, !garden.isFavorite)}
              >
                <Feather
                  name="heart"
                  size={16}
                  color={garden.isFavorite ? '#FF5252' : '#CCC'}
                />
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* 테마별 모아보기 */}
        <ServiceButtons
          selected={selectedCategory}
          onSelect={(id) => setSelectedCategory((prev) => (prev === id ? undefined : id))}
        />

        {/* 필터 */}
        <FilterSection />

        {/* 공고 리스트 */}
        <View style={styles.listContainer}>
          {gardens.map((garden) => (
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
  container: { flex: 1, backgroundColor: '#fff' },
  sectionHeader: {
    paddingHorizontal: 20,
    marginBottom: 14,
  },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#222' },
  popularScroll: { paddingHorizontal: 20, gap: 12 },
  popularCard: {
    width: 140,
    height: 180,
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: '#F5F5F5',
  },
  popularImg: { width: '100%', height: '100%' },
  popularImgPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  popularTagRow: {
    position: 'absolute',
    top: 8,
    left: 8,
  },
  popularTag: {
    backgroundColor: 'rgba(255,255,255,0.88)',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 5,
  },
  popularTagText: { fontSize: 10, color: '#4CAF50', fontWeight: '700' },
  popularHeart: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 5,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 100,
  },
});
