import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';

import type { FoundAccount } from '../../../features/findAccount/types';

export default function FindIdResultPage() {
  const { accounts: accountsParam } = useLocalSearchParams<{ accounts?: string }>();

  const accounts: FoundAccount[] = useMemo(() => {
    if (!accountsParam) return [];
    try {
      return JSON.parse(accountsParam) as FoundAccount[];
    } catch {
      return [];
    }
  }, [accountsParam]);

  const hasResults = accounts.length > 0;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
        </View>

        {hasResults ? (
          <>
            <View style={styles.titleSection}>
              <Text style={styles.title}>아이디가 {accounts.length}건 검색되었습니다</Text>
            </View>

            <FlatList
              data={accounts}
              keyExtractor={(item, idx) => `${item.type}-${idx}`}
              contentContainerStyle={{ gap: 12 }}
              renderItem={({ item }) => (
                <View style={styles.accountCard}>
                  <View style={styles.accountIcon}>
                    <Ionicons
                      name={item.type === 'kakao' ? 'chatbubble' : 'person-circle-outline'}
                      size={22}
                      color={item.type === 'kakao' ? '#3C1E1E' : '#00D664'}
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.accountLabel}>{item.label}</Text>
                    <Text style={styles.accountId}>{item.userId}</Text>
                  </View>
                  <Text style={styles.accountDate}>{item.joinedAt} 가입</Text>
                </View>
              )}
            />

            <TouchableOpacity
              style={styles.passwordLink}
              onPress={() => router.push('/onBoarding/findPassword' as any)}
            >
              <Text style={styles.passwordLinkText}>비밀번호를 잊어버리셨나요? 비밀번호 찾기</Text>
            </TouchableOpacity>
          </>
        ) : (
          <View style={styles.emptyState}>
            <Image
              source={require('../../../assets/images/icon.png')}
              style={styles.mascot}
              resizeMode="contain"
            />
            <Text style={styles.emptyTitle}>계정 정보가 없어요.</Text>
            <Text style={styles.emptySubtitle}>입력하신 정보로 가입된 계정을 찾을 수 없어요.</Text>
          </View>
        )}
      </View>

      <View style={styles.buttonContainer}>
        {hasResults ? (
          <TouchableOpacity style={styles.nextButton} onPress={() => router.replace('/onBoarding/login' as any)}>
            <Text style={styles.nextButtonText}>로그인</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.nextButton} onPress={() => router.replace('/onBoarding/register' as any)}>
            <Text style={styles.nextButtonText}>회원가입 바로가기</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  content: { flex: 1, paddingHorizontal: 24 },
  header: { paddingTop: 20, paddingBottom: 20 },
  backButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'flex-start' },
  backButtonText: { fontSize: 24, color: '#333333' },
  titleSection: { marginBottom: 24 },
  title: { fontSize: 20, fontWeight: '700', color: '#333333' },
  accountCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EEEEEE',
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  accountIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  accountLabel: { fontSize: 14, fontWeight: '600', color: '#333333' },
  accountId: { fontSize: 13, color: '#999999', marginTop: 2 },
  accountDate: { fontSize: 12, color: '#AAAAAA' },
  passwordLink: { alignItems: 'center', paddingVertical: 20 },
  passwordLinkText: { fontSize: 13, color: '#00D664', fontWeight: '600', textDecorationLine: 'underline' },
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingBottom: 60 },
  mascot: { width: 140, height: 140, marginBottom: 20 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: '#333333', marginBottom: 8 },
  emptySubtitle: { fontSize: 13, color: '#999999', textAlign: 'center' },
  buttonContainer: { paddingHorizontal: 24, paddingBottom: 34, paddingTop: 16 },
  nextButton: { paddingVertical: 16, borderRadius: 12, alignItems: 'center', backgroundColor: '#00D664' },
  nextButtonText: { fontSize: 16, fontWeight: '600', color: '#FFFFFF' },
});
