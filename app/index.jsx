import { StatusBar } from 'expo-status-bar';
import {ScrollView, Text, View,Image,StyleSheet,TouchableOpacity} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {images} from '../constants';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {router,useRouter} from 'expo-router';

export default function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(null); // Track login state
  const router = useRouter();

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const loggedIn = await AsyncStorage.getItem('loggedIn');
        if (loggedIn === 'true') {
          router.replace('tabs/home'); // Redirect to home if logged in
        } else {
          setIsLoggedIn(false); // Stay on index if not logged in
        }
      } catch (error) {
        console.error('Failed to check login status', error);
      }
    };

    checkLoginStatus();
  }, []);

  const handleLogin = async () => {
    try {
      await AsyncStorage.setItem('loggedIn', 'true');
      router.replace('/home'); // Redirect to home after login
    } catch (error) {
      console.error('Failed to save login status', error);
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.setItem('loggedIn', 'false');
      router.replace('/index'); // Redirect to index after logout
    } catch (error) {
      console.error('Failed to save logout status', error);
    }
  };

  if (isLoggedIn === null) {
    // Show loading state while checking login status
    return <Text>Loading...</Text>;
  }
  return (
    <SafeAreaView className = "bg-primarybg h-full ">
      <ScrollView contentContainerStyle = {{height : '100%'}}>
        <View className = "w-full items-center min-h-[85vh] px-4 my-6">
          <Image source={images.logo} className="w-[150px] h-[250px]" resizeMode="contain" style = {styles.logo} />
          <View className = "relative mt-5">
          <Text className="text-2xl text-black font-pbold text-center" style={styles.mainContainer}>Discover Endless Travel with{' '}
              <Text className="font-pextrabold text-3xl" style={styles.CRtext}>Crown Travels</Text></Text>

            <Text className = "text-sm font-psemibold text-black-100 mt-7 text-center">Explore Sri Lanka with Crown Travels
            We offer you the ultimate journey across Sri Lanka. We create unique travel experiences that are seamless, exciting, and unforgettable.</Text>
          </View>

          <TouchableOpacity style={styles.button} onPress = {() => router.push('auth/Sign-in')}>
            <Text style={styles.buttonText}>Countinue with Email</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <StatusBar backgroundColor='#161622' style='light'/>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  logo: {
    width: 250,
    height: 250,
    alignItems: 'center',
    marginRight: 30,
    marginBottom: 40,
    justifyContent: 'center',
  },

  button: {
    backgroundColor: '#662483',
    paddingVertical: 12,
    width: 360,
    height: 70,
    marginTop: 50,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    textAlign: 'center',
    marginTop: 10,
  },

  CRtext: {
    color: '#DAA520',
    textShadowColor: '#000000',
    textShadowOffset: { width: 2, height: 3 },
    textShadowRadius: 1,
  },

  mainContainer: {
    marginTop: 20,
  }
});