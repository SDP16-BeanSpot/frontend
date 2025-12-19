import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Image, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const Navbar = () => {
  const [hasNotification, setHasNotification] = useState(true);
  const shakeAnimation = useRef(new Animated.Value(0)).current;

  const startShaking = useCallback(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shakeAnimation, { toValue: 10, duration: 100, useNativeDriver: true }),
        Animated.timing(shakeAnimation, { toValue: -10, duration: 100, useNativeDriver: true }),
        Animated.timing(shakeAnimation, { toValue: 10, duration: 100, useNativeDriver: true }),
        Animated.timing(shakeAnimation, { toValue: 0, duration: 100, useNativeDriver: true }),
      ])
    ).start();
  }, [shakeAnimation]);

  const stopShaking = useCallback(() => {
    shakeAnimation.setValue(0);
    // 만약 애니메이션이 멈추지 않으면 이 줄의 주석을 해제
    // shakeAnimation.stopAnimation(); 
  }, [shakeAnimation]);

  useEffect(() => {
    if (hasNotification) {
      startShaking();
    } else {
      stopShaking();
    }
  }, [hasNotification, startShaking, stopShaking]);

  const bellIconName = hasNotification ? "notifications" : "notifications-outline";
  const bellIconColor = hasNotification ? "#FFD700" : "#333333";

  const animatedStyle = {
    transform: [{
      rotate: shakeAnimation.interpolate({
        inputRange: [-10, 10],
        outputRange: ['-10deg', '10deg']
      })
    }]
  };

  return (
    <View style={styles.navContainer}>
      <Image
        source={require('../../../assets/bean_logo.png')} 
        style={styles.logo}
      />
      <TouchableOpacity onPress={() => setHasNotification(!hasNotification)}>
        <Animated.View style={[styles.bellContainer, animatedStyle]}>
          <Ionicons name={bellIconName} size={28} color={bellIconColor} />
          {hasNotification && <View style={styles.redDot} />}
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  navContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    height: 60,
  },
  logo: {
    width: 80,
    height: 40,
    resizeMode: 'contain',
  },
  bellContainer: {
    padding: 5,
  },
  redDot: {
    position: 'absolute',
    top: 5,
    right: 5,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'red',
  },
});

export default Navbar;