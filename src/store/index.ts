import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { postsReducer } from './posts/reducer';
import {userReducer} from './auth/userReducer'

const rootReducer = combineReducers({
  posts: postsReducer,
  user: userReducer
  // ... тут будут другие редьюсеры (user и т.д.)
});

export const store = configureStore({
  reducer: rootReducer,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
