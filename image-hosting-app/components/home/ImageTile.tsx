import React from 'react';
import { View, Image, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';

const numColumns = 3;
const { width } = Dimensions.get('window');
const size = (width - 20) / numColumns; // 10 is for horizontal padding

interface ImageTileProps {
  item: { id: string; source: any };
  onPress: () => void;
}

export default function ImageTile({ item, onPress }: ImageTileProps) {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.imageContainer}>
        <Image source={item.source} style={styles.image} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  imageContainer: {
    width: size,
    height: size,
    padding: 5,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
});
