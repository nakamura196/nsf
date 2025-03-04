import { ResultsPerPage } from '@elastic/react-search-ui';

export default function CustomPerPage({ options }: { options: number[] }) {
  return (
    <ResultsPerPage
      options={options}
      view={({ value, options, onChange }) => (
        <select
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="border border-gray-300 dark:border-gray-600 rounded-md px-2 py-1"
        >
          {options?.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      )}
    />
  );
}
