import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MenuComponent } from '../menu/menu.component';
import { IonButton, IonCol, IonContent, IonGrid, IonItem, IonLabel, IonList, IonRow } from '@ionic/angular/standalone';
import { CartService } from '../services/cart.service';
import { ApiService } from '../services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.page.html',
  styleUrls: ['./carrito.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonButton, IonContent, IonCol, IonGrid, IonItem, IonLabel, IonList, IonRow, MenuComponent]
})
export class CarritoPage implements OnInit {
  fileUpload: any;

  constructor(
    private api: ApiService,
    public cart: CartService,
    private router: Router
  ) { }

  async checkout() {
    try {
      const fileInput = document.getElementById('fileUpload') as HTMLInputElement;
      if (fileInput.files && fileInput.files.length > 0) {
        const file = fileInput.files[0];
        const reader = new FileReader();
        reader.onloadend = () => async () => {
          const fileData = reader.result as string;
          const base64Data = btoa(fileData);
          const data = {
            cart: this.cart.items,
            fileData: base64Data
          };
          const r = await this.api.buy(data);
          this.cart.clean();
          this.router.navigate(['/paquetes']);
        };
        reader.readAsDataURL(file);
      } else {
        const data = {
          cart: this.cart.items,
        }
        const r = await this.api.buy(data);      
        this.cart.clean();
        this.router.navigate(['/paquetes']);
      }
    } catch (err) {
      console.log(err);
    }
  }

  async ngOnInit() {
    await this.cart.init();
  }

  async removeFromCart(index:number) {
    await this.cart.removeFromCart(index);
  }
}
