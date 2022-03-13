import { Injectable } from '@angular/core';
import { getFirebaseBackend } from '../../authUtils';
import { User } from '../models/auth.models';
import { CryptoUser } from '../models/user.models';

@Injectable({ providedIn: 'root' })

/**
 * Auth-service Component
 */
export class AuthenticationService {

    user!: User;
    currentUserValue: any;

    constructor() { }

    /**
     * Performs the register
     * @param email email
     * @param password password
     */
    register(email: string, password: string) {
        return getFirebaseBackend()!.registerUser(email, password).then((response: any) => {
            const user = response;
            return user;
        });
    }

    uploadUserData(uid:any, user:CryptoUser) {
        return getFirebaseBackend()!.uploadUser(uid, user).then((response:any) => {
            const res = response;
            return res;
        })
    }

    /**
     * Performs the auth
     * @param email email of user
     * @param password password of user
     */
    login(email: string, password: string) {
        return getFirebaseBackend()!.loginUser(email, password).then((response: any) => {
            const user = response;
            return user;
        });
    }

    /**
     * Returns the current user
     */
    public currentUser(): any {
        return getFirebaseBackend()!.getAuthenticatedUser();
    }

    /**
     * Logout the user
     */
    logout() {
        // logout the user
        return getFirebaseBackend()!.logout();
    }

    /**
     * Reset password
     * @param email email
     */
    resetPassword(email: string) {
        return getFirebaseBackend()!.forgetPassword(email).then((response: any) => {
            const message = response.data;
            return message;
        });
    }

}

