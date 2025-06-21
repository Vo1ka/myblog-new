import Link from 'next/link';

interface ArticleProps {
  slug: string;
  title: string;
  description: string;
  date: string;
}

const ArticleCard = ({ slug, title, description, date }: ArticleProps) => {
  return (
    <div className="bg-white rounded-lg shadow p-6 flex flex-col justify-between transition hover:shadow-lg">
      <div>
        <h4 className="text-xl font-semibold mb-2">{title}</h4>
        <p className="text-gray-600 mb-4">{description}</p>
      </div>
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-400">{date}</span>
        <Link
          href={`/blog/${slug}`}
          className="text-blue-600 hover:underline font-medium"
        >
          Читать →
        </Link>
      </div>
    </div>
  );
};

export default ArticleCard;
