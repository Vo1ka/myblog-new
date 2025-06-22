import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { postsReducer } from './posts/reducer';


const rootReducer = combineReducers({
  posts: postsReducer,
  // ... тут будут другие редьюсеры (user и т.д.)
});

export const store = configureStore({
  reducer: rootReducer,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
