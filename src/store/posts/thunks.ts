import { fetchPostsFromFirebase } from '@/firebase/posts';
import { fetchPostsStart, fetchPostsSuccess, fetchPostsError } from './actions';
import { AppDispatch } from '..';

export const loadPosts = () => async (dispatch: AppDispatch) => {
  dispatch(fetchPostsStart());
  try {
    const posts = await fetchPostsFromFirebase();
    dispatch(fetchPostsSuccess(posts));
  } catch (err) {
    dispatch(fetchPostsError('Ошибка загрузки постов'));
    console.log(err);
  }
};
