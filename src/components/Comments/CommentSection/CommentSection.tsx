'use client';

import { useState, useEffect } from 'react';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import CommentList from '../CommentList/CommentList';
import CommentForm from '../CommentForm/CommentForm';
import { db } from '@/firebase/config'; // Исправь путь на свой
import type { PostComment } from '@/types/comment'; // Импортируй свой тип

interface CommentsSectionProps {
  postId: string;
}

const CommentsSection = ({ postId }: CommentsSectionProps) => {
  const [rootComments, setRootComments] = useState<PostComment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, 'comments', postId, 'comments'),
      where('parentId', '==', null),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const comments = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as PostComment[];
      setRootComments(comments);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [postId]);

  const handleCommentAdded = () => {
    // Можно добавить дополнительную логику при успешном добавлении
  };

  return (
    <div className="bg-white rounded-lg p-4 mt-6 shadow">
      <h3 className="text-lg font-bold mb-4">
        Комментарии <span className="text-gray-500">({rootComments.length})</span>
      </h3>

      <CommentForm postId={postId} onSuccess={handleCommentAdded} />

      {isLoading ? (
        <div className="flex items-center gap-2 text-gray-500 mt-4">
          <span className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-blue-500"></span>
          Загрузка комментариев...
        </div>
      ) : (
        <CommentList comments={rootComments} postId={postId} />
      )}
    </div>
  );
};

export default CommentsSection;
