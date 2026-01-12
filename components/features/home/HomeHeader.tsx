import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { Feather } from '@expo/vector-icons';

const HomeHeader = () => {
  return (
    <>
      <View style={styles.header}>
        <Text style={styles.logo}>
          Bean<Text style={{ color: '#76E24E' }}>.</Text>
        </Text>
        <TouchableOpacity style={styles.iconButton}>
          <Feather name="bell" size={24} color="black" />
          <View style={styles.notificationDot} />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="검색어를 입력해보세요"
          placeholderTextColor="#999"
        />
        <Feather name="search" size={20} color="#999" style={styles.searchIcon} />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
  },
  logo: {
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: -1,
  },
  iconButton: {},
  notificationDot: {
    position: 'absolute',
    right: 0,
    top: 0,
    width: 5,
    height: 5,
    backgroundColor: '#FF4D4D',
    borderRadius: 5,
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  searchInput: {
    backgroundColor: '#F8F8F8',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    fontSize: 14,
  },
  searchIcon: {
    position: 'absolute',
    right: 35,
    top: 12,
  },
});

export default HomeHeader;
