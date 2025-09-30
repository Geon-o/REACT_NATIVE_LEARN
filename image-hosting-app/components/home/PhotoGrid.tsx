import React from 'react';
import { FlatList, StyleSheet } from 'react-native';
import ImageTile from './ImageTile';
import EmptyState from './EmptyState';

interface PhotoGridProps {
  photos: { id: string; source: any }[];
}

export default function PhotoGrid({ photos }: PhotoGridProps) {
  return (
    <FlatList
      data={photos}
      renderItem={({ item }) => <ImageTile item={item} />}
      keyExtractor={(item) => item.id}
      numColumns={3}
      contentContainerStyle={photos.length > 0 ? styles.list : styles.emptyList}
      ListEmptyComponent={EmptyState}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    justifyContent: 'flex-start',
  },
  emptyList: {
    flexGrow: 1,
    justifyContent: 'center',
  },
});
