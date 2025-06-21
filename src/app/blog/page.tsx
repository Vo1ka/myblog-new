import ArticleCard from "@/components/ArticleCard/ArticleCard";
import { getAllPosts } from "@/lib/posts";
import { Post } from "@/types/post";

export default async function BlogPage() {
  const posts: Post[] = await getAllPosts();

  return (
    <section>
      <h2 className="text-2xl font-bold mb-4">Блог</h2>
      {posts.length > 0 ? (
        <div className="grid md:grid-cols-2 gap-6">
          {posts.map((post) => (
            <ArticleCard
              key={post.slug}
              slug={post.slug}
              title={post.title}
              description={post.description}
              date={post.date}
            />
          ))}
        </div>
      ) : (
        <p>Постов нет!</p>
      )}
    </section>
  );
}
