/** @format */

import { auth } from "@/config/firebase-config";
import { getFirebaseError } from "@/utils/getFirebaseError";
import { FirebaseError } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut
} from "firebase/auth";

export const firebaseCreateUser = async (email: string, password: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    /* const user = userCredential.user; */
    return { data: userCredential.user };
  } catch (error) {
    const firebaseError = error as FirebaseError;
    const errorCode = firebaseError.code;
    const errorMessage = getFirebaseError("createUserWithEmailAndPassword", firebaseError.code)
    return {
      error: {
        code: errorCode,
        message: errorMessage
      }
    };
  }
};
export const firebaseLoginUser = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    /* const user = userCredential.user; */
    return { data: userCredential.user };
  } catch (error) {
    const firebaseError = error as FirebaseError;
    const errorCode = firebaseError.code;
    const errorMessage = getFirebaseError("signInWithEmailAndPassword", firebaseError.code)
    return {
      error: {
        code: errorCode,
        message: errorMessage
      }
    };
  }
};
export const firebaseLogOutUser = async () => {
  try {
    await signOut(auth);
    /* const user = userCredential.user; */
    return {data: true}
  } catch (error) {
    const firebaseError = error as FirebaseError;
    const errorCode = firebaseError.code;
    const errorMessage = getFirebaseError("signOut", firebaseError.code)
    return {
      error: {
        code: errorCode,
        message: errorMessage
      }
    };
  }
};
export const firebaseResetPasswordUser = async (email: string) => {
  try {
    await sendPasswordResetEmail(auth, email);
    /* const user = userCredential.user; */
    return { data: true };
  } catch (error) {
    const firebaseError = error as FirebaseError;
    const errorCode = firebaseError.code;
    const errorMessage = getFirebaseError("sendPasswordResetEmail", firebaseError.code)
    return {
      error: {
        code: errorCode,
        message: errorMessage
      }
    };
  }
};

export const firebaseEmailVerification = async () => {
  if (auth.currentUser) {
    try {
      await sendEmailVerification(auth.currentUser);
      /* const user = userCredential.user; */
      return { data: true };
    } catch (error) {
      const firebaseError = error as FirebaseError;
      const errorCode = firebaseError.code;
      const errorMessage = getFirebaseError("sendEmailVerification", firebaseError.code)
      return {
        error: {
          code: errorCode,
          message: errorMessage
        }
      };
    }
  } 
};
