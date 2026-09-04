// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics, isSupported as analyticsIsSupported } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB6uMlx2FvQOnjhRANRD0jllQmksIuGl_o",
  authDomain: "amour-estilo.firebaseapp.com",
  projectId: "amour-estilo",
  storageBucket: "amour-estilo.firebasestorage.app",
  messagingSenderId: "253903451302",
  appId: "1:253903451302:web:05e14c8e6a0763176a3067",
  measurementId: "G-P5CHDD4WSZ",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firestore — this is what AmourAppointmentBooking.jsx imports as `db`
export const db = getFirestore(app);

// Analytics only works in a browser context (not SSR) and only if supported,
// so we guard it to avoid build/runtime errors.
export let analytics = null;
if (typeof window !== "undefined") {
  analyticsIsSupported().then((supported) => {
    if (supported) analytics = getAnalytics(app);
  });
}

export default app;
