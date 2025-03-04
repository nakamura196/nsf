export type SortOption = {
  name: string;
  value: string;
  direction: 'asc' | 'desc';
};

export type FacetOption = {
  label: string;
  field: string;
  sortField: 'count' | 'value';
  sortDirection: 'asc' | 'desc';
};
