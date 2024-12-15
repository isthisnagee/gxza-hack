import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCP68zK9YU-_XXg_PGe8ndqgZzLpHcjhKk",
  authDomain: "gxza-inventory.firebaseapp.com",
  projectId: "gxza-inventory",
  storageBucket: "gxza-inventory.firebasestorage.app",
  messagingSenderId: "18903933279",
  appId: "1:18903933279:web:62c0c4c3850527fca0d6ea"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app); 
