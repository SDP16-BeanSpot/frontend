import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

// --- 1. 임시 채팅 데이터 (디자인 기반) ---
const SAMPLE_CHAT_DATA = [
  {
    id: '1',
    name: '김파니',
    lastMessage: '거래하시겠습니까?',
    timestamp: '9일 전',
    avatar: 'https-via-placeholder-com-100-8B4513-FFFFFF-?text=K',
    unreadCount: 1,
  },
  {
    id: '2',
    name: '비니',
    lastMessage: '감사합니다 텃밭 잘 사용했어요',
    timestamp: '9일 전',
    avatar: 'https-via-placeholder-com-100-8B4513-FFFFFF-?text=B',
    unreadCount: 0,
  },
  {
    id: '3',
    name: '챗봇',
    lastMessage: '기타 문의사항은 아래 메시지 보내...',
    timestamp: '9일 전',
    avatar: 'https-via-placeholder-com-100-228B22-FFFFFF-?text=Bot',
    unreadCount: 0,
  },
];

const ChatScreen = () => {
  // --- 2. 채팅 목록 상태 ---
  // ✅ 테스트 방법:
  // - 목록을 보려면: useState(SAMPLE_CHAT_DATA)
  // - 빈 화면을 보려면: useState([])
  const [chats, setChats] = useState(SAMPLE_CHAT_DATA);
  
  // --- 3. 채팅 목록의 각 항목 렌더링 ---
  const renderChatItem = ({ item }: { item: typeof SAMPLE_CHAT_DATA[0] }) => (
    <TouchableOpacity style={styles.chatItem}>
      {/* 3-1. 프로필 이미지 */}
      <Image source={{ uri: item.avatar }} style={styles.avatar} />
      
      {/* 3-2. 채팅 내용 */}
      <View style={styles.chatContent}>
        <View style={styles.chatHeader}>
          <Text style={styles.chatName}>{item.name}</Text>
          <Text style={styles.chatTimestamp}>{item.timestamp}</Text>
        </View>
        <Text style={styles.chatLastMessage} numberOfLines={1}>
          {item.lastMessage}
        </Text>
      </View>
      
      {/* 3-3. 안 읽은 배지 */}
      {item.unreadCount > 0 && (
        <View style={styles.unreadBadge}>
          <Text style={styles.unreadText}>{item.unreadCount}</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  // --- 4. 채팅 목록 상단의 헤더 (채팅, 필터) ---
  const renderHeader = () => (
    <View style={styles.headerContainer}>
      {/* 4-1. 상단 '채팅' 헤더 */}
      <View style={styles.titleHeader}>
        <Text style={styles.title}>채팅</Text>
        <TouchableOpacity>
          <Ionicons name="bookmark-outline" size={24} color="black" />
        </TouchableOpacity>
      </View>
      
      {/* 4-2. 필터 버튼 */}
      <View style={styles.filterContainer}>
        <TouchableOpacity style={[styles.filterButton, styles.filterActive]}>
          <Text style={[styles.filterText, styles.filterTextActive]}>전체</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterText}>안 읽은 채팅방</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterText}>문의</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // --- 5. 채팅 목록이 비어있을 때 표시할 컴포넌트 ---
  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="chatbubbles-outline" size={100} color="#cccccc" />
      <Text style={styles.emptyText}>아직 대화 내용이 없어요</Text>
    </View>
  );

  // --- 6. 메인 렌더링 ---
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <FlatList
        data={chats} // 채팅 데이터
        renderItem={renderChatItem} // 각 항목 렌더링 함수
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader} // 상단 헤더 컴포넌트
        ListEmptyComponent={renderEmptyComponent} // 목록이 비어있을 때
        contentContainerStyle={chats.length === 0 ? styles.emptyListContainer : null}
      />
    </SafeAreaView>
  );
};

export default ChatScreen;

// --- 7. 스타일 시트 ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  // --- 헤더 ---
  headerContainer: {
    paddingHorizontal: 16,
    paddingTop: 10,
    backgroundColor: 'white',
  },
  titleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  // --- 필터 ---
  filterContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    marginRight: 10,
  },
  filterActive: {
    backgroundColor: 'green',
  },
  filterText: {
    color: '#555',
    fontWeight: 'bold',
  },
  filterTextActive: {
    color: 'white',
  },
  // --- 채팅 항목 ---
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#cccccc',
    marginRight: 12,
  },
  chatContent: {
    flex: 1,
    justifyContent: 'center',
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  chatName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  chatTimestamp: {
    fontSize: 12,
    color: 'gray',
  },
  chatLastMessage: {
    fontSize: 14,
    color: '#333',
  },
  unreadBadge: {
    backgroundColor: '#8B4513', // 디자인의 갈색
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
    marginLeft: 10,
  },
  unreadText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  // --- 빈 화면 ---
  emptyListContainer: {
    flex: 1, // 헤더를 제외한 나머지 공간을 모두 차지
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 60, // 탭바 높이 고려
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: 'gray',
  },
});