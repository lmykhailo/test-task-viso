import React, { createContext } from "react";
import ReactDOM from "react-dom/client";

import App from "./App";

import { FirebaseApp, initializeApp } from "firebase/app";
import { Firestore, getFirestore } from "@firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAY4zyzgcQ-jFknyYgVjy2Ovprel7N389M",
  authDomain: "visotesttask-e4979.firebaseapp.com",
  projectId: "visotesttask-e4979",
  storageBucket: "visotesttask-e4979.appspot.com",
  messagingSenderId: "23001544473",
  appId: "1:23001544473:web:64971c2675a1e86488f788",
};

const app = initializeApp(firebaseConfig);

type ContextType = {
  firebase: FirebaseApp;
  firestore: Firestore;
};

export const Context = createContext<ContextType | null>(null);

export const firestore = getFirestore();

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <Context.Provider value={{ firebase: app, firestore }}>
    <App />
  </Context.Provider>
);
