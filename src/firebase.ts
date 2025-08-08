// Configuración de Firebase para el proyecto
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyAAo_yiZ5LFra5BEM_6bu0oKi85KxXppE4',
  authDomain: 'crypto-dashboard-f1e61.firebaseapp.com',
  projectId: 'crypto-dashboard-f1e61',
  storageBucket: 'crypto-dashboard-f1e61.firebasestorage.app',
  messagingSenderId: '924117529891',
  appId: '1:924117529891:web:20f82c66873cd7f5f38896',
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
