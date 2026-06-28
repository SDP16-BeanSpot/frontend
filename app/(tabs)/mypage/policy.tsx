import React, { useEffect, useState } from 'react';
import {
  LayoutAnimation,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  UIManager,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

type PolicySection = {
  id: string;
  title: string;
  body: string;
};

const POLICY_SECTIONS: PolicySection[] = [
  {
    id: 'service',
    title: '서비스 이용 약관',
    body: `제1조 (목적)
본 약관은 빈스팟이 제공하는 앱/웹 기반 공고 정보 서비스의 이용과 관련한 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.

제2조 (서비스 제공)
빈스팟은 공고 열람, 일정 관리, 채팅 기능 등을 제공합니다.

제3조 (회원의 의무)
회원은 관련 법령과 약관을 준수해야 하며 타인의 권리를 침해해서는 안 됩니다.`,
  },
  {
    id: 'privacy',
    title: '빈스팟 개인정보 처리 방침',
    body: `1. 수집 항목
필수: 휴대폰 번호, 닉네임, 식별 정보

2. 이용 목적
서비스 운영, 본인 확인, 문의 대응, 부정 이용 방지

3. 보관 및 파기
관련 법령에 따라 보관 후 지체 없이 파기합니다.`,
  },
  {
    id: 'chat',
    title: '공고 채팅 운영 정책',
    body: `1. 운영 목적
공고 참여자 간 원활한 소통을 지원합니다.

2. 금지 행위
욕설, 혐오/차별 표현, 성희롱, 스팸/광고, 사기성 행위

3. 제재 조치
경고, 메시지 제한, 채팅방 퇴장, 계정 이용 제한`,
  },
  {
    id: 'location',
    title: '위치기반 서비스 이용약관',
    body: `제1조 (목적)
위치 정보를 기반으로 주변 공고 정보를 제공하기 위함입니다.

제2조 (이용 동의)
위치 권한은 사용자 동의 하에 수집되며 동의 철회가 가능합니다.`,
  },
  {
    id: 'notice',
    title: '정보 제공 및 책임 고지',
    body: `빈스팟은 공고 등록자/기관이 제공한 정보를 기반으로 서비스를 제공합니다.
게시된 정보의 정확성은 등록 주체에게 책임이 있으며,
허위/불법 정보 발견 시 신고 기능을 통해 접수할 수 있습니다.`,
  },
];

export default function PolicyScreen() {
  const router = useRouter();
  const [expandedIds, setExpandedIds] = useState<string[]>([]);

  useEffect(() => {
    if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }, []);

  const toggleSection = (id: string) => {
    LayoutAnimation.configureNext({
      duration: 220,
      create: {
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.scaleY,
      },
      update: {
        type: LayoutAnimation.Types.spring,
      },
      delete: {
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.scaleY,
      },
    });

    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Feather name="arrow-left" size={28} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>약관 및 정책</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {POLICY_SECTIONS.map((section) => {
          const isExpanded = expandedIds.includes(section.id);

          return (
            <View key={section.id} style={styles.sectionWrap}>
              <TouchableOpacity
                style={styles.sectionHeader}
                activeOpacity={0.8}
                onPress={() => toggleSection(section.id)}
              >
                <Text style={styles.sectionTitle}>{section.title}</Text>
                <Feather
                  name={isExpanded ? 'chevron-down' : 'chevron-right'}
                  size={20}
                  color="#8A8A8A"
                />
              </TouchableOpacity>
              {isExpanded && (
                <View style={styles.sectionBodyWrap}>
                  <Text style={styles.body}>{section.body}</Text>
                </View>
              )}
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ECECEC',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#333',
  },
  backButton: {
    padding: 5,
  },
  headerSpacer: {
    width: 28,
  },
  content: {
    paddingHorizontal: 14,
    paddingTop: 8,
    paddingBottom: 40,
  },
  sectionWrap: {
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
  },
  sectionHeader: {
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  sectionBodyWrap: {
    paddingHorizontal: 2,
    paddingTop: 2,
    paddingBottom: 14,
  },
  body: {
    fontSize: 13,
    lineHeight: 20,
    color: '#424242',
  },
});
