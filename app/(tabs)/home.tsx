import React, { useState } from 'react';
import {
  StyleSheet,
  FlatList,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// 분리된 컴포넌트들을 import
import { HomeHeader } from '@/components/features/home/HomeHeader';
import { GardenCard } from '@/components/features/home/GardenCard';

// --- 1. 임시 데이터 (실제로는 constants/data.ts 같은 곳으로 이동 가능) ---
const bannerData = [
  { id: '1', title: '빈스팟에 오신걸 환영해요!', image: 'https-via-placeholder-com-350x150-png-?text=Banner+1' },
  { id: '2', title: '두 번째 배너', image: 'https-via-placeholder-com-350x150-png-?text=Banner+2' },
  { id: '3', title: '세 번째 배너', image: 'https-via-placeholder-com-350x150-png-?text=Banner+3' },
];
const filterData = [
  { id: '1', name: '가까운' },
  { id: '2', name: '최신 등록' },
  { id: '3', name: '무료 텃밭 신청' },
  { id: '4', name: '인기순' },
];
const gardenData = [
  { id: '1', name: '실외 옥상형 월 10만원', distance: '9.5km', area: '성수동', duration: '3~6개월', size: '대형', image: 'https-via-placeholder-com-150-jpeg-?text=Garden+1' },
  { id: '2', name: '실내 온실형 월 40만원', distance: '2.5km', area: '성수동', duration: '1~3개월', size: '소형', image: 'https-via-placeholder-com-150-jpeg-?text=Garden+2' },
  { id: '3', name: '실외 옥상형 월 10만원', distance: '3.9km', area: '성수동', duration: '3~6개월', size: '대형', image: 'https-via-placeholder-com-150-jpeg-?text=Garden+3' },
  { id: '4', name: '실내 온실형 월 50만원', distance: '4.1km', area: '성수동', duration: '1~3개월', size: '소형', image: 'https-via-placeholder-com-150-jpeg-?text=Garden+4' },
];

// --- 2. 메인 홈 화면 컴포넌트 ---
const MainHomeScreen = () => {
  // 필터 상태는 부모(페이지)가 가지고 있어야 함 (HomeHeader와 GardenList가 공유)
  const [activeFilterId, setActiveFilterId] = useState('1');

  // renderItem 함수가 매우 간결해짐
  const renderGardenItem = ({ item }: { item: typeof gardenData[0] }) => (
    <View style={styles.cardWrapper}>
      <GardenCard item={item} />
    </View>
  );

  // renderHeader 함수가 매우 간결해짐
  const renderHeader = () => (
    <HomeHeader
      bannerData={bannerData}
      filterData={filterData}
      activeFilterId={activeFilterId}
      setActiveFilterId={setActiveFilterId}
    />
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <FlatList
        data={gardenData}
        renderItem={renderGardenItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        ListHeaderComponent={renderHeader}
        columnWrapperStyle={styles.gridRow}
        contentContainerStyle={styles.listContentContainer}
      />
    </SafeAreaView>
  );
};

export default MainHomeScreen;

// --- 3. home.tsx에만 필요한 최소한의 스타일 ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  listContentContainer: {
    paddingHorizontal: 8, // 카드 좌우 여백을 위해 16 -> 8
  },
  gridRow: {
    justifyContent: 'space-between',
    paddingHorizontal: 8, // 카드 사이의 간격
  },
  cardWrapper: {
    width: '100%', // numColumns가 2일 때, 이 wrapper가 50%를 차지
    paddingHorizontal: 8, // 카드 사이의 간격
  },
});