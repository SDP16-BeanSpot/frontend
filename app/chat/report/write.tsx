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
import {
  REPORT_CONTENT_MAX_LENGTH,
  REPORT_CONTENT_MIN_LENGTH,
  REPORT_TYPE_LABELS,
  type ReportType,
} from '../../../features/shared/reportTypes';

const ChatReportWriteScreen = () => {
  const router = useRouter();
  const { reportType, chatId, messageId } = useLocalSearchParams<{
    reportType?: string | string[];
    chatId?: string | string[];
    messageId?: string | string[];
  }>();
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const selectedType = useMemo<ReportType>(() => {
    const value = Array.isArray(reportType) ? reportType[0] : reportType;
    return (value as ReportType) ?? 'OTHER';
  }, [reportType]);
  const normalizedChatId = useMemo(() => {
    if (Array.isArray(chatId)) return chatId[0];
    return chatId;
  }, [chatId]);
  const normalizedMessageId = useMemo(() => {
    if (Array.isArray(messageId)) return messageId[0];
    return messageId;
  }, [messageId]);

  const trimmedLength = content.trim().length;
  const isTooShort = trimmedLength > 0 && trimmedLength < REPORT_CONTENT_MIN_LENGTH;
  const canSubmit = trimmedLength >= REPORT_CONTENT_MIN_LENGTH;

  const submitReport = async () => {
    const trimmed = content.trim();
    if (trimmed.length < REPORT_CONTENT_MIN_LENGTH) {
      Alert.alert('알림', `신고 내용을 ${REPORT_CONTENT_MIN_LENGTH}자 이상 입력해주세요.`);
      return;
    }

    if (!normalizedMessageId) {
      Alert.alert('알림', '신고할 메시지 정보가 없어요.');
      return;
    }

    if (submitting) return;

    setSubmitting(true);
    const result = await createChatReport(normalizedMessageId, {
      reportType: selectedType,
      content: trimmed,
    });
    setSubmitting(false);

    if (!result.ok && !result.skipped) {
      Alert.alert('신고 접수에 실패했어요.', result.message || '잠시 후 다시 시도해주세요.');
      return;
    }

    Alert.alert(
      '신고가 접수되었어요.',
      '검토 후 조치할게요. 신고 접수 즉시 해당 채팅방에는 더 이상 메시지를 보낼 수 없어요.',
      [
        {
          text: '확인',
          onPress: () => {
            if (normalizedChatId) {
              router.replace({ pathname: '/chat/[id]', params: { id: normalizedChatId } });
            } else {
              router.back();
            }
          },
        },
      ],
    );
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
        <Text style={styles.reasonText}>{REPORT_TYPE_LABELS[selectedType]}</Text>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            value={content}
            onChangeText={setContent}
            multiline
            maxLength={REPORT_CONTENT_MAX_LENGTH}
            placeholder="신고할 내용을 입력해주세요."
            placeholderTextColor="#BDBDBD"
            textAlignVertical="top"
          />
          <Text style={[styles.counterText, isTooShort && styles.counterTextWarn]}>
            {content.length}/{REPORT_CONTENT_MAX_LENGTH}
          </Text>
        </View>
        {isTooShort && (
          <Text style={styles.warnText}>
            최소 {REPORT_CONTENT_MIN_LENGTH}자 이상 입력해주세요. ({trimmedLength}/
            {REPORT_CONTENT_MIN_LENGTH})
          </Text>
        )}
        <Text style={styles.noticeText}>
          이 항목으로 신고하면 더 이상 해당 채팅방에 메시지를 보낼 수 없어요.{'\n'}
          (마이페이지 {'>'} 신고 탭에서 차단을 취소할 수 있어요.)
        </Text>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.submitButton, !canSubmit && styles.submitButtonDisabled]}
          onPress={() => void submitReport()}
          disabled={!canSubmit || submitting}
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
    fontSize: 14,
    fontWeight: '700',
    color: '#212121',
  },
  inputWrapper: {
    marginTop: 12,
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
  counterTextWarn: {
    color: '#FF5252',
  },
  warnText: {
    marginTop: 6,
    fontSize: 11,
    color: '#FF5252',
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
    backgroundColor: '#C8E6C9',
  },
  submitText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
});
