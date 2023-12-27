import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MenuComponent } from 'src/app/menu/menu.component';
import { IonButton, IonCol, IonContent, IonIcon, IonInput, IonItem, IonRow } from '@ionic/angular/standalone';
import { IUserDetails } from 'src/app/models/user/user-details';
import { LoginService } from 'src/app/services/login.service';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonButton, IonCol, IonContent, IonIcon, IonInput, IonItem, IonRow, MenuComponent],
})
export class LoginPage implements OnInit {
  user: IUserDetails = {};

  constructor(
    public loginService: LoginService,
    private storage: Storage
  ) { 
  }

  ionViewDidEnter() {
    this.loginService.initialize();
  }

  isLoggedIn(): boolean {
    return this.loginService.isLoggedIn();
  }

  async ngOnInit() {
    await this.storage.create();
    this.user = await this.loginService.getUser() ?? {};
  }

  signInWithFacebook(): void {
    this.loginService.loginViaFacebook();
  }

  signInWithGoogle(): void {
    this.loginService.loginViaGoogle();
  }

  signOut(): void {
  }
}
