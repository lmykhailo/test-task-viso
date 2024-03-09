import React, { createContext } from "react";
import ReactDOM from "react-dom/client";

import App from "./App";

import { FirebaseApp, initializeApp } from "firebase/app";
import { Firestore, getFirestore } from "@firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCnuUR5uArKefRn4zDFz5i9MWWS5kN_Fx8",
  authDomain: "visotesttask.firebaseapp.com",
  projectId: "visotesttask",
  storageBucket: "visotesttask.appspot.com",
  messagingSenderId: "196403105160",
  appId: "1:196403105160:web:0b8bf35ebe06343bd8fe3d",
};

const app = initializeApp(firebaseConfig);

type ContextType = {
  firebase: FirebaseApp;
  firestore: Firestore;
};

export const Context = createContext<ContextType | null>(null);

const firestore = getFirestore();

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <Context.Provider value={{ firebase: app, firestore }}>
    <App />
  </Context.Provider>
);
