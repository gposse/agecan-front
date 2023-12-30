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
import { Router } from '@angular/router';

@Component({
  selector: 'app-paquetes',
  templateUrl: './paquetes.page.html',
  styleUrls: ['./paquetes.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonButton, IonCol, IonContent, IonGrid, IonInput, IonItem, IonRow, MenuComponent]
})
export class PaquetesPage implements OnInit {
  idSesion: any;
  isReady: boolean = false;
  numSesiones: number = 0;
  numSesionesDisponibles: number = 0;
  prices: any = [];
  price1: number = 0;
  price2: number = 0;
  price3: number = 0;
  precio: number = 0;
  user: IUserDetails | undefined = undefined;

  constructor(
    private account: AccountService,
    private api: ApiService,
    public cart: CartService,
    private router: Router,
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
      this.precio += this.price1;
    }
    if (this.numSesiones > 1) {
      this.precio += this.price2;
    }
    if (this.numSesiones > 2) {
      this.precio += (this.numSesiones-2)*this.price3;
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
    this.isReady = false;
    await this.storage.create();
    this.user = await this.account.getUser() ?? undefined;
    if (this.user) {
      const r = await this.api.sessionsUser();
      if (r.length>0) {
        this.numSesionesDisponibles = r.length;
        this.idSesion = r[0].id;
      }
    }
    const pt = await this.api.prices('Sesiones');
    this.prices = pt;
    this.price1 = pt.find((price: any) => price.order === 1).price;
    this.price2 = pt.find((price: any) => price.order === 2).price;
    this.price3 = pt.find((price: any) => price.order === 3).price;
    this.isReady = true;
  }

  numeroSesiones() {
    const n = this.cart.sessions();
    if (n==1) {
      return "1 sesión";
    } else {
      return n+" sesiones";
    }
  }

  programarSesion() {
    this.router.navigate(['/agendar'], { state: { idSesion: this.idSesion } });    
  }

  sesionesDisponibles() {
    if (this.numSesionesDisponibles==1) {
      return "1 sesión disponible";
    } else {
      return this.numSesionesDisponibles+" sesiones disponibles";
    }
  }
}
