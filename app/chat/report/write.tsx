import React, { useMemo, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import {
  Alert,
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { createChatReport } from '../../../features/chat/api';

const MAX_REPORT_LENGTH = 200;

const ChatReportWriteScreen = () => {
  const router = useRouter();
  const { reason, chatId } = useLocalSearchParams<{
    reason?: string | string[];
    chatId?: string | string[];
  }>();
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const selectedReason = useMemo(() => {
    if (Array.isArray(reason)) {
      return reason[0] ?? '기타';
    }
    return reason ?? '기타';
  }, [reason]);
  const normalizedChatId = useMemo(() => {
    if (Array.isArray(chatId)) {
      return chatId[0];
    }
    return chatId;
  }, [chatId]);

  const submitReport = async () => {
    const trimmed = content.trim();
    if (!trimmed) {
      Alert.alert('신고 내용을 입력해주세요.');
      return;
    }

    if (!normalizedChatId) {
      Alert.alert('채팅방 정보가 없어 신고할 수 없어요.');
      return;
    }

    if (submitting) {
      return;
    }

    setSubmitting(true);
    const result = await createChatReport(normalizedChatId, {
      reason: selectedReason,
      content: trimmed,
    });
    setSubmitting(false);

    if (!result.ok && !result.skipped) {
      Alert.alert('신고 접수에 실패했어요.', result.message || '잠시 후 다시 시도해주세요.');
      return;
    }

    Alert.alert('신고가 접수되었어요.', '검토 후 조치할게요.', [
      {
        text: '확인',
        onPress: () => {
          router.replace({
            pathname: '/chat/[id]',
            params: { id: normalizedChatId },
          });
        },
      },
    ]);
  };

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

      <View style={styles.content}>
        <Text style={styles.reasonText}>{selectedReason}</Text>
        <Text style={styles.descriptionLabel}>신고 내용을 입력해주세요.</Text>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            value={content}
            onChangeText={setContent}
            multiline
            maxLength={MAX_REPORT_LENGTH}
            placeholder="상세 내용을 작성해주세요."
            placeholderTextColor="#BDBDBD"
            textAlignVertical="top"
          />
          <Text style={styles.counterText}>{content.length}/{MAX_REPORT_LENGTH}</Text>
        </View>
        <Text style={styles.noticeText}>
          허위 신고는 신고자에게 더 큰 불이익을 줄 수 있으며, 반복적인 신고는 이용 제한 사유가 될 수 있어요.
        </Text>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.submitButton, submitting && styles.submitButtonDisabled]}
          onPress={() => void submitReport()}
          disabled={submitting}
        >
          {submitting ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.submitText}>신고 제출하기</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ChatReportWriteScreen;

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
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 18,
  },
  reasonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#616161',
  },
  descriptionLabel: {
    marginTop: 10,
    fontSize: 11,
    color: '#9E9E9E',
  },
  inputWrapper: {
    marginTop: 8,
    borderRadius: 10,
    backgroundColor: '#F5F5F7',
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 10,
    minHeight: 220,
  },
  input: {
    flex: 1,
    fontSize: 13,
    color: '#212121',
    lineHeight: 19,
  },
  counterText: {
    marginTop: 8,
    fontSize: 10,
    color: '#9E9E9E',
    textAlign: 'right',
  },
  noticeText: {
    marginTop: 12,
    fontSize: 10,
    color: '#A2A2A2',
    lineHeight: 15,
  },
  footer: {
    paddingHorizontal: 12,
    paddingBottom: 14,
  },
  submitButton: {
    height: 42,
    borderRadius: 12,
    backgroundColor: '#2ED10F',
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonDisabled: {
    opacity: 0.8,
  },
  submitText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
});
