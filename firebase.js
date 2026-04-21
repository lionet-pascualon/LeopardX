import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDA4oxTvYgrv7NKdhreFq_0eJFQ8EKlCUA",
  authDomain: "leopardx.firebaseapp.com",
  projectId: "leopardx",
  storageBucket: "leopardx.firebasestorage.app",
  messagingSenderId: "20322051861",
  appId: "1:20322051861:web:3764871bfc4b7f30b96b1c"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
