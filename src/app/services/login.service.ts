import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { FacebookLogin } from '@capacitor-community/facebook-login';
import { GoogleAuth } from "@codetrix-studio/capacitor-google-auth";
import { Platform } from "@ionic/angular";
import { initializeApp } from "firebase/app";
import { FacebookAuthProvider, GoogleAuthProvider, getAuth, signInWithCredential } from "firebase/auth";
import { AppPagePath, AppStorageKey } from "src/app/models/enums/app-constant";
import { AccountService } from "./account.service";
import { LocalStorageService } from "./local-storage.service";
import { environment } from "src/environments/environment";

@Injectable({
    providedIn: 'root'
})
export class LoginService {
    isWeb = false;
    firebase: any;
    constructor(
        private userService: AccountService,
        private localStorageService: LocalStorageService,
        private platform: Platform,
        private router: Router) {
        this.isWeb = !(this.platform.is('android') || this.platform.is('ios'));
        this.firebase = initializeApp(environment.firebase);
    }

    public async getUser() {
        return await this.userService.getUser();
    }

    isLoggedIn(): boolean {
        return this.userService.isLoggedIn();
    }

    async logout() {
        await getAuth(this.firebase).signOut();
        if (this.userService.loginType === 'facebook') {
            await FacebookLogin.logout().then(() => console.log('Logged out')).catch((e) => { console.log('Logged out') });
        }
        if (this.userService.loginType === 'google') {
            await GoogleAuth.signOut().then(() => console.log('Signed Out')).catch((e) => { console.log('Signed Out') });
        }
        this.userService.logout().then(async () => {
            this.router.navigateByUrl('/login');
        });
    }

    initialize() {
        if (this.isWeb) {
            GoogleAuth.initialize({ 
                clientId: environment.google.clientId,
                grantOfflineAccess: true
            });

        }
    }

    async loginViaFacebook() {
        try {
            const FACEBOOK_PERMISSIONS = ['email'];
            const result = await FacebookLogin.login({ permissions: FACEBOOK_PERMISSIONS });
            if (result.accessToken) {
                const credential = FacebookAuthProvider.credential(result.accessToken.token);
                signInWithCredential(getAuth(this.firebase), credential)
                    .then(async (s) => {
                        const access_token = await s.user.getIdToken();
                        await this.localStorageService.set(AppStorageKey.AccessToken, access_token);
                        this.userService.login({ name: result.accessToken?.userId, email: result.accessToken?.userId, imageUrl: result.accessToken?.userId },'facebook');
                        this.router.navigateByUrl(AppPagePath.Home);
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            }
        } catch (error) {
            console.log(error);
        }
    }

    async loginViaGoogle() {
        try {
            const user = await GoogleAuth.signIn();
            if (user) {
                // Sign in with credential from the Google user.
                signInWithCredential(getAuth(this.firebase), GoogleAuthProvider.credential(user.authentication.idToken))
                    .then(async (s) => {
                        const access_token = await s.user.getIdToken();
                        await this.localStorageService.set(AppStorageKey.AccessToken, access_token);
                        this.userService.login({ name: user.givenName, email: user.email, imageUrl: user.imageUrl },'google');
                        this.router.navigate([AppPagePath.Home], { replaceUrl: true });
                    })
                    .catch((error) => {
                        console.log(error);
                    });

            }
        } catch (error) {
            console.log(error);
        }
    }
}
