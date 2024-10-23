// useFetchQuranData.js
import { useEffect, useState } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const useFetchQuranData = (url, storageKey) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedData = await AsyncStorage.getItem(storageKey);
        if (storedData) {
          setData(JSON.parse(storedData));
        } else {
          const response = await axios.get(url);
          const surahs = response.data.data.surahs;
          setData(surahs);
          await AsyncStorage.setItem(storageKey, JSON.stringify(surahs));
        }
      } catch (error) {
        console.error('Error fetching Quran data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [url]);

  return { data, loading };
};

export default useFetchQuranData;
