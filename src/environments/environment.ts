// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  defaultauth: 'firebase',//fakebackend',
  firebaseConfig: {
    apiKey: "AIzaSyBdgUFLuDI8Ttfc6gR5zbqXUykJMUlHKGU",
    authDomain: "cryptopeer2peer.firebaseapp.com",
    databaseURL: "https://cryptopeer2peer-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "cryptopeer2peer",
    storageBucket: "cryptopeer2peer.appspot.com",
    messagingSenderId: "1046262048899",
    appId: "1:1046262048899:web:a0c0aa368557610d7e53b6",
    measurementId: "G-8JTL5NG0YB"
  },
  moralis: {
    appId: "cG3PkW2sY6runEuBktncGQbPmvVBOJoKB00kTE7i",
    serverUrl: "https://abxgkddrkb9c.usemoralis.com:2053/server"
  },
  flutterwavePubKey: "FLWPUBK-0d71ee518685d4e82073059eed9deff4-X"
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
