// import React, { useEffect, useState } from 'react';
// import { View, Text, StyleSheet, Alert, ScrollView, TouchableOpacity } from 'react-native';
// import { auth } from '../firebase';
// import { signOut } from 'firebase/auth';
// import { collection, getDocs } from 'firebase/firestore';
// import { db } from '../firebase';
// import { useRouter } from 'expo-router';
// import TabHeader from '../../components/tabHeader';

// const Admin = () => {
//     const [bookingDetails, setBookingDetails] = useState([]);
//     const [isLoading, setIsLoading] = useState(true);
//     const router = useRouter();

//     useEffect(() => {
//         const fetchBookingDetails = async () => {
//             try {
//                 const querySnapshot = await getDocs(collection(db, 'bookingdetails'));
//                 const bookings = [];
//                 querySnapshot.forEach((doc) => {
//                     bookings.push({ id: doc.id, ...doc.data() });
//                 });

//                 // Sort bookings by createdAt in descending order
//                 bookings.sort((a, b) => {
//                     return b.createdAt.seconds - a.createdAt.seconds; // Assuming createdAt is a Firestore Timestamp
//                 });

//                 setBookingDetails(bookings);
//             } catch (error) {
//                 Alert.alert('Error fetching booking details', error.message);
//             } finally {
//                 setIsLoading(false);
//             }
//         };

//         fetchBookingDetails();
//     }, []);

//     const formatDateTime = (timestamp) => {
//         const date = new Date(timestamp.seconds * 1000);
//         return `${String(date.getFullYear()).padStart(4, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;
//     };

//     const handleLogout = async () => {
//         try {
//             await signOut(auth);
//             console.log('Admin signed out successfully');
//             router.replace('/auth/Sign-in');
//         } catch (error) {
//             Alert.alert('Error signing out', error.message);
//         }
//     };

//     return (
//         //<SafeAreaView style={styles.container}>
//         <View style={styles.container}>
//             <ScrollView>
//                 {/* <View style={styles.header}>
//                     <Text style={styles.name}>Booking Details</Text>
//                 </View> */}
//                 <TabHeader title="Booking Details"/>
//                 <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
//                     <Text style={styles.logoutButtonText}>Logout</Text>
//                 </TouchableOpacity>
//                 {isLoading ? (
//                     <Text>Loading...</Text>
//                 ) : (
//                     bookingDetails.map((booking) => (
//                         <View key={booking.id} style={styles.card}>
//                             <Text style={styles.cardTitle}>{booking.name}</Text>

//                             <Text style={styles.label}>Status:</Text>
//                             <Text style={styles.value}>{booking.status}</Text>

//                             <Text style={styles.label}>Reference Number:</Text>
//                             <Text style={styles.value}>{booking.paymentIntentId}</Text>
//                             <Text style={styles.label}>Booked On:</Text>
//                             <Text style={styles.value}>{formatDateTime(booking.createdAt)}</Text>
//                             <Text style={styles.label}>Trip Day:</Text>
//                             <Text style={styles.value}>{booking.startDate}</Text>
//                             <Text style={styles.label}>Email:</Text>
//                             <Text style={styles.value}>{booking.email}</Text>
//                             <Text style={styles.label}>User name:</Text>
//                             <Text style={styles.value}>{booking.username}</Text>
//                             <Text style={styles.label}>Contact Number:</Text>
//                             <Text style={styles.value}>{booking.contactnumber}</Text>
//                             <Text style={styles.label}>Destination:</Text>
//                             <Text style={styles.value}>{booking.destination}</Text>
//                             <Text style={styles.label}>Duration:</Text>
//                             <Text style={styles.value}>{booking.duration}</Text>
//                             <Text style={styles.label}>Total:  Advanced:  End Trip Payment:</Text>
//                             <Text style={styles.value}>{`LKR ${booking.totalPayable}.00`}  {`LKR ${booking.advancedPayment}.00`}  {`LKR ${booking.endtripPayable}.00`}</Text>
//                             <Text style={styles.label}>Vehicle:</Text>
//                             <Text style={styles.value}>{booking.model}</Text>
//                             <Text style={styles.label}>Vehicle Id:</Text>
//                             <Text style={styles.value}>{booking.id}</Text>
//                         </View>
//                     ))
//                 )}
//             </ScrollView>
//         </View>
//         //</SafeAreaView>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         backgroundColor: '#E6E6FA',
//         flex: 1,
//     },
//     // header: {
//     //     flexDirection: 'row',
//     //     alignItems: 'center',
//     //     paddingTop: 30,
//     //     backgroundColor: '#DAA621',
//     //     height: 80,
//     // },
//     // name: {
//     //     fontSize: 24,
//     //     fontFamily: 'Poppins-Bold',
//     //     paddingLeft: '25%',
//     //     paddingTop: 8,
//     // },
//     logoutButton: {
//         backgroundColor: '#662483',
//         paddingVertical: 12,
//         width: 120,
//         height: 50,
//         alignItems: 'center',
//         paddingHorizontal: 24,
//         borderRadius: 8,
//         marginTop: 12,
//         marginLeft: 260,
//     },
//     logoutButtonText: {
//         color: '#FFFFFF',
//         fontSize: 18,
//         fontFamily: 'Poppins-SemiBold',
//         textAlign: 'center',
//     },
//     card: {
//         backgroundColor: '#D3D3D3',
//         padding: 16,
//         marginVertical: 8,
//         borderRadius: 8,
//         elevation: 2,
//         margin: 20,
//     },
//     cardTitle: {
//         fontSize: 18,
//         fontFamily: 'Poppins-Bold',
//     },
//     label: {
//         fontFamily: 'Poppins-SemiBold',
//         color: '#000000',
//         fontSize: 15,
//         marginTop: 8,
//     },
//     value: {
//         fontFamily: 'Poppins-Regular',
//         color: '#000000',
//         fontSize: 15,
//         marginBottom: 8,
//     },
// });

// export default Admin;


import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView, TouchableOpacity } from 'react-native';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { useRouter } from 'expo-router';
import TabHeader from '../../components/tabHeader';

const Admin = () => {
    const [bookingDetails, setBookingDetails] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchBookingDetails = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'bookingdetails'));
                const bookings = [];
                querySnapshot.forEach((doc) => {
                    bookings.push({ id: doc.id, ...doc.data() });
                });

                // Sort bookings by createdAt in descending order
                bookings.sort((a, b) => b.createdAt.seconds - a.createdAt.seconds);

                setBookingDetails(bookings);
            } catch (error) {
                Alert.alert('Error fetching booking details', error.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchBookingDetails();
    }, []);

    const formatDateTime = (timestamp) => {
        const date = new Date(timestamp.seconds * 1000);
        return `${String(date.getFullYear()).padStart(4, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
            console.log('Admin signed out successfully');
            router.replace('/auth/Sign-in');
        } catch (error) {
            Alert.alert('Error signing out', error.message);
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView>
                <TabHeader title="Booking Details" />
                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <Text style={styles.logoutButtonText}>Logout</Text>
                </TouchableOpacity>
                {isLoading ? (
                    <Text>Loading...</Text>
                ) : (
                    bookingDetails.map((booking, index) => (
                        <View key={booking.paymentIntentId} style={styles.card}>
                            <Text style={styles.cardTitle}>{booking.name}</Text>

                            <Text style={styles.label}>Status:</Text>
                            <Text style={styles.value}>{booking.status}</Text>

                            <Text style={styles.label}>Reference Number:</Text>
                            <Text style={styles.value}>{booking.paymentIntentId}</Text>
                            <Text style={styles.label}>Booked On:</Text>
                            <Text style={styles.value}>{formatDateTime(booking.createdAt)}</Text>
                            <Text style={styles.label}>Trip Day:</Text>
                            <Text style={styles.value}>{booking.startDate}</Text>
                            <Text style={styles.label}>Email:</Text>
                            <Text style={styles.value}>{booking.email}</Text>
                            <Text style={styles.label}>User name:</Text>
                            <Text style={styles.value}>{booking.username}</Text>
                            <Text style={styles.label}>Contact Number:</Text>
                            <Text style={styles.value}>{booking.contactnumber}</Text>
                            <Text style={styles.label}>Destination:</Text>
                            <Text style={styles.value}>{booking.destination}</Text>
                            <Text style={styles.label}>Duration:</Text>
                            <Text style={styles.value}>{booking.duration}</Text>
                            <Text style={styles.label}>Total:  Advanced:  End Trip Payment:</Text>
                            <Text style={styles.value}>{`LKR ${booking.totalPayable}.00`}  {`LKR ${booking.advancedPayment}.00`}  {`LKR ${booking.endtripPayable}.00`}</Text>
                            <Text style={styles.label}>Vehicle:</Text>
                            <Text style={styles.value}>{booking.model}</Text>
                            <Text style={styles.label}>Vehicle Id:</Text>
                            <Text style={styles.value}>{booking.id}</Text>
                        </View>
                    ))
                )}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#E6E6FA',
        flex: 1,
    },
    logoutButton: {
        backgroundColor: '#662483',
        paddingVertical: 12,
        width: 120,
        height: 50,
        alignItems: 'center',
        paddingHorizontal: 24,
        borderRadius: 8,
        marginTop: 12,
        marginLeft: 260,
    },
    logoutButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontFamily: 'Poppins-SemiBold',
        textAlign: 'center',
    },
    card: {
        backgroundColor: '#D3D3D3',
        padding: 16,
        marginVertical: 8,
        borderRadius: 8,
        elevation: 2,
        margin: 20,
    },
    cardTitle: {
        fontSize: 18,
        fontFamily: 'Poppins-Bold',
    },
    label: {
        fontFamily: 'Poppins-SemiBold',
        color: '#000000',
        fontSize: 15,
        marginTop: 8,
    },
    value: {
        fontFamily: 'Poppins-Regular',
        color: '#000000',
        fontSize: 15,
        marginBottom: 8,
    },
});

export default Admin;
