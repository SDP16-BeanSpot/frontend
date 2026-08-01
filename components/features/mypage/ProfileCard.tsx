import React, { useCallback, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Href, useFocusEffect, useRouter } from 'expo-router';

import { fetchMyProfile } from '../../../features/user/api';
import { DEFAULT_NICKNAME } from '../../../features/user/types';

const DEFAULT_AVATAR = require('../../../assets/images/beanGreen.png');

const ProfileCard = () => {
  const router = useRouter();
  const [nickname, setNickname] = useState(DEFAULT_NICKNAME);
  const [avatarUri, setAvatarUri] = useState<string | null>(null);

  // 프로필 수정 후 돌아왔을 때 갱신되도록 포커스마다 다시 읽음
  useFocusEffect(
    useCallback(() => {
      let cancelled = false;
      fetchMyProfile().then((profile) => {
        if (cancelled) return;
        setNickname(profile.nickname || DEFAULT_NICKNAME);
        setAvatarUri(profile.profileUrl ?? null);
      });
      return () => {
        cancelled = true;
      };
    }, []),
  );

  return (
    <View style={styles.profileCard}>
      {/* 프로필 정보 + 수정 버튼 */}
      <View style={styles.profileRow}>
        <View style={styles.profileInfo}>
          <View style={styles.avatarContainer}>
            <Image
              source={avatarUri ? { uri: avatarUri } : DEFAULT_AVATAR}
              style={avatarUri ? styles.avatarPhoto : styles.avatarImage}
              resizeMode={avatarUri ? 'cover' : 'contain'}
            />
          </View>
          <Text style={styles.nickname} numberOfLines={1}>
            {nickname}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.editBtn}
          onPress={() => router.push('/mypage/profileEdit')}
        >
          <Feather name="edit-2" size={14} color="#888" />
          <Text style={styles.editText}>수정</Text>
        </TouchableOpacity>
      </View>

      {/* Bean. 카드 */}
      <View style={styles.logoRow}>
        <Text style={styles.cardLogo}>
          Bean<Text style={{ color: '#76E24E' }}>.</Text>
        </Text>
        <Text style={styles.logoSubText}>
          나의 <Text style={styles.highlightText}>관심공고</Text>를 확인해보세요
        </Text>
      </View>

      <TouchableOpacity
        style={styles.interestButton}
        onPress={() => router.push('/mypage/favorites' as Href)}
      >
        <Text style={styles.interestButtonText}>나의 관심공고</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  profileCard: {
    backgroundColor: '#F8F9FA',
    marginHorizontal: 20,
    borderRadius: 25,
    padding: 20,
    marginTop: 10,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  profileInfo: { flexDirection: 'row', alignItems: 'center' },
  avatarContainer: {
    width: 44,
    height: 44,
    backgroundColor: '#E8F5E9',
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    overflow: 'hidden',
  },
  avatarImage: { width: 32, height: 32 },
  avatarPhoto: { width: 44, height: 44 },
  nickname: { fontSize: 20, fontWeight: 'bold', color: '#333', flexShrink: 1 },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: '#EBEBEB',
  },
  editText: { fontSize: 13, color: '#888' },
  logoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 15,
    paddingHorizontal: 5,
  },
  cardLogo: { fontSize: 18, fontWeight: '900' },
  logoSubText: { fontSize: 12, color: '#888' },
  highlightText: { color: '#1AD100', fontWeight: 'bold' },
  interestButton: {
    backgroundColor: '#1AD100',
    borderRadius: 15,
    paddingVertical: 14,
    alignItems: 'center',
  },
  interestButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});

export default ProfileCard;
