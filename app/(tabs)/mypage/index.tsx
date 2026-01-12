import React from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import MyPageHeader from '../../../components/features/mypage/MyPageHeader';
import ProfileCard from '../../../components/features/mypage/ProfileCard';
import RecentlyViewed from '../../../components/features/mypage/RecentlyViewed';
import MenuSection from '../../../components/features/mypage/MenuSection';

export default function MyPageScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <MyPageHeader />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <ProfileCard />
        <RecentlyViewed />
        <MenuSection />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    paddingBottom: 100,
  },
});
