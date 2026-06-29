import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const AppSettingsScreen = () => {
  const router = useRouter();
  const [doNotDisturb, setDoNotDisturb] = useState(true);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>앱 설정</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* 알림 설정 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>알림 설정</Text>

          <TouchableOpacity style={styles.item}>
            <Text style={styles.itemText}>알림 수신 설정</Text>
          </TouchableOpacity>

          <View style={styles.itemRow}>
            <View>
              <Text style={styles.itemText}>방해금지 시간 설정</Text>
              <Text style={styles.itemSub}>오후 10시 ~ 오전 7시</Text>
            </View>
            <Switch
              value={doNotDisturb}
              onValueChange={setDoNotDisturb}
              trackColor={{ false: '#E0E0E0', true: '#4CAF50' }}
              thumbColor="#fff"
            />
          </View>
        </View>

        <View style={styles.divider} />

        {/* 사용자 설정 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>사용자 설정</Text>
          <TouchableOpacity style={styles.item}>
            <Text style={styles.itemText}>계정/정보 관리</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.divider} />

        {/* 기타 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>기타</Text>

          <TouchableOpacity style={styles.item}>
            <Text style={styles.itemText}>공지사항</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.item}
            onPress={() => Alert.alert('캐시 삭제', '캐시 데이터를 삭제하시겠습니까?', [
              { text: '취소', style: 'cancel' },
              { text: '삭제', style: 'destructive', onPress: () => {} },
            ])}
          >
            <Text style={styles.itemText}>캐시 데이터 삭제</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.item}
            onPress={() => Alert.alert('로그아웃', '로그아웃 하시겠습니까?', [
              { text: '취소', style: 'cancel' },
              { text: '로그아웃', style: 'destructive', onPress: () => {} },
            ])}
          >
            <Text style={styles.itemText}>로그아웃</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.item}
            onPress={() => Alert.alert('탈퇴하기', '정말로 탈퇴하시겠습니까?\n탈퇴 시 모든 데이터가 삭제됩니다.', [
              { text: '취소', style: 'cancel' },
              { text: '탈퇴', style: 'destructive', onPress: () => {} },
            ])}
          >
            <Text style={[styles.itemText, styles.dangerText]}>탈퇴하기</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerTitle: { fontSize: 17, fontWeight: '700', color: '#333' },
  backButton: { padding: 4 },
  section: { paddingHorizontal: 20, paddingVertical: 16 },
  sectionTitle: { fontSize: 13, color: '#999', marginBottom: 4 },
  item: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  itemText: { fontSize: 16, color: '#333' },
  itemSub: { fontSize: 12, color: '#999', marginTop: 3 },
  dangerText: { color: '#F44336' },
  divider: { height: 8, backgroundColor: '#F5F5F5' },
});

export default AppSettingsScreen;
