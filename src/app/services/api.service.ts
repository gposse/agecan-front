import { environment } from 'src/environments/environment';
import { firstValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    private httpClient: HttpClient
  ) { }

  async calendarAvailability(date:any): Promise<any> {
    const url = `${environment.apiUrl}calendar/available/${date}`;
    const r = await firstValueFrom(this.httpClient.get(url));
    return r;
  }

  async horasDisponibles(date:any): Promise<any> {
    const currentDate = new Date();
    const currentLocalDate = new Date(currentDate.toLocaleString("en-US", {timeZone: "America/Bogota"}));
    const currentLocalDateString = currentLocalDate.toISOString().slice(0,10);
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
    const r:any = await firstValueFrom(this.httpClient.get(`${environment.apiUrl}calendar/available/${date}`));
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
}
