import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import PhotoGrid from '@/components/home/PhotoGrid';
import FloatingButton from '@/components/ui/FloatingButton';

interface Photo {
  id: string;
  source: { uri: string };
}

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isButtonVisible, setIsButtonVisible] = useState(true);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const handleInteraction = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    const hideButton = () => {
      if (photos.length > 0) {
        setIsButtonVisible(false);
      }
    };

    setIsButtonVisible(true);
    timerRef.current = setTimeout(hideButton, 2000);
  };

  useEffect(() => {
    handleInteraction();

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [photos.length]);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      allowsMultipleSelection: true,
      selectionLimit: 30,
    });

    if (!result.canceled) {
      const newPhotos = result.assets.map((asset) => ({
        id: asset.assetId || asset.uri,
        source: { uri: asset.uri },
      }));
      setPhotos((prevPhotos) => [...newPhotos, ...prevPhotos]);
    }
  };

  return (
    <View
      style={styles.container}
      onStartShouldSetResponderCapture={() => {
        handleInteraction();
        return false; // Allow children to also handle the touch
      }}>
      <View style={{ ...styles.gridContainer, paddingTop: insets.top + 20 }}>
        <PhotoGrid photos={photos} />
      </View>
      <FloatingButton onPress={pickImage} isVisible={isButtonVisible} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gridContainer: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
  },
});