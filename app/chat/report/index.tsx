// import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const REPORT_REASONS = [
  '부적절한 언행 및 욕설을 사용했어요',
  '성적 언행 및 은밀한 제안을 했어요',
  '근로환경 고충이 있어요',
  '동네/근교에서 비매너를 보였어요',
  '스팸/도배를 했어요',
  '불편한 대화를 했어요',
  '기타',
];

const ChatReportReasonScreen = () => {
  const router = useRouter();
  const { chatId } = useLocalSearchParams<{ chatId?: string }>();
  const normalizedChatId = Array.isArray(chatId) ? chatId[0] : chatId;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerIcon} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={22} color="#212121" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>신고하기</Text>
        <View style={styles.headerIcon} />
      </View>

      <View style={styles.list}>
        {REPORT_REASONS.map((reason) => (
          <TouchableOpacity
            key={reason}
            style={styles.listItem}
            onPress={() =>
              router.push({
                pathname: '/chat/report/write',
                params: { reason, chatId: normalizedChatId },
              })
            }
          >
            <Text style={styles.listItemText}>{reason}</Text>
            <Ionicons name="chevron-forward" size={16} color="#9E9E9E" />
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
};

export default ChatReportReasonScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    paddingHorizontal: 6,
  },
  headerIcon: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#212121',
  },
  list: {
    paddingTop: 14,
  },
  listItem: {
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  listItemText: {
    fontSize: 12,
    color: '#424242',
    fontWeight: '500',
  },
});
