import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "API_KEY",
  authDomain: "gxza-inventory.firebaseapp.com",
  projectId: "gxza-inventory",
  storageBucket: "gxza-inventory.firebasestorage.app",
  messagingSenderId: "SENDER_ID",
  appId: "APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app); 
