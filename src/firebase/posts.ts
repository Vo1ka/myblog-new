import { db } from './config';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { Post } from '@/types/post';

// Получить все посты
export async function fetchPostsFromFirebase(): Promise<Post[]> {
  const postsCol = collection(db, 'posts');
  const postSnapshot = await getDocs(postsCol);
  return postSnapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      title: data.title,
      content: data.content,
      userId: data.userId,
      tags: data.tags || [],
      createdAt: data.createdAt ? data.createdAt.toDate().toISOString() : '',
      userDisplayName: data.userDisplayName
    } as Post;
  });
}

// Пример создания поста
export async function createPost(post: Omit<Post, 'id'>) {
  const postsCol = collection(db, 'posts');
  const docRef = await addDoc(postsCol, post);
  return docRef.id;
}

// Другие CRUD-операции по аналогии
