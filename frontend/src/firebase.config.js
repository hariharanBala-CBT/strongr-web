
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA_uPDjOn8zPSut8y3PFf0gTNReujiD550",
  authDomain: "otplogin-strongr.firebaseapp.com",
  projectId: "otplogin-strongr",
  storageBucket: "otplogin-strongr.appspot.com",
  messagingSenderId: "227254545894",
  appId: "1:227254545894:web:fadb9fd186868cb8c03a27",
  measurementId: "G-R2Q8TBJKYE",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };