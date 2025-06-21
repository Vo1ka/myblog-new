import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-blue-600 text-white p-4 shadow">
      <nav className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          <Link href="/">My Blog</Link>
        </h1>
        <ul className="flex gap-6">
          <li><Link className="hover:underline" href="/">Главная</Link></li>
          <li><Link className="hover:underline" href="/about">О нас</Link></li>
          <li><Link className="hover:underline" href="/blog">Блог</Link></li>
          <li><Link className="hover:underline" href="/contact">Контакты</Link></li>
        </ul>
      </nav>
    </header>
  );
}
