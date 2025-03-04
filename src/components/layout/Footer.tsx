import { getTranslations } from 'next-intl/server';

// async
export default async function Footer() {
  const t = await getTranslations('Common');

  return (
    <footer className="bg-gray-100 dark:bg-gray-800 pt-16 pb-8">
      <div className="container mx-auto px-4">
        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-200 dark:border-gray-700">
          <div className="flex justify-center items-center">
            <p className="text-gray-600 dark:text-gray-300">{t('title')}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
