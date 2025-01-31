import errors from '@/config/locales/errors.json';
type FirebaseErrorType = {
    [key: string]: string;
}
type FirebaseErrors = {
    [key: string]: FirebaseErrorType;
}

const firebaseErrors: FirebaseErrors = {
    ...errors,
    an_unknown_error_has_occurred:{
        an_unknown_error_has_occurred: errors.an_unknown_error_has_occurred
    }
}
export function getFirebaseError(method: string, errorCode: string): string {
    const defaulErrorMessage = errors.an_unknown_error_has_occurred;

    if (!firebaseErrors[method] ) {
        return defaulErrorMessage;
    }

    if (!firebaseErrors[method][errorCode]) {
        return defaulErrorMessage;
    }
    const errorMessage = firebaseErrors[method][errorCode];
    
    return errorMessage  
}