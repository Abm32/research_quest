import { initializeApp } from 'firebase/app';
import { getAuth, browserLocalPersistence, setPersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration (Use environment variables for security)
const firebaseConfig = {
  apiKey: "AIzaSyA7YdB5bKmQp4nFTFqlcW2mvFk3Se1MZ2U",
  authDomain: "pokedex-abhi1.firebaseapp.com",
  databaseURL: "https://pokedex-abhi1-default-rtdb.firebaseio.com",
  projectId: "pokedex-abhi1",
  storageBucket: "pokedex-abhi1.appspot.com",
  messagingSenderId: "86763938546",
  appId: "1:86763938546:web:b246a73a4d6659ffd0666b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// ✅ Set persistence correctly
setPersistence(auth, browserLocalPersistence)
  .then(() => console.log("Auth persistence set to local"))
  .catch((error) => console.error("Error setting auth persistence:", error));
