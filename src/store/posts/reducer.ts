import { AnyAction } from '@reduxjs/toolkit';
import { Post } from '@/types/post';

export type PostsState = {
  items: Post[];
  loading: boolean;
  error: string | null;
};

const initialState: PostsState = {
  items: [],
  loading: false,
  error: null,
};

export function postsReducer(state = initialState, action: AnyAction): PostsState {
  switch (action.type) {
    case 'posts/fetchStart':
      return { ...state, loading: true, error: null };
    case 'posts/fetchSuccess':
      return { ...state, loading: false, items: action.payload };
    case 'posts/fetchError':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}
