import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyA7YdB5bKmQp4nFTFqlcW2mvFk3Se1MZ2U",
  authDomain: "pokedex-abhi1.firebaseapp.com",
  databaseURL: "https://pokedex-abhi1-default-rtdb.firebaseio.com",
  projectId: "pokedex-abhi1",
  storageBucket: "pokedex-abhi1.firebasestorage.app",
  messagingSenderId: "86763938546",
  appId: "1:86763938546:web:b246a73a4d6659ffd0666b"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
