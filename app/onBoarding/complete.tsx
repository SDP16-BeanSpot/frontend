import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function RegisterCompletePage() {
  const { nickname } = useLocalSearchParams<{ nickname?: string }>();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>회원가입</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.content}>
        <Image
          source={require('../../assets/images/paniOnBoarding.svg')}
          style={styles.mascot}
          resizeMode="contain"
        />
        <Text style={styles.completeText}>회원가입 완료!</Text>
        <Text style={styles.welcomeText}>
          {nickname ? `${nickname} 님, ` : ''}환영해콩!
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.startButton}
          onPress={() => router.replace('/(tabs)/home')}
        >
          <Text style={styles.startButtonText}>바로 시작하기</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingTop: 12,
  },
  backButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  backButtonText: { fontSize: 24, color: '#333333' },
  headerTitle: { fontSize: 16, fontWeight: 'bold', color: '#333333' },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  mascot: { width: 180, height: 180, marginBottom: 32 },
  completeText: { fontSize: 14, color: '#666666', marginBottom: 8 },
  welcomeText: { fontSize: 20, fontWeight: 'bold', color: '#222222' },
  buttonContainer: { paddingHorizontal: 24, paddingBottom: 34 },
  startButton: {
    backgroundColor: '#00D664',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  startButtonText: { fontSize: 16, fontWeight: '600', color: '#FFFFFF' },
});
