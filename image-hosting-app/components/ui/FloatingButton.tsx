import React, { useEffect } from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { useTheme } from '@/app/ThemeContext';

interface FloatingButtonProps {
  onPress: () => void;
  isVisible: boolean;
}

export default function FloatingButton({ onPress, isVisible }: FloatingButtonProps) {
  const opacity = useSharedValue(0);
  const { theme } = useTheme();

  useEffect(() => {
    opacity.value = withTiming(isVisible ? 1 : 0, { duration: 250 });
  }, [isVisible]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      pointerEvents: opacity.value === 1 ? 'auto' : 'none',
    };
  });

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <TouchableOpacity onPress={onPress}>
        <View style={[styles.button, theme === 'dark' && styles.darkButton]}>
          <Text style={styles.icon}>+</Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 120,
    right: 30,
  },
  button: {
    width: 60,
    height: 60,
    borderRadius: 22,
    backgroundColor: '#013220',
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
  },
  darkButton: {
    borderColor: '#fff',
    borderWidth: 1,
  },
});