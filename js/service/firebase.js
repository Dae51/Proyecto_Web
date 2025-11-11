
  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js";
  import { getFirestore } from 'https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js'; 
  

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyB1TEOKBiBqaTKGlwEbVIXhtJov7NhadIc",
    authDomain: "proyectoweb-53df0.firebaseapp.com",
    projectId: "proyectoweb-53df0",
    storageBucket: "proyectoweb-53df0.firebasestorage.app",
    messagingSenderId: "814991189603",
    appId: "1:814991189603:web:7ae16ebe83dc0373c97a56",
    measurementId: "G-36RQN39TW9"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  export { db };