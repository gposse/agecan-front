import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { IonContent } from '@ionic/angular/standalone';
import { MenuComponent } from '../menu/menu.component';

@Component({
  selector: 'app-terminos',
  templateUrl: './terminos.page.html',
  styleUrls: ['./terminos.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonContent, MenuComponent]
})
export class TerminosPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
