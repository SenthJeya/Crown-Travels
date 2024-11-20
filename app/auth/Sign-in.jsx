import { View, Text, ScrollView, Image, Alert,StyleSheet } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { images } from '../../constants';
import FormField from '../../components/FormField';
import CustomButton from '../../components/customButton';
import { Link, useRouter } from 'expo-router';
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

const SignIn = () => {
  const [form, setForm] = useState({
    email: '',
    password: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const submit = async () => {
    setIsSubmitting(true);
    try {
      await signInWithEmailAndPassword(auth, form.email, form.password);
      console.log('User signed in successfully');
      if (form.email === 'admin@gmail.com') {
        router.replace('/screens/admin'); // Redirect to admin page
      } else {
        router.replace('/tabs/home'); // Redirect to home page for regular users
      }
    } catch (error) {
      let errorMessage = 'An error occurred. Please try again.';
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'No user found with this email.';
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'Incorrect password.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'The email address is not valid.';
      }
      Alert.alert('Sign In Error', errorMessage);
      console.error('Error signing in:', error);
    }
    setIsSubmitting(false);
  };

  return (
    <SafeAreaView className="bg-primarybg h-full">
      <ScrollView>
        <View className="w-full justify-center min-h-[85vh] px-4 my-6">
          <Image source={images.logo} className="w-[150px] h-[250px]" resizeMode="contain" style = {styles.logo} />
          <Text className="text-center text-2xl text-black mt-10 font-pbold">Login to Crown Travels</Text>

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

          <CustomButton
            title="Sign-in"
            handlePress={submit}
            containerStyles="mt-7"
            isLoading={isSubmitting}
          />

          <View className="justify-center pt-5 flex-row gap-2">
            <Text className="text-lg text-black-100 font-pregular">Don't have an account?</Text>
            <Link href="/auth/Sign-up" className="text-lg font-psemibold text-secondary">Sign Up</Link>
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
    marginLeft: 80,
    justifyContent: 'center',
  },
});
export default SignIn;
