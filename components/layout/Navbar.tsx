import React from 'react';
import { View, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export const Navbar = () => {
  return (
    <View style={styles.navbar}>
      {/* 1. 로고 */}
      <Image 
        source={{ uri: 'https://via.placeholder.com/80x30.png?text=Bean.' }} 
        style={styles.logo} 
      />
      {/* 2. 오른쪽 아이콘 (검색 + 알림) */}
      <View style={styles.navIcons}>
        <TouchableOpacity>
          <Ionicons name="search" size={24} color="black" style={styles.navIcon} />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="notifications-outline" size={24} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    height: 60,
    backgroundColor: 'white', // 홈 화면 배경과 동일하게
  },
  logo: {
    width: 80,
    height: 30,
    resizeMode: 'contain',
  },
  navIcons: {
    flexDirection: 'row',
  },
  navIcon: {
    marginRight: 16, // 아이콘 사이 간격
  },
});
