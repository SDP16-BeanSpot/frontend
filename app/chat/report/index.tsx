import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { REPORT_TYPE_LABELS, REPORT_TYPES } from '../../../features/shared/reportTypes';

const ChatReportReasonScreen = () => {
  const router = useRouter();
  const { chatId, messageId } = useLocalSearchParams<{ chatId?: string; messageId?: string }>();
  const normalizedChatId = Array.isArray(chatId) ? chatId[0] : chatId;
  const normalizedMessageId = Array.isArray(messageId) ? messageId[0] : messageId;

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
        {REPORT_TYPES.map((reportType) => (
          <TouchableOpacity
            key={reportType}
            style={styles.listItem}
            onPress={() =>
              router.push({
                pathname: '/chat/report/write',
                params: {
                  reportType,
                  chatId: normalizedChatId,
                  messageId: normalizedMessageId,
                },
              })
            }
          >
            <Text style={styles.listItemText}>{REPORT_TYPE_LABELS[reportType]}</Text>
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
