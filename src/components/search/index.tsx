'use client';

import { SearchProvider } from '@elastic/react-search-ui';
import { useRef } from 'react';
import CustomPageInfo from '@/components/search/PageInfo';
import CustomSorting from '@/components/search/Sorting';
import CustomPerPage from '@/components/search/PerPage';
import CustomPaging from '@/components/search/Paging';
import CustomFacet from '@/components/search/Facet';
import { useTranslations } from 'next-intl';
import { SearchDriverOptions } from '@elastic/search-ui';
import { SortOption } from '@/components/types/search';
// 共通の検索UIコンポーネントを作成
const SearchUI = ({
  config,
  sortOptions,
  perPageOptions,
  facets,
  children,
}: {
  config: SearchDriverOptions;
  sortOptions: SortOption[];
  perPageOptions: number[];
  facets: {
    field: string;
    label: string;
  }[];
  children: {
    // facets: React.ReactNode;
    results: React.ReactNode;
    searchForm: React.ReactNode;
  };
}) => {
  const t = useTranslations('Search');
  const searchContainerRef = useRef<HTMLDivElement>(null);

  return (
    <SearchProvider config={config}>
      <div className="px-8" ref={searchContainerRef}>
        {children.searchForm}

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
          <CustomPageInfo />

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 dark:text-gray-300">{t('sort')}:</span>
              <CustomSorting sortOptions={sortOptions} />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 dark:text-gray-300">{t('show')}:</span>
              <CustomPerPage options={perPageOptions} />
            </div>
          </div>
        </div>

        {/* メインコンテンツ */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* ファセット（左サイドバー） */}
          <div className="w-full lg:w-[20%] shrink-0">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 space-y-6">
              {facets.map((facet) => (
                <CustomFacet key={facet.field} field={facet.field} label={facet.label} />
              ))}
            </div>
          </div>

          {/* 検索結果（右メイン） */}
          <div className="flex-grow">
            {children.results}

            {/* ページネーション */}
            <div className="mt-8">
              <CustomPaging />
            </div>
          </div>
        </div>
      </div>
    </SearchProvider>
  );
};

export default SearchUI;
