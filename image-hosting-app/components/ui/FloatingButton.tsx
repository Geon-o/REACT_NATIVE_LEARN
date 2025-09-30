import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';

interface FloatingButtonProps {
  onPress: () => void;
}

export default function FloatingButton({ onPress }: FloatingButtonProps) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.button}>
        <Text style={styles.icon}>+</Text>
      </View>
    </TouchableOpacity>
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
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  icon: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
  },
});
