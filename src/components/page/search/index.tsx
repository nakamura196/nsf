'use client';

import { useState, useEffect } from 'react';
import SearchUI from '@/components/search';
import Loading from '@/components/search/Loading';
import Results from '@/components/page/search/Results';
import SearchForm from '@/components/page/search/form';
import FuseConnector from '@/components/page/search/config';
import { SortOption, FacetOption } from '@/components/types/search';
import { useTranslations } from 'next-intl';

export default function FuseSearch() {
  const [isLoading, setIsLoading] = useState(true);
  const t = useTranslations('Search');

  const sortOptions: SortOption[] = [
    {
      name: `title:${t('asc')}`, // t('title:asc'),
      value: 'title',
      direction: 'asc',
    },
    {
      name: `title:${t('desc')}`, // t('title:desc'),
      value: 'title',
      direction: 'desc',
    },
  ];

  const perPageOptions = [10, 20, 50, 100];

  const facetOptions: FacetOption[] = [
    { label: 'Subject', field: 'subject', sortField: 'count', sortDirection: 'desc' },
    // { label: 'Title', field: 'title', sortField: 'value', sortDirection: 'asc' },
  ];

  const indexPath = '/data/index.json';

  const connector = new FuseConnector(indexPath, facetOptions);

  useEffect(() => {
    connector.initialize().then(() => {
      setIsLoading(false);
    });
  }, []);

  // : SearchDriverOptions
  const config = {
    alwaysSearchOnInitialLoad: true,
    apiConnector: connector,
    searchQuery: {
      facets: {
        subject: {
          type: 'value',
        },
      },
    },
    disjunctiveFacets: ['subject'],
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <SearchUI
      config={config}
      sortOptions={sortOptions}
      perPageOptions={perPageOptions}
      facets={facetOptions}
    >
      {{
        searchForm: <SearchForm />,
        results: <Results />,
      }}
    </SearchUI>
  );
}
