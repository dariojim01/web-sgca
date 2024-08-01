import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyDFxQX-yhUadVsvS-_3-XMab2bpfRaEh-0",
    authDomain: "demopp-fb74e.firebaseapp.com",
    projectId: "demopp-fb74e",
    storageBucket: "demopp-fb74e.appspot.com",
    messagingSenderId: "1040934591839",
    appId: "1:1040934591839:web:092c066f64b81a42ad2aea",
    measurementId: "G-RDZWLWT240"
  };

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);