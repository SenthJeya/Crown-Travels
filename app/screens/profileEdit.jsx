import { View, Text, StyleSheet, TouchableOpacity, Alert,Image } from 'react-native';
import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import FormField from '../../components/FormField';
import ScreenHeader from '../../components/screenHeader';

const EditProfile = () => {
  const [form, setForm] = useState({
    username: '',
    contactNumber: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setForm({
            username: data.username,
            contactNumber: data.contactnumber
          });
          setLoading(false);
        }
      }
    };

    fetchUserData();
  }, []);

  const handleSave = async () => {
    const user = auth.currentUser;
    if (user) {
      const docRef = doc(db, 'users', user.uid);
      await updateDoc(docRef, {
        username: form.username,
        contactnumber: form.contactNumber,
      });
      Alert.alert('Success', 'Profile updated successfully.');
      router.replace('/tabs/profile');
    }
  };
  
  return (
    <View style={styles.container}>
      <ScreenHeader title="Edit Profile" path="/tabs/profile"/>     
      <View style={styles.innerContainer}>
        <FormField
          title="Username"
          value={form.username}
          handleChangeText={(e) => setForm({ ...form, username: e })}
          otherStyles="mt-10"
        />
      
        <FormField
          title="Contact Number"
          value={form.contactNumber}
          handleChangeText={(e) => setForm({ ...form, contactNumber: e })}
          otherStyles="mt-7"
          keyboardType="phone-pad"
        />

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save Changes</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E6E6FA',
  },
  innerContainer:{
    padding: 10,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    marginBottom: 16,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  saveButton: {
    backgroundColor: '#662483',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 40,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
  },
});

export default EditProfile;
