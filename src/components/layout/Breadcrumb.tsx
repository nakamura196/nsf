import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';

export default function Breadcrumb({ items }: { items: { title: string; href?: string }[] }) {
  const t = useTranslations('Common');
  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <nav className="mb-6 md:mb-8 text-sm text-gray-500 dark:text-gray-400">
        <Link href={`/`} className="hover:text-gray-700 dark:hover:text-gray-200">
          {t('home')}
        </Link>

        {items.map((item, i) => (
          <span key={i}>
            <span className="mx-2 text-gray-400 dark:text-gray-500">›</span>
            {item.href ? (
              <Link href={item.href} className="hover:text-gray-700 dark:hover:text-gray-200">
                {item.title}
              </Link>
            ) : (
              <span className="text-gray-700 dark:text-gray-300">{item.title}</span>
            )}
          </span>
        ))}
      </nav>
    </div>
  );
}
