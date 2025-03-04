import { useTranslations } from 'next-intl';
import { SearchBox } from '@elastic/react-search-ui';

export default function CustomSearchBox() {
  const t = useTranslations('Search');

  return (
    <SearchBox
      view={({ onChange, onSubmit, value }) => (
        <form
          onSubmit={(e) => {
            onSubmit(e);
          }}
          className="w-full"
        >
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="search"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={t('placeholder')}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 inline-flex items-center gap-2"
            >
              <span>{t('search')}</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
          </div>
        </form>
      )}
    />
  );
}
