import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';

import AdminGuard from '../../components/features/admin/AdminGuard';
import MonthPicker, { type DatePickerResult } from '../../components/features/calendar/MonthPicker';
import { createAnnouncement } from '../../features/admin/api';
import { ApiError } from '../../features/shared/apiClient';
import {
  ANNOUNCEMENT_TYPE_LABELS,
  type AnnouncementType,
  type ScheduleItem,
} from '../../features/admin/types';

type Step = 1 | 2 | 3;

const TYPE_OPTIONS = Object.entries(ANNOUNCEMENT_TYPE_LABELS) as [AnnouncementType, string][];
const METHOD_OPTIONS = ['온라인', '오프라인', '혼합'];

const toDateString = ({ year, month, day }: DatePickerResult) =>
  `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

export default function AnnouncementCreateScreen() {
  return (
    <AdminGuard title="공고등록">
      <CreateFlow />
    </AdminGuard>
  );
}

function CreateFlow() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [submitting, setSubmitting] = useState(false);

  // ── Step 1: 기본 사항 ──
  const [type, setType] = useState<AnnouncementType | null>(null);
  const [title, setTitle] = useState('');
  const [poster, setPoster] = useState<{ uri: string; name: string; type: string } | null>(null);
  const [organizer, setOrganizer] = useState('');
  const [intro, setIntro] = useState(''); // 활동소개 (200자) → activityContent
  const [target, setTarget] = useState('');
  const [recruitmentCount, setRecruitmentCount] = useState('');
  const [recruitStart, setRecruitStart] = useState('');
  const [recruitEnd, setRecruitEnd] = useState('');
  const [activityStart, setActivityStart] = useState('');
  const [activityEnd, setActivityEnd] = useState('');
  const [activityMethod, setActivityMethod] = useState('');
  const [region, setRegion] = useState('');
  const [location, setLocation] = useState('');
  const [applyMethod, setApplyMethod] = useState('');
  const [fee, setFee] = useState('');
  const [benefits, setBenefits] = useState('');

  // 날짜 피커 상태: 어느 필드를 편집 중인지
  const [dateField, setDateField] = useState<
    'recruitStart' | 'recruitEnd' | 'activityStart' | 'activityEnd' | null
  >(null);

  // ── Step 2: 상세 내용 ──
  const [activityDetail, setActivityDetail] = useState(''); // 활동 내용
  const [selectionProcess, setSelectionProcess] = useState(''); // 지원 방법
  const [caution, setCaution] = useState(''); // 유의 사항 (detailContent 에 병합)
  const [linkUrl, setLinkUrl] = useState(''); // 문의 / 홈페이지 링크

  // ── Step 3: 세부 일정 ──
  const [schedules, setSchedules] = useState<ScheduleItem[]>([]);
  const [scheduleDateInput, setScheduleDateInput] = useState('');
  const [scheduleContentInput, setScheduleContentInput] = useState('');

  const pickPoster = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('알림', '사진 접근 권한이 필요합니다.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.85,
    });
    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];
      setPoster({
        uri: asset.uri,
        name: asset.fileName ?? 'poster.jpg',
        type: asset.mimeType ?? 'image/jpeg',
      });
    }
  };

  const handleDateConfirm = (result: DatePickerResult) => {
    const value = toDateString(result);
    if (dateField === 'recruitStart') setRecruitStart(value);
    if (dateField === 'recruitEnd') setRecruitEnd(value);
    if (dateField === 'activityStart') setActivityStart(value);
    if (dateField === 'activityEnd') setActivityEnd(value);
    setDateField(null);
  };

  const step1Valid =
    !!type &&
    title.trim().length > 0 &&
    organizer.trim().length > 0 &&
    intro.trim().length > 0 &&
    !!recruitStart &&
    !!recruitEnd &&
    !!activityStart &&
    !!activityEnd &&
    activityMethod.length > 0 &&
    region.trim().length > 0 &&
    location.trim().length > 0;

  const step2Valid = activityDetail.trim().length > 0;

  const addSchedule = () => {
    if (!scheduleDateInput.trim() || !scheduleContentInput.trim()) return;
    setSchedules((prev) => [
      ...prev,
      { scheduleDate: scheduleDateInput.trim(), content: scheduleContentInput.trim() },
    ]);
    setScheduleDateInput('');
    setScheduleContentInput('');
  };

  const removeSchedule = (index: number) => {
    setSchedules((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!type) return;
    setSubmitting(true);
    try {
      // 유의 사항은 백엔드에 별도 필드가 없어 detailContent 에 병합합니다.
      const detailContent = caution.trim()
        ? `${activityDetail.trim()}\n\n[유의 사항]\n${caution.trim()}`
        : activityDetail.trim();

      await createAnnouncement(
        {
          title: title.trim(),
          organizer: organizer.trim(),
          type,
          // imgUrl 은 필수 스펙이지만 서버가 multipart image 업로드 후 대체할 것으로
          // 예상됩니다. 규약이 다르면 백엔드 팀과 협의해 수정하세요.
          imgUrl: poster?.name ?? 'poster',
          region: region.trim(),
          location: location.trim(),
          activityMethod,
          recruitmentStart: recruitStart,
          recruitmentEnd: recruitEnd,
          startDate: activityStart,
          endDate: activityEnd,
          activityContent: intro.trim(),
          detailContent,
          target: target.trim() || undefined,
          recruitmentCount: recruitmentCount.trim() || undefined,
          applyMethod: applyMethod.trim() || undefined,
          linkUrl: linkUrl.trim() || undefined,
          fee: fee.trim() ? Number(fee.replace(/[^0-9]/g, '')) : undefined,
          benefits: benefits.trim() || undefined,
          selectionProcess: selectionProcess.trim() || undefined,
          schedules: schedules.length > 0 ? schedules : undefined,
        },
        poster ?? undefined,
      );
      Alert.alert('완료', '공고가 등록되었습니다.', [
        { text: '확인', onPress: () => router.back() },
      ]);
    } catch (error) {
      const message = error instanceof ApiError ? error.message : '공고 등록에 실패했습니다.';
      Alert.alert('오류', message);
    } finally {
      setSubmitting(false);
    }
  };

  const stepTitle = step === 1 ? '기본 사항' : step === 2 ? '상세 내용' : '세부 일정';

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => (step === 1 ? router.back() : setStep((step - 1) as Step))}
          style={styles.headerIcon}
        >
          <Ionicons name="chevron-back" size={24} color="#212121" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{stepTitle}</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        {step === 1 && (
          <>
            <Field label="공고 종류">
              <View style={styles.chipRow}>
                {TYPE_OPTIONS.map(([value, label]) => (
                  <TouchableOpacity
                    key={value}
                    style={[styles.chip, type === value && styles.chipActive]}
                    onPress={() => setType(value)}
                  >
                    <Text style={[styles.chipText, type === value && styles.chipTextActive]}>
                      {label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </Field>

            <Field label="공고 제목">
              <TextInput
                style={styles.input}
                placeholder="공고 제목을 입력해주세요"
                value={title}
                onChangeText={setTitle}
              />
            </Field>

            <Field label="공고 포스터">
              <TouchableOpacity style={styles.posterBox} onPress={pickPoster}>
                {poster ? (
                  <Image source={{ uri: poster.uri }} style={styles.posterPreview} />
                ) : (
                  <Feather name="folder-plus" size={28} color="#4CAF50" />
                )}
              </TouchableOpacity>
            </Field>

            <Field label="운영 주체">
              <TextInput
                style={styles.input}
                placeholder="운영 주체를 입력해주세요"
                value={organizer}
                onChangeText={setOrganizer}
              />
            </Field>

            <Field label="활동소개 (200자 제한)">
              <TextInput
                style={styles.input}
                placeholder="활동을 간단히 소개해주세요"
                value={intro}
                onChangeText={setIntro}
                maxLength={200}
                multiline
              />
            </Field>

            <Field label="공고 대상">
              <TextInput
                style={styles.input}
                placeholder="예: 대학생"
                value={target}
                onChangeText={setTarget}
              />
            </Field>

            <Field label="모집인원">
              <TextInput
                style={styles.input}
                placeholder="예: 50명"
                value={recruitmentCount}
                onChangeText={setRecruitmentCount}
              />
            </Field>

            <Field label="접수 일정">
              <View style={styles.dateRow}>
                <DateButton value={recruitStart} onPress={() => setDateField('recruitStart')} />
                <Text style={styles.dateTilde}>~</Text>
                <DateButton value={recruitEnd} onPress={() => setDateField('recruitEnd')} />
              </View>
            </Field>

            <Field label="활동 일정">
              <View style={styles.dateRow}>
                <DateButton value={activityStart} onPress={() => setDateField('activityStart')} />
                <Text style={styles.dateTilde}>~</Text>
                <DateButton value={activityEnd} onPress={() => setDateField('activityEnd')} />
              </View>
            </Field>

            <Field label="활동 방식">
              <View style={styles.chipRow}>
                {METHOD_OPTIONS.map((method) => (
                  <TouchableOpacity
                    key={method}
                    style={[styles.chip, activityMethod === method && styles.chipActive]}
                    onPress={() => setActivityMethod(method)}
                  >
                    <Text
                      style={[styles.chipText, activityMethod === method && styles.chipTextActive]}
                    >
                      {method}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </Field>

            <Field label="활동 지역">
              <TextInput
                style={styles.input}
                placeholder="예: 강남구"
                value={region}
                onChangeText={setRegion}
              />
            </Field>

            <Field label="활동 장소">
              <TextInput
                style={styles.input}
                placeholder="상세 장소를 입력해주세요"
                value={location}
                onChangeText={setLocation}
              />
            </Field>

            <Field label="접수 방법">
              <TextInput
                style={styles.input}
                placeholder="예: 홈페이지 지원"
                value={applyMethod}
                onChangeText={setApplyMethod}
              />
            </Field>

            <Field label="참가비">
              <TextInput
                style={styles.input}
                placeholder="예: 5000 (없으면 비워두세요)"
                value={fee}
                onChangeText={setFee}
                keyboardType="number-pad"
              />
            </Field>

            <Field label="활동 혜택">
              <TextInput
                style={styles.input}
                placeholder="예: 수료증 및 기념품"
                value={benefits}
                onChangeText={setBenefits}
              />
            </Field>
          </>
        )}

        {step === 2 && (
          <>
            <Text style={styles.stepGuide}>상세 내용을 입력해 주세요</Text>
            <TextAreaCard
              label="활동 내용"
              placeholder="활동 내용을 입력해주세요"
              value={activityDetail}
              onChangeText={setActivityDetail}
            />
            <TextAreaCard
              label="지원 방법"
              placeholder="지원방법을 입력해주세요."
              value={selectionProcess}
              onChangeText={setSelectionProcess}
            />
            <TextAreaCard
              label="유의 사항"
              placeholder="유의 사항을 입력해주세요."
              value={caution}
              onChangeText={setCaution}
            />
            <TextAreaCard
              label="문의"
              placeholder="홈페이지 링크 입력"
              value={linkUrl}
              onChangeText={setLinkUrl}
              multilineCount={1}
            />
          </>
        )}

        {step === 3 && (
          <>
            <Text style={styles.stepGuide}>세부 일정을 입력해 주세요</Text>

            {/* 타임라인 */}
            {schedules.map((item, index) => (
              <View key={`${item.scheduleDate}-${index}`} style={styles.timelineRow}>
                <View style={styles.timelineDot} />
                <View style={styles.timelineCard}>
                  <Text style={styles.timelineDate}>{item.scheduleDate}</Text>
                  <Text style={styles.timelineContent}>{item.content}</Text>
                </View>
                <TouchableOpacity onPress={() => removeSchedule(index)} style={styles.timelineRemove}>
                  <Feather name="x" size={16} color="#999" />
                </TouchableOpacity>
              </View>
            ))}

            {/* 새 일정 입력 */}
            <View style={styles.timelineRow}>
              <View style={[styles.timelineDot, styles.timelineDotInactive]} />
              <View style={[styles.timelineCard, styles.timelineInputCard]}>
                <TextInput
                  style={styles.timelineDateInput}
                  placeholder="01.11"
                  value={scheduleDateInput}
                  onChangeText={setScheduleDateInput}
                />
                <TextInput
                  style={styles.timelineContentInput}
                  placeholder="일정 내용을 입력해주세요"
                  value={scheduleContentInput}
                  onChangeText={setScheduleContentInput}
                  onSubmitEditing={addSchedule}
                />
              </View>
            </View>

            <TouchableOpacity style={styles.addScheduleBtn} onPress={addSchedule}>
              <Feather name="plus" size={20} color="#999" />
            </TouchableOpacity>
          </>
        )}
      </ScrollView>

      {/* 하단 버튼 */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.cancelBtn}
          onPress={() => (step === 1 ? router.back() : setStep((step - 1) as Step))}
        >
          <Text style={styles.cancelText}>취소</Text>
        </TouchableOpacity>
        {step < 3 ? (
          <TouchableOpacity
            style={[
              styles.nextBtn,
              !(step === 1 ? step1Valid : step2Valid) && styles.nextBtnDisabled,
            ]}
            disabled={!(step === 1 ? step1Valid : step2Valid)}
            onPress={() => setStep((step + 1) as Step)}
          >
            <Text style={styles.nextText}>다음</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.nextBtn, submitting && styles.nextBtnDisabled]}
            disabled={submitting}
            onPress={handleSubmit}
          >
            {submitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.nextText}>등록하기</Text>
            )}
          </TouchableOpacity>
        )}
      </View>

      {/* 날짜 피커 */}
      <MonthPicker
        visible={dateField !== null}
        selectedDate={new Date()}
        onConfirm={handleDateConfirm}
        onCancel={() => setDateField(null)}
      />

      {/* 제출 중 오버레이 */}
      <Modal visible={submitting} transparent animationType="fade">
        <View style={styles.submitOverlay}>
          <ActivityIndicator size="large" color="#4CAF50" />
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// ─── 소형 컴포넌트 ────────────────────────────────────────────────────────────

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      {children}
    </View>
  );
}

function DateButton({ value, onPress }: { value: string; onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.dateBtn} onPress={onPress}>
      <Text style={[styles.dateBtnText, !value && styles.dateBtnPlaceholder]}>
        {value || '날짜 선택'}
      </Text>
    </TouchableOpacity>
  );
}

function TextAreaCard({
  label,
  placeholder,
  value,
  onChangeText,
  multilineCount = 6,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (v: string) => void;
  multilineCount?: number;
}) {
  return (
    <View style={styles.textAreaCard}>
      <View style={styles.textAreaHeader}>
        <Text style={styles.textAreaLabel}>{label}</Text>
        {value.length > 0 && (
          <TouchableOpacity onPress={() => onChangeText('')}>
            <Feather name="x" size={18} color="#999" />
          </TouchableOpacity>
        )}
      </View>
      <TextInput
        style={[styles.textAreaInput, { minHeight: multilineCount * 22 }]}
        placeholder={placeholder}
        placeholderTextColor="#BBB"
        value={value}
        onChangeText={onChangeText}
        multiline={multilineCount > 1}
        maxLength={2000}
      />
      <Text style={styles.textAreaCount}>{value.length}/2000</Text>
    </View>
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
  scroll: { paddingHorizontal: 20, paddingBottom: 24 },
  stepGuide: { fontSize: 16, fontWeight: '700', color: '#222', marginBottom: 16, marginTop: 4 },

  field: { marginBottom: 18 },
  fieldLabel: { fontSize: 13, color: '#555', marginBottom: 8 },
  input: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontSize: 14,
    color: '#222',
  },

  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 18,
    backgroundColor: '#F5F5F5',
  },
  chipActive: { backgroundColor: '#4CAF50' },
  chipText: { fontSize: 13, color: '#666', fontWeight: '600' },
  chipTextActive: { color: '#fff' },

  posterBox: {
    height: 110,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    backgroundColor: '#FAFFF8',
  },
  posterPreview: { width: '100%', height: '100%' },

  dateRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  dateBtn: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingVertical: 13,
    alignItems: 'center',
  },
  dateBtnText: { fontSize: 13, color: '#222' },
  dateBtnPlaceholder: { color: '#AAA' },
  dateTilde: { fontSize: 14, color: '#999' },

  textAreaCard: {
    backgroundColor: '#F7F7F7',
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
  },
  textAreaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
    paddingBottom: 10,
    marginBottom: 10,
  },
  textAreaLabel: { fontSize: 14, fontWeight: '700', color: '#333' },
  textAreaInput: { fontSize: 13, color: '#333', textAlignVertical: 'top' },
  textAreaCount: { alignSelf: 'flex-end', fontSize: 11, color: '#BBB', marginTop: 8 },

  timelineRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 14, gap: 12 },
  timelineDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#4CAF50',
  },
  timelineDotInactive: { backgroundColor: '#DFF3DC' },
  timelineCard: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  timelineDate: { fontSize: 12, color: '#888', marginBottom: 3 },
  timelineContent: { fontSize: 14, color: '#222', fontWeight: '500' },
  timelineRemove: { padding: 4 },
  timelineInputCard: { gap: 4 },
  timelineDateInput: { fontSize: 12, color: '#222', padding: 0 },
  timelineContentInput: { fontSize: 14, color: '#222', padding: 0 },
  addScheduleBtn: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginLeft: 22,
  },

  bottomBar: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 28,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  cancelBtn: {
    flex: 1,
    height: 52,
    borderRadius: 14,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelText: { fontSize: 15, fontWeight: '600', color: '#555' },
  nextBtn: {
    flex: 2,
    height: 52,
    borderRadius: 14,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextBtnDisabled: { backgroundColor: '#C8E6C9' },
  nextText: { fontSize: 15, fontWeight: '700', color: '#fff' },

  submitOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
