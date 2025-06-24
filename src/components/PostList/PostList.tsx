'use client'

import { RootState, AppDispatch } from "@/store";
import { fetchPostsThunk } from "@/store/posts/thunks";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import PostCard from "../PostCard/PostCard";

export default function PostList() {
  const { items, loading, error } = useSelector((state: RootState) => state.posts);

  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
  dispatch(fetchPostsThunk());
  }, [dispatch]);

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div>Ошибка: {error}</div>;
  return (
    <section>
      <h2 className="text-2xl font-bold mb-4">Блог</h2>
      {items.length > 0 ? (
        <div className="grid md:grid-cols-2 gap-6">
          {items.map((item) => (
            <PostCard
              key={item.id}
              post={item}
            />
          ))}
        </div>
      ) : (
        <p>Постов нет!</p>
      )}
    </section>
  );
}
