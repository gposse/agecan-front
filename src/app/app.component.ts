import { Component } from '@angular/core';
import { DataService } from './services/data.service';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { IonicStorageModule, Storage } from '@ionic/storage-angular';
import { AccountService } from './services/account.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [IonApp, IonRouterOutlet, IonicStorageModule ],
})
export class AppComponent {
  constructor(
    private data: DataService,
    private storage: Storage
  ) {    
  }

  async ngOnInit() {
    await this.data.iniciar();
    await this.storage.create();
  }
}
