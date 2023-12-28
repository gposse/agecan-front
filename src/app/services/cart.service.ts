import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  items: any[] = [];

  constructor(
    private storage: Storage
  ) { }

  addProduct(product: any) {
    this.items.push(product);
    this.storage.set('carrito', this.items);
  }

  itemCount() {
    return this.items.length;
  }

  async init() {
    this.storage.create();
    const carrito = await this.storage.get('carrito');
    if (carrito) {
      this.items = carrito;
    }
  }

  async removeFromCart(index: number) {
    this.items.splice(index, 1);
    await this.storage.set('carrito', this.items);
  }

  sessions() {
    let s = 0;
    this.items.forEach(item => {
      if (item.type=='Sesiones')
        s += item.quantity;
    });
    return s;
  }

  total() {
    let total = 0;
    this.items.forEach(item => {
      total += item.price;
    });
    return total;
  }
}
