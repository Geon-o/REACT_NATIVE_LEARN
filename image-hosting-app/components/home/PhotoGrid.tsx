import React, { useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import ImageTile from './ImageTile';
import EmptyState from './EmptyState';
import ImageViewer from './ImageViewer';

interface PhotoGridProps {
  photos: { id: string; source: any }[];
}

export default function PhotoGrid({ photos }: PhotoGridProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleImagePress = (imageUrl: string) => {
    setSelectedImage(imageUrl);
  };

  const handleCloseViewer = () => {
    setSelectedImage(null);
  };

  return (
    <View style={{flex: 1}}>
      <FlatList
        data={photos}
        renderItem={({ item }) => <ImageTile item={item} onPress={() => handleImagePress(item.source.uri)} />}
        keyExtractor={(item) => item.id}
        numColumns={3}
        contentContainerStyle={photos.length > 0 ? styles.list : styles.emptyList}
        ListEmptyComponent={EmptyState}
      />
      <ImageViewer imageUrl={selectedImage} onClose={handleCloseViewer} />
    </View>
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
