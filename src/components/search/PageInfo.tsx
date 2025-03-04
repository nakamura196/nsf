import { PagingInfo } from '@elastic/react-search-ui';
import { useTranslations } from 'next-intl';
export default function PageInfo() {
  const t = useTranslations('Search');
  return (
    <PagingInfo
      view={({
        start,
        end,
        totalResults,
      }: {
        start: number;
        end: number;
        totalResults: number;
      }) => (
        <div className="text-sm text-gray-600 dark:text-gray-300">
          {totalResults > 0 ? (
            <p>
              {t('showing')}{' '}
              <span className="font-medium text-gray-900 dark:text-gray-100">
                {start} - {end}
              </span>{' '}
              {t('of')}{' '}
              <span className="font-medium text-gray-900 dark:text-gray-100">{totalResults}</span>{' '}
              {t('results')}
            </p>
          ) : (
            <></>
          )}
        </div>
      )}
    />
  );
}
