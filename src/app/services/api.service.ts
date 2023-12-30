import { environment } from 'src/environments/environment';
import { firstValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AccountService } from './account.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    private account: AccountService,
    private httpClient: HttpClient
  ) { }

  async addAppointment(appointment:any): Promise<any> {
    const url = `${environment.apiUrl}appointment/add`;
    const token = await this.account.getToken();
    const headers = {
      Authorization: `Bearer ${token}`
    }
    const r = await firstValueFrom(this.httpClient.post(url,JSON.stringify(appointment),{headers: headers}));
    return r;
  }

  async addresses(): Promise<any> {
    const url = `${environment.apiUrl}address/list`;
    const token = await this.account.getToken();
    const headers = {
      Authorization: `Bearer ${token}`
    }
    const r = await firstValueFrom(this.httpClient.get(url,{headers: headers}));
    return r;
  }

  async buy(data:any): Promise<any> {
    const url = `${environment.apiUrl}sales/buy`;
    const token = await this.account.getToken();
    const headers = {
      Authorization: `Bearer ${token}`
    }
    const r = await firstValueFrom(this.httpClient.post(url,JSON.stringify(data),{headers: headers}));
    return r;
  }

  async calendarAvailability(date:any,cityId:string,locationId:string): Promise<any> {
    const url = `${environment.apiUrl}calendar/available/${date}/${cityId}/${locationId}`;
    const token = await this.account.getToken();
    const headers = {
      Authorization: `Bearer ${token}`
    }
    const r = await firstValueFrom(this.httpClient.get(url,{headers: headers}));
    return r;
  }

  async horasDisponibles(date:any,cityId:string,locationId:string): Promise<any> {
    const currentLocalDate = new Date();
    const a = currentLocalDate.toLocaleDateString("en-US", {timeZone: "America/Bogota", year: 'numeric', month: '2-digit', day: '2-digit'});
    const b = a.split('/');
    const currentLocalDateString = b[2]+"-"+b[0]+"-"+b[1];
    const currentTime = currentLocalDate.toLocaleTimeString("en-US", {hour12: false, timeZone: "America/Bogota"});
    const currentHour = parseInt(currentTime.slice(0,2));
    const currentMinute = parseInt(currentTime.slice(3,5));

    const currentPos = (currentHour*2)+Math.floor(currentMinute/30);

    let isCurrentDate = false;
    if (date === currentLocalDateString) {
      isCurrentDate = true;
    }

    let horas:any = {
      manana: [],
      tarde: []
    };
    const token = await this.account.getToken();
    const headers = {
      Authorization: `Bearer ${token}`
    }
    const url = `${environment.apiUrl}calendar/available/${date}/${cityId}/${locationId}`;
    const r:any = await firstValueFrom(this.httpClient.get(url,{headers: headers}));
    for (let i = 0; i < 48; i++) {
      if (r.availability[i]=="A" && !(isCurrentDate && i<currentPos+3)) {
        const hora = Math.floor(i/2);
        const minutos = (i % 2)*30;
        const horaStr = hora.toString().padStart(2, '0')+":"+minutos.toString().padStart(2, '0');
        if (i<24) {
          horas.manana.push(horaStr);
        } else {
          horas.tarde.push(horaStr);
        }
      }
    }
    return horas;
  }

  async initialData(): Promise<any> {
    const url = `${environment.apiUrl}base/initial-data`;
    const r = await firstValueFrom(this.httpClient.get(url));
    return r;
  }


  async sessionsUser(): Promise<any> {
//    const url = `${environment.apiUrl}sessions/history`;
    const url = `${environment.apiUrl}sessions`;
    const token = await this.account.getToken();
    const headers = {
      Authorization: `Bearer ${token}`
    }
    const r = await firstValueFrom(this.httpClient.get(url,{headers: headers}));
    return r;
  }

  async prices(type: any): Promise<any> {
    const url = `${environment.apiUrl}sales/prices`;
    const r:any = await firstValueFrom(this.httpClient.get(url));
    let prices = [];
    for (let i = 0; i < r.prices.length; i++) {
      if (r.prices[i].type == type || type == 'all') {
        prices.push(r.prices[i]);
      }
    }
    return prices;
  }
}
