import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const ProfileCard = () => {
  return (
    <View style={styles.profileCard}>
      <View style={styles.profileInfo}>
        <View style={styles.avatarContainer}>
          <MaterialCommunityIcons name="bird" size={32} color="#76E24E" />
        </View>
        <Text style={styles.nickname}>빈스팟</Text>
      </View>
      
      <View style={styles.logoRow}>
        <Text style={styles.cardLogo}>Bean<Text style={{ color: '#76E24E' }}>.</Text></Text>
        <Text style={styles.logoSubText}>나의 <Text style={styles.highlightText}>관심공고</Text>를 확인해보세요</Text>
      </View>

      <TouchableOpacity style={styles.interestButton}>
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
  profileInfo: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  avatarContainer: {
    width: 44,
    height: 44,
    backgroundColor: '#E8F5E9',
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  nickname: { fontSize: 20, fontWeight: 'bold', color: '#333' },
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