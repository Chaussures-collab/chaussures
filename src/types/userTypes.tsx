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
    uid?: string;
    email?: string|null;
    how_did_hear?: string|null;
    how_did_her?: string|null; // Ancien nom pour compatibilité
    created_at?: Timestamp | { seconds: number; nanoseconds: number };
    creation_date?: Timestamp;
    last_login?: Timestamp | { seconds: number; nanoseconds: number } | Date;
    nom?: string|null;
    prenom?: string|null;
    admin?: boolean;
    role?: string;
    userDocData?: {
        uid?: string;
        email?: string|null;
        how_did_hear?: string|null;
        created_at?: Timestamp | { seconds: number; nanoseconds: number };
        last_login?: Timestamp | { seconds: number; nanoseconds: number } | Date;
        nom?: string|null;
        prenom?: string|null;
        admin?: boolean;
        role?: string;
    };
}