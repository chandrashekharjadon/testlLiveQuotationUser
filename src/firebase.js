import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyA13-72gNmZoR9Yka3D45XJZkHqOqYYv80",
  authDomain: "quotation-web-2aa02.firebaseapp.com",
  projectId: "quotation-web-2aa02",
  storageBucket: "quotation-web-2aa02.firebasestorage.app",
  messagingSenderId: "717258944112",
  appId: "1:717258944112:web:2f2351efe4760ab0f98eb5",
  measurementId: "G-JNX8MEDRQG",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export default app;