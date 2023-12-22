import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../services/data.service';
import { FormsModule } from '@angular/forms';
import { IonButton, IonCol, IonContent, IonDatetime, IonGrid, IonItem, IonList, IonRow, IonSelect, IonSelectOption } from '@ionic/angular/standalone';
import { MenuComponent } from '../menu/menu.component';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-agendar',
  templateUrl: './agendar.page.html',
  styleUrls: ['./agendar.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonButton, IonCol, IonContent, IonDatetime, IonGrid, IonItem, IonList, IonRow, IonSelect, IonSelectOption, MenuComponent]
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
    const currentLocalDate = new Date();
    const a = currentLocalDate.toLocaleDateString("en-US", {timeZone: "America/Bogota", year: 'numeric', month: '2-digit', day: '2-digit'});
    const b = a.split('/');
    this.minDate = b[2]+"-"+b[0]+"-"+b[1];
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
    this.horasDisponibles = await this.apiService.horasDisponibles(this.fechaSeleccionada,this.ciudad.id,this.localidad.id);
  }

  async ngOnInit() {
    await this.data.iniciar();
    const fecha = new Date();
    this.fechaSeleccionada = fecha.toISOString().split('T')[0];
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

  async onConfirmar() {
    if (this.ciudad && this.localidad) {
      this.horasDisponibles = await this.apiService.horasDisponibles(this.fechaSeleccionada,this.ciudad.id,this.localidad.id);
      this.isLocated = true;
    }
  }

  onDateChange(event: any) {
    this.fechaSeleccionada = event.detail.value.split('T')[0];
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
    console.log(this.ciudadNombre);
  }

  startRecording() {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
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
            };
            reader.readAsDataURL(audioBlob);
          });

          this.mediaRecorder.start();
        })
        .catch((error) => {
          console.error('Error al acceder al dispositivo de grabación:', error);
        });
    } else {
      console.error('getUserMedia is not supported');
    }
  }  

  stopRecording() {
    if (this.mediaRecorder && this.recording) {
      this.mediaRecorder.stop();
      this.recording = false;
      this.mediaRecorder.stream.getTracks().forEach((track:any) => track.stop());
    }
  }  
  
  async submitForm() {
    let duration = 90;
    if (this.ciudad.id!="11001")
      duration = 150;
    let appointment = {
      datetime: this.fechaSeleccionada+"T"+this.horaSeleccionada+":00.000Z",
      city: this.ciudad.id,
      location: this.localidad.id,
      address: this.direccion,
      name: this.nombre,
      phone: this.celular,
      email: this.email,
      duration: duration,
      audio: this.audioBase64
    }
    const r = await this.apiService.addAppointment(appointment);
    if (r) {
      this.horaSeleccionada = "";
      this.audioBase64 = "";
      this.celular = "";
      this.direccion = "";
      this.email = "";
      this.nombre = "";
      this.recording = false;
    }
  }

  tieneHoraSeleccionada() {
    return (this.horaSeleccionada!="");
  }
}
