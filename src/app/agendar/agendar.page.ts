import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../services/data.service';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { MenuComponent } from '../menu/menu.component';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-agendar',
  templateUrl: './agendar.page.html',
  styleUrls: ['./agendar.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, MenuComponent]
})
export class AgendarPage implements OnInit {
  public audioBase64: any;
  public celular: string = '';
  public chunks: any[] = [];
  public ciudad: any = null;
  public ciudadNombre: string = '';
  public direccion: string = '';
  public email: string = '';
  public fechaSeleccionada: string; 
  public horasDisponibles: any;
  public horaSeleccionada: string;
  public isLocated: boolean = false;
  public localidades: any = [];
  public localidad: any = null;
  public minDate: string;
  public mediaRecorder: any;
  public nombre: string = '';
  public recording: boolean = false;
  
  constructor(
    private apiService: ApiService,
    private data: DataService
  ) { 
    this.minDate = new Date().toISOString().split('T')[0];
    this.fechaSeleccionada = this.minDate;
    this.horaSeleccionada = '';
  }

  get Ciudades() {
    return this.data.ciudades;
  }

  cambiarUbicacion() {
    this.isLocated = false;
  }

  cancelForm() {
    this.horaSeleccionada = "";
  }

  async getHorasDisponibles() {
    this.horasDisponibles = await this.apiService.horasDisponibles(this.fechaSeleccionada);
  }

  async ngOnInit() {
    await this.data.iniciar();
    const fecha = new Date();
    this.fechaSeleccionada = fecha.toISOString().split('T')[0];
    console.log(this.fechaSeleccionada);
    this.horasDisponibles = await this.apiService.horasDisponibles(this.fechaSeleccionada);

  }

  onCiudadChange(event: any) {
    const ciudadId = event.detail.value;
    let ciudad:any = null;
    this.data.ciudades.forEach((c:any) => {
      if (c.id == ciudadId) {
        ciudad = c;
      }
    });
    if (ciudad) {
      this.ciudad = ciudad;
      this.ciudadNombre = ciudad.name;
      if (ciudad.locations) {
        this.localidades = ciudad.locations;
      } else {
        this.localidades = [{"id": ciudad.id, "name": ciudad.name, "zone": ciudad.zone}];
      }
    }
  }

  onConfirmar() {
    if (this.ciudad && this.localidad) {
      this.isLocated = true;
    }
  }

  onDateChange(event: any) {
    this.fechaSeleccionada = event.detail.value.split('T')[0];
    console.log(this.fechaSeleccionada);
    this.getHorasDisponibles();
  }

  onLocalidadChange(event: any) {
    const lcId = event.detail.value;
    let localidad:any = null;
    this.localidades.forEach((l:any) => {
      if (l.id == lcId) {
        localidad = l;
      }
    });
    if (localidad) {
      this.localidad = localidad;
    }
  }

  seleccionarHora(hora:string) {
    this.horaSeleccionada = hora;
  }

  startRecording() {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then((stream) => {
        this.recording = true;
        this.chunks = [];
        this.mediaRecorder = new MediaRecorder(stream);

        this.mediaRecorder.addEventListener('dataavailable', (event: any) => {
          this.chunks.push(event.data);
        });

        this.mediaRecorder.addEventListener('stop', () => {
          this.recording = false;
          const audioBlob = new Blob(this.chunks, { type: 'audio/wav' });

          const reader = new FileReader();
          reader.onloadend = () => {
            this.audioBase64 = reader.result as string;
            console.log('Archivo de audio en base64:', this.audioBase64);
          };
          reader.readAsDataURL(audioBlob);
        });

        this.mediaRecorder.start();
      })
      .catch((error) => {
        console.error('Error al acceder al dispositivo de grabación:', error);
      });
  }  

  stopRecording() {
    if (this.mediaRecorder && this.recording) {
      this.mediaRecorder.stop();
      this.recording = false;
    }
  }  
  
  submitForm() {
    console.log('Nombre:', this.nombre);
    console.log('Dirección:', this.direccion);
    console.log('Ciudad:', this.ciudad);
  }

  tieneHoraSeleccionada() {
    return (this.horaSeleccionada!="");
  }
}
