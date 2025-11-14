import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyD7nGTNdGrKno8FPGJCQhTzz5dsol39zjw",
  authDomain: "movierecomendation-ba370.firebaseapp.com",
  projectId: "movierecomendation-ba370",
  storageBucket: "movierecomendation-ba370.firebasestorage.app",
  messagingSenderId: "1062933075393",
  appId: "1:1062933075393:web:775543a24b08d155650b40",
  measurementId: "G-D75VZ7F8JY",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

export default app;
