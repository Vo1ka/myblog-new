import { AnyAction } from '@reduxjs/toolkit';
import { User } from 'firebase/auth';

export type userState = {
    user: User | null;
    loading: boolean;
    error: null | string;

};

const initialState: userState = {
  user: null,
  loading: false,
  error: null,
};

export function userReducer(state = initialState, action: AnyAction): userState {
  switch (action.type) {
    case 'user/login':
      return { ...state, loading: true, error: null };
    case 'user/success':
      return { ...state, loading: false, user: action.payload };
    case 'user/error':
      return { ...state, loading: false, error: action.payload };
    case 'user/logout':
        return {...state, loading: false, user: null}
    default:
      return state;
  }
}
