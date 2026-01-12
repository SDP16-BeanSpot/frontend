import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';

const BannerCarousel = () => {
  return (
    <TouchableOpacity style={styles.banner}>
      <View>
        <Text style={styles.bannerTag}>서비스 이용안내</Text>
        <Text style={styles.bannerText}>빈스팟에 오신걸 환영해요!</Text>
      </View>
      <View style={styles.bannerImageCircle}>
        <MaterialCommunityIcons name="face-recognition" size={40} color="#76E24E" />
      </View>
      <TouchableOpacity style={styles.bannerClose}>
        <Feather name="x" size={16} color="#fff" />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  banner: {
    marginHorizontal: 20,
    backgroundColor: '#7D6A5A',
    borderRadius: 15,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'relative',
    marginBottom: 15,
  },
  bannerTag: {
    color: '#D4BFA4',
    fontSize: 11,
    fontWeight: '600',
  },
  bannerText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 4,
  },
  bannerImageCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bannerClose: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
});

export default BannerCarousel;
