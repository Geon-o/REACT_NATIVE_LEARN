import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import PhotoGrid from '@/components/home/PhotoGrid';
import FloatingButton from '@/components/ui/FloatingButton';

interface Photo {
  id: string;
  source: { uri: string };
}

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const buttonOpacity = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: buttonOpacity.value,
      pointerEvents: buttonOpacity.value === 1 ? 'auto' : 'none',
    };
  });

  const hideButton = () => {
    if (photos.length > 0) {
      buttonOpacity.value = withTiming(0, { duration: 500 });
    }
  };

  const handleInteraction = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    buttonOpacity.value = withTiming(1, { duration: 200 });
    timerRef.current = setTimeout(hideButton, 3500);
  };

  useEffect(() => {
    handleInteraction(); // Start the timer on mount
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [photos.length]); // Rerun logic when photos are added/removed

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
      onStartShouldSetResponder={() => {
        handleInteraction();
        return false; // We don't want this view to become the responder
      }}>
      <View style={{ ...styles.gridContainer, paddingTop: insets.top + 20 }}>
        <PhotoGrid photos={photos} />
      </View>
      <Animated.View style={animatedStyle}>
        <FloatingButton onPress={pickImage} />
      </Animated.View>
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
