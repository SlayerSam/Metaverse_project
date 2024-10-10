// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

const firebaseConfig = {
    apiKey: "AIzaSyC6PgMcfl3V1xVC9QFcy3ChKYnl_4-4VmM",
    authDomain: "metaverse-project-6d6a6.firebaseapp.com",
    projectId: "metaverse-project-6d6a6",
    storageBucket: "metaverse-project-6d6a6.appspot.com",
    messagingSenderId: "334850889677",
    appId: "1:334850889677:web:ee2bfd6ff0c597f2619684",
    measurementId: "G-MZK8C40FGY"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);