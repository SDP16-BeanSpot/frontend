import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useUserRole } from '../../../hooks/useUserRole';

interface AdminGuardProps {
  /** 헤더에 표시할 화면 제목 (예: "공고등록") */
  title: string;
  children: React.ReactNode;
}

/**
 * 관리자 전용 화면 가드.
 * role 로딩 중에는 빈 화면, ADMIN 이 아니면 Figma의 "권한이 없습니다" 화면을 보여줍니다.
 */
const AdminGuard = ({ title, children }: AdminGuardProps) => {
  const router = useRouter();
  const { isAdmin, loaded } = useUserRole();

  if (!loaded) {
    return <SafeAreaView style={styles.container} />;
  }

  if (!isAdmin) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.headerIcon}>
            <Ionicons name="chevron-back" size={24} color="#212121" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{title}</Text>
          <View style={{ width: 36 }} />
        </View>

        <View style={styles.center}>
          <Image
            source={require('../../../assets/images/icon.png')}
            style={styles.mascot}
            resizeMode="contain"
          />
          <Text style={styles.message}>권한이 없습니다</Text>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Text style={styles.backBtnText}>되돌아가기</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return <>{children}</>;
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  headerIcon: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 16, fontWeight: '700', color: '#212121' },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 80,
    gap: 14,
  },
  mascot: { width: 90, height: 90, opacity: 0.4 },
  message: { fontSize: 15, color: '#555', fontWeight: '500' },
  backBtn: {
    borderWidth: 1.5,
    borderColor: '#DDD',
    borderRadius: 22,
    paddingHorizontal: 40,
    paddingVertical: 12,
  },
  backBtnText: { fontSize: 14, color: '#555', fontWeight: '600' },
});

export default AdminGuard;
