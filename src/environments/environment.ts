// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  apiUrl:'https://msi14ljp6h.execute-api.us-east-1.amazonaws.com/dev/',
  firebase: {
    apiKey: "AIzaSyBBiS7Yw1wv7gLc1iUOTz9hXOTVer_Nwtw",
    authDomain: "agendacaninara.firebaseapp.com",
    projectId: "agendacaninara",
    storageBucket: "agendacaninara.appspot.com",
    messagingSenderId: "745117521548",
    appId: "1:745117521548:web:b161fd62e82f132b380da9",
    measurementId: "G-WLLQFCSC3B"
  },
  google: {
    clientId: '745117521548-i0447lnt2kqbj4if28bstmn12d0alb27.apps.googleusercontent.com'
  },
  facebook: {
    appId: '749935929900547'
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
