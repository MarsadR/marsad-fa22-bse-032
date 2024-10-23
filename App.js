import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; // Icon library
import useFetchQuranData from './useFetchQuranData'; // Custom hook for fetching data

const QuranApp = () => {
  const { data, loading } = useFetchQuranData(
    'https://api.alquran.cloud/v1/quran/en.asad',
    'quranData'
  );

  const [expandedSurah, setExpandedSurah] = useState(null);
  const [previewMode, setPreviewMode] = useState(false); // Track preview/full mode toggle

  const toggleSurah = (surahNumber) => {
    if (expandedSurah === surahNumber && !previewMode) {
      setExpandedSurah(null); // Collapse if clicked again
    } else {
      setExpandedSurah(surahNumber); // Expand surah and show preview
      setPreviewMode(!previewMode);
    }
  };

  const renderAyahs = (ayahs) => {
    const ayahList = previewMode ? ayahs.slice(0, 3) : ayahs; // Preview mode: show first 3 ayahs
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
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Icon name="menu-outline" size={30} color="#fff" />
        <Text style={styles.headerTitle}>Quran App</Text>
        <Icon name="search-outline" size={30} color="#fff" />
      </View>

      {/* Greeting Section */}
      <View style={styles.greetingContainer}>
        <Text style={styles.greetingText}>Assalamualaikum</Text>
        <Text style={styles.username}>Tanvir Ahassan</Text>
      </View>

      {/* Last Read Section */}
      <View style={styles.lastReadContainer}>
        <View>
          <Text style={styles.lastReadLabel}>Last Read</Text>
          <Text style={styles.surahName}>Al-Fatiah</Text>
          <Text style={styles.ayahInfo}>Ayah No: 1</Text>
        </View>
        <Image
          source={{ uri: 'https://example.com/quran-book.png' }} // Replace with actual image URL
          style={styles.quranImage}
        />
      </View>

      {/* Tab Section */}
      <View style={styles.tabContainer}>
        <Text style={[styles.tabItem, styles.activeTab]}>Surah</Text>
        <Text style={styles.tabItem}>Para</Text>
        <Text style={styles.tabItem}>Page</Text>
        <Text style={styles.tabItem}>Hijb</Text>
      </View>

      {/* Surah List */}
      <FlatList
        data={data}
        renderItem={renderSurah}
        keyExtractor={(item) => item.number.toString()}
        contentContainerStyle={styles.surahList}
      />
    </ScrollView>
  );
};

export default QuranApp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#6A5ACD',
    paddingVertical: 15,
    paddingHorizontal: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  greetingContainer: {
    padding: 15,
  },
  greetingText: {
    fontSize: 18,
    color: '#777',
  },
  username: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  lastReadContainer: {
    flexDirection: 'row',
    backgroundColor: '#A5B4FC',
    borderRadius: 10,
    margin: 15,
    padding: 15,
    alignItems: 'center',
  },
  lastReadLabel: {
    fontSize: 14,
    color: '#fff',
    marginBottom: 5,
  },
  surahName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  ayahInfo: {
    fontSize: 16,
    color: '#E0E7FF',
  },
  quranImage: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
    marginLeft: 'auto',
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  tabItem: {
    fontSize: 18,
    color: '#777',
  },
  activeTab: {
    color: '#6A5ACD',
    fontWeight: 'bold',
    borderBottomWidth: 2,
    borderBottomColor: '#6A5ACD',
  },
  surahList: {
    paddingVertical: 10,
  },
  surahCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 3,
  },
  surahHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  surahDetails: {
    fontSize: 14,
    color: '#777',
  },
  surahArabic: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#6A5ACD',
  },
  ayahContainer: {
    marginTop: 10,
  },
  ayah: {
    fontSize: 16,
    color: '#444',
    marginVertical: 2,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
