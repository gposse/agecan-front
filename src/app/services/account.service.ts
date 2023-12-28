import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { AppEvent, AppStorageKey } from 'src/app/models/enums/app-constant';
import { IUserDetails } from 'src/app/models/user/user-details';
import { LocalNotificationService } from './local-notification.service';
import { LocalStorageService } from './local-storage.service';
import { jwtDecode } from "jwt-decode";
import { User, getAuth, onAuthStateChanged } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AccountService {
    favorites: string[] = [];
    firebase: any;
    public loginType: string = '';
    public token: string = '';

    constructor(
        public storage: Storage, 
        private localStorageService: LocalStorageService,
        private localNotificationService: LocalNotificationService
    ) { 
        this.firebase = initializeApp(environment.firebase);
    }

    addFavorite(sessionName: string): void {
        this.favorites.push(sessionName);
    }

    hasFavorite(sessionName: string): boolean {
        return (this.favorites.indexOf(sessionName) > -1);
    }

    removeFavorite(sessionName: string): void {
        const index = this.favorites.indexOf(sessionName);
        if (index > -1) {
            this.favorites.splice(index, 1);
        }
    }

    async login(user: IUserDetails,service:any): Promise<any> {
        this.loginType = service;
        user.source = service;
        await this.storage.set(AppStorageKey.CurrentUser, user);
        return window.dispatchEvent(new CustomEvent(AppEvent.Login, { detail: user }));
    }

    async logout(): Promise<any> {
        this.loginType = '';
        await this.storage.remove(AppStorageKey.CurrentUser);
        await this.localNotificationService.send('😄', 'Thank you for using the APP!');
        window.dispatchEvent(new CustomEvent(AppEvent.Logout));
    }

    getToken(): string {
        return this.token;
    }

    isTokenExpired(token: string): boolean {
        try {
            const decodedToken = jwtDecode(token);
            if (decodedToken && typeof decodedToken === 'object' && decodedToken.exp) {
                const expirationDate = new Date(decodedToken.exp * 1000);
                const currentDate = new Date();
                return expirationDate < currentDate;
            }
        } catch (error) {
            console.error('Error decoding token:', error);
        }
        return true;
    }

    async getUser(): Promise<IUserDetails | undefined> {
        if (!this.localStorageService.started) 
            await this.localStorageService.init();
        let token = await this.localStorageService.get(AppStorageKey.AccessToken);
        if (token && this.isTokenExpired(token)) {
            await this.refreshToken();
            token = await this.localStorageService.get(AppStorageKey.AccessToken);
        }
        if (!token) {
            this.loginType = '';
            this.token = '';
            return undefined; 
        }
        this.token = token;
        const user = await this.storage.get(AppStorageKey.CurrentUser);
        if (!user) { 
            this.loginType = '';
            this.token = '';
            return undefined; 
        }
        this.loginType = user.source;
        return { name: user.name, email: user.email, imageUrl: user.imageUrl };
    }

    isLoggedIn(): boolean {
        return this.loginType !== '';
    }

    public async refreshToken() {
        const auth = getAuth(this.firebase);
        onAuthStateChanged(auth, async (currenUser: User | null) => {
            if (currenUser) {
                const idToken = await currenUser.getIdToken(true);
                await this.localStorageService.set(AppStorageKey.AccessToken, idToken);
            } else {
                await this.logout();
            }
        });
    }
}