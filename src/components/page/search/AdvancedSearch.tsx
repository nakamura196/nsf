'use client';

import type { FilterValue, FilterType, Filter } from '@elastic/search-ui';
import { withSearch } from '@elastic/react-search-ui';

import { useState, useEffect } from 'react';
import { FaPlus, FaMinus, FaSearch } from 'react-icons/fa';
import { useTranslations } from 'next-intl';

interface SearchCondition {
  id: number;
  field: string;
  value: string;
  operator: 'AND' | 'OR';
}

type Props = {
  setSearchTerm: (searchTerm: string) => void;
  setFilter: (name: string, value: FilterValue, type?: FilterType) => void;
  removeFilter: (name: string, value?: FilterValue, type?: FilterType) => void;
  filters: Filter[];
};
const FIELDS = [
  { value: 'q', label: 'All' },
  { value: 'title', label: 'Title' },
  { value: 'subject', label: 'Subject' },
];

function AdvancedSearch({ setSearchTerm, setFilter, removeFilter, filters }: Props) {
  const [conditions, setConditions] = useState<SearchCondition[]>([
    { id: 1, field: 'q', value: '', operator: 'AND' },
  ]);

  const t = useTranslations('Search');

  // filtersから初期値を設定
  useEffect(() => {
    const newConditions: SearchCondition[] = [];
    let nextId = 1;

    filters.forEach((filter) => {
      const field = filter.field;
      if (!filter.field.startsWith('in:')) {
        // 通常の検索条件の処理
        const values = filter.values;
        values.forEach((value, index) => {
          newConditions.push({
            id: nextId++,
            field,
            value: value as string,
            operator: index === 0 ? 'AND' : filter.type === 'any' ? 'OR' : 'AND',
          });
        });
      }
    });

    if (newConditions.length > 0) {
      setConditions(
        newConditions.length > 0
          ? newConditions
          : [{ id: 1, field: 'q', value: '', operator: 'AND' }]
      );
    }
  }, [filters]);

  const addCondition = () => {
    const newId = Math.max(...conditions.map((c) => c.id), 0) + 1;
    setConditions([...conditions, { id: newId, field: 'q', value: '', operator: 'AND' }]);
  };

  const removeCondition = (id: number) => {
    if (conditions.length > 1) {
      const condition = conditions.find((c) => c.id === id);
      if (condition) {
        removeFilter(condition.field);
      }
      setConditions(conditions.filter((c) => c.id !== id));
    }
  };

  const updateCondition = (id: number, updates: Partial<SearchCondition>) => {
    setConditions(
      conditions.map((condition) => {
        if (condition.id === id) {
          const updatedCondition = { ...condition, ...updates };
          if (updates.value !== undefined) {
            // setFilter(condition.field, updates.value);
          }
          return updatedCondition;
        }
        return condition;
      })
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 検索実行のロジックをここに追加

    setSearchTerm('');

    const advancedFilters: Record<string, SearchCondition[]> = {};

    for (const condition of conditions) {
      if (!advancedFilters[condition.field]) {
        advancedFilters[condition.field] = [];
      }
      advancedFilters[condition.field].push(condition);
    }

    for (const [field, conditions] of Object.entries(advancedFilters)) {
      // setFilter(field, conditions, 'all');
      let operator: FilterType = 'all';
      const values: FilterValue = [];
      for (const condition of conditions) {
        if (condition.operator === 'OR') {
          operator = 'any';
          // break;
        }
        if (condition.value) {
          values.push(condition.value);
        }
      }
      removeFilter(field);
      if (values.length > 0) {
        setFilter(field, values, operator);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex justify-end">
        <button
          type="submit"
          className="inline-flex items-center gap-2 px-6 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
        >
          <FaSearch className="w-4 h-4" />
          <span>{t('search')}</span>
        </button>
      </div>

      <div className="space-y-4">
        {conditions.map((condition, index) => (
          <div key={condition.id} className="space-y-2">
            {index > 0 && (
              <select
                value={condition.operator}
                onChange={(e) =>
                  updateCondition(condition.id, { operator: e.target.value as 'AND' | 'OR' })
                }
                className="block w-24 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm"
              >
                <option value="AND">AND</option>
                <option value="OR">OR</option>
              </select>
            )}

            <div className="flex gap-2">
              <select
                value={condition.field}
                onChange={(e) => updateCondition(condition.id, { field: e.target.value })}
                className="block w-40 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm"
              >
                {FIELDS.map((field) => (
                  <option key={field.value} value={field.value}>
                    {field.label}
                  </option>
                ))}
              </select>

              <input
                type="text"
                value={condition.value}
                onChange={(e) => updateCondition(condition.id, { value: e.target.value })}
                className="flex-1 block bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm"
                placeholder={t('placeholder')}
              />

              <button
                onClick={() => removeCondition(condition.id)}
                className="p-2 text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 transition-colors"
                disabled={conditions.length === 1}
              >
                <FaMinus className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={addCondition}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
        >
          <FaPlus className="w-4 h-4" />
          {t('addCondition')}
        </button>
      </div>
    </form>
  );
}

// 3. withSearchで必要なpropsを注入し、残りのpropsの型を指定
export default withSearch(({ setSearchTerm, setFilter, removeFilter, filters }) => ({
  setSearchTerm,
  setFilter,
  removeFilter,
  filters,
}))(AdvancedSearch) as React.ComponentType<
  Omit<Props, 'setFilter' | 'removeFilter' | 'setSearchTerm' | 'filters'>
>;
