import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import { Post } from '../types/post';

const postsDirectory = path.join(process.cwd(), 'content', 'posts');

// Получить все имена файлов (для генерации путей)
export function getPostSlugs(): string[] {
  return fs.readdirSync(postsDirectory)
    .filter((fileName) => fileName.endsWith('.md'))
    .map((fileName) => fileName.replace(/\.md$/, ''));
}

// Получить и распарсить пост по slug (с HTML контентом)
export async function getPostBySlug(slug: string): Promise<Post & { contentHtml: string }> {
  const fullPath = path.join(postsDirectory, `${slug}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  const processedContent = await remark()
    .use(html)
    .process(content);
  const contentHtml = processedContent.toString();

  return {
    slug,
    title: data.title,
    date: data.date,
    description: data.description,
    authorId: data.authorId || '',
    authorName: data.authorName || '',
    contentHtml,
  };
}

// Получить все посты (без HTML, только мета)
export async function getAllPosts(): Promise<Post[]> {
  const fileNames = fs.readdirSync(postsDirectory);

  const posts = fileNames
    .filter((fileName) => fileName.endsWith('.md'))
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, '');
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data } = matter(fileContents);

      return {
        slug,
        title: data.title,
        date: data.date,
        description: data.description,
        authorId: data.authorId || '',
        authorName: data.authorName || '',
      } as Post;
    });

  // Сортировка по дате (сначала новые)
  return posts.sort((a, b) => (a.date < b.date ? 1 : -1));
}
