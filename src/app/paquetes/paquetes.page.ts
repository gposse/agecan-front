import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MenuComponent } from '../menu/menu.component';
import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCol, IonContent, IonGrid, IonInput, IonItem, IonRow } from '@ionic/angular/standalone';
import { AccountService } from '../services/account.service';
import { IUserDetails } from '../models/user/user-details';
import { Storage } from '@ionic/storage-angular';
import { ApiService } from '../services/api.service';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-paquetes',
  templateUrl: './paquetes.page.html',
  styleUrls: ['./paquetes.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonButton, IonCol, IonContent, IonGrid, IonInput, IonItem, IonRow, MenuComponent]
})
export class PaquetesPage implements OnInit {
  numSesiones: number = 0;
  packageTypes: any = [];
  packagesUser: any = [];
  precio: number = 0;
  user: IUserDetails | undefined = undefined;

  constructor(
    private account: AccountService,
    private api: ApiService,
    public cart: CartService,
    private storage: Storage
  ) { }

  agregarACarrito() {
    if (this.numSesiones<1) return;
    
    this.cart.addProduct({
      type: 'Sesiones',
      quantity: this.numSesiones,
      price: this.precio
    });
  }

  calcularPrecio() {
    if (this.numSesiones < 0) this.numSesiones = 0;
    if (this.numSesiones > 10) this.numSesiones = 10;
    this.precio = 0;
    if (this.numSesiones > 0) {
      this.precio += 210000;
    }
    if (this.numSesiones > 1) {
      this.precio += 180000;
    }
    if (this.numSesiones > 2) {
      this.precio += (this.numSesiones-2)*170000;
    }
  }

  goTo(url: string) {
  }

  isLoggedIn() {
    return this.account.isLoggedIn();
  }

  formatoPrecio(precio: number) {
    return '$'+precio.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  }

  async ngOnInit() {
    await this.storage.create();
    this.user = await this.account.getUser() ?? undefined;
    if (this.user) {
      const r = await this.api.packagesUser();
    }
    const pt = await this.api.packageTypes();
    this.packageTypes = pt.types;
  }

}
