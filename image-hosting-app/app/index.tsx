import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  useColorScheme,
  StatusBar,
  TouchableWithoutFeedback,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import PhotoGrid from '@/components/home/PhotoGrid';
import FloatingButton from '@/components/ui/FloatingButton';
import { useTheme } from './ThemeContext';

interface Photo {
  id: string;
  source: { uri: string };
}

const themes = {
  light: {
    background: '#fff',
    textColor: '#000',
    iconColor: 'black',
  },
  dark: {
    background: '#000',
    textColor: '#fff',
    iconColor: 'white',
  },
};

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isButtonVisible, setIsButtonVisible] = useState(true);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const { theme, setTheme } = useTheme();
  const currentTheme = themes[theme];

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

  const toggleDropdown = () => {
    setIsDropdownVisible(!isDropdownVisible);
  };

  return (
    <TouchableWithoutFeedback onPress={() => setIsDropdownVisible(false)}>
      <View
        style={[styles.container, { backgroundColor: currentTheme.background }]}
        onStartShouldSetResponderCapture={() => {
          handleInteraction();
          return false; // Allow children to also handle the touch
        }}>
        <StatusBar barStyle={theme === 'dark' ? 'light-content' : 'dark-content'} />
        <View style={{ ...styles.gridContainer, paddingTop: insets.top, backgroundColor: currentTheme.background }}>
          <View style={styles.header}>
            <TouchableOpacity>
              <Ionicons name="folder-outline" size={28} color={currentTheme.iconColor} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.settingsButton}
              onPress={toggleDropdown}>
              <Ionicons name='settings-outline' size={24} color={currentTheme.iconColor} />
            </TouchableOpacity>
          </View>
          {isDropdownVisible && (
            <View style={styles.dropdown} onStartShouldSetResponder={() => true}>
              <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity style={styles.dropdownButton} onPress={() => { setTheme('light'); setIsDropdownVisible(false); }}>
                  <Ionicons name='sunny-outline' size={24} color='black' />
                </TouchableOpacity>
                <TouchableOpacity style={styles.dropdownButton} onPress={() => { setTheme('dark'); setIsDropdownVisible(false); }}>
                  <Ionicons name='moon-outline' size={24} color='black' />
                </TouchableOpacity>
              </View>
              <View style={styles.separator} />
            </View>
          )}
          <PhotoGrid photos={photos} />
        </View>
        <FloatingButton onPress={pickImage} isVisible={isButtonVisible} />
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gridContainer: {
    flex: 1,
    paddingHorizontal: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginBottom: 10,
    marginTop: 20,
  },
  settingsButton: {
    padding: 5,
  },
  dropdown: {
    position: 'absolute',
    top: 80, // Adjust this value as needed
    right: 20, // Adjust this value as needed
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 10,
    flexDirection: 'column',
    elevation: 5,
    zIndex: 1000,
  },
  dropdownButton: {
    padding: 5,
    marginHorizontal: 5,
  },
  separator: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 5,
  },
});