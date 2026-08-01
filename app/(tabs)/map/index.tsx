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
import {
  fetchFavoritePostingIds,
  fetchJobPostingsInBounds,
  toggleFavoritePosting,
} from '../../../features/map/api';
import type { JobPosting, MapBounds } from '../../../features/map/types';

// 카테고리 목록
const CATEGORIES = ['전체', '재생에너지', '환경보전', '일자리 창출', '지속가능성'];

export default function MapScreen() {
  const router = useRouter();
  const bottomSheetRef = useRef<BottomSheet>(null);
  
  const snapPoints = useMemo(() => ['12%', '50%', '90%'], []);

  const [visiblePostings, setVisiblePostings] = useState<JobPosting[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [selectedPostingId, setSelectedPostingId] = useState<string | null>(null);
  const [mapSupported, setMapSupported] = useState<boolean | null>(null);

  // 지도 이동이 잦아 매번 요청하지 않도록 디바운스 처리
  const boundsTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const requestSeqRef = useRef(0);

  const loadPostingsInBounds = useCallback(async (bounds: MapBounds) => {
    const seq = ++requestSeqRef.current;
    setLoading(true);
    const data = await fetchJobPostingsInBounds(bounds);
    // 늦게 도착한 이전 요청이 최신 결과를 덮어쓰지 않도록
    if (seq !== requestSeqRef.current) return;
    setVisiblePostings(data);
    setLoading(false);
  }, []);

  const handleCameraChange = useCallback(
    (event: { nativeEvent: MapBounds }) => {
      const bounds = event.nativeEvent;
      if (boundsTimerRef.current) clearTimeout(boundsTimerRef.current);
      boundsTimerRef.current = setTimeout(() => loadPostingsInBounds(bounds), 400);
    },
    [loadPostingsInBounds],
  );

  useEffect(
    () => () => {
      if (boundsTimerRef.current) clearTimeout(boundsTimerRef.current);
    },
    [],
  );

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
      .catch((error: unknown) => {
        console.error('KakaoMap SDK init failed:', error);
      });
  }, []);

  useEffect(() => {
    if (Platform.OS !== 'android') {
      // iOS는 네이티브 모듈 불필요 — 맵 지원으로 처리
      setMapSupported(true);
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

  // 공고 목록은 지도가 준비되면 곧바로 오는 onCameraChange(최초 표시 영역)로 채워집니다.

  // 이미 등록해둔 관심 공고를 불러와 하트 상태를 복원
  useEffect(() => {
    let cancelled = false;
    fetchFavoritePostingIds().then((ids) => {
      if (!cancelled) setFavorites(ids);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const toggleFavorite = useCallback(async (postingId: string) => {
    const isFavorite = favorites.has(postingId);
    const applyLocal = (favorited: boolean) =>
      setFavorites((prev) => {
        const updated = new Set(prev);
        if (favorited) updated.add(postingId);
        else updated.delete(postingId);
        return updated;
      });

    applyLocal(!isFavorite);
    const result = await toggleFavoritePosting(postingId, !isFavorite);
    // 서버 반영 실패 시 하트를 원래대로 되돌림
    if (!result.ok && !result.skipped) applyLocal(isFavorite);
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
          onCameraChange={handleCameraChange}
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
