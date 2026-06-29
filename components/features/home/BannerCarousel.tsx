import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import type { Banner } from '../../../features/home/types';

interface BannerCarouselProps {
  banners: Banner[];
}

const BannerCarousel: React.FC<BannerCarouselProps> = ({ banners }) => {
  const [visible, setVisible] = useState(true);

  if (!banners.length || !visible) return null;

  const banner = banners[0];

  return (
    <View style={styles.banner}>
      <View style={styles.textWrap}>
        <Text style={styles.tag}>{banner.tag}</Text>
        <Text style={styles.title}>{banner.text}</Text>
      </View>

      <Image
        source={require('../../../assets/images/icon.png')}
        style={styles.mascot}
        resizeMode="contain"
      />

      <TouchableOpacity style={styles.closeBtn} onPress={() => setVisible(false)}>
        <Feather name="x" size={14} color="rgba(255,255,255,0.8)" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  banner: {
    marginHorizontal: 20,
    marginBottom: 24,
    backgroundColor: '#7D6A5A',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
    minHeight: 80,
  },
  textWrap: { flex: 1 },
  tag: {
    fontSize: 11,
    color: '#D4BFA4',
    fontWeight: '600',
    marginBottom: 5,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    lineHeight: 22,
  },
  mascot: {
    width: 64,
    height: 64,
    marginLeft: 12,
  },
  closeBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 4,
  },
});

export default BannerCarousel;
