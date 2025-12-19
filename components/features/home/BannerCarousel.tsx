// components/features/home/BannerCarousel.tsx

import React, { useState } from 'react';
import { View, Text, Image, FlatList, Dimensions, StyleSheet } from 'react-native';

const { width } = Dimensions.get('window');

// 배너 아이템 렌더링
const renderBannerItem = ({ item }: { item: any }) => (
  <View style={styles.bannerItemContainer}>
    <Image source={{ uri: item.image }} style={styles.bannerImage} />
    <Text style={styles.bannerTitle}>{item.title}</Text>
  </View>
);

// 페이지네이션 렌더링
const renderPagination = (data: any[], activeIndex: number) => (
  <View style={styles.paginationContainer}>
    {data.map((_, index) => (
      <View
        key={index}
        style={[
          styles.dot,
          index === activeIndex ? styles.dotActive : styles.dotInactive,
        ]}
      />
    ))}
  </View>
);

export const BannerCarousel = ({ data }: { data: any[] }) => {
  const [activeBannerIndex, setActiveBannerIndex] = useState(0);

  return (
    <View style={styles.bannerContainer}>
      <FlatList
        data={data}
        renderItem={renderBannerItem}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={(event) => {
          const index = Math.round(event.nativeEvent.contentOffset.x / width);
          setActiveBannerIndex(index);
        }}
      />
      {renderPagination(data, activeBannerIndex)}
    </View>
  );
};

const styles = StyleSheet.create({
  bannerContainer: { height: 150 },
  bannerItemContainer: { width: width, height: 150, justifyContent: 'center' },
  bannerImage: { width: '100%', height: '100%', position: 'absolute', resizeMode: 'cover' },
  bannerTitle: { fontSize: 22, fontWeight: 'bold', color: '#FFFFFF', paddingHorizontal: 16 },
  paginationContainer: { flexDirection: 'row', position: 'absolute', bottom: 10, alignSelf: 'center' },
  dot: { width: 8, height: 8, borderRadius: 4, marginHorizontal: 3 },
  dotActive: { backgroundColor: 'green' },
  dotInactive: { backgroundColor: 'gray' },
});