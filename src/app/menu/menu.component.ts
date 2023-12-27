import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { IonButton, IonButtons, IonContent, IonHeader, IonItem, IonList, IonMenu, IonMenuButton, IonMenuToggle, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { MenuController } from '@ionic/angular';
import { AccountService } from '../services/account.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  standalone: true,
  imports: [ CommonModule, IonButton, IonButtons, IonContent, IonHeader, IonItem, IonList, IonMenu, IonMenuButton, IonMenuToggle, IonTitle, IonToolbar ]
})
export class MenuComponent  implements OnInit {

  constructor(
    private account: AccountService,
    public menuCtrl: MenuController
  ) { }

  isLoggedIn() {
    return this.account.isLoggedIn();
  }

  async logout() {
    await this.account.logout();
    this.menuCtrl.close();
  }

  ngOnInit() {}

}
