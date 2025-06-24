'use client';

import { useState } from 'react';
import { db } from '@/firebase/config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store';

interface ReplyFormProps {
  postId: string;
  parentId: string | null;
  onSuccess: () => void;
}

const ReplyForm = ({ postId, parentId, onSuccess }: ReplyFormProps) => {
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
    setError('');

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
      });

      setContent('');
      onSuccess();
    } catch (err) {
      console.error('Ошибка при отправке комментария:', err);
      setError('Ошибка при отправке');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 mt-2">
      {error && <div className="text-red-600 text-sm">{error}</div>}

      <textarea
        className="border rounded p-2 min-h-[60px] focus:outline-blue-400"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Ваш ответ..."
        disabled={isSubmitting}
        rows={3}
      />

      <div className="flex gap-2 justify-end">
        <button
          type="button"
          onClick={onSuccess}
          disabled={isSubmitting}
          className="bg-gray-200 text-gray-700 px-4 py-1 rounded hover:bg-gray-300"
        >
          Отмена
        </button>
        <button
          type="submit"
          disabled={!content.trim() || isSubmitting}
          className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 transition disabled:opacity-50"
        >
          {isSubmitting ? 'Отправка...' : 'Ответить'}
        </button>
      </div>
    </form>
  );
};

export default ReplyForm;
