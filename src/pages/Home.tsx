import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import { Mail } from 'lucide-react';
import 'swiper/css';
import 'swiper/css/pagination';
import { contactSend } from '../services/api';
import { InstagramIcon, TikTokIcon, WhatsAppIcon } from '../components/BrandIcons';

// Ported from agecan-front/src/app/home/home.page.ts / .html
// The 3 ngx-slick-carousel + jQuery slick carousels are replaced with Swiper (React).

const mensajesHome = [
  {
    titulo: 'Apasionados por el comportamiento canino',
    subtitulo: 'Libera el poder de tu perro',
    imagen: '/images/about/home.jpg',
  },
  {
    titulo: '¿Tienes un perro equilibrado?',
    subtitulo: 'Confírmalo con una sesión',
    imagen: '/images/about/home02.png',
  },
  {
    titulo: '¿Tu perro presenta algún comportamiento que quisieras corregir?',
    subtitulo: '¿Y no sabes cómo?',
    imagen: '/images/about/home03.jpg',
  },
  {
    titulo: '!Me la paso huyendo de los perros porque el mío ladra y ladra!',
    subtitulo: '',
    imagen: '/images/about/home04.png',
  },
  {
    titulo: 'Mi perro no se puede quedar solo',
    subtitulo: '',
    imagen: '/images/about/home05.png',
  },
];

const fotosPerfil = ['/images/about/profile_image.png', '/images/about/profile02.jpg', '/images/about/profile03.jpg'];

const mensajes = Array.from({ length: 19 }, (_, i) => `/images/mensajes/m${String(i + 1).padStart(2, '0')}.png`);

const contactSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  email: z.string().min(1, 'Email inválido').email('Email inválido'),
  title: z.string().min(1, 'El título es requerido'),
  message: z.string().min(1, 'El mensaje es requerido'),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export default function Home() {
  const [sent, setSent] = useState<'idle' | 'sending' | 'ok' | 'error'>('idle');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({ resolver: zodResolver(contactSchema) });

  async function onSubmit(values: ContactFormValues) {
    setSent('sending');
    try {
      await contactSend(values);
      setSent('ok');
      reset();
    } catch {
      setSent('error');
    }
  }

  return (
    <div className="mx-auto max-w-6xl">
      {/* Hero carousel */}
      <section id="start" className="relative overflow-hidden">
        <Swiper
          modules={[Autoplay, Pagination]}
          autoplay={{ delay: 7000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          loop
          className="hero-swiper"
        >
          {mensajesHome.map((h) => (
            <SwiperSlide key={h.titulo}>
              <div
                className="flex h-[40vw] min-h-[320px] items-center justify-center bg-cover bg-center"
                style={{ backgroundImage: `url(${h.imagen})` }}
              >
                <div className="flex h-full w-full items-center justify-center bg-[rgba(10,31,116,0.4)] px-6 text-center text-white">
                  <div>
                    <h1 className="text-2xl font-bold sm:text-4xl">{h.titulo}</h1>
                    {h.subtitulo && <h2 className="mt-2 text-lg font-semibold sm:text-2xl">{h.subtitulo}</h2>}
                    <div className="mt-6 flex flex-wrap justify-center gap-4 text-base font-bold">
                      <a href="/paquetes" className="rounded bg-primary px-4 py-2 text-white">
                        Programa tu sesión
                      </a>
                      <a href="/productos" className="rounded bg-primary px-4 py-2 text-white">
                        Productos
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        <p className="px-4 py-4 text-center">
          En{' '}
          <a href="https://www.instagram.com/agendacanina/" target="_blank" rel="noreferrer" className="text-primary underline">
            Instagram
          </a>{' '}
          y{' '}
          <a href="https://www.tiktok.com/@agendacanina" target="_blank" rel="noreferrer" className="text-primary underline">
            TikTok
          </a>{' '}
          puedes ver más sobre Agenda Canina.
        </p>
      </section>

      {/* Quiénes somos */}
      <section id="about" className="bg-white px-4 py-12">
        <h2 className="text-center text-2xl font-semibold text-gray-600">QUIÉNES SOMOS</h2>
        <div className="mt-8 grid gap-8 md:grid-cols-12">
          <div className="md:col-span-7">
            <p className="text-justify leading-relaxed">
              Soy Rodrigo Arenas, líder del equipo de Agenda Canina. Soy un migrante del mundo corporativo,
              apasionado conocedor de la psicología canina con casi una década de experiencia tratando perros con
              temas de comportamiento y una altísima tasa de casos resueltos.
              <br />
              <br />
              En más del 98% de los casos atendidos se ha dado una solución definitiva al problema.
            </p>
          </div>
          <div className="md:col-span-5">
            <Swiper
              modules={[Autoplay, Pagination]}
              autoplay={{ delay: 5000, disableOnInteraction: false }}
              pagination={{ clickable: true }}
              loop
            >
              {fotosPerfil.map((src) => (
                <SwiperSlide key={src}>
                  <img src={src} alt="Rodrigo Arenas" className="mx-auto w-full" />
                </SwiperSlide>
              ))}
            </Swiper>
            <ul className="mt-6 flex justify-center gap-6">
              <li>
                <a href="https://www.tiktok.com/@agendacanina" target="_blank" rel="noreferrer" aria-label="TikTok">
                  <TikTokIcon className="h-6 w-6 text-secondary" />
                </a>
              </li>
              <li>
                <a href="https://wa.me/573142452458" target="_blank" rel="noreferrer" aria-label="WhatsApp">
                  <WhatsAppIcon className="h-6 w-6 text-secondary" />
                </a>
              </li>
              <li>
                <a href="https://www.instagram.com/agendacanina/" target="_blank" rel="noreferrer" aria-label="Instagram">
                  <InstagramIcon className="h-6 w-6 text-secondary" />
                </a>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Qué hacemos */}
      <section id="quehacemos" className="bg-[#f7f7f7] px-4 py-12">
        <h2 className="text-center text-2xl font-semibold text-gray-600">QUÉ HACEMOS</h2>
        <div className="mt-8 grid gap-10 md:grid-cols-3">
          <div className="text-center">
            <h3 className="text-lg font-semibold">Sesiones Privadas</h3>
            <div className="mx-auto my-3 h-px w-24 bg-black" />
            <p className="text-justify leading-relaxed">
              Trabajo personalizado en casa del perro con su familia donde el objetivo central es devolverle a la
              manada la armonía, paz, tranquilidad y unión que vienen los perros a traer a nuestras vidas, pero que
              por diversas razones se ha tornado en una situación disruptiva.
            </p>
          </div>
          <div className="text-center">
            <h3 className="text-lg font-semibold">La S.E.D.E.</h3>
            <div className="mx-auto my-3 h-px w-24 bg-black" />
            <p className="text-justify leading-relaxed">
              Es un espacio complementario a las sesiones privadas donde los perros pueden venir a pasar el día o
              quedarse temporadas cortas y largas según la necesidad. Se llama La S.E.D.E. porque aquí Socializan de
              manera adecuada, hacen Ejercicio dirigido en función de su nivel de energía y se les refuerza la
              Disciplina mediante un set de reglas y límites igual al que se instauró en su casa mediante las
              sesiones privadas, lo que en conjunto contrubuye a tener perros Equilibrados con buenos modales.
            </p>
          </div>
          <div className="text-center">
            <h3 className="text-lg font-semibold">Conferencias</h3>
            <div className="mx-auto my-3 h-px w-24 bg-black" />
            <p className="text-justify leading-relaxed">
              Preparamos conversatorios para todo tipo de público a solicitud de empresas, colegios, instituciones,
              complejos de propiedad horizontal, etc. interesados en aprender sobre psicología canina, que tengan
              alguna problemática puntual a solucionar en sus comunidades.
            </p>
          </div>
        </div>
      </section>

      {/* Mensajes carousel */}
      <section id="mensajes" className="bg-white px-4 py-10">
        <Swiper
          modules={[Autoplay, Pagination]}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          loop
          slidesPerView={1}
          breakpoints={{ 640: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } }}
        >
          {mensajes.map((src) => (
            <SwiperSlide key={src}>
              <div className="text-center">
                <img src={src} alt="Testimonio" className="mx-auto max-h-96" />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {/* Contacto */}
      <section id="contacto" className="bg-white px-4 py-12">
        <h2 className="text-center text-2xl font-semibold text-gray-600">CONTÁCTANOS</h2>
        <div className="mt-8 grid gap-10 md:grid-cols-12">
          <div className="md:col-span-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-secondary" htmlFor="name">
                  Nombre
                </label>
                <input
                  id="name"
                  type="text"
                  className="mt-1 w-full rounded border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none"
                  {...register('name')}
                />
                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary" htmlFor="email">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  className="mt-1 w-full rounded border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none"
                  {...register('email')}
                />
                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary" htmlFor="title">
                  Título
                </label>
                <input
                  id="title"
                  type="text"
                  className="mt-1 w-full rounded border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none"
                  {...register('title')}
                />
                {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary" htmlFor="message">
                  Mensaje
                </label>
                <textarea
                  id="message"
                  rows={4}
                  className="mt-1 w-full rounded border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none"
                  {...register('message')}
                />
                {errors.message && <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>}
              </div>
              <button
                type="submit"
                disabled={sent === 'sending'}
                className="rounded bg-primary px-6 py-2 font-semibold text-white hover:opacity-90 disabled:opacity-60"
              >
                Enviar
              </button>
              {sent === 'ok' && <p className="text-secondary">Gracias por su mensaje</p>}
              {sent === 'error' && (
                <p className="text-red-600">
                  Se produjo un error al enviar el mensaje. Intente más tarde, o envíenos su mensaje a
                  rodrigosabbie@gmail.com
                </p>
              )}
            </form>
          </div>
          <div className="md:col-span-5 md:col-start-8">
            <h3 className="text-lg font-semibold text-gray-600">Agenda Canina</h3>
            <p className="text-gray-500">por Rodrigo Arenas</p>

            <h3 className="mt-4 text-lg font-semibold text-gray-600">Whatsapp</h3>
            <p>
              <a href="https://wa.me/573142452458" target="_blank" rel="noreferrer" className="text-gray-500">
                +57 3142452458
              </a>
            </p>

            <h3 className="mt-4 text-lg font-semibold text-gray-600">Email</h3>
            <p>
              <a href="mailto:rodrigosabbie@gmail.com" className="text-gray-500">
                rodrigosabbie@gmail.com
              </a>
            </p>

            <ul className="mt-4 flex gap-6">
              <li>
                <a href="https://www.tiktok.com/@agendacanina" target="_blank" rel="noreferrer" aria-label="TikTok">
                  <TikTokIcon className="h-6 w-6 text-secondary" />
                </a>
              </li>
              <li>
                <a href="https://wa.me/573142452458" target="_blank" rel="noreferrer" aria-label="WhatsApp">
                  <WhatsAppIcon className="h-6 w-6 text-secondary" />
                </a>
              </li>
              <li>
                <a href="https://www.instagram.com/agendacanina/" target="_blank" rel="noreferrer" aria-label="Instagram">
                  <InstagramIcon className="h-6 w-6 text-secondary" />
                </a>
              </li>
              <li>
                <a href="mailto:rodrigosabbie@gmail.com" aria-label="Email">
                  <Mail className="h-6 w-6 text-secondary" />
                </a>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
