import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import CustomSearchBox from '@/components/search/SearchBox';
import AdvancedSearch from '@/components/page/search/AdvancedSearch';

export default function SearchForm() {
  const t = useTranslations('Search');
  const [isAdvancedSearch, setIsAdvancedSearch] = useState(() => {
    // 初期値をセッションストレージから取得
    if (typeof window !== 'undefined') {
      const saved = sessionStorage.getItem('searchMode');
      return saved === 'advanced';
    }
    return false;
  });

  // 検索モードが変更されたらセッションストレージに保存
  useEffect(() => {
    sessionStorage.setItem('searchMode', isAdvancedSearch ? 'advanced' : 'simple');
  }, [isAdvancedSearch]);
  {
    /* 簡易検索と詳細検索を切り替えるボタン */
  }
  return (
    <div className="container mx-auto px-4">
      <div className="flex items-center gap-2 mb-6">
        <button
          className={`
            inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800
            ${
              !isAdvancedSearch
                ? 'text-white bg-blue-600 hover:bg-blue-700'
                : 'text-blue-600 bg-blue-50 hover:bg-blue-100 dark:text-blue-400 dark:bg-blue-900/20 dark:hover:bg-blue-900/30'
            }
          `}
          onClick={() => setIsAdvancedSearch(false)}
        >
          {t('simpleSearch')}
        </button>

        <button
          className={`
            inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800
            ${
              isAdvancedSearch
                ? 'text-white bg-blue-600 hover:bg-blue-700'
                : 'text-blue-600 bg-blue-50 hover:bg-blue-100 dark:text-blue-400 dark:bg-blue-900/20 dark:hover:bg-blue-900/30'
            }
          `}
          onClick={() => setIsAdvancedSearch(true)}
        >
          {t('advancedSearch')}
        </button>
      </div>

      <div className="w-full max-w-2xl mx-auto mb-8">
        {isAdvancedSearch ? <AdvancedSearch /> : <CustomSearchBox />}
      </div>
    </div>
  );
}
