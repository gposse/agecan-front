import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  public ciudades: any = [];

  constructor(
    private api: ApiService
  ) { }

  async iniciar() {
    if (this.ciudades.length == 0) {
      const data:any = await this.api.initialData();
      this.ciudades = data.cities;
    }
  }
}
