import { View, Text, StyleSheet, TouchableOpacity, Alert, Image, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { auth, db } from '../firebase'; 
import { useRouter } from 'expo-router'; 
import { doc, getDoc, deleteDoc, collection, query, where, getDocs, updateDoc } from 'firebase/firestore';
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder';
import { images } from '../../constants';
import TabHeader from '../../components/tabHeader';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true); 
  const [bookingDetails, setBookingDetails] = useState([]); 
  const router = useRouter(); 

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setUser(user);
        try {
          const docRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            setUserData(docSnap.data());

            // Fetch booking details
            const bookingQuery = query(
              collection(db, 'bookingdetails'),
              where('email', '==', docSnap.data().email)
            );
            const bookingSnap = await getDocs(bookingQuery);

            const bookings = bookingSnap.docs.map((doc) => {
              const data = doc.data();
              const createdAt = data.createdAt?.toDate();
              const formattedDateTime = createdAt
                ? `${String(createdAt.getFullYear()).padStart(4, '0')}-${String(createdAt.getMonth() + 1).padStart(2, '0')}-${String(createdAt.getDate()).padStart(2, '0')} ${String(createdAt.getHours()).padStart(2, '0')}:${String(createdAt.getMinutes()).padStart(2, '0')}`
                : 'No date';

              return {
                ...data,
                createdAt: formattedDateTime,
                rawDate: createdAt, // Keep raw date for sorting
              };
            });

            // Sort bookings by rawDate in descending order
            bookings.sort((a, b) => b.rawDate - a.rawDate);
            setBookingDetails(bookings);
          } else {
            console.log('No such document!');
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
        setLoading(false);
      } else {
        setLoading(false); 
      }
    });

    return unsubscribe; 
  }, []);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      router.replace('/auth/Sign-in'); 
    } catch (error) {
      console.error('Error signing out:', error);
      Alert.alert('Error', 'Failed to sign out. Please try again.');
    }
  };

  const handleDeleteProfile = () => {
    Alert.alert(
      'Confirm Deletion',
      'Are you sure you want to delete your profile? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Profile deletion canceled'),
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: async () => {
            try {
              const user = auth.currentUser;
              if (user) {
                await deleteDoc(doc(db, 'users', user.uid)); 
                await auth.signOut();
                await user.delete();
                Alert.alert('Profile Deleted', 'Your profile has been deleted successfully.');
                router.replace('/auth/Sign-in');
              }
            } catch (error) {
              console.error('Error deleting profile:', error);
              Alert.alert('Error', 'Failed to delete profile. Please try again.');
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  const handleEditProfile = () => {
    router.push('/screens/profileEdit');
  };

  const formatDate = (date) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
  };

  const handleCancelBooking = async (paymentIntentId, bookingDate) => {
    try {
      // Parse the Firestore timestamp into a JavaScript Date object
      const bookingTime = new Date(bookingDate);
  
      const currentTime = new Date(); // Current system time
      const twelveHoursInMs = 12 * 60 * 60 * 1000; // 12 hours in milliseconds
  
      const timeDifference = currentTime - bookingTime;
  
      if (timeDifference > twelveHoursInMs) {
        Alert.alert('Cancellation Error', 'You can only cancel the booking within 12 hours of booking time.');
        return;
      }
  
      // Check if booking exists and is confirmed
      const bookingQuery = query(
        collection(db, 'bookingdetails'),
        where('paymentIntentId', '==', paymentIntentId),
        where('status', '==', 'Active') // Ensure it's a confirmed booking
      );
      const bookingSnap = await getDocs(bookingQuery);
  
      if (!bookingSnap.empty) {
        // Proceed with the cancellation
        Alert.alert(
          'Confirm Cancellation',
          'Are you sure you want to cancel this booking? This action cannot be undone.',
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Confirm',
              onPress: async () => {
                try {
                  const bookingDoc = bookingSnap.docs[0];
                  await updateDoc(bookingDoc.ref, { status: 'Canceled' });
  
                  // Update the state to reflect the canceled booking
                  setBookingDetails((prevBookings) =>
                    prevBookings.map((booking) =>
                      booking.paymentIntentId === paymentIntentId
                        ? { ...booking, status: 'Canceled' } // Update the status to 'Canceled'
                        : booking
                    )
                  );
  
                  Alert.alert('Booking Canceled', 'Your booking has been successfully canceled.');
                } catch (error) {
                  console.error('Error canceling booking:', error);
                  Alert.alert('Error', 'Failed to cancel booking. Please try again.');
                }
              },
            },
          ],
          { cancelable: false }
        );
      } else {
        // Handle case where the booking doesn't exist or is not confirmed
        Alert.alert('Error', 'Booking not found or not confirmed.');
      }
    } catch (error) {
      console.error('Error processing booking cancellation:', error);
      Alert.alert('Error', 'Failed to process the booking cancellation.');
    }
  };
  
  

  return (
    <View style={styles.container}>
      <ScrollView>
        <TabHeader title="Profile" />
        <View style={styles.innerContainer}>
          <ShimmerPlaceHolder visible={!loading} style={styles.imagePlaceholder}>
            <Image source={images.profile} style={styles.image} />
          </ShimmerPlaceHolder>

          {loading ? (
            <View style={styles.shimmerContainer}>
              <ShimmerPlaceHolder style={styles.shimmerText} />
              <ShimmerPlaceHolder style={styles.shimmerText} />
              <ShimmerPlaceHolder style={styles.shimmerText} />
            </View>
          ) : (
            userData && (
              <View style={styles.userInfo}>
                <Text style={styles.infoText}>Username: {userData.username}</Text>
                <Text style={styles.infoText}>Email: {userData.email}</Text>
                <Text style={styles.infoText}>Contact Number: {userData.contactnumber}</Text>
              </View>
            )
          )}

          <View style={styles.control}>
            <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteProfile}>
              <Text style={styles.deleteButtonText}>Deactive Profile</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
              <Text style={styles.editButtonText}>Edit Profile</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <Text style={styles.logoutButtonText}>Logout Profile</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.billHeding}>
            <Text style={styles.billHedingText}>My Bills</Text>
          </View>

          {bookingDetails.length > 0 && (
            <View style={styles.bookingContainer}>
              {bookingDetails.map((booking, index) => (
                <View key={index} style={styles.bookingCard}>
                  <Text style={styles.bookingTitle}>Booking #{index + 1}</Text>
                  <Text style={styles.bookingDetail}>Status: {booking.status}</Text>
                  <Text style={styles.bookingDetail}>Bill Reference: {booking.paymentIntentId}</Text>
                  <Text style={styles.bookingDetail}>Booked On: {booking.createdAt}</Text>
                  <Text style={styles.bookingDetail}>Email: {booking.email}</Text>
                  <Text style={styles.bookingDetail}>Trip Date: {booking.startDate}</Text>
                  <Text style={styles.bookingDetail}>User Name: {booking.username}</Text>
                  <Text style={styles.bookingDetail}>Vehicle: {booking.model}</Text>
                  <Text style={styles.bookingDetail}>Destination: {booking.destination}</Text>
                  <Text style={styles.bookingDetail}>Duration: {booking.duration}</Text>
                  <Text style={styles.bookingDetail}>Advance Payment: {booking.endtripPayable}.00</Text>
                  <Text style={styles.bookingDetail}>End Trip Payment: {booking.endtripPayable}.00</Text>
                  <Text style={styles.bookingDetail}>Total Payment: {booking.totalPayable}.00</Text>

                  {/* Disable the button and show 'Cancelled' if the booking is canceled */}
                  {booking.status === 'Canceled' ? (
                    <Text style={styles.cancelledText}>Cancelled</Text>
                  ) : (
                  <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => handleCancelBooking(booking.paymentIntentId, booking.rawDate)}
                  >
                    <Text style={styles.cancelButtonText}>Cancel Booking</Text>
                  </TouchableOpacity>
                  )}

                  <Text style={styles.note}>Note: Precise Pickup Location Will Be Confirmed Upon Payment</Text>
                </View>
              ))}

            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
    backgroundColor: '#E6E6FA', 
    flex:1,
  },
  innerContainer:{
    alignItems: 'center',
    paddingTop: 20,
    height: '100%',
  },
  imagePlaceholder: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 5,
    borderColor: '#662483',
    alignItems: 'center',
  },
  shimmerContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  shimmerText: {
    width: 300,
    height: 20,
    marginVertical: 10,
    borderRadius: 10,
  },
  userInfo: {
    marginBottom: 20,
  },
  infoText: {
    fontSize: 18,
    color: '#000000', 
    textAlign: 'center',
    marginBottom: 10,
    fontFamily: 'Poppins-SemiBold', 
  },
  control:{
    flexDirection:'row',
    alignItems: 'center',
  },
  logoutButton: {
    backgroundColor: '#008000',
    paddingVertical: 12,
    width: 120,
    alignItems: 'center',
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  logoutButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    textAlign: 'center',
  },
  editButton: {
    backgroundColor: '#662483',
    paddingVertical: 12,
    width: 120,
    paddingHorizontal: 24,
    margin:10,
    borderRadius: 8,
  },
  editButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    textAlign: 'center',
  },
  deleteButton: {
    backgroundColor: '#B22222',
    paddingVertical: 12,
    width: 120,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  deleteButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    textAlign: 'center',
  },
  billHeding:{
    backgroundColor: '#DAA621',
    padding: 15,
    width: 360,
    borderRadius: 10,
    marginTop: 10,
    elevation: 3,
    // for shadow on Android
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  billHedingText:{
    color: '#000000',  
    fontSize: 18,
    fontFamily: 'Poppins-ExtraBold',
    textAlign:'center',
  },
  bookingContainer: {
    marginTop: 20,
    width: '100%',
    paddingHorizontal: 20,
  },
  bookingCard: {
    backgroundColor: '#D3D3D3',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 3,
    // for shadow on Android
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  bookingTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    marginBottom: 10,
  },
  bookingDetail: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 5,
  },
  cancelButton: {
    backgroundColor: 'orange',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    textAlign: 'center',
  },
  note:{
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    color: '#B22222',
    textAlign:'center',
    paddingTop:20,
  },
  cancelledText: {
    color: 'red',
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    textAlign: 'center',
    marginTop: 10,
  },
  
});

export default Profile;
