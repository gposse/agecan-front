# Agenda Canina — Front (React + Vite)

Sitio público de Agenda Canina (peluquería/paseo canino y sesiones de comportamiento canino):
landing page de marketing, flujo de reserva de citas, autenticación, catálogo de
paquetes/precios, carrito de compras y páginas legales.

Esta app **reemplaza** a `agecan-front` (Angular 17 + Ionic 7), migrada 1:1 en textos y
lógica de negocio a un stack React + Vite orientado solo a web (sin Capacitor / apps
nativas).

## Cómo correr

```bash
npm install
cp .env.example .env.local   # y completa los valores reales (ver abajo)
npm run dev
```

Otros scripts:

- `npm run build` — build de producción (TypeScript + Vite). Debe pasar sin errores.
- `npm run lint` — `oxlint` sobre `src/`.
- `npm run preview` — sirve el build de producción localmente.

## Variables de entorno

Ver `.env.example`. Se necesitan:

- `VITE_API_URL`: URL base de `agecan-api` (con `/` final).
- `VITE_FIREBASE_*`: config del SDK web de Firebase (Project settings > General > Your apps).
- `VITE_GOOGLE_CLIENT_ID`, `VITE_FACEBOOK_APP_ID`: ver comentarios en `.env.example` —
  con Firebase Auth normalmente basta con habilitar los proveedores Google/Facebook
  desde la consola de Firebase; estas variables quedan solo como referencia si se
  necesita el ID directamente en algún otro lado.

Sin estos valores reales la app **compila y se puede navegar**, pero las llamadas a la
API y el login social no funcionarán end-to-end (ver "Pendientes" abajo).

## Qué se migró desde Angular/Ionic

| Original (`agecan-front`) | Nuevo (`agecan-front-new`) |
|---|---|
| Angular 17 standalone components + Ionic 7 UI | React 19 + Tailwind CSS v4 |
| `@angular/router` | `react-router-dom` v7, layout anidado (`Layout` + `<Outlet/>`) |
| `HttpClient` (`api.service.ts`) | `fetch` client en `src/services/api.ts`, mismos endpoints/métodos |
| `@ionic/storage-angular` (sesión, carrito) | `localStorage` vía Context API (`AuthContext`, `CartContext`) |
| Firebase JS SDK + `@codetrix-studio/capacitor-google-auth` + `@capacitor-community/facebook-login` | Firebase JS SDK v10+ **solo con proveedores web** (`signInWithPopup` + `GoogleAuthProvider`/`FacebookAuthProvider`) — ver "Decisiones" |
| `ngx-slick-carousel` + jQuery + slick-carousel | `swiper` (paquete React) para los 3 carruseles de home |
| Angular Reactive/Template forms | `react-hook-form` + `zod` (login, registro, contacto, agendar) |
| Font Awesome (`fa-*` classes) | `lucide-react` para iconos genéricos + iconos de marca hechos a mano en `src/components/BrandIcons.tsx` (ver "Decisiones") |
| `AuthGuard` (`CanActivateFn`) | `ProtectedRoute` (componente wrapper) para `/agendar` y `/carrito` |
| `DataService.iniciar()` (ciudades) | `InitialDataContext`, se carga una vez al montar la app |
| `AccountService.getToken()` / `isTokenExpired` | `src/lib/authToken.ts`, misma lógica de expiración vía `jwt-decode` |
| `horasDisponibles()` (bucketing AM/PM, filtro de horas pasadas en `America/Bogota`) | `src/lib/schedule.ts`, portado tal cual (mismo algoritmo de índices de 30 min) |

Páginas migradas 1:1 (textos en español conservados): `/` (home), `/agendar`, `/login`,
`/registro`, `/paquetes`, `/productos`, `/carrito`, `/privacidad`, `/terminos`.

## Decisiones de diseño no 100% especificadas

- **Iconos de marca**: la versión de `lucide-react` usada en este proyecto **no incluye
  iconos de marcas** (Instagram, Facebook, Google/Chrome, TikTok, WhatsApp fueron
  removidos del paquete). Se creó `src/components/BrandIcons.tsx` con SVGs inline
  equivalentes para reemplazar esos `fa-brands` del original. Los iconos genéricos
  (carrito, menú, cerrar, check, micrófono, detener, papelera) sí vienen de
  `lucide-react`.
- **`/agendar`**: el wizard se implementó con varios `useState` (no `useReducer`) porque
  el flujo, aunque tiene varios pasos, no comparte transiciones complejas entre campos;
  esto se mantiene más legible que una máquina de estados explícita.
- **Bug corregido en el carrito**: el `checkout()` original en
  `agecan-front/src/app/carrito/carrito.page.ts` tenía
  `reader.onloadend = () => async () => {...}` — una función que se creaba pero nunca
  se invocaba, por lo que subir un comprobante de pago **nunca completaba la compra**
  en la app original. Se corrigió en `src/pages/Carrito.tsx` (`readFileAsBase64`
  con una promesa que sí resuelve) para que la funcionalidad realmente funcione.
- **Autenticación / refresco de token**: en vez de replicar el `onAuthStateChanged`
  reactivo async dentro de `getToken()` (que en el original es algo propenso a
  condiciones de carrera), `src/lib/authToken.ts` usa
  `firebaseAuth.currentUser?.getIdToken(true)` de forma directa y determinística
  cuando el token guardado está expirado.
- **Colores de marca**: tomados de `agecan-front/src/theme/variables.scss`
  (`primary #553A09`, `secondary #004B33`, `tertiary #4B8178`) y declarados como
  tokens de Tailwind v4 (`@theme` en `src/index.css`), incluyendo variantes
  `-shade`/`-tint` para que Tailwind genere automáticamente utilidades como
  `bg-primary`, `text-secondary`, `border-tertiary-tint/40`, etc.
- **Imágenes**: los assets usados por home (`about/*`, `mensajes/*`) se copiaron a
  `public/images/...` (rutas absolutas simples tipo `/images/mensajes/m01.png`) en vez
  de importarlas una por una desde `src/assets`, dado el volumen de archivos (19
  imágenes de "mensajes" + 8 de "about"). El logo sí se importa desde
  `src/assets/images/logo.png` porque solo se usa en un lugar (`Layout.tsx`).
- **Rutas hash de ancla** (`/#about`, `/#quehacemos`, `/#contacto`): se mantuvieron como
  enlaces `<a href>` normales (no `<Link>` de React Router) porque apuntan a anclas
  dentro de la misma página de home, igual que en el original (`href="/home#about"`).

## Pendientes / no configurado

- **Valores reales de Firebase**: crear el proyecto en Firebase console, registrar una
  app web, habilitar Email/Password + Google + Facebook en Authentication > Sign-in
  method, y completar `VITE_FIREBASE_*` en `.env.local`.
- **Facebook Login**: además de habilitarlo en Firebase, hay que crear la app en
  [developers.facebook.com](https://developers.facebook.com) y configurar el dominio
  autorizado (localhost para desarrollo, dominio real para producción).
- **`VITE_API_URL`**: apuntar al `agecan-api` real (local o desplegado) para que
  funcionen home (contacto, precios), login, agendar, paquetes y carrito.
- Sin estas variables configuradas, el build/lint/dev funcionan igual, pero las
  llamadas de red fallarán en tiempo de ejecución (se muestran mensajes de error en
  la UI en vez de romper la app).
