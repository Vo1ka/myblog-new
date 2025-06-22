import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { app } from './config';


export const auth = getAuth(app);
//Регистрация
export function registerWithEmailAndPassword(email: string, password: string) {
  return createUserWithEmailAndPassword(auth, email, password);
}
//Логин
export function loginWithEmailAndPassword(email: string, password: string) {
  return signInWithEmailAndPassword(auth, email, password);
}
//Выход
export function logoutUser() {
  return signOut(auth);
}
//Отслеживание пользователя

export function subscribeToAuthChanges(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}
