import { Paging } from '@elastic/react-search-ui';

export default function CustomPaging() {
  return (
    <Paging
      view={({ current = 1, totalPages, onChange }) => {
        const pageNumbers = [];
        const maxVisiblePages = 3; // スマホ用に表示する最大ページ数

        if (totalPages <= maxVisiblePages) {
          pageNumbers.push(...Array.from({ length: totalPages }, (_, i) => i + 1));
        } else {
          const startPage = Math.max(1, current - 1);
          const endPage = Math.min(totalPages, current + 1);

          if (startPage > 1) pageNumbers.push(1, '...');
          pageNumbers.push(
            ...Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i)
          );
          if (endPage < totalPages) pageNumbers.push('...', totalPages);
        }

        return (
          <nav className="flex justify-center">
            <ul className="flex space-x-2">
              {pageNumbers.map((page, index) => (
                <li key={index}>
                  {typeof page === 'number' ? (
                    <button
                      onClick={() => onChange(page)}
                      className={`px-4 py-2 text-sm font-medium rounded-md transition-colors
                      ${
                        current === page
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      {page}
                    </button>
                  ) : (
                    <span className="px-4 py-2 text-sm font-medium text-gray-500">{page}</span>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        );
      }}
    />
  );
}
