import { User } from "firebase/auth";


export const loginStart = () => ({ type: 'user/login' });
export const loginSuccess = (user:User) => ({ type: 'user/success', payload: user });
export const loginError = (error: string) => ({ type: 'user/error', payload: error });
export const logout = () => ({ type: 'user/logout' });
