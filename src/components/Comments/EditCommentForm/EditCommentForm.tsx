'use client';

import { useState } from 'react';
import { doc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db } from '@/firebase/config'; 

interface EditFormProps {
  postId: string;
  commentId: string;
  initialContent: string;
  onSuccess: (newContent: string) => void;
  onCancel: () => void;
}

const EditCommentForm = ({
  postId,
  commentId,
  initialContent,
  onSuccess,
  onCancel,
}: EditFormProps) => {
  const [content, setContent] = useState(initialContent);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await updateDoc(doc(db, 'comments', postId, 'comments', commentId), {
        content,
        updatedAt: serverTimestamp(),
      });
      onSuccess(content);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 mt-2">
      <textarea
        className="border rounded p-2 min-h-[60px] focus:outline-blue-400"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        disabled={isSubmitting}
      />
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 transition disabled:opacity-50"
        >
          Сохранить
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-200 text-gray-700 px-4 py-1 rounded hover:bg-gray-300"
        >
          Отмена
        </button>
      </div>
    </form>
  );
};

export default EditCommentForm;
