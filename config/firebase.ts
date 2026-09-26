import { initializeApp, getApps, getApp } from "firebase/app";
import { initializeAuth, getAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
    apiKey: "AIzaSyAYafn26HYTFm43GaeFi8bl0D-DuYJx9KM",
    authDomain: "carelink-a25f5.firebaseapp.com",
    projectId: "carelink-a25f5",
    storageBucket: "carelink-a25f5.firebasestorage.app",
    messagingSenderId: "567616666250",
    appId: "1:567616666250:web:8cd87b2660b2cd9e17cb73",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const auth = (() => {
    try {
        return initializeAuth(app, {
            persistence: getReactNativePersistence(ReactNativeAsyncStorage),
        });
    } catch {
        return getAuth(app);
    }
})();

export default app;