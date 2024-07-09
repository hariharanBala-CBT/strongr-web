import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyA_uPDjOn8zPSut8y3PFf0gTNReujiD550",
  authDomain: "otplogin-strongr.firebaseapp.com",
  projectId: "otplogin-strongr",
  storageBucket: "otplogin-strongr.appspot.com",
  messagingSenderId: "227254545894",
  appId: "1:227254545894:web:fadb9fd186868cb8c03a27",
  measurementId: "G-R2Q8TBJKYE"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);