// app/firebase.js
import { initializeApp } from "firebase/app";
import {getAuth,initializeAuth,getReactNativePersistence} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyB_lM67-OAM7EPYUDM56mRwzxU12gxv4Hk",
  authDomain: "crowntravels-ea854.firebaseapp.com",
  projectId: "crowntravels-ea854",
  storageBucket: "crowntravels-ea854.appspot.com",
  messagingSenderId: "821298182107",
  appId: "1:821298182107:web:6323263ffd107a504f99fe",
  measurementId: "G-X4FSFKG2N7"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export { auth, db };
