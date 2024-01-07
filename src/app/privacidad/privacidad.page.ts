import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MenuComponent } from '../menu/menu.component';
import { IonContent } from '@ionic/angular/standalone';

@Component({
  selector: 'app-privacidad',
  templateUrl: './privacidad.page.html',
  styleUrls: ['./privacidad.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonContent, MenuComponent]
})
export class PrivacidadPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
