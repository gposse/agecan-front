import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { AppEvent, AppStorageKey } from 'src/app/models/enums/app-constant';
import { IUserDetails } from 'src/app/models/user/user-details';
import { LocalNotificationService } from './local-notification.service';
import { LocalStorageService } from './local-storage.service';

@Injectable({
    providedIn: 'root'
})
export class AccountService {
    favorites: string[] = [];
    public loginService: string = '';
    public token: string = '';

    constructor(
        public storage: Storage, 
        private localStorageService: LocalStorageService,
        private localNotificationService: LocalNotificationService
    ) { }

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
        this.loginService = service;
        user.source = service;
        await this.storage.set(AppStorageKey.CurrentUser, user);
        return window.dispatchEvent(new CustomEvent(AppEvent.Login, { detail: user }));
    }

    async logout(): Promise<any> {
        this.loginService = '';
        await this.storage.remove(AppStorageKey.CurrentUser);
        await this.localNotificationService.send('😄', 'Thank you for using the APP!');
        window.dispatchEvent(new CustomEvent(AppEvent.Logout));
    }

    getToken(): string {
        return this.token;
    }

    async getUser(): Promise<IUserDetails | undefined> {
        const user = await this.storage.get(AppStorageKey.CurrentUser);
        if (!user) { 
            this.loginService = '';
            this.token = '';
            return undefined; 
        }
        this.token = await this.localStorageService.get(AppStorageKey.AccessToken);
        this.loginService = user.source;
        return { name: user.name, email: user.email, imageUrl: user.imageUrl };
    }

    isLoggedIn(): boolean {
        return this.loginService !== '';
    }
}