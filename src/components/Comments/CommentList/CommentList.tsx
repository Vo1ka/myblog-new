'use client';

import CommentItem from "../CommentItem/CommentItem";
import type { PostComment } from "@/types/comment";

interface CommentListProps {
  comments: PostComment[];
  postId: string;
}

const CommentList = ({ comments, postId }: CommentListProps) => {
  return (
    <ul className="space-y-4">
      {comments.map((comment) => (
        <li key={comment.id}>
          <CommentItem
            comment={comment}
            postId={postId}
            parentId={null}
            depth={0}
          />
        </li>
      ))}
    </ul>
  );
};

export default CommentList;
