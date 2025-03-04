import { Facet, withSearch } from '@elastic/react-search-ui';
import type { FacetValue, FilterValue, FilterType, Facet as FacetType } from '@elastic/search-ui';

interface CustomFacetProps {
  field: string;
  label: string;
  setFilter: (field: string, value: FilterValue, type: string) => void;
  removeFilter: (field: string, value: FilterValue, type: string) => void;
  addFilter: (field: string, value: FilterValue, type: string) => void;
  facets: {
    [key: string]: FacetType[];
  };
}

type Props = {
  field: string;
  label: string;
  setFilter: (name: string, value: FilterValue, type?: FilterType) => void;
  removeFilter: (name: string, value?: FilterValue, type?: FilterType) => void;
  addFilter: (name: string, value: FilterValue, type?: FilterType) => void;
};

function CustomFacet({ field, label, removeFilter, addFilter, facets }: CustomFacetProps) {
  const customView = ({ options }: { values: FilterValue[]; options: FacetValue[] }) => {
    const onChange = (value: FacetValue) => {
      if (!value.selected) {
        // setFilter(`${field}`, value.value, 'any');
        addFilter(`${field}`, value.value, 'any');
      } else {
        removeFilter(`${field}`, value.value, 'any');
      }
    };

    const facetOptions = facets[field][0].data || options;

    return (
      <>
        <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-3">{label}</h3>
        <div className="space-y-2">
          {facetOptions.map((value, i) => (
            <div key={i} className="flex items-center">
              <label className="flex items-center space-x-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={value.selected}
                  onChange={() => onChange(value)}
                  style={{ accentColor: '#2563eb' }}
                  className="w-4 h-4 cursor-pointer"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-100">
                  {String(value.value)}
                  <span className="ml-2 text-gray-500 dark:text-gray-400">({value.count})</span>
                </span>
              </label>
            </div>
          ))}
        </div>
      </>
    );
  };

  return (
    <Facet field={field} label={label} isFilterable={false} filterType="any" view={customView} />
  );
}

export default withSearch(({ setFilter, removeFilter, addFilter, facets }) => {
  return {
    setFilter,
    removeFilter,
    addFilter,
    facets,
  };
})(CustomFacet) as React.ComponentType<Omit<Props, 'setFilter' | 'removeFilter' | 'addFilter'>>;
