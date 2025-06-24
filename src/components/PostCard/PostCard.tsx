'use client'

import { db, auth } from "@/firebase/config";
import { Post } from "@/types/post";
import { onSnapshot, doc, runTransaction, serverTimestamp } from "firebase/firestore";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import CommentsSection from "../Comments/CommentSection/CommentSection";
interface PostCardProps {
    post: Post;
    isFullText?: boolean;  // Флаг для полного/краткого отображения
  }

const PostCard = ({post, isFullText = false}:PostCardProps) => {
    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(post.likeCount || 0);
    const router = useRouter();
    const [showComments, setShowComments] = useState(false);


    useEffect(() => {
        const unsubscribePost = onSnapshot(doc(db, "posts", post.id), (doc) => {
          if (doc.exists()) {
            setLikeCount(doc.data()?.likeCount || 0);
          }
        });
        return () => unsubscribePost();
      }, [post.id]);
  
    // 2. Подписка на лайк текущего пользователя
    useEffect(() => {
        if (!auth.currentUser?.uid) return;

        const userLikeRef = doc(db, `users/${auth.currentUser.uid}/likes`, post.id);
        const unsubscribeLike = onSnapshot(userLikeRef, (doc) => {
        setIsLiked(doc.exists());
        });

        return () => unsubscribeLike();
    }, [post.id]);
  
    const handleLike = async () => {
        if (!auth.currentUser) {
          router.replace('/login');
          return;
        }
    
        const userLikeRef = doc(db, `users/${auth.currentUser.uid}/likes`, post.id);
        const postLikeRef = doc(db, "posts", post.id);
    
        try {
          await runTransaction(db, async (transaction) => {
            const likeDoc = await transaction.get(userLikeRef);
            const postDoc = await transaction.get(postLikeRef);
            
            if (likeDoc.exists()) {
              transaction.delete(userLikeRef);
              transaction.update(postLikeRef, {
                likeCount: (postDoc.data()?.likeCount || 0) - 1
              });
            } else {
              transaction.set(userLikeRef, {
                timestamp: serverTimestamp()
              });
              transaction.update(postLikeRef, {
                likeCount: (postDoc.data()?.likeCount || 0) + 1
              });
            }
          });
        } catch (error) {
          console.error("Ошибка при обновлении лайка:", error);
        }
      };

    const formattedDate = post.createdAt?.toLocaleString?.('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    }) || 'Дата не указана';
    return(
        <div className="bg-white rounded-lg shadow p-6 flex flex-col mb-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-lg">
                {post.userDisplayName?.charAt(0)}
              </span>
              <div>
                <span className="block font-semibold">{post.userDisplayName}</span>
                <time className="text-gray-400 text-xs block" dateTime={post.createdAt instanceof Date ? post.createdAt.toISOString() : ''}>
                  {formattedDate}
                </time>
              </div>
            </div>
            <button
              className={`flex items-center gap-1 px-3 py-1 rounded transition ${
                isLiked ? "bg-red-100 text-red-500" : "bg-gray-100 text-gray-500"
              }`}
              onClick={handleLike}
              aria-label={isLiked ? "Убрать лайк" : "Поставить лайк"}
            >
              <span>{isLiked ? "❤️" : "🤍"}</span>
              <span>{likeCount}</span>
            </button>
          </div>

          {/* Content */}
          <div className="mb-4">
            <h3 className="text-lg font-bold mb-2">{post.title}</h3>
            <div>
              {isFullText ? (
                <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: post.content }} />
              ) : (
                <>
                  <p>
                    {post.content?.substring(0, 150)}
                    {post.content && post.content.length > 150 ? '...' : ''}
                  </p>
                  {post.content && post.content.length > 150 && (
                    <div className="mt-2">
                      <Link href={`/posts/${post.id}`} className="text-blue-600 hover:underline">
                        Читать далее <span className="ml-1">→</span>
                      </Link>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.map((tag, index) => (
                <Link
                  href={`/404`}
                  key={index}
                  className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-xs hover:bg-blue-200"
                  onClick={(e) => e.stopPropagation()}
                >
                  #{tag}
                </Link>
              ))}
            </div>
          )}

          {/* Comments toggle */}
          <button
            onClick={() => setShowComments(!showComments)}
            className="text-blue-600 hover:underline text-sm self-start mb-2"
          >
            {showComments ? "Скрыть" : "Показать комментарии"}
          </button>

          {/* Comments section */}
          {showComments && (
            <Suspense fallback={<div>Загрузка комментариев...</div>}>
              <CommentsSection postId={post.id} />
            </Suspense>
          )}
        </div>


    )
}

export default PostCard;