import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, ActivityIndicator, RefreshControl,StatusBar,Platform } from 'react-native';
import { db } from '../firebase';  // Import your Firebase configuration
import { collection, getDocs } from 'firebase/firestore';
import { useRouter } from 'expo-router';  // Import useRouter
import { images } from '../../constants';
import TabHeader from '../../components/tabHeader';

const Vehicle = () => {
  const [vehicles, setVehicles] = useState([]);
  const [bookedVehicles, setBookedVehicles] = useState([]);
  const [loading, setLoading] = useState(true);  // Add loading state
  const [refreshing, setRefreshing] = useState(false); // Add refreshing state
  const router = useRouter();  // Initialize useRouter

  const fetchVehicles = async () => {
    try {
      const vehicleCollection = collection(db, 'vehicle');
      const vehicleSnapshot = await getDocs(vehicleCollection);
      const vehicleList = vehicleSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setVehicles(vehicleList);
    } catch (error) {
      console.error("Error fetching vehicles: ", error);
    }
  };

  const fetchBookedVehicles = async () => {
    try {
      const bookingCollection = collection(db, 'bookingdetails');
      const bookingSnapshot = await getDocs(bookingCollection);
      const bookedList = bookingSnapshot.docs.map(doc => doc.data());
      //console.log("Fetched booked vehicles:", bookedList);  // Log the fetched bookings
      setBookedVehicles(bookedList);
    } catch (error) {
      console.error("Error fetching booking details: ", error);
    }
  };

  const fetchData = async () => {
    setLoading(true); // Set loading to true when fetching
    await fetchVehicles();
    await fetchBookedVehicles();
    setLoading(false);  // Set loading to false after data is fetched
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData(); // Fetch the data again
    setRefreshing(false);
  };

  const isVehicleBooked = (vehicleId) => {
    if (bookedVehicles.length === 0) return false; // No bookings yet

    const bookings = bookedVehicles.filter((book) => String(book.id) === String(vehicleId));
    if (bookings.length === 0) return false;

    const currentDate = new Date();
    return bookings.some((booking) => {
      const endDurationDate = new Date(booking.endDuration);
      return currentDate <= endDurationDate;
    });
  };

  const handleBook = (vehicle) => {
    router.push({
      pathname: '/screens/booking',
      params: { id: vehicle.id, model: vehicle.model, type: vehicle.type, seats: vehicle.seat }
    });
  };

  if (loading) {
    return (
      <View style={{paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0}}>
        <ActivityIndicator size="large" color="#662483" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#662483']}
          />
        }
      >
        <TabHeader title="Vehicles"/>
        <View style={styles.innerContainer}>
          {vehicles.length === 0 ? (
            <Text style={styles.noDataText}>No vehicles available.</Text>
          ) : (
            <>
              {/* Render available vehicles */}
              {vehicles.filter(vehicle => !isVehicleBooked(vehicle.id)).map((vehicle, index) => (
                <View key={index} style={styles.card}>
                  <Text style={styles.title}>{vehicle.name}</Text>
                  <View style={styles.cardContent}>
                    <Image source={{ uri: vehicle.url || 'https://via.placeholder.com/100' }} style={styles.image} />
                    <View style={styles.details}>
                      <Text style={styles.detail}>Model: {vehicle.model}</Text>
                      <Text style={styles.detail}>Seats: {vehicle.seat}</Text>
                      <Text style={styles.detail}>Type: {vehicle.type}</Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    style={styles.bookButton}
                    onPress={() => handleBook(vehicle)}
                  >
                    <Text style={styles.bookButtonText}>Book</Text>
                  </TouchableOpacity>
                </View>
              ))}
  
              {/* Render booked vehicles */}
              {vehicles.filter(vehicle => isVehicleBooked(vehicle.id)).map((vehicle, index) => {
                const bookedDetails = bookedVehicles.find((booking) => String(booking.id) === String(vehicle.id));
                return (
                  <View key={index} style={styles.card}>
                    <View style={styles.overlay}>
                      <Image source={images.booked} style={styles.overlayImage} />
                    </View>
                    <Text style={styles.title}>{vehicle.name}</Text>
                    <View style={styles.cardContent}>
                      <Image source={{ uri: vehicle.url || 'https://via.placeholder.com/100' }} style={styles.image} />
                      <View style={styles.details}>
                        <Text style={styles.detail}>Model: {vehicle.model}</Text>
                        <Text style={styles.detail}>Seats: {vehicle.seat}</Text>
                        <Text style={styles.detail}>Type: {vehicle.type}</Text>
                        {bookedDetails && (
                          <Text style={styles.detail}>Available On: {new Date(bookedDetails.endDuration).toLocaleDateString()}</Text>
                        )}
                      </View>
                    </View>
                    <TouchableOpacity
                      style={[styles.bookButton, styles.disabledButton]}
                      disabled
                    >
                      <Text style={styles.bookButtonText}>Booked</Text>
                    </TouchableOpacity>
                  </View>
                );
              })}
            </>
          )}
        </View>
      </ScrollView>
    </View>
    //</SafeAreaView>
  );
  
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#E6E6FA',
    flex: 1,
  },
  innerContainer: {
    alignItems: 'center',
    padding: 10,
  },
  card: {
    marginBottom: 20,
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 2,
    width: '100%',
    borderColor: '#6A1B9A',
    backgroundColor: '#FFFFFF',
    padding: 15,
  },
  title: {
    fontSize: 18,
    fontFamily: 'Poppins-ExtraBold',
    marginBottom: 10,
    textAlign: 'center',
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginRight: 15,
    resizeMode: 'stretch',
    zIndex: 0,
  },
  details: {
    flex: 1,
  },
  detail: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 5,
  },
  bookButton: {
    backgroundColor: '#662483',
    alignItems: 'center',
    paddingVertical: 10,
    marginTop: 15,
    borderRadius: 5,
    alignSelf: 'center',
    width: '80%',
    zIndex: 0,
  },
  disabledButton: {
    backgroundColor: 'gray', 
  },
  bookButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E6E6FA',
  },
  noDataText: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#662483',
    textAlign: 'center',
    marginTop: 20,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1, 
  },
  overlayImage: {
    opacity: 0.5,
    width: '100%',
    height: '100%',
    resizeMode: 'cover', 
  },
});

export default Vehicle;
