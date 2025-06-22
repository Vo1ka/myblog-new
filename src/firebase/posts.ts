import { db } from './config';
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { Post } from '@/types/post';

// Получить все посты
export async function fetchPostsFromFirebase(): Promise<Post[]> {
  const postsCol = collection(db, 'posts');
  const postSnapshot = await getDocs(postsCol);
  return postSnapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      slug: data.slug ?? '', // если slug нет — пустая строка (или генерируй из title)
      title: data.title ?? '',
      date: data.date ?? '',
      description: data.description ?? '',
      authorId: data.authorId ?? '',
      authorName: data.authorName ?? '',
      // ...другие поля по типу Post
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
