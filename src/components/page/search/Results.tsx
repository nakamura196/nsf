import { withSearch } from '@elastic/react-search-ui';
import type { SearchResult } from '@elastic/search-ui';

interface ResultsProps {
  results: SearchResult[];
}

import type { FuseRecord } from '@/components/page/search/type';

function CustomResults({ results }: ResultsProps) {
  return (
    <div className="space-y-6">
      {results.length > 0 ? (
        results.map((result) => {
          // SearchResultをFuseRecordとして扱う
          const fuseResult = result as unknown as FuseRecord;
          return (
            <div
              key={fuseResult.id}
              className="border p-4 rounded dark:border-gray-700 dark:bg-gray-800 flex gap-4"
            >
              {fuseResult.attributes.filename && (
                <div className="flex-shrink-0">
                  <img
                    src={fuseResult.attributes.filename as string}
                    alt={fuseResult.attributes.title as string}
                    className="w-24 h-24 object-cover rounded"
                  />
                </div>
              )}
              <div>
                <h3 className="font-bold text-gray-900 dark:text-gray-100">
                  {fuseResult.attributes.title}
                </h3>
                {fuseResult.attributes.subject && (
                  <div className="mt-2 text-gray-600 dark:text-gray-300">
                    {Array.isArray(fuseResult.attributes.subject)
                      ? fuseResult.attributes.subject.join(', ')
                      : fuseResult.attributes.subject}
                  </div>
                )}
              </div>
            </div>
          );
        })
      ) : (
        <></>
      )}
    </div>
  );
}

export default withSearch(({ results }) => ({
  results,
}))(CustomResults);
