import { Sorting } from '@elastic/react-search-ui';
import { SortOption } from '@/components/types/search';
export default function CustomSorting({ sortOptions }: { sortOptions: SortOption[] }) {
  return (
    <div className="flex items-center gap-2">
      <Sorting
        sortOptions={sortOptions}
        view={({
          onChange,
          value,
          options,
        }: {
          onChange: (value: string) => void;
          value: string;
          options: {
            label: string;
            value: string;
          }[];
        }) => (
          <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="border border-gray-300 dark:border-gray-600 rounded-md px-2 py-1"
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        )}
      />
    </div>
  );
}
