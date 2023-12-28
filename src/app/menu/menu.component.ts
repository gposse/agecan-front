import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonItem, IonList, IonMenu, IonMenuButton, IonMenuToggle, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { MenuController } from '@ionic/angular';
import { AccountService } from '../services/account.service';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  standalone: true,
  imports: [ CommonModule, IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonItem, IonList, IonMenu, IonMenuButton, IonMenuToggle, IonTitle, IonToolbar ]
})
export class MenuComponent  implements OnInit {
  constructor(
    private account: AccountService,
    private cart: CartService,
    public menuCtrl: MenuController
  ) { }

  isLoggedIn() {
    return this.account.isLoggedIn();
  }

  itemCount() {
    return this.cart.itemCount();
  }

  async logout() {
    await this.account.logout();
    this.menuCtrl.close();
  }

  async ngOnInit() {
    await this.cart.init();
  }
}
