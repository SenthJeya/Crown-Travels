import { View, Text, ScrollView, Image, Alert,StyleSheet } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { images } from '../../constants';
import FormField from '../../components/FormField';
import CustomButton from '../../components/customButton';
import { Link, useRouter } from 'expo-router';
import { auth } from '../firebase'; 
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore'; 

const SignUp = () => {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    contactnumber: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const submit = async () => {
    setIsSubmitting(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, form.email, form.password);
      const user = userCredential.user;

      // Save additional user data to Firestore
      await setDoc(doc(db, 'users', user.uid), {
        username: form.username,
        email: form.email,
        contactnumber: form.contactnumber,
        createdAt: new Date(),
      });

      router.replace('/tabs/home');
    } catch (error) {
      let errorMessage = 'An error occurred. Please try again.';
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'The email address is already in use by another account.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'The email address is not valid.';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'The password is too weak.';
      }
      Alert.alert('Sign Up Error', errorMessage);
      console.error('Error signing up:', error);
    }
    setIsSubmitting(false);
  };

  return (
    <SafeAreaView className="bg-primarybg h-full">
      <ScrollView>
        <View className="w-full justify-center min-h-[85vh] px-4 my-6">
          <Image source={images.logo} className="w-[150px] h-[250px]" resizeMode="contain" style = {styles.logo} />
          <Text className="text-2xl text-center text-black mt-10 font-pbold">Sign Up to Crown Travels</Text>

          <FormField
            title="Username"
            value={form.username}
            handleChangeText={(e) => setForm({ ...form, username: e })}
            otherStyles="mt-10"
          />

          <FormField
            title="Email"
            value={form.email}
            handleChangeText={(e) => setForm({ ...form, email: e })}
            otherStyles="mt-7"
            keyboardType="email-address"
          />

          <FormField
            title="Password"
            value={form.password}
            handleChangeText={(e) => setForm({ ...form, password: e })}
            otherStyles="mt-7"
          />

          <FormField
            title="Contact Number"
            value={form.contactnumber}
            handleChangeText={(e) => setForm({ ...form, contactnumber: e })}
            otherStyles="mt-7"
            keyboardType="phone-pad"
          />

          <CustomButton
            title="Sign-up"
            handlePress={submit}
            containerStyles="mt-7"
            isLoading={isSubmitting}
          />

          <View className="justify-center pt-5 flex-row gap-2">
            <Text className="text-lg text-black font-pregular">Have an account already?</Text>
            <Link href="/auth/Sign-in" className="text-lg font-psemibold text-secondary">Sign In</Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  logo: {
    width: 170,
    height: 170,
    alignItems: 'center',
    //marginTop: 30,
    marginLeft: 80,
    justifyContent: 'center',
  },
});

export default SignUp;