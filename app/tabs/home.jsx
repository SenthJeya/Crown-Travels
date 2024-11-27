import { View, Text, StyleSheet, ImageBackground, ActivityIndicator, ScrollView, Image, Dimensions } from 'react-native';
import React, { useEffect, useState, useRef } from 'react';
import { auth, db } from '../firebase'; 
import { useRouter } from 'expo-router'; 
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import TabHeader from '../../components/tabHeader';

const { width } = Dimensions.get('window'); 

const Home = () => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [message, setMessage] = useState('');
  const [imageUrl, setImageUrl] = useState(''); 
  const [loading, setLoading] = useState(true); 
  const [adImages, setAdImages] = useState([]); // Ad set 1
  const [beachAdImages, setBeachAdImages] = useState([]); // Ad set 2
  const [places, setPlaces] = useState([]); 
  const [currentPlaceIndex, setCurrentPlaceIndex] = useState(0); 
  const [textColor, setTextColor] = useState('#000');  // Initialize textColor state
  const scrollViewRef1 = useRef(null); 
  const scrollViewRef2 = useRef(null); 
  const scrollPosition1 = useRef(0); 
  const scrollPosition2 = useRef(0); 
  const adIntervalRef1 = useRef(null); 
  const adIntervalRef2 = useRef(null); 
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setUser(user);
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const userData = docSnap.data();
          setUserData(userData);
        } else {
          console.log('No such document!');
        }
      }
    });

    return () => unsubscribe(); 
  }, []);

  useEffect(() => {
    const now = new Date();
    const hours = now.getHours();
    let timeOfDay;

    if (hours >= 0 && hours < 12) {
      timeOfDay = 'Morning';
      setTextColor('#000000');  // Set text color to black for morning
    } else if (hours >= 12 && hours < 16) {
      timeOfDay = 'Afternoon';
      setTextColor('#000000');  // Set text color to black for afternoon
    } else if (hours >= 16 && hours < 19) {
      timeOfDay = 'Evening';
      setTextColor('#FFFFFF');  // Set text color to white for evening
    } else {
      timeOfDay = 'Night';
      setTextColor('#FFFFFF');  // Set text color to white for night
    }

    const fetchMessageAndImage = async () => {
      const docRef = doc(db, 'home', timeOfDay); 
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setMessage(data.message); 
        setImageUrl(data.url); 
      } else {
        console.log('No such document!');
      }
      setLoading(false);
    };

    fetchMessageAndImage();
  }, []);

  useEffect(() => {
    const fetchAdImages = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'placead')); 
        const images = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.url) {
            images.push(data.url); 
          }
        });
        setAdImages(images); 
      } catch (error) {
        console.error("Error fetching advertisement images: ", error);
      }
    };

    const fetchBeachAdImages = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'beachad')); 
        const images = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.url) {
            images.push(data.url); 
          }
        });
        setBeachAdImages(images); 
      } catch (error) {
        console.error("Error fetching beach advertisement images: ", error);
      }
    };

    fetchAdImages();
    fetchBeachAdImages();
  }, []);

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'places')); // Fetch all places
        const placeArray = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.name) { 
            placeArray.push(data.name); // Push place name into array
          }
        });
        setPlaces(placeArray); // Store the place names in state
      } catch (error) {
        console.error('Error fetching places: ', error);
      }
    };
  
    fetchPlaces();
  }, []);
  

  // Start the place change interval only when the places are fetched
  useEffect(() => {
    if (places.length > 0) {
      const placeInterval = setInterval(() => {
        setCurrentPlaceIndex((prevIndex) => (prevIndex + 1) % places.length);
      }, 2500);

      return () => clearInterval(placeInterval);
    }
  }, [places]);

  useEffect(() => {
    if (adImages.length > 0) {
      adIntervalRef1.current = setInterval(() => {
        scrollPosition1.current += width;

        if (scrollPosition1.current >= width * adImages.length) {
          scrollPosition1.current = 0;
        }

        scrollViewRef1.current?.scrollTo({
          x: scrollPosition1.current,
          animated: true,
        });
      }, 3000);

      return () => clearInterval(adIntervalRef1.current);
    }
  }, [adImages]);

  useEffect(() => {
    if (beachAdImages.length > 0) {
      adIntervalRef2.current = setInterval(() => {
        scrollPosition2.current += width;

        if (scrollPosition2.current >= width * beachAdImages.length) {
          scrollPosition2.current = 0;
        }

        scrollViewRef2.current?.scrollTo({
          x: scrollPosition2.current,
          animated: true,
        });
      }, 3000);

      return () => clearInterval(adIntervalRef2.current);
    }
  }, [beachAdImages]);

  return (
    <View style={styles.container}>
      <TabHeader title="Crown Travels"/>
      <View style={styles.userDetails}>
        {loading ? (
          <ActivityIndicator size="large" color="#6A1B9A" />
        ) : (
          imageUrl ? (
            <ImageBackground source={{ uri: imageUrl }} style={styles.timeImage}>
              <Text style={[styles.userDetailText, { color: textColor }]}>Welcome Back {userData?.username}</Text>
              <Text style={[styles.messageText, { color: textColor }]}>{message}</Text>
            </ImageBackground>
          ) : (
            <View style={styles.timeImage}>
              <Text style={[styles.userDetailText, { color: textColor }]}>Welcome Back {userData?.username}</Text> 
              <Text style={[styles.messageText, { color: textColor }]}>{message}</Text>
            </View>
          )
        )}
      </View>

      {/* Travel To card */}
      <View style={styles.travelsCard}>
        <Text style={styles.travelsCardText}>Travel To {places[currentPlaceIndex] || 'Loading...'} </Text>{/* Display the current place */}
      </View>

      {/* Display ad images from placead */}
      <View style={styles.adContainer}>
        <ScrollView
          horizontal
          ref={scrollViewRef1}
          showsHorizontalScrollIndicator={false}
          scrollEnabled={false}
          contentContainerStyle={styles.adScroll}
        >
          {adImages.map((url, index) => (
            <Image key={index} source={{ uri: url }} style={styles.adImage} />
          ))}
        </ScrollView>
      </View>

      {/* Display ad images from beachad */}
      <View style={styles.adContainer}>
        <ScrollView
          horizontal
          pagingEnabled
          ref={scrollViewRef2}
          showsHorizontalScrollIndicator={false}
          scrollEnabled={false}
          contentContainerStyle={styles.adScroll}
        >
          {beachAdImages.map((url, index) => (
            <Image key={index} source={{ uri: url }} style={styles.adImage} />
          ))}
        </ScrollView>
      </View>
    </View>
    //</SafeAreaView>
  );
};

const styles = StyleSheet.create({
  userDetails: {
    marginTop: 10,
    marginRight: 3,
    marginLeft: 3,
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 4,
    borderColor: '#6A1B9A',
    justifyContent: 'center',
    alignItems: 'center',
    height: 150,
  },
  timeImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    resizeMode: 'cover',
  },
  userDetailText: {
    textAlign: 'center',
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
  },
  messageText: {
    textAlign: 'center',
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
  },
  container: {
    backgroundColor: '#E6E6FA', 
    flex: 1,
  },
  travelsCard:{
    width: '100%',
    height: 70,
    backgroundColor: '#DAA621',
    marginTop:20,
    marginRight:20,
    borderRadius:15,
    borderWidth:3,
    borderColor:'#662483',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  travelsCardText:{
    color:'#662483',
    fontSize: 24,
    fontFamily: 'Poppins-ExtraBold',
    padding:10,
    textAlign:'center',
  },
  adContainer: {
    marginTop: 20,
    height: 150,
  },
  adScroll: {
    alignItems: 'center',
  },
  adImage: {
    width: width, // Use the full screen width dynamically
    height: 150,
    marginHorizontal: 0, // Remove extra margin to prevent cutting off
    borderRadius: 10,
    resizeMode: 'cover', // Change to cover for better fit
    borderWidth: 3,
    borderColor: '#662483',
  },
  travelToCard: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 60,
    marginVertical: 10,
    backgroundColor: '#DAA621',
    borderRadius: 8,
    padding: 10,
  },
  travelToText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: '#000',
  },
});

export default Home;
