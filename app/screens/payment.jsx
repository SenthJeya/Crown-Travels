import React, { useState, useRef } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text, ActivityIndicator, Modal, Image } from 'react-native';
//import { useStripe } from '@stripe/stripe-react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { db } from '../firebase'; // Firebase import for saving booking details
import { collection, addDoc, serverTimestamp} from 'firebase/firestore';
//import 'firebase/firestore';
import { images } from '../../constants';
import uuid from 'react-native-uuid'; // Use react-native-uuid
import ScreenHeader from '../../components/screenHeader';


const Payment = () => {
  //const { confirmPayment } = useStripe();
  const { id, totalPayable, advancedPayment, endtripPayable, username, email, contactnumber, duration, endDuration,destination,model,startDate } = useLocalSearchParams();
  const router = useRouter();

  const [cardNumber, setCardNumber] = useState('');
  const [expiryMonth, setExpiryMonth] = useState('');
  const [expiryYear, setExpiryYear] = useState('');
  const [cvc, setCvc] = useState('');
  const [loading, setLoading] = useState(false); // Loading state
  const [showModal, setShowModal] = useState(false); // Modal state

  const expiryMonthRef = useRef(null);
  const expiryYearRef = useRef(null);
  const cvcRef = useRef(null);

  const handleCardNumberChange = (text) => {
    const formattedText = text
      .replace(/\D/g, '')
      .replace(/(.{4})/g, '$1 ')
      .trim();
    setCardNumber(formattedText);
    if (formattedText.length >= 19) {
      expiryMonthRef.current.focus();
    }
  };

  const isFormValid = () => {
    return (
      cardNumber.length === 19 && // Must be 16 digits + spaces (19 characters)
      expiryMonth.length === 2 && // Must be 2 digits
      expiryYear.length === 2 && // Must be 2 digits
      cvc.length >= 3 // Must be at least 3 digits
    );
  };

  // const back = () => {
  //   router.push('/tabs/vehicle');
  // };

  const handlePayment = async () => {
    setLoading(true);

    setTimeout(async () => {
      setLoading(false);
      setShowModal(true); // Show success modal

      const fakePaymentIntentId = uuid.v4() + Date.now();

      // Save booking details in Firebase
      await addDoc(collection(db, 'bookingdetails'),{  
        id,
        totalPayable,
        advancedPayment,
        endtripPayable,
        username,
        email,
        contactnumber,
        destination,
        duration,
        endDuration,
        paymentIntentId: fakePaymentIntentId,
        createdAt: serverTimestamp(),
        model,
        startDate,
        status: 'Active', // Added status as 'active'
      });

      console.log('Payment details saved to Firebase');

      setTimeout(() => {
        setShowModal(false);
        router.push('/tabs/home'); // Redirect to home after 2 seconds
      }, 2000);
    }, 2000);

    /*
    // Back end Payment Logic Not Working
    try {
      // Create a payment intent with the amount (advancedPayment)
      const res = await createPaymentIntent(advancedPayment);
      console.log("Successfully created payment intent", res);

      if (res?.data?.clientSecret) {
        // Confirm the payment with the client secret and card details
        const confirmPaymentIntent = await confirmPayment(res?.data?.clientSecret, {
          type: 'Card',
        });
        console.log("Payment confirmation result:", confirmPaymentIntent);

        if (confirmPaymentIntent?.paymentIntent) {
          alert("Payment Successful");

          // Save payment details in Firebase
          await firestore.collection('bookingdetails').add({
            id,
            totalPayable,
            advancedPayment,
            endtripPayable,
            username,
            email,
            contactnumber,
            duration,
            endDuration,
            paymentIntentId: confirmPaymentIntent.paymentIntent.id,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          });
          console.log('Payment details saved to Firebase');
          router.push('/tabs/home');
        }
      }
    } catch (error) {
      console.log("Error during payment process", error);
    }
    */
  };

  return (
    //<SafeAreaView style={styles.maincontainer}>
    <View style={styles.maincontainer}>
      {/* <View style={styles.header}>
        <TouchableOpacity onPress={back} style={styles.button}>
          <Text style={styles.buttonText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.name}>Payment Details</Text>
      </View> */}
      <ScreenHeader title="Payment Details" path="/tabs/vehicle"/>
      <View style={styles.container}>
      <Image source={images.logo} style={styles.logo} resizeMode="contain" />
        <TextInput
          style={styles.input}
          placeholder="Card Number"
          keyboardType="numeric"
          maxLength={19}
          onChangeText={handleCardNumberChange}
          value={cardNumber}
        />
        <View style={styles.row}>
          <TextInput
            style={[styles.input, styles.expiryInput]}
            placeholder="MM"
            keyboardType="numeric"
            maxLength={2}
            onChangeText={text => {
              setExpiryMonth(text);
              if (text.length === 2) expiryYearRef.current.focus();
            }}
            value={expiryMonth}
            ref={expiryMonthRef}
          />
          <TextInput
            style={[styles.input, styles.expiryInput]}
            placeholder="YY"
            keyboardType="numeric"
            maxLength={2}
            onChangeText={text => {
              setExpiryYear(text);
              if (text.length === 2) cvcRef.current.focus();
            }}
            value={expiryYear}
            ref={expiryYearRef}
          />
        </View>
        <TextInput
          style={styles.input}
          placeholder="CVC"
          keyboardType="numeric"
          maxLength={4}
          onChangeText={text => {
            setCvc(text);
          }}
          value={cvc}
          ref={cvcRef}
        />
        
        <TouchableOpacity
          style={[styles.payButton, !isFormValid() && styles.disabledButton]}
          onPress={handlePayment}
          disabled={!isFormValid()}
        >
            <Text style={styles.payButtonText}>Pay Now</Text>
        </TouchableOpacity>

        {/* Loading Spinner */}
        {loading && <ActivityIndicator size="large" color="#0000ff" />}

        {/* Success Modal */}
        <Modal transparent={true} visible={showModal} animationType="fade">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.successText}>Payment Successful!</Text>
            </View>
          </View>
        </Modal>
      </View>
    </View>
    //</SafeAreaView>
  );
};

const styles = StyleSheet.create({
  maincontainer: {
    flex: 1,
    backgroundColor: '#E6E6FA',
  },
  // header: {
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   paddingTop: 30,
  //   backgroundColor: '#DAA621',
  //   height: 80,
  // },
  // button: {
  //   backgroundColor: '#662483',
  //   width: 80,
  //   height: 47,
  //   borderTopLeftRadius: 80,
  //   borderTopRightRadius: 10,
  //   borderBottomRightRadius: 10,
  //   alignItems: 'center',
  // },
  // buttonText: {
  //   color: '#FFFFFF',
  //   fontSize: 18,
  //   fontFamily: 'Poppins-SemiBold',
  //   paddingLeft: 10,
  //   paddingTop: 10,
  // },
  // name: {
  //   fontSize: 24,
  //   fontFamily: 'Poppins-Bold',
  //   paddingLeft: 40,
  //   paddingTop: 8,
  // },
  container: {
    padding: 15,
  },
  logo: {
    width: 170,
    height: 170,
    marginLeft: 'auto',
    marginRight: 'auto',
    marginBottom:30,
  },
  input: {
    height: 50,
    borderWidth: 3,
    borderRadius: 10,
    borderColor: '#662483',
    backgroundColor: '#FFFFFF',
    marginBottom: 12,
    paddingHorizontal: 8,
    fontFamily: 'Poppins-SemiBold',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  payButton:{
    backgroundColor: '#662483',
    paddingVertical: 12,
    width: '100%',
    paddingHorizontal: 24,
    marginTop:10,
    borderRadius: 8,
  },
  payButtonText:{
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    textAlign: 'center',
  },
  expiryInput: {
    flex: 1,
    marginRight: 8,
  },
  disabledButton: {
    backgroundColor: '#CCC', 
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 200,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
  },
  successText: {
    fontSize: 18,
    color: '#008000',
    fontFamily: 'Poppins-Bold',
    textAlign:'justify',
  },
});

export default Payment;
