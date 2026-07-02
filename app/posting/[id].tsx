import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Linking,
  Share,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, Ionicons } from '@expo/vector-icons';
import { Href, useLocalSearchParams, useRouter } from 'expo-router';

import { fetchPostingDetail, toggleFavoritePosting } from '../../features/posting/api';
import type { PostingDetail } from '../../features/posting/types';

export default function PostingDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const [posting, setPosting] = useState<PostingDetail | null>(null);

  useEffect(() => {
    if (!id) return;
    fetchPostingDetail(String(id)).then(setPosting);
  }, [id]);

  const handleShare = async () => {
    if (!posting) return;
    await Share.share({
      message: `[빈스팟] ${posting.title}\n${posting.organizer} 주최`,
    }).catch(() => {});
  };

  const handleToggleFavorite = async () => {
    if (!posting) return;
    const next = !posting.isFavorite;
    setPosting({ ...posting, isFavorite: next });
    await toggleFavoritePosting(posting.id, next);
  };

  const handleApply = () => {
    if (posting?.applyUrl) {
      Linking.openURL(posting.applyUrl).catch(() => {});
    }
  };

  if (!posting) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.headerIcon}>
            <Ionicons name="chevron-back" size={24} color="#212121" />
          </TouchableOpacity>
        </View>
        <View style={styles.notFound}>
          <Text style={styles.notFoundText}>공고를 찾을 수 없습니다.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerIcon}>
          <Ionicons name="chevron-back" size={24} color="#212121" />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>{posting.title}</Text>
        <TouchableOpacity onPress={handleShare} style={styles.headerIcon}>
          <Feather name="share" size={20} color="#212121" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* 포스터 */}
        {posting.posterUrl ? (
          <Image source={{ uri: posting.posterUrl }} style={styles.poster} resizeMode="cover" />
        ) : (
          <View style={[styles.poster, styles.posterPlaceholder]}>
            <Feather name="image" size={40} color="#DDD" />
          </View>
        )}

        {/* 뱃지 + 제목 + 주최 */}
        <View style={styles.titleSection}>
          <View style={styles.badgeRow}>
            <View style={styles.dDayBadge}>
              <Text style={styles.dDayText}>{posting.dDay}</Text>
            </View>
            <View style={styles.catBadge}>
              <Text style={styles.catText}>{posting.category}</Text>
            </View>
          </View>
          <Text style={styles.title}>{posting.title}</Text>
          <View style={styles.organizerRow}>
            <Ionicons name="business-outline" size={14} color="#757575" />
            <Text style={styles.organizer}>{posting.organizer}</Text>
          </View>
        </View>

        {/* 정보 필드 */}
        <View style={styles.fieldsCard}>
          {posting.fields.map((f) => (
            <View key={f.label} style={styles.fieldRow}>
              <Text style={styles.fieldLabel}>{f.label}</Text>
              <Text style={styles.fieldValue}>{f.value}</Text>
            </View>
          ))}
        </View>

        {/* 채팅방 바로가기 */}
        {posting.chatRoomId && (
          <TouchableOpacity
            style={styles.chatBtn}
            onPress={() =>
              router.push(`/chat/${encodeURIComponent(posting.chatRoomId!)}` as Href)
            }
          >
            <Text style={styles.chatBtnText}>채팅방 바로가기</Text>
            <Feather name="chevron-right" size={16} color="#2E7D32" />
          </TouchableOpacity>
        )}

        {/* 상세 내용 */}
        <View style={styles.descSection}>
          <Text style={styles.descTitle}>상세내용</Text>
          <Text style={styles.descBody}>{posting.description}</Text>
        </View>
      </ScrollView>

      {/* 하단 고정 버튼 */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.heartBtn} onPress={handleToggleFavorite}>
          <Ionicons
            name={posting.isFavorite ? 'heart' : 'heart-outline'}
            size={24}
            color={posting.isFavorite ? '#FF5252' : '#999'}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.applyBtn} onPress={handleApply}>
          <Text style={styles.applyText}>홈페이지 지원 바로가기</Text>
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
  headerTitle: { flex: 1, textAlign: 'center', fontSize: 16, fontWeight: '700', color: '#212121' },
  scroll: { paddingBottom: 110 },
  poster: { width: '100%', height: 300, backgroundColor: '#F5F5F5' },
  posterPlaceholder: { justifyContent: 'center', alignItems: 'center' },
  titleSection: { paddingHorizontal: 20, paddingTop: 18 },
  badgeRow: { flexDirection: 'row', gap: 6, marginBottom: 10 },
  dDayBadge: {
    backgroundColor: '#FFF0F0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  dDayText: { color: '#FF5252', fontSize: 11, fontWeight: '700' },
  catBadge: {
    backgroundColor: '#E8F5E4',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  catText: { color: '#4CAF50', fontSize: 11, fontWeight: '600' },
  title: { fontSize: 20, fontWeight: '800', color: '#212121', lineHeight: 28 },
  organizerRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 8 },
  organizer: { fontSize: 13, color: '#757575' },
  fieldsCard: {
    marginHorizontal: 20,
    marginTop: 18,
    backgroundColor: '#FAFAFA',
    borderRadius: 14,
    padding: 16,
    gap: 10,
  },
  fieldRow: { flexDirection: 'row' },
  fieldLabel: { width: 76, fontSize: 13, color: '#999', fontWeight: '600' },
  fieldValue: { flex: 1, fontSize: 13, color: '#333' },
  chatBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    marginHorizontal: 20,
    marginTop: 14,
    paddingVertical: 13,
    borderRadius: 12,
    backgroundColor: '#E8F5E4',
  },
  chatBtnText: { fontSize: 14, fontWeight: '700', color: '#2E7D32' },
  descSection: { paddingHorizontal: 20, paddingTop: 26 },
  descTitle: { fontSize: 16, fontWeight: '700', color: '#212121', marginBottom: 12 },
  descBody: { fontSize: 14, color: '#424242', lineHeight: 22 },
  bottomBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 28,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  heartBtn: {
    width: 52,
    height: 52,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  applyBtn: {
    flex: 1,
    height: 52,
    borderRadius: 14,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
  },
  applyText: { fontSize: 16, fontWeight: '700', color: '#fff' },
  notFound: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  notFoundText: { fontSize: 14, color: '#999' },
});
