import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import TabHeader from '../../components/tabHeader';

const LocationScreen = () => {
  const [places, setPlaces] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchPlaces = async () => {
      const querySnapshot = await getDocs(collection(db, "places"));
      const placesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPlaces(placesData);
    };

    fetchPlaces();
  }, []);

  const renderPlace = ({ item }) => (
    <TouchableOpacity onPress={() => router.push(`/screens/placeDetails?placeId=${item.id}`)} style={styles.containerplace}>
      <View style={styles.placeContainer}>
        <Image source={{ uri: item.url }} style={styles.image} />
        <Text style={styles.name}>{item.name}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TabHeader title="Places"/>
      <FlatList
        data={places}
        renderItem={renderPlace}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.container}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#E6E6FA',
    marginBottom: 40,
  },
  containerplace:{
    padding: 10,
  },
  placeContainer: {
    marginBottom: 20,
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#6A1B9A',
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  name: {
    padding: 10,
    fontSize: 18,
    textAlign: 'center',
    backgroundColor: '#DAA621',
    fontFamily: 'Poppins-Bold', 
  },
});

export default LocationScreen;
