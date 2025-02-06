import { Timestamp } from "firebase/firestore";

export interface UserInterface{
    uid: string;
    email: string|null;
    nom: string|null;
    prenom: string|null;
    emailVerified: boolean;
    phoneNumber: string|null;
    photoURL: string|null;
    userDocument?: UserDocument;
}
export interface UserInterfaces{
    uid: string;
    email: string|null;
    displayName: string|null;
    emailVerified: boolean;
    phoneNumber: string|null;
    photoURL: string|null;
    userDocument?: UserDocument;
}
export interface UserDocument{
    uid: string;
    email: string|null;
    how_did_her: string|null;
    creation_date: Timestamp;
}