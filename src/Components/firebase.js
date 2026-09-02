import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB6uMlx2FvQOnjhRANRD0jllQmksIuGl_o",
  authDomain: "amour-estilo.firebaseapp.com",
  projectId: "amour-estilo",
  storageBucket: "amour-estilo.firebasestorage.app",
  messagingSenderId: "253903451302",
  appId: "1:253903451302:web:05e14e8c6a0763176a3067",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);