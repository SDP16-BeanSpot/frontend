import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const SettingItem = ({ title, onPress }) => (
  <TouchableOpacity style={styles.item} onPress={onPress}>
    <Text style={styles.itemText}>{title}</Text>
  </TouchableOpacity>
);

const SectionTitle = ({ title }) => (
  <Text style={styles.sectionTitle}>{title}</Text>
);

const AppSettingsScreen = () => {
  const router = useRouter();
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Feather name="arrow-left" size={28} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>앱 설정</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* 알림 설정 섹션 */}
        <View style={styles.section}>
          <SectionTitle title="알림 설정" />
          <SettingItem title="알림 수신 설정" onPress={() => console.log('알림 설정 클릭')} />
          <SettingItem title="방해금지 시간 설정" />
        </View>

        <View style={styles.divider} />

        {/* 사용자 설정 섹션 */}
        <View style={styles.section}>
          <SectionTitle title="사용자 설정" />
          <SettingItem title="계정/정보 관리" />
          <SettingItem title="채팅 설정" />
          <SettingItem title="캘린더 설정" />
        </View>

        <View style={styles.divider} />

        {/* 기타 섹션 */}
        <View style={styles.section}>
          <SectionTitle title="기타" />
          <SettingItem title="공지사항" />
          <SettingItem title="캐시 데이터 삭제" />
          <SettingItem title="로그아웃" />
          <SettingItem title="탈퇴하기" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 15,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  backButton: {
    padding: 5,
  },
  section: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  sectionTitle: {
    fontSize: 13,
    color: '#999',
    marginBottom: 15,
  },
  item: {
    paddingVertical: 15,
  },
  itemText: {
    fontSize: 16,
    color: '#333',
  },
  divider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginHorizontal: 20,
  },
});

export default AppSettingsScreen;
