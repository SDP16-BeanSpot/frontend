import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

// --- 재사용을 위한 '메뉴 행' 컴포넌트 ---
// (예: "텃밭 등록하기 >", "거래 내역 >")
const MenuRow = ({ icon, name }: { icon: keyof typeof Ionicons.glyphMap; name: string }) => {
  return (
    <TouchableOpacity style={styles.menuRow}>
      <View style={styles.menuRowContent}>
        <Ionicons name={icon} size={22} color="#555" style={styles.menuIcon} />
        <Text style={styles.menuText}>{name}</Text>
      </View>
      <Ionicons name="chevron-forward-outline" size={20} color="#BDBDBD" />
    </TouchableOpacity>
  );
};

// --- '마이페이지' 메인 컴포넌트 ---
const MyScreen = () => {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* 1. 상단 헤더 */}
      <View style={styles.header}>
        <Text style={styles.title}>나의 빈스팟</Text>
      </View>

      {/* 2. 스크롤 가능한 메인 콘텐츠 */}
      <ScrollView style={styles.scrollView}>
        
        {/* 2-1. 프로필 섹션 */}
        <View style={styles.profileSection}>
          <TouchableOpacity style={styles.profileLink}>
            <Image 
              source={{ uri: 'https-via-placeholder-com-40-228B22-FFFFFF-?text=B' }} 
              style={styles.profileLogo} 
            />
            <Text style={styles.profileLinkText}>빈스팟</Text>
            <Ionicons name="chevron-forward-outline" size={20} color="#BDBDBD" />
          </TouchableOpacity>
          
          <View style={styles.profileInfo}>
            <Image 
              source={{ uri: 'https-via-placeholder-com-80-9370DB-FFFFFF-?text=Mushroom' }} 
              style={styles.avatar} 
            />
            <Text style={styles.profileName}>Bean</Text>
          </View>
          
          <TouchableOpacity style={styles.myGardenButton}>
            <Text style={styles.myGardenButtonText}>나의 텃밭</Text>
          </TouchableOpacity>
        </View>

        {/* 2-2. 빠른 링크 섹션 */}
        <View style={styles.quickLinks}>
          <TouchableOpacity style={styles.quickLinkButton}>
            <Ionicons name="heart-outline" size={24} color="#333" />
            <Text style={styles.quickLinkText}>찜한 텃밭</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickLinkButton}>
            <Ionicons name="time-outline" size={24} color="#333" />
            <Text style={styles.quickLinkText}>최근 본 텃밭</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickLinkButton}>
            <Ionicons name="star-outline" size={24} color="#333" />
            <Text style={styles.quickLinkText}>이벤트</Text>
          </TouchableOpacity>
        </View>

        {/* 2-3. 메뉴 그룹: 나의 텃밭 거래 */}
        <View style={styles.menuGroup}>
          <Text style={styles.menuGroupTitle}>나의 텃밭 거래</Text>
          <MenuRow icon="add-circle-outline" name="텃밭 등록하기" />
          <MenuRow icon="document-text-outline" name="거래 내역" />
          <MenuRow icon="chatbubble-ellipses-outline" name="내가 받은 후기" />
        </View>

        {/* 2-4. 메뉴 그룹: 나의 중심 */}
        <View style={styles.menuGroup}>
          <Text style={styles.menuGroupTitle}>나의 중심</Text>
          <MenuRow icon="key-outline" name="키워드 알림 설정" />
        </View>
        
        {/* 2-5. 메뉴 그룹: 설정 */}
        <View style={styles.menuGroup}>
          <Text style={styles.menuGroupTitle}>설정</Text>
          <MenuRow icon="settings-outline" name="앱 설정" />
          <MenuRow icon="ellipsis-horizontal-circle-outline" name="기타" />
        </View>

        {/* 2-6. 메뉴 그룹: 고객지원 */}
        <View style={styles.menuGroup}>
          <Text style={styles.menuGroupTitle}>고객지원</Text>
          <MenuRow icon="volume-high-outline" name="공지사항" />
          <MenuRow icon="call-outline" name="고객센터" />
          <MenuRow icon="chatbox-outline" name="의견 남기기" />
          <MenuRow icon="reader-outline" name="약관 및 정책" />
        </View>

        {/* 2-7. 하단 푸터 정보 */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>빈스팟 사업자 정보</Text>
          <Text style={styles.footerText}>
            빈스팟은 플랫폼 중개업을 통한 통신판매업의 당사자가 아니며, 
            중개 거래에 대한 정보 및 내용에 대하여 책임을 지지 않습니다.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default MyScreen;

// --- 3. 스타일 시트 ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5', // 전체 배경은 회색
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
  },
  // --- 프로필 섹션 ---
  profileSection: {
    backgroundColor: 'white',
    padding: 16,
    marginBottom: 8,
  },
  profileLink: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  profileLogo: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 8,
  },
  profileLinkText: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1, // 텍스트가 남은 공간을 차지
  },
  profileInfo: {
    alignItems: 'center', // 가운데 정렬
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E0E0E0',
    marginBottom: 8,
  },
  profileName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  myGardenButton: {
    backgroundColor: 'green',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  myGardenButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  // --- 빠른 링크 ---
  quickLinks: {
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
    marginBottom: 8,
  },
  quickLinkButton: {
    alignItems: 'center',
  },
  quickLinkIcon: {
    marginBottom: 4,
  },
  quickLinkText: {
    fontSize: 13,
    color: '#333',
  },
  // --- 메뉴 그룹 ---
  menuGroup: {
    backgroundColor: 'white',
    marginBottom: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  menuGroupTitle: {
    fontSize: 14,
    color: 'gray',
    marginBottom: 8,
    paddingLeft: 4, // 아이콘과 정렬 맞추기
  },
  // --- 메뉴 행 ---
  menuRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
  },
  menuRowContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIcon: {
    width: 30, // 아이콘 정렬을 위한 고정 너비
  },
  menuText: {
    fontSize: 16,
    color: '#333',
  },
  // --- 푸터 ---
  footer: {
    padding: 16,
    paddingBottom: 40, // 스크롤 하단 여유
  },
  footerText: {
    fontSize: 12,
    color: 'gray',
    marginBottom: 8,
  },
});