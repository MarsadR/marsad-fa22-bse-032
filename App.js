import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import useFetchQuranData from './useFetchQuranData'; // Custom Hook to fetch Quran Data

const QuranApp = () => {
  const { data, loading } = useFetchQuranData(
    'https://api.alquran.cloud/v1/quran/en.asad',
    'quranData'
  );

  const [expandedSurah, setExpandedSurah] = useState(null);
  const [previewMode, setPreviewMode] = useState(false); // Track preview/full mode toggle

  const toggleSurah = (surahNumber) => {
    if (expandedSurah === surahNumber && !previewMode) {
      setExpandedSurah(null); // Collapse
    } else {
      setExpandedSurah(surahNumber); // Expand on click
      setPreviewMode(!previewMode); // Toggle preview/full
    }
  };

  const renderAyahs = (ayahs) => {
    const ayahList = previewMode ? ayahs.slice(0, 3) : ayahs; // Show 3 lines on first click
    return ayahList.map((ayah) => (
      <Text key={ayah.numberInSurah} style={styles.ayah}>
        {ayah.text}
      </Text>
    ));
  };

  const renderSurah = ({ item }) => (
    <TouchableOpacity
      style={styles.surahCard}
      onPress={() => toggleSurah(item.number)}
    >
      <View style={styles.surahHeader}>
        <Text style={styles.surahName}>{item.englishName}</Text>
        <Text style={styles.surahDetails}>
          {item.revelationType} - {item.ayahs.length} VERSES
        </Text>
        <Text style={styles.surahArabic}>{item.name}</Text>
      </View>
      {expandedSurah === item.number && (
        <View style={styles.ayahContainer}>{renderAyahs(item.ayahs)}</View>
      )}
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#6A5ACD" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        renderItem={renderSurah}
        keyExtractor={(item) => item.number.toString()}
        contentContainerStyle={styles.surahList}
      />
    </View>
  );
};

export default QuranApp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EDECF7', // Light purple background matching your design
    paddingHorizontal: 20,
  },
  surahList: {
    paddingVertical: 10,
  },
  surahCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5, // Shadow for Android
  },
  surahHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  surahName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  surahDetails: {
    fontSize: 14,
    color: '#666',
  },
  surahArabic: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#6A5ACD', // Matching your purple color
  },
  ayahContainer: {
    marginTop: 10,
  },
  ayah: {
    fontSize: 16,
    color: '#444',
    marginVertical: 3,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
