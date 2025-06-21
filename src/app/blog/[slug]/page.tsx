import { notFound } from 'next/navigation';
import { getPostSlugs, getPostBySlug } from '../../../lib/posts';

type Params = { slug: string };

export async function generateStaticParams() {
  // Для SSG/ISR: сгенерировать пути для всех постов
  const slugs = getPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Params }) {
  // Для SEO: динамический title/description
  const post = await getPostBySlug(params.slug).catch(() => null);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
  };
}

export default async function ArticlePage({ params }: { params: Params }) {
  let post;
  try {
    post = await getPostBySlug(params.slug);
  } catch {
    notFound(); // 404 если нет поста
  }

  return (
    <article className="prose prose-lg mx-auto bg-white p-8 rounded shadow my-8">
      <h1>{post.title}</h1>
      <p className="text-gray-500 mb-2">
        {post.date} {post.authorName && <>| {post.authorName}</>}
      </p>
      <div dangerouslySetInnerHTML={{ __html: post.contentHtml }} />
      <div className="mt-8">
        <a href="/blog" className="text-blue-600 hover:underline">&larr; Назад к блогу</a>
      </div>
    </article>
  );
}
