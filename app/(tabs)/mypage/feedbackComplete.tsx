import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function FeedbackCompleteScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerIcon}>
          <Ionicons name="chevron-back" size={24} color="#212121" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>의견 남기기</Text>
        <View style={{ width: 36 }} />
      </View>

      <View style={styles.content}>
        <Image
          source={require('../../../assets/images/beanCouple.png')}
          style={styles.mascot}
          resizeMode="contain"
        />
        <Text style={styles.title}>소중한 의견이 제출되었어요!</Text>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.confirmBtn}
          onPress={() => router.replace('/mypage')}
        >
          <Text style={styles.confirmText}>확인</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

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
  content: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  mascot: { width: 210, height: 145, marginBottom: 28 },
  title: { fontSize: 17, fontWeight: '700', color: '#222' },
  footer: { paddingHorizontal: 20, paddingBottom: 28, paddingTop: 10 },
  confirmBtn: {
    width: '100%',
    height: 52,
    borderRadius: 14,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmText: { fontSize: 16, fontWeight: '700', color: '#fff' },
});
