import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
export const firebaseConfig = {
  apiKey: "AIzaSyAyKn9H8P0Ca4-f8mLfAWtw-nnC4rTopp4",
  authDomain: "webmotores-b8b16.firebaseapp.com",
  projectId: "webmotores-b8b16",
  storageBucket: "webmotores-b8b16.appspot.com",
  messagingSenderId: "688584806714",
  appId: "1:688584806714:web:801dfd9b9a833c9efec003"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)

export default app