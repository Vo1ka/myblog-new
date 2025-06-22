import { Post } from '@/types/post';

export const fetchPostsStart = () => ({ type: 'posts/fetchStart' });
export const fetchPostsSuccess = (posts: Post[]) => ({ type: 'posts/fetchSuccess', payload: posts });
export const fetchPostsError = (error: string) => ({ type: 'posts/fetchError', payload: error });
