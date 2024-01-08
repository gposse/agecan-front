import { AppPagePath } from "src/app/models/enums/app-constant";
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MenuComponent } from 'src/app/menu/menu.component';
import { IonButton, IonCol, IonContent, IonIcon, IonInput, IonItem, IonRow } from '@ionic/angular/standalone';
import { IUserDetails } from 'src/app/models/user/user-details';
import { LoginService } from 'src/app/services/login.service';
import { Storage } from '@ionic/storage-angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonButton, IonCol, IonContent, IonIcon, IonInput, IonItem, IonRow, MenuComponent],
})
export class LoginPage implements OnInit {
  email: string = '';
  error: any = null;
  password: string = '';
  user: IUserDetails = {};

  constructor(
    public loginService: LoginService,
    private router: Router,
    private storage: Storage
  ) { 
  }

  isLoggedIn(): boolean {
    return this.loginService.isLoggedIn();
  }

  async ngOnInit() {
    //this.loginService.initialize();
    await this.storage.create();
    this.user = await this.loginService.getUser() ?? {};
  }

  async onSubmit() {
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      this.error = "Email inválido";
      return;
    }

    try {
      await this.loginService.loginViaEmail(this.email, this.password);
      this.router.navigateByUrl(AppPagePath.Home);
    } catch (err) {
      this.error = "Error al iniciar sesión. El email o la contraseña son incorrectos.";
    }
  }

  register() {
    this.router.navigate(['/registro'], { replaceUrl: true });
  }

  signInWithFacebook(): void {
    this.loginService.loginViaFacebook();
  }

  async signInWithGoogle() {
    await this.loginService.loginViaGoogle();
  }

  signOut(): void {
  }
}
