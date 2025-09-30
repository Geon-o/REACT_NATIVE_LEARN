import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import PhotoGrid from '@/components/home/PhotoGrid';

const initialPhotos: { id: string; source: any }[] = [];

export default function HomeScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={{ ...styles.container, paddingTop: insets.top + 20 }}>
      <PhotoGrid photos={initialPhotos} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
  },
});