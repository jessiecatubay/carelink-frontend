import {
    GoogleSignin,
    statusCodes,
} from "@react-native-google-signin/google-signin";

import {
    GoogleAuthProvider,
    signInWithCredential,
} from "firebase/auth";

import { auth } from "@/config/firebase";

GoogleSignin.configure({
    webClientId:
        "567616666250-0sr7cgva9st10lvktd03iv29kkbdk3e2.apps.googleusercontent.com",
    scopes: ["profile", "email"],
});

export const signInWithGoogle = async () => {
    try {
        await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

        // Clear any previous sign-in session so Google account picker allows choosing any account
        try {
            await GoogleSignin.signOut();
        } catch {
            // Ignore if no active session
        }

        const response = await GoogleSignin.signIn();

        if (response.type !== "success" || !response.data) {
            throw new Error("Google Sign-In was cancelled.");
        }

        const idToken = response.data.idToken || (response as any).idToken;

        if (!idToken) {
            throw new Error("Google Sign-In did not return an ID token.");
        }

        // Convert the Google ID token into a Firebase credential
        const googleCredential = GoogleAuthProvider.credential(idToken);

        // Sign in to Firebase
        const userCredential = await signInWithCredential(
            auth,
            googleCredential
        );

        // Get the Firebase ID token
        const firebaseIdToken = await userCredential.user.getIdToken();

        return {
            firebaseIdToken,
            user: userCredential.user,
        };
    } catch (error: any) {
        if (error.code === statusCodes.SIGN_IN_CANCELLED) {
            throw new Error("Google Sign-In was cancelled.");
        }

        if (error.code === statusCodes.IN_PROGRESS) {
            throw new Error("Google Sign-In is already in progress.");
        }

        if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
            throw new Error("Google Play Services is not available.");
        }

        throw error;
    }
};

export const signOutFromGoogle = async () => {
    try {
        await GoogleSignin.signOut();
    } catch {
        // Ignore errors during Google sign-out if not signed in
    }
};