import { Component } from '@angular/core';
import { IonButton, IonButtons, IonCol, IonContent, IonGrid, IonHeader, IonInput, IonItem, IonMenuButton, IonRow, IonTextarea, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { MenuComponent } from '../menu/menu.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonButton, IonCol, IonContent, IonGrid, IonHeader, IonInput, IonItem, IonRow, IonTextarea, IonTitle, IonToolbar, MenuComponent, IonButtons, IonMenuButton],
})
export class HomePage {
  constructor() {}
}
