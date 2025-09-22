// src/lib/firebase.ts
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  "projectId": "studio-603038115-2bb43",
  "appId": "1:1040170185939:web:52bc0b3b39e402617c5026",
  "apiKey": "AIzaSyD4V5zfNnBB9l4onuEcRM7UJ5Q0bCPIhho",
  "authDomain": "studio-603038115-2bb43.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "1040170185939"
};


// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export { db };
