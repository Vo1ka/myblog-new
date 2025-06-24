import { Timestamp } from "firebase/firestore";

export interface PostComment {
    id: string; 
    postId: string; 
    parentId: string | null;
    authorId: string;
    authorName: string;
    authorAvatar: string;
    content: string;
    createdAt: Timestamp;
    updatedAt: Timestamp;
    likes: string[];
    replyCount: number;
  }