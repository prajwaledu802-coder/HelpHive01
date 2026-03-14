import { initializeApp } from 'firebase/app';
import { getAnalytics, isSupported } from 'firebase/analytics';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyAj_DO8jkoK8CxQbELiN8nyYFv_vtIy5Hc',
  authDomain: 'helphi-ed17a.firebaseapp.com',
  projectId: 'helphi-ed17a',
  storageBucket: 'helphi-ed17a.firebasestorage.app',
  messagingSenderId: '670288716620',
  appId: '1:670288716620:web:f6e256d8c06f28b3a3a5e9',
  measurementId: 'G-N3DS9N7KM4',
};

export const firebaseApp = initializeApp(firebaseConfig);
export const firebaseAuth = getAuth(firebaseApp);
export const firebaseGoogleProvider = new GoogleAuthProvider();

export const initFirebaseAnalytics = async () => {
  if (typeof window === 'undefined') return null;

  const supported = await isSupported();
  if (!supported) return null;

  return getAnalytics(firebaseApp);
};
