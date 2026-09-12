import { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Animated, Easing } from 'react-native';
import { Colors } from '@/constants/colors';

interface EntryAnimationProps {
  onFinish: () => void;
}

export default function EntryAnimation({ onFinish }: EntryAnimationProps) {
  const [logoOpacity] = useState(new Animated.Value(0));
  const [logoScale] = useState(new Animated.Value(0.8));
  const [slideUp] = useState(new Animated.Value(0));
  const [subtitleOpacity] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 600,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.spring(logoScale, {
          toValue: 1,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(subtitleOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(slideUp, {
        toValue: 1,
        duration: 500,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start(() => {
      setTimeout(onFinish, 300);
    });
  }, []);

  const slideTranslate = slideUp.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -300],
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: logoOpacity,
            transform: [{ scale: logoScale }, { translateY: slideTranslate }],
          },
        ]}
      >
        <Text style={styles.logoText}>Krust</Text>
        <Animated.Text style={[styles.logoSubtitle, { opacity: subtitleOpacity }]}>
          2026
        </Animated.Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.SURFACE,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
  },
  logoContainer: {
    alignItems: 'center',
  },
  logoText: {
    fontSize: 48,
    fontWeight: '900',
    color: Colors.PRIMARY,
    letterSpacing: 1,
  },
  logoSubtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.DARK_GRAY,
    letterSpacing: 4,
    marginTop: 4,
  },
});
