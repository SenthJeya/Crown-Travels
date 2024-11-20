import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { images } from '../../constants';
import { doc, getDoc } from 'firebase/firestore';
import { db, auth } from '../firebase'; // Import Firebase auth
import ScreenHeader from '../../components/screenHeader';

const Confirmation = () => {
    const router = useRouter();
    const { id, model, type, seat, pickup, destination, duration, date, time } = useLocalSearchParams();

    const [totalAmount, setTotalAmount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState(null);
    const [isChecked, setIsChecked] = useState(false);

    const handleCheckboxToggle = () => {
        setIsChecked(!isChecked);
    };

    const durationMapping = {
        'One Day': 1,
        'Two Days': 2,
        'Three Days': 3,
        'Four Days': 4,
        'Five Days': 5,
        'Six Days': 6,
        'One Week': 7,
    };

    const normalizeValues = (type, model) => {
        const normalizedType = type === 'A/C' ? 'ac' : 'nonac';
        const normalizedModel = model.toLowerCase();
        return { normalizedType, normalizedModel };
    };

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            if (user) {
                const userDocRef = doc(db, 'users', user.uid);
                const userDocSnapshot = await getDoc(userDocRef);
                if (userDocSnapshot.exists()) {
                    setUserData({ id: user.uid, ...userDocSnapshot.data() });
                } else {
                    console.log("No user data found in Firestore.");
                }
            } else {
                console.log("No user is logged in.");
            }
        });

        return () => unsubscribe(); 
    }, []);

    useEffect(() => {
        const fetchAndCalculate = async () => {
            setLoading(true);
            try {
                const numericDuration = durationMapping[duration] || 0;

                if (numericDuration === 0 || !destination || !type || !model) {
                    console.error('Invalid parameters for calculation.');
                    setLoading(false);
                    return;
                }

                const { normalizedType, normalizedModel } = normalizeValues(type, model);
                const modelDocRef = doc(db, 'pricedetails', destination, normalizedType, normalizedModel);
                const modelDocSnapshot = await getDoc(modelDocRef);

                if (modelDocSnapshot.exists()) {
                    const data = modelDocSnapshot.data();
                    if (data.amount) {
                        const total = data.amount * seat * numericDuration;
                        setTotalAmount(total);
                    } else {
                        console.error('Amount field not found in the document.');
                    }
                } else {
                    console.error(`Document does not exist at path: pricedetails/${destination}/${normalizedType}/${normalizedModel}`);
                }
            } catch (error) {
                console.error('Error fetching data: ', error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchAndCalculate();
    }, [destination, type, model, seat, duration]);

    const calculateEndDuration = () => {
        const numericDuration = durationMapping[duration] || 0;
        const startDate = new Date(date);
        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + numericDuration + 2);
        return endDate;
    };

    const endDuration = calculateEndDuration();

    const handlePayment = () => {
        if (!isChecked) return;
        router.push({
            pathname: '/screens/payment',
            params: {
                id: id,
                totalPayable: totalAmount,
                advancedPayment: totalAmount / 2,
                endtripPayable: totalAmount / 2,
                username: userData?.username,
                email: userData?.email,
                contactnumber: userData?.contactnumber,
                duration: duration,
                endDuration: endDuration.toISOString().split('T')[0],
                destination: destination,
                model: model,
                startDate: date,
            },
        });
    };

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    const advancedPayment = totalAmount / 2;
    const remainingPayment = totalAmount - advancedPayment;

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <ScreenHeader title="Confirmation" path="/tabs/vehicle" />
                <View style={styles.content}>
                    <Image source={images.logo} style={styles.logo} resizeMode="contain" />
                    
                    <View style={styles.detailCard}>
                        <Text style={styles.label}>Pickup Location: </Text>
                        <Text style={styles.value}>{pickup}</Text>
                        <Text style={styles.label}>Destination: </Text>
                        <Text style={styles.value}>{destination}</Text>
                        <Text style={styles.label}>Duration: </Text>
                        <Text style={styles.value}>{duration}</Text>
                        <Text style={styles.label}>Depature Date: </Text>
                        <Text style={styles.value}>{date}</Text>
                        <Text style={styles.label}>Pickup Time: </Text>
                        <Text style={styles.value}>{time}</Text>
                        <Text style={styles.label}>Vehicle: </Text>
                        <Text style={styles.value}>{model}</Text>
                    </View>

                    <View style={styles.paymentCard}>
                        <Text style={styles.paymentLabel}>Total Payable Amount: </Text>
                        <Text style={styles.paymentValue}>LKR {totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Text>

                        <Text style={styles.paymentLabel}>Advance to Pay: </Text>
                        <Text style={styles.paymentValue}>LKR {advancedPayment.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Text>

                        <Text style={styles.paymentLabel}>Amount to Pay After the Trip: </Text>
                        <Text style={styles.paymentValue}>LKR {remainingPayment.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Text>
                    </View>

                    <View style={styles.noticeCard}>
                        <Text style={styles.noticeHeading}>Terms and Conditions </Text>
                        <Text style={styles.noticeMessage}>Advanced Payment Not Refundable and Trip Can Cancel Within 12 Hours From Booking </Text>
                        <Text style={styles.noticeMessage}>Precise Pickup Location Will Be Confirmed Over the Phone</Text>
                        <Text style={styles.noticeMessage}>Remaining Amount Should Be Paid At The End Of The Trip</Text>
                        {/* Checkbox */}
                        <TouchableOpacity style={styles.checkboxContainer} onPress={handleCheckboxToggle}>
                            <View style={[styles.checkbox, isChecked && styles.checkboxChecked]}>
                                {isChecked && <Text style={styles.checkboxTick}>✔</Text>}
                            </View>
                            <Text style={styles.checkboxLabel}>I accept the Terms and Conditions</Text>
                        </TouchableOpacity>
                    </View>
        
                    

                    <TouchableOpacity
                        style={[
                            styles.payButton,
                            { backgroundColor: isChecked ? '#662483' : '#ccc' },
                        ]}
                        onPress={handlePayment}
                        disabled={!isChecked} // Disable button if not accepted
                    >
                        <Text style={styles.payButtonText}>Make Payment</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#E6E6FA',
        flex: 1,
    },
    // header: {
    //     flexDirection: 'row',
    //     alignItems: 'center',
    //     paddingTop: 30,
    //     backgroundColor: '#DAA621',
    //     height: 80,
    // },
    // button: {
    //     backgroundColor: '#662483',
    //     width: 80,
    //     height: 47,
    //     borderTopLeftRadius: 80,
    //     borderTopRightRadius: 10,
    //     borderBottomRightRadius: 10,
    //     alignItems: 'center',
    // },
    // buttonText: {
    //     color: '#FFFFFF',
    //     fontSize: 18,
    //     fontFamily: 'Poppins-SemiBold',
    //     paddingLeft: 10,
    //     paddingTop: 10,
    // },
    // name: {
    //     fontSize: 24,
    //     fontFamily: 'Poppins-Bold',
    //     paddingLeft: 40,
    //     paddingTop: 8,
    // },
    content: {
        padding: 20,
    },
    logo: {
        width: 170,
        height: 170,
        marginLeft: 'auto',
        marginRight: 'auto',
        //paddingBottom:20,
    },
    noticeCard:{
        backgroundColor: '#FFFFFF', // #e5b161
        borderRadius: 10,
        padding: 15,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    noticeHeading:{
        fontFamily: 'Poppins-ExtraBold',
        color: '#000000',
        textAlign: 'center',
        fontSize: 17,
        paddingBottom: 8,
    },
    noticeMessage:{
        fontFamily: 'Poppins-SemiBold',
        color: '#000000',
        //textAlign: 'center',
        fontSize: 15,
        paddingBottom: 8,
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 20,
    },
    checkbox: {
        width: 24,
        height: 24,
        borderWidth: 2,
        borderColor: '#662483',
        borderRadius: 4,
        marginRight: 10,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    checkboxChecked: {
        backgroundColor: '#662483',
    },
    checkboxTick: {
        color: '#fff',
        fontSize: 16,
    },
    checkboxLabel: {
        fontSize: 16,
        fontFamily: 'Poppins-ExtraBold',
        //color: '#FFFFFF',
        color: '#000000',
    },
    detailCard: {
        backgroundColor: '#662483',
        borderRadius: 10,
        padding: 15,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    label: {
        fontSize: 16,
        fontFamily: 'Poppins-SemiBold',
        marginBottom: 5,
        color: '#FFFFFF',
        textAlign: 'center',
    },
    value: {
        fontFamily: 'Poppins-ExtraBold',
        color: '#FFFFFF',
        textAlign: 'center',
        fontSize: 17,
        paddingBottom: 8,
    },
    payButton: {
        backgroundColor: '#662483',
        paddingVertical: 12,
        width: '100%',
        paddingHorizontal: 24,
        alignItems: 'center',
        borderRadius: 8,
        marginTop: 20,
    },
    payButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontFamily: 'Poppins-SemiBold',
        textAlign: 'center',
    },

    paymentCard: {
        backgroundColor: '#DAA621',
        borderRadius: 10,
        padding: 20,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    paymentLabel: {
        fontSize: 16,
        fontFamily: 'Poppins-SemiBold',
        marginBottom: 5,
        color: '#333',
        textAlign:'center',
    },
    paymentValue: {
        fontFamily: 'Poppins-ExtraBold',
        color: '#000',
        fontSize: 17,
        textAlign:'center',
        paddingBottom:7,
    },
});

export default Confirmation;
