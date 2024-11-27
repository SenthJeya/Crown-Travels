import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import ScreenHeader from '../../components/screenHeader';

const PlaceDetails = () => {
  const params = useLocalSearchParams();
  const { placeId } = params;
  const [place, setPlace] = useState(null);

  useEffect(() => {
    const fetchPlace = async () => {
      if (placeId) {
        try {
          const placeRef = doc(db, "places", placeId);
          const placeSnap = await getDoc(placeRef);
          if (placeSnap.exists()) {
            setPlace(placeSnap.data());
          } else {
            console.log('No such document!');
          }
        } catch (error) {
          console.error("Error fetching place:", error);
        }
      }
    };

    fetchPlace();
  }, [placeId]);

  if (!place) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      <ScreenHeader title={place.name} path="/tabs/location"/>
      <View style={styles.contentContainer}>
        
        <Image source={{ uri: place.url }} style={styles.image} />
        
        <Text style={styles.heading}>Hotels</Text>
        {place.hotels.map((hotels, index) => (
          <Text key={index} style={styles.details}>{hotels}</Text>
        ))}
        
        <Text style={styles.heading}>Tourist Places</Text>
        {place.tourist_places.map((touristPlace, index) => (
          <Text key={index} style={styles.details}>{touristPlace}</Text>
        ))}

        <Text style={styles.heading}>Unique Features</Text>
        {place.unique_features.map((unique_features, index) => (
          <Text key={index} style={styles.details}>{unique_features}</Text>
        ))}

        
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#E6E6FA',
    flex: 1,
  },

  contentContainer:{
    padding: 10,
  },
  image: {
    width: '100%',
    height: 300,
    marginBottom: 20,
    resizeMode: 'cover',
    borderWidth:4,
    borderColor: '#662483',
    borderRadius:10,
  },

  details: {
    fontSize: 17,
    fontFamily: 'Poppins-SemiBold', 
    paddingLeft:70,
    flexDirection: 'column',
  },
  
  heading: {
    fontSize: 22,
    fontFamily: 'Poppins-ExtraBold', 
    color: '#662483',
    paddingLeft:10,
  },
});

export default PlaceDetails;
