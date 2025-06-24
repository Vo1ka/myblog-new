'use client';

import { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/firebase/config';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store';

interface CommentFormProps {
  postId: string;
  parentId?: string | null;
  onSuccess: () => void;
}

const CommentForm = ({ postId, parentId = null, onSuccess }: CommentFormProps) => {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const user = useSelector((state: RootState) => state.user.user);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) {
      setError('Комментарий не может быть пустым');
      return;
    }

    if (!user) {
      setError('Необходимо авторизоваться');
      return;
    }

    setIsSubmitting(true);

    try {
      await addDoc(collection(db, 'comments', postId, 'comments'), {
        content,
        authorId: user.uid,
        authorName: user.displayName || 'Аноним',
        authorAvatar: user.photoURL || null,
        parentId,
        postId,
        likes: [],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        replyCount: 0,
      });

      setContent('');
      setError('');
      onSuccess();
    } catch (err) {
      console.error('Ошибка при отправке:', err);
      setError('Ошибка при отправке комментария');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 mt-4">
      {error && <div className="text-red-600 text-sm">{error}</div>}
      <textarea
        className="border rounded p-2 resize-y min-h-[60px] focus:outline-blue-400"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Напишите комментарий..."
        disabled={isSubmitting}
        rows={3}
      />
      <button
        type="submit"
        disabled={isSubmitting || !content.trim()}
        className="self-end bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 transition disabled:opacity-50"
      >
        {isSubmitting ? 'Отправка...' : 'Отправить'}
      </button>
    </form>
  );
};

export default CommentForm;
