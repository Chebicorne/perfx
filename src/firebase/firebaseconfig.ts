import "firebase/auth";
import "firebase/firestore";

import { initializeApp } from "firebase/app";
import {
  initializeAuth,
  getReactNativePersistence,
  signOut,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyADpUFKsOyHypkMdtl6k2Cd3EFQHB6pelc",
  authDomain: "perfx-97485.firebaseapp.com",
  projectId: "perfx-97485",
  storageBucket: "perfx-97485.appspot.com",
  messagingSenderId: "503835541535",
  appId: "1:503835541535:web:d7d66a5c55842ca372552a",
  measurementId: "G-RCNMQCZDG8",
};
const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

export const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Erreur lors de la déconnexion :", error);
  }
};

export const db = getFirestore(app);

