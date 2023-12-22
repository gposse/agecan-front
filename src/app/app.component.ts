import { Component } from '@angular/core';
import { DataService } from './services/data.service';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {
  constructor(
    private data: DataService
  ) {    
  }

  async ngOnInit() {
    await this.data.iniciar();
  }
}
