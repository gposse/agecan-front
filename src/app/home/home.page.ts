import { Component, OnInit } from '@angular/core';
import { IonButton, IonButtons, IonCol, IonContent, IonGrid, IonHeader, IonInput, IonItem, IonMenuButton, IonRow, IonTextarea, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { MenuComponent } from '../menu/menu.component';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonButton, IonCol, IonContent, IonGrid, IonHeader, IonInput, IonItem, IonRow, IonTextarea, IonTitle, IonToolbar, MenuComponent, IonButtons, IonMenuButton],
})
export class HomePage implements OnInit {
  constructor() {}

  enviar() {
    const nameInput = document.querySelector('ion-input[name="name"]') as HTMLIonInputElement;
    const emailInput = document.querySelector('ion-input[name="email"]') as HTMLIonInputElement;
    const titleInput = document.querySelector('ion-input[name="title"]') as HTMLIonInputElement;
    const messageInput = document.querySelector('ion-textarea[name="message"]') as HTMLIonTextareaElement

    const name = nameInput.value;
    const email:any = emailInput.value;
    const title = titleInput.value;
    const message = messageInput.value;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (name && email && title && message && emailRegex.test(email)) {
    } else {
      alert('Por favor complete todos los datos o ingrese un correo electrónico válido');
    }
  }

  ngOnInit() {
    console.log(environment.production,environment.apiUrl);
  }

}
