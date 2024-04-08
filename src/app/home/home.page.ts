import { Component, OnInit } from '@angular/core';
import { ellipseSharp } from 'ionicons/icons';
import {
  IonButton,
  IonButtons,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonMenuButton,
  IonRow,
  IonTextarea,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { MenuComponent } from '../menu/menu.component';
import { SlickCarouselComponent, SlickCarouselModule } from 'ngx-slick-carousel';
import { addIcons } from 'ionicons';
import { CommonModule } from '@angular/common';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonButton,
    IonButtons,
    IonCol,
    IonContent,
    IonGrid,
    IonHeader,
    IonIcon,
    IonInput,
    IonItem,
    IonMenuButton,
    IonRow,
    IonTextarea,
    IonTitle,
    IonToolbar,
    MenuComponent,
    SlickCarouselModule
  ],
  providers: [SlickCarouselComponent]
})
export class HomePage implements OnInit {
  slideConfig = {"slidesToShow": 1, "slidesToScroll": 1, "autoplay": true, "autoplaySpeed": 7000, "arrows": false, "dots": true};
  slideMensajes = {"slidesToShow": 3, "slidesToScroll": 1, "autoplay": true, "autoplaySpeed": 3000, "arrows": false, "dots": true};
  slidePerfil = {"slidesToShow": 1, "slidesToScroll": 1, "autoplay": true, "autoplaySpeed": 5000, "arrows": false, "dots": true};

  mensajesHome = [
    {
      titulo: "Apasionados por el comportamiento canino",
      subtitulo: "Libera el poder de tu perro",
      clase: "home-image",
    },
    {
      titulo: "¿Tienes un perro equilibrado?",
      subtitulo: "Confírmalo con una sesión",
      clase: "home-image02",
    },
    {
      titulo: "¿Tu perro presenta algún comportamiento que quisieras corregir?",
      subtitulo: "¿Y no sabes cómo?",
      clase: "home-image03",
    },
    {
      titulo: "!Me la paso huyendo de los perros porque el mío ladra y ladra!",
      subtitulo: "",
      clase: "home-image04",
    },
    {
      titulo: "Mi perro no se puede quedar solo",
      subtitulo: "",
      clase: "home-image05",
    },
  ]

  fotosPerfil = [
    "../assets/images/about/profile_image.png",
    "../assets/images/about/profile02.jpg",
    "../assets/images/about/profile03.jpg",
  ];

  mensajes = [
    "../assets/images/mensajes/m01.png",
    "../assets/images/mensajes/m02.png",
    "../assets/images/mensajes/m03.png",
    "../assets/images/mensajes/m04.png",
    "../assets/images/mensajes/m05.png",
    "../assets/images/mensajes/m06.png",
    "../assets/images/mensajes/m07.png",
    "../assets/images/mensajes/m08.png",
    "../assets/images/mensajes/m09.png",
    "../assets/images/mensajes/m10.png",
    "../assets/images/mensajes/m11.png",
    "../assets/images/mensajes/m12.png",
    "../assets/images/mensajes/m13.png",
    "../assets/images/mensajes/m14.png",
    "../assets/images/mensajes/m15.png",
    "../assets/images/mensajes/m16.png",
    "../assets/images/mensajes/m17.png",
    "../assets/images/mensajes/m18.png",
    "../assets/images/mensajes/m19.png"
  ];

  constructor(
    private api: ApiService
  ) {
    addIcons({ ellipseSharp });
  }

  async enviar() {
    const nameInput = document.querySelector(
      'ion-input[name="name"]'
    ) as HTMLIonInputElement;
    const emailInput = document.querySelector(
      'ion-input[name="email"]'
    ) as HTMLIonInputElement;
    const titleInput = document.querySelector(
      'ion-input[name="title"]'
    ) as HTMLIonInputElement;
    const messageInput = document.querySelector(
      'ion-textarea[name="message"]'
    ) as HTMLIonTextareaElement;

    const name = nameInput.value;
    const email: any = emailInput.value;
    const title = titleInput.value;
    const message = messageInput.value;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (name && email && title && message && emailRegex.test(email)) {
      try {
        const body = {
          name,
          email,
          title,
          message,
        };
        await this.api.contactSend(body);
        alert('Gracias por su mensaje');
        nameInput.value = '';
        emailInput.value = '';
        titleInput.value = '';
        messageInput.value = '';
      } catch (error) {
        alert('Se produjo un error al enviar el mensaje. Intente más tarde, on envíenos su mensaje a contacto@agendacanina.co');
      }
    } else {
      alert(
        'Por favor complete todos los datos o ingrese un correo electrónico válido'
      );
    }
  }

  ngOnInit() {
  }
}
