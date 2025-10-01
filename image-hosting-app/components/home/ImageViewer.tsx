import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Modal, Pressable, Dimensions, Image } from 'react-native';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');
const MAX_SCALE = 3; // Define maximum zoom scale

interface ImageViewerProps {
  imageUrl: string | null;
  onClose: () => void;
}

export default function ImageViewer({ imageUrl, onClose }: ImageViewerProps) {
  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const savedTranslateX = useSharedValue(0);
  const savedTranslateY = useSharedValue(0);

  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (imageUrl) {
      Image.getSize(imageUrl, (w, h) => {
        setImageDimensions({ width: w, height: h });
      });
    }
  }, [imageUrl]);

  const aspectRatio = imageDimensions.width / imageDimensions.height;

  let calculatedContainerWidth = width * 0.9;
  let calculatedContainerHeight = height * 0.8;

  if (imageDimensions.width > 0 && imageDimensions.height > 0) {
    if (aspectRatio > calculatedContainerWidth / calculatedContainerHeight) {
      calculatedContainerHeight = calculatedContainerWidth / aspectRatio;
    } else {
      calculatedContainerWidth = calculatedContainerHeight * aspectRatio;
    }
  }

  const pinchGesture = Gesture.Pinch()
    .onUpdate((e) => {
      scale.value = Math.min(MAX_SCALE, savedScale.value * e.scale);
    })
    .onEnd(() => {
      savedScale.value = scale.value;
      if (scale.value < 1) {
        scale.value = withTiming(1);
        savedScale.value = 1;
        translateX.value = withTiming(0); // Reset translation when scale is reset
        translateY.value = withTiming(0);
        savedTranslateX.value = 0;
        savedTranslateY.value = 0;
      } else if (scale.value > MAX_SCALE) {
        scale.value = withTiming(MAX_SCALE);
        savedScale.value = MAX_SCALE;
      }
    });

  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      const scaledImageWidth = calculatedContainerWidth * scale.value;
      const scaledImageHeight = calculatedContainerHeight * scale.value;

      const maxTranslateX = Math.max(0, (scaledImageWidth - calculatedContainerWidth) / 2);
      const maxTranslateY = Math.max(0, (scaledImageHeight - calculatedContainerHeight) / 2);

      let newTranslateX = savedTranslateX.value + e.translationX;
      let newTranslateY = savedTranslateY.value + e.translationY;

      // Clamp X
      if (scaledImageWidth > calculatedContainerWidth) {
        newTranslateX = Math.max(-maxTranslateX, Math.min(newTranslateX, maxTranslateX));
      } else {
        newTranslateX = 0; // If image is smaller than container, no pan
      }

      // Clamp Y
      if (scaledImageHeight > calculatedContainerHeight) {
        newTranslateY = Math.max(-maxTranslateY, Math.min(newTranslateY, maxTranslateY));
      } else {
        newTranslateY = 0; // If image is smaller than container, no pan
      }

      translateX.value = newTranslateX;
      translateY.value = newTranslateY;
    })
    .onEnd(() => {
      savedTranslateX.value = translateX.value;
      savedTranslateY.value = translateY.value;

      // If image is smaller than container after pinch, reset translation
      const scaledImageWidth = calculatedContainerWidth * scale.value;
      const scaledImageHeight = calculatedContainerHeight * scale.value;
      if (scaledImageWidth <= calculatedContainerWidth) {
        translateX.value = withTiming(0);
        savedTranslateX.value = 0;
      }
      if (scaledImageHeight <= calculatedContainerHeight) {
        translateY.value = withTiming(0);
        savedTranslateY.value = 0;
      }
    });

  const composedGesture = Gesture.Simultaneous(pinchGesture, panGesture);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: scale.value },
        { translateX: translateX.value },
        { translateY: translateY.value },
      ],
    };
  });

  if (!imageUrl) {
    return null;
  }

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={imageUrl !== null}
      onRequestClose={onClose}
    >
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Pressable style={styles.modalContainer} onPress={onClose}>
          <Pressable>
              <GestureDetector gesture={composedGesture}>
                  <View style={[styles.imageContainer, { width: calculatedContainerWidth, height: calculatedContainerHeight }]}>
                      <Animated.Image source={{ uri: imageUrl }} style={[styles.image, animatedStyle]} resizeMode="contain" />
                  </View>
              </GestureDetector>
          </Pressable>
        </Pressable>
      </GestureHandlerRootView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    // width and height are now dynamic
    borderRadius: 10,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});
