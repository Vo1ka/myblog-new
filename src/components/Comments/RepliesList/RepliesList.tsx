'use client';

import CommentItem from "../CommentItem/CommentItem";
import type { PostComment } from "@/types/comment";

interface RepliesListProps {
  replies: PostComment[];
  postId: string;
  parentId: string | null;
  currentDepth: number;
}

const RepliesList = ({ replies, postId, parentId, currentDepth }: RepliesListProps) => {
  return (
    <div className="ml-6 border-l-2 border-gray-200 pl-4 mt-2">
      {replies.map((reply) => (
        <CommentItem
          key={reply.id}
          comment={reply}
          postId={postId}
          parentId={parentId}
          depth={currentDepth + 1}
        />
      ))}
    </div>
  );
};

export default RepliesList;
