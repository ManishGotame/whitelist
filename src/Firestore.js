
// initializing firebase code

import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';

firebase.initializeApp({
  apiKey: "AIzaSyDF3MjlayVfeAC-dBPMXdYmb9r6WvS661Q",
  authDomain: "sathi-4f237.firebaseapp.com",
  projectId: "sathi-4f237",
  storageBucket: "sathi-4f237.appspot.com",
  messagingSenderId: "253073282906",
  appId: "1:253073282906:web:6f65f99cc3df0972bac563",
  measurementId: "G-QSN6Y0V0LE"
});

var db = firebase.firestore();

export default db;