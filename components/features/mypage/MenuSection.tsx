import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const MenuSection = () => {
  const router = useRouter();
  return (
    <>
      {/* 설정 그룹 */}
      <View style={styles.menuGroupCard}>
        <Text style={styles.groupLabel}>설정</Text>
        
        <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/mypage/appSettings')}>
          <View style={styles.menuLeft}>
            <Ionicons name="settings-outline" size={20} color="#333" />
            <Text style={styles.menuText}>앱 설정</Text>
          </View>
          <Feather name="chevron-right" size={20} color="#ccc" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.menuLeft}>
            <Feather name="tag" size={20} color="#333" />
            <Text style={styles.menuText}>키워드 알림 설정</Text>
          </View>
          <Feather name="chevron-right" size={20} color="#ccc" />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.menuItem, { borderBottomWidth: 0 }]}>
          <View style={styles.menuLeft}>
            <Feather name="mail" size={20} color="#333" />
            <Text style={styles.menuText}>공고 등록</Text>
          </View>
          <Feather name="chevron-right" size={20} color="#ccc" />
        </TouchableOpacity>
      </View>

      {/* 고객지원 그룹 */}
      <View style={[styles.menuGroupCard, { marginBottom: 30 }]}>
        <Text style={styles.groupLabel}>고객지원</Text>
        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.menuLeft}>
            <Feather name="volume-2" size={20} color="#333" />
            <Text style={styles.menuText}>공지사항</Text>
          </View>
          <Feather name="chevron-right" size={20} color="#ccc" />
        </TouchableOpacity>
        {/* 고객센터 */}
        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.menuLeft}>
            <Feather name="headphones" size={20} color="#333" />
            <Text style={styles.menuText}>고객센터</Text>
          </View>
          <Feather name="chevron-right" size={20} color="#ccc" />
        </TouchableOpacity>

        {/* 의견 남기기 */}
        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.menuLeft}>
            <Feather name="mail" size={20} color="#333" />
            <Text style={styles.menuText}>의견 남기기</Text>
          </View>
          <Feather name="chevron-right" size={20} color="#ccc" />
        </TouchableOpacity>

        {/* 약관 및 정책 */}
        <TouchableOpacity style={[styles.menuItem, { borderBottomWidth: 0 }]}>
          <View style={styles.menuLeft}>
            <Feather name="file-text" size={20} color="#333" />
            <Text style={styles.menuText}>약관 및 정책</Text>
          </View>
          <Feather name="chevron-right" size={20} color="#ccc" />
        </TouchableOpacity>
      </View>
    </>
  );
};
// 
const styles = StyleSheet.create({
  menuGroupCard: {
    backgroundColor: '#F8F9FA',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 25,
    padding: 20,
  },
  groupLabel: { fontSize: 13, color: '#999', marginBottom: 15, marginLeft: 5 },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  menuLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  menuText: { fontSize: 15, color: '#333', fontWeight: '500' },
});

export default MenuSection;