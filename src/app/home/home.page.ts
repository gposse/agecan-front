import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MenuComponent } from '../menu/menu.component';
import { SharedDirectivesModule } from '../directives/shared-directives.module';
import { IonicModule } from '@ionic/angular';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, MenuComponent, SharedDirectivesModule],
})
export class HomePage {
  startImagePath = 'assets/images/about/home.jpg';
  
  constructor(
    private data: DataService
  ) {}
}
