import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyA7Gt_CQSk4mdZJjmRZ3u5Oue5dIkUNwQk",
  authDomain: "amptee-football-gambia.firebaseapp.com",
  projectId: "amptee-football-gambia",
  storageBucket: "amptee-football-gambia.appspot.com",
  messagingSenderId: "845373043124",
  appId: "1:845373043124:web:fe702529d5ce8f0a5142e1"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
