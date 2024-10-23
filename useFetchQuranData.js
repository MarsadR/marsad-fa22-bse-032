import { useEffect, useState } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const useFetchQuranData = (url, storageKey) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const storedData = await AsyncStorage.getItem(storageKey);
      if (storedData) {
        setData(JSON.parse(storedData)); // Use cached data if available
        setLoading(false);
      } else {
        const response = await axios.get(url);
        setData(response.data.data.surahs);
        await AsyncStorage.setItem(
          storageKey,
          JSON.stringify(response.data.data.surahs)
        ); // Save data locally for offline use
        setLoading(false);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { data, loading };
};

export default useFetchQuranData;
