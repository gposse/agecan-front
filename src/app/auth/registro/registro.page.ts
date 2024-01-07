import { AppPagePath } from "src/app/models/enums/app-constant";
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonButton, IonCol, IonContent, IonGrid, IonInput, IonItem, IonRow } from '@ionic/angular/standalone';
import { MenuComponent } from 'src/app/menu/menu.component';
import { LoginService } from 'src/app/services/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonButton, IonCol, IonContent, IonGrid, IonInput, IonItem, IonRow, MenuComponent]
})
export class RegistroPage implements OnInit {
  apellido: string = '';
  contrasena: string = '';
  email: string = '';
  error: any = null;
  nombre: string = '';
  telefono: string = '';

  constructor(
    private loginService: LoginService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  async onSubmit() {
    // Assign captured data to variables
    const emailValue = this.email;
    const nombreValue = this.nombre;
    const apellidoValue = this.apellido;
    const telefonoValue = this.telefono;
    const contrasenaValue = this.contrasena;

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailValue)) {
      this.error = "Email inválido";
      return;
    }

    // Validate password format
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
    if (!passwordRegex.test(contrasenaValue)) {
      this.error = "Contraseña inválida. Debe contener al menos 6 caracteres, incluyendo letras y números.";
      return;
    }

    try {
      await this.loginService.registerWithEmail(emailValue, contrasenaValue,nombreValue,apellidoValue);
      this.router.navigate([AppPagePath.Home], { replaceUrl: true });
    } catch (err) {
      this.error = "Error al registrar el usuario. El email ya debe estar registrado.";
    }
  }
}
