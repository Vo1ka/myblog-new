'use client';

import { useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { db } from "@/firebase/config";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  runTransaction,
  Timestamp,
  where,
} from "firebase/firestore";
import { formatDistanceToNow } from "date-fns";
import { ru } from "date-fns/locale";
import type { RootState } from "@/store";
import EditCommentForm from "../EditCommentForm/EditCommentForm";
import RepliesList from "../RepliesList/RepliesList";
import ReplyForm from "../ReplyForm/ReplyForm";
import { PostComment } from "@/types/comment";

interface CommentItemProps {
  comment: PostComment;
  postId: string;
  parentId: string | null;
  depth?: number;
  onUpdate?: (updatedComment: PostComment) => void;
  onDelete?: (commentId: string) => void;
}

const MAX_DEPTH = 10;

const CommentItem = ({
  comment,
  postId,
  parentId,
  depth = 0,
  onDelete,
  onUpdate,
}: CommentItemProps) => {
  const user = useSelector((state: RootState) => state.user.user);
  const userId = user?.uid || "";
  const [isReplying, setIsReplying] = useState(false);
  const [replies, setReplies] = useState<PostComment[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoadingReplies, setIsLoadingReplies] = useState(false);
  const router = useRouter();

  const handleLike = async () => {
    if (!user) {
      router.push("/login");
      return;
    }

    const commentRef = doc(db, "comments", postId, "comments", comment.id);
    try {
      const newLikes = comment.likes.includes(userId)
        ? comment.likes.filter((id) => id !== userId)
        : [...comment.likes, userId];

      onUpdate?.({ ...comment, likes: newLikes });

      await runTransaction(db, async (transaction) => {
        const docSnapshot = await transaction.get(commentRef);
        if (!docSnapshot.exists()) throw new Error("Комментарий не найден");
        transaction.update(commentRef, { likes: newLikes });
      });
    } catch (error) {
      onUpdate?.(comment);
      console.error("Ошибка при лайке:", error);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Удалить комментарий?")) return;

    try {
      await deleteDoc(doc(db, "comments", postId, "comments", comment.id));
      onDelete?.(comment.id);
    } catch (error) {
      console.error("Ошибка при удалении:", error);
    }
  };

  const loadReplies = async () => {
    if (replies.length > 0 || !comment.replyCount) return;

    setIsLoadingReplies(true);
    try {
      const repliesSnapshot = await getDocs(
        query(
          collection(db, "comments", postId, "comments"),
          where("parentId", "==", comment.id),
          orderBy("createdAt", "desc")
        )
      );

      const repliesData = repliesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as PostComment[];

      setReplies(repliesData);
    } catch (error) {
      console.error("Ошибка загрузки ответов:", error);
    } finally {
      setIsLoadingReplies(false);
    }
  };

  return (
    <div className={`border rounded p-4 mb-4 ${depth > 0 ? "ml-8" : ""} bg-gray-50`}>
      <div className="flex items-center gap-3 mb-2">
        <span className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-lg">
          {comment.authorAvatar ? (
            <img src={comment.authorAvatar} alt={comment.authorName} className="w-8 h-8 rounded-full" />
          ) : (
            comment.authorName?.charAt(0) || "?"
          )}
        </span>
        <div>
          <span className="font-semibold">{comment.authorName || "Аноним"}</span>
          <span className="ml-2 text-gray-400 text-xs">
            {comment.createdAt?.toDate
              ? formatDistanceToNow(comment.createdAt.toDate(), {
                  addSuffix: true,
                  locale: ru,
                })
              : "только что"}
          </span>
        </div>
      </div>

      {isEditing ? (
        <EditCommentForm
          postId={postId}
          commentId={comment.id}
          initialContent={comment.content}
          onSuccess={(newContent) => {
            setIsEditing(false);
            onUpdate?.({
              ...comment,
              content: newContent,
              updatedAt: Timestamp.fromDate(new Date()),
            });
          }}
          onCancel={() => setIsEditing(false)}
        />
      ) : (
        <div className="mb-2">{comment.content}</div>
      )}

      <div className="flex gap-3 items-center text-sm mb-2">
        <button
          onClick={handleLike}
          className={`flex items-center gap-1 ${comment.likes.includes(userId) ? "text-red-500" : "text-gray-500"}`}
        >
          {comment.likes.includes(userId) ? "❤️" : "♡"} {comment.likes.length}
        </button>
        <button onClick={() => setIsReplying(!isReplying)} className="text-blue-600 hover:underline">
          {isReplying ? "Отмена" : "Ответить"}
        </button>
        {user && user.uid === comment.authorId && (
          <>
            <button onClick={() => setIsEditing(true)} title="Редактировать">
              ✏️
            </button>
            <button onClick={handleDelete} title="Удалить">
              🗑️
            </button>
          </>
        )}
      </div>

      {isReplying && (
        <ReplyForm postId={postId} parentId={parentId} onSuccess={() => setIsReplying(false)} />
      )}

      {comment.replyCount > 0 && (
        <button onClick={loadReplies} disabled={isLoadingReplies} className="text-xs text-blue-500">
          {isLoadingReplies ? "Загрузка..." : `Показать ответы (${comment.replyCount})`}
        </button>
      )}

      {depth < MAX_DEPTH && (
        <RepliesList
          replies={replies}
          postId={postId}
          parentId={parentId}
          currentDepth={depth}
        />
      )}
    </div>
  );
};

export default CommentItem;
