import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
  Platform,
  NativeModules,
} from 'react-native';
import BottomSheet, { BottomSheetView, BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import { Href, useRouter } from 'expo-router';
import BeanSpotKakaoMapView from '../../../components/features/map/BeanSpotKakaoMapView';
import { fetchJobPostings, toggleFavoritePosting } from '../../../features/map/api';
import type { JobPosting } from '../../../features/map/types';

// 카테고리 목록
const CATEGORIES = ['전체', '재생에너지', '환경보전', '일자리 창출', '지속가능성'];

export default function MapScreen() {
  const router = useRouter();
  const bottomSheetRef = useRef<BottomSheet>(null);
  
  const snapPoints = useMemo(() => ['12%', '50%', '90%'], []);

  const [allPostings, setAllPostings] = useState<JobPosting[]>([]);
  const [visiblePostings, setVisiblePostings] = useState<JobPosting[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [mapReady, setMapReady] = useState(false);
  const [selectedPostingId, setSelectedPostingId] = useState<string | null>(null);
  const [mapSupported, setMapSupported] = useState<boolean | null>(null);

  const loadData = async () => {
    setLoading(true);
    const data = await fetchJobPostings();
    setAllPostings(data);
    setVisiblePostings(data); // Initially show all
    setLoading(false);
  };

  useEffect(() => {
    const appKey =
      process.env.EXPO_PUBLIC_KAKAO_NATIVE_APP_KEY ||
      process.env.EXPO_PUBLIC_KAKAO_MAP_KEY ||
      '';

    if (!appKey) {
      console.warn('Kakao native app key is missing.');
      return;
    }

    const { BeanSpotKakaoMapModule } = NativeModules;
    if (!BeanSpotKakaoMapModule?.initializeKakaoMapSDK) {
      console.warn('KakaoMap native module is missing.');
      return;
    }

    BeanSpotKakaoMapModule.initializeKakaoMapSDK(appKey)
      .then(() => setMapReady(true))
      .catch((error: unknown) => {
        console.error('KakaoMap SDK init failed:', error);
      });
  }, []);

  useEffect(() => {
    if (Platform.OS !== 'android') {
      // iOS는 네이티브 모듈 불필요 — 맵 지원으로 처리하고 바로 데이터 로드
      setMapSupported(true);
      setMapReady(true);
      return;
    }

    const { BeanSpotKakaoMapModule } = NativeModules;
    if (!BeanSpotKakaoMapModule?.getPrimaryAbi) {
      setMapSupported(false);
      return;
    }

    BeanSpotKakaoMapModule.getPrimaryAbi()
      .then((abi: string) => {
        setMapSupported(!abi.startsWith('x86'));
      })
      .catch(() => setMapSupported(false));
  }, []);

  useEffect(() => {
    if (mapReady) {
      loadData();
    }
  }, [mapReady]);

  const toggleFavorite = useCallback(async (postingId: string) => {
    const isFavorite = favorites.has(postingId);
    setFavorites((prev) => {
      const updated = new Set(prev);
      if (isFavorite) {
        updated.delete(postingId);
      } else {
        updated.add(postingId);
      }
      return updated;
    });
    // Fire-and-forget API call
    await toggleFavoritePosting(postingId, !isFavorite);
  }, [favorites]);

  const handleMarkerPress = useCallback(
    (event: { nativeEvent: { id: string } }) => {
      const { id } = event.nativeEvent;
      setSelectedPostingId(id);
      bottomSheetRef.current?.snapToIndex(1);
    },
    [],
  );

  const filteredPostings = useMemo(() => {
    if (selectedCategory === '전체') {
      return visiblePostings;
    }
    return visiblePostings.filter((posting) => posting.category === selectedCategory);
  }, [visiblePostings, selectedCategory]);

  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  const resetLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        alert('위치 권한이 필요합니다.');
        return;
      }
      const location = await Location.getCurrentPositionAsync({});
      setUserLocation({
        lat: location.coords.latitude,
        lng: location.coords.longitude,
      });
    } catch (error) {
      console.error('위치 가져오기 실패:', error);
    }
  };

  const renderPostingCard = ({ item }: { item: JobPosting }) => (
    <TouchableOpacity
      style={[
        styles.postingCard,
        item.id === selectedPostingId && styles.postingCardSelected,
      ]}
      activeOpacity={0.8}
      onPress={() => router.push(`/posting/${encodeURIComponent(item.id)}` as Href)}
    >
      <Image 
        source={{ uri: item.thumbnail }} 
        style={styles.thumbnail}
        resizeMode="cover"
      />
      <View style={styles.cardInfo}>
        <View style={styles.badgeContainer}>
          <View style={[styles.badge, { backgroundColor: '#E3F2FD' }]}>
            <Text style={[styles.badgeText, { color: '#1976D2' }]}>
              {item.workType}
            </Text>
          </View>
          <View style={[styles.badge, { backgroundColor: '#E8F5E9' }]}>
            <Text style={[styles.badgeText, { color: '#4CAF50' }]}>
              {item.category}
            </Text>
          </View>
        </View>
        <Text style={styles.postingTitle} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.companyName} numberOfLines={1}>
          {item.company}
        </Text>
        <Text style={styles.deadline}>마감일 {item.deadline}</Text>
      </View>
      <TouchableOpacity
        style={styles.favoriteBtn}
        onPress={() => toggleFavorite(item.id)}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Ionicons
          name={favorites.has(item.id) ? 'heart' : 'heart-outline'}
          size={26}
          color={favorites.has(item.id) ? '#FF5252' : '#BDBDBD'}
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="map-outline" size={100} color="#E0E0E0" />
      <Text style={styles.emptyText}>지도 영역 내에 공고가 없습니다.</Text>
      <TouchableOpacity style={styles.resetBtn} onPress={resetLocation}>
        <Text style={styles.resetBtnText}>내 위치로 이동</Text>
        <Ionicons name="refresh-outline" size={18} color="#4CAF50" />
      </TouchableOpacity>
    </View>
  );

  return (
    <GestureHandlerRootView style={styles.container}>
      {mapSupported === false ? (
        <View style={styles.mapGuard}>
          <Ionicons name="map-outline" size={64} color="#BDBDBD" />
          <Text style={styles.mapGuardTitle}>지도는 실기기에서만 지원됩니다</Text>
          <Text style={styles.mapGuardDesc}>
            현재 에뮬레이터는 x86_64라 Kakao 지도 SDK를 로드할 수 없어요.
          </Text>
        </View>
      ) : mapSupported === null ? (
        <View style={styles.mapGuard}>
          <ActivityIndicator size="large" color="#4CAF50" />
        </View>
      ) : (
        <BeanSpotKakaoMapView
          style={styles.mapView}
          markers={visiblePostings}
          markerImage={Platform.OS === 'android' ? 'beanspot_marker' : undefined}
          camera={userLocation ?? undefined}
          onMarkerPress={handleMarkerPress}
          onMapReady={() => setMapReady(true)}
          initialCamera={{
            lat: 37.4979,
            lng: 126.8291,
            zoomLevel: 3,
          }}
        />
      )}

      <BottomSheet
        ref={bottomSheetRef}
        index={0}
        snapPoints={snapPoints}
        enablePanDownToClose={false}
        handleIndicatorStyle={styles.sheetIndicator}
        backgroundStyle={styles.sheetBackground}
      >
        <BottomSheetView style={styles.sheetContent}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#4CAF50" />
            </View>
          ) : (
            <>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.filterScroll}
                contentContainerStyle={styles.filterScrollContent}
              >
                {CATEGORIES.map((category) => (
                  <TouchableOpacity
                    key={category}
                    style={[
                      styles.filterChip,
                      selectedCategory === category && styles.filterChipActive,
                    ]}
                    onPress={() => setSelectedCategory(category)}
                  >
                    <Text
                      style={[
                        styles.filterChipText,
                        selectedCategory === category && styles.filterChipTextActive,
                      ]}
                    >
                      {category}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <Text style={styles.resultCount}>
                총 공고 {filteredPostings.length}개
              </Text>

              {filteredPostings.length > 0 ? (
                <BottomSheetFlatList
                  data={filteredPostings}
                  renderItem={renderPostingCard}
                  keyExtractor={(item) => item.id}
                  contentContainerStyle={styles.listContainer}
                  showsVerticalScrollIndicator={false}
                />
              ) : (
                renderEmptyState()
              )}
            </>
          )}
        </BottomSheetView>
      </BottomSheet>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  webview: {
    flex: 1,
  },
  mapView: {
    flex: 1,
  },
  mapGuard: {
    flex: 1,
    backgroundColor: '#FAFAFA',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  mapGuardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#424242',
    marginTop: 12,
  },
  mapGuardDesc: {
    fontSize: 13,
    color: '#757575',
    marginTop: 8,
    textAlign: 'center',
  },
  sheetIndicator: {
    backgroundColor: '#BDBDBD',
    width: 40,
    height: 4,
  },
  sheetBackground: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  sheetContent: {
    flex: 1,
    paddingHorizontal: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // 필터 칩
  filterScroll: {
    marginBottom: 12,
  },
  filterScrollContent: {
    paddingVertical: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  filterChipActive: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#757575',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
  },
  
  // 결과 개수
  resultCount: {
    fontSize: 13,
    color: '#757575',
    marginBottom: 12,
    fontWeight: '500',
  },
  
  // 공고 카드
  listContainer: {
    paddingBottom: 20,
  },
  postingCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  postingCardSelected: {
    borderWidth: 1.5,
    borderColor: '#4CAF50',
  },
  thumbnail: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#E0E0E0',
  },
  cardInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'space-between',
  },
  badgeContainer: {
    flexDirection: 'row',
    gap: 6,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  postingTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#212121',
    marginTop: 4,
  },
  companyName: {
    fontSize: 13,
    color: '#616161',
    fontWeight: '500',
  },
  deadline: {
    fontSize: 12,
    color: '#9E9E9E',
  },
  favoriteBtn: {
    padding: 4,
    alignSelf: 'flex-start',
  },
  
  // 빈 화면
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
  },
  emptyText: {
    fontSize: 17,
    color: '#9E9E9E',
    marginTop: 20,
    marginBottom: 28,
    fontWeight: '500',
  },
  resetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: '#4CAF50',
    gap: 8,
  },
  resetBtnText: {
    fontSize: 15,
    color: '#4CAF50',
    fontWeight: '700',
  },
});
