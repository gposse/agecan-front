import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { IonButton, IonButtons, IonItem, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  standalone: true,
  imports: [ CommonModule, IonButton, IonButtons, IonItem, IonTitle, IonToolbar ]
})
export class MenuComponent  implements OnInit {

  constructor(
    public menuCtrl: MenuController
  ) { }

  ngOnInit() {}

}
