import React from 'react';
import { View, Image, StyleSheet, Dimensions } from 'react-native';

const numColumns = 3;
const { width } = Dimensions.get('window');
const size = (width - 20) / numColumns; // 10 is for horizontal padding

interface ImageTileProps {
  item: { id: string; source: any };
}

export default function ImageTile({ item }: ImageTileProps) {
  return (
    <View style={styles.imageContainer}>
      <Image source={item.source} style={styles.image} />
    </View>
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
