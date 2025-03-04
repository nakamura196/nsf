// カスタムコネクタの作成
import Fuse from 'fuse.js';
import type { FuseResult } from 'fuse.js';
import type {
  RequestState,
  Filter,
  APIConnector,
  ResponseState,
  AutocompleteResponseState,
} from '@elastic/search-ui';

import type { FuseRecord } from '@/components/page/search/type';
import type { FacetOption } from '@/components/types/search';

export default class FuseConnector implements APIConnector {
  indexPath: string;
  // fuseIndexPath: string;
  fuseInstance: Fuse<FuseRecord> | null;
  allData: FuseRecord[];
  facetOptions: FacetOption[];

  constructor(indexPath: string, facetOptions: FacetOption[]) {
    this.fuseInstance = null;
    this.allData = [];

    this.indexPath = indexPath;
    this.facetOptions = facetOptions;
  }

  async onSearch(state: RequestState): Promise<ResponseState> {
    if (!this.fuseInstance) {
      await this.initialize();
    }

    const searchTerm = state.searchTerm || '';
    const filters = state.filters || [];
    const current = state.current || 1;
    const resultsPerPage = state.resultsPerPage || 10;

    const sortDirection = state.sortDirection || 'desc';
    const sortField = state.sortField || 'score';

    if (this.fuseInstance) {
      // フィルターを適用した検索を実行
      let results: FuseResult<FuseRecord>[] = this.allData.map((item) => ({
        item,
        refIndex: -1,
        score: 1,
      })); // this.fuseInstance.search(searchTerm);

      if (searchTerm) {
        results = this.fuseInstance.search(searchTerm);
      }

      // フィルターの適用
      if (filters.length > 0) {
        const filteredResults = this.applyFilters(
          results.map((result) => result.item),
          filters
        );
        // 結果を Fuse の結果形式に戻す
        results = filteredResults.map((item) => ({ item, refIndex: -1, score: 1 }));
      }

      // ソート処理を追加
      this.sortResults(results, sortField, sortDirection);

      // ページネーション処理
      const startIndex = (current - 1) * resultsPerPage;
      const endIndex = startIndex + resultsPerPage;
      const paginatedResults = results.slice(startIndex, endIndex);

      const facets = this.generateFacets(
        results.map((result) => result.item),
        filters,
        this.facetOptions
      );

      return {
        requestId: '',
        results: paginatedResults.map((result) => result.item),
        totalResults: results.length,
        facets,
        totalPages: Math.ceil(results.length / resultsPerPage),
        // current,
        resultSearchTerm: searchTerm,
        wasSearched: true,
        pagingStart: startIndex + 1,
        pagingEnd: Math.min(endIndex, results.length),
        rawResponse: results,
      };
    }

    // ページネーション処理（検索語がない場合）
    const startIndex = (current - 1) * resultsPerPage;
    const endIndex = startIndex + resultsPerPage;
    const paginatedResults = this.allData.slice(startIndex, endIndex);

    const facets = this.generateFacets(this.allData, filters, this.facetOptions);

    return {
      requestId: '',
      facets,
      resultSearchTerm: searchTerm || '',
      results: paginatedResults,
      totalPages: Math.ceil(this.allData.length / resultsPerPage),
      totalResults: this.allData.length,
      wasSearched: true,
      pagingStart: startIndex + 1,
      pagingEnd: Math.min(endIndex, this.allData.length),
      rawResponse: this.allData,
    };
  }

  removePrefix(field: string) {
    return field.replace('range:', '').replace('in:', '');
  }

  generateFacets(
    items: FuseRecord[],
    filters: Filter[],
    facets: {
      field: string;
      sortField: 'count' | 'value';
      sortDirection: 'asc' | 'desc';
    }[]
  ) {
    // 複数のファセットに対応するための結果オブジェクト
    const result: Record<
      string,
      { data: { value: string; count: number; selected: boolean }[]; type: string; field: string }[]
    > = {};

    // 各ファセットフィールドに対して処理
    facets.forEach((facet) => {
      const facetField = `${facet.field}`; // in:
      const facetCounts: Record<string, number> = {};

      // アイテムを走査して各ファセット値のカウントを集計
      items.forEach((item) => {
        const itemAttribute = item.attributes[facet.field];
        if (itemAttribute) {
          if (Array.isArray(itemAttribute)) {
            itemAttribute.forEach((value) => {
              facetCounts[value] = (facetCounts[value] || 0) + 1;
            });
          } else {
            facetCounts[itemAttribute] = (facetCounts[itemAttribute] || 0) + 1;
          }
        }
      });

      // フィルターから選択された値を取得
      const filterValues = filters?.find((f) => f.field === facetField)?.values || [];

      // ファセットデータを構築
      const facetData = Object.entries(facetCounts)
        .map(([value, count]) => ({
          value,
          count,
          selected: filterValues.includes(value),
        }))
        .filter((item) => item.value);

      if (facet.sortField === 'count') {
        facetData.sort((a, b) => b.count - a.count);
      } else {
        facetData.sort((a, b) => a.value.localeCompare(b.value));
      }

      // 結果オブジェクトに追加
      result[facetField] = [
        {
          data: facetData,
          type: 'value',
          field: facetField,
        },
      ];
    });

    return result;
  }

  async initialize() {
    try {
      const response = await fetch(this.indexPath);

      this.allData = await response.json();

      const options = {
        keys: ['attributes.title', 'attributes.subject'],
        threshold: 0.3,
      };
      this.fuseInstance = new Fuse(this.allData, options);

      return this.allData;
    } catch (error) {
      console.error('データの読み込みに失敗しました:', error);
      return [];
    }
  }

  async onAutocomplete(): Promise<AutocompleteResponseState> {
    return {
      autocompletedResults: [],
      autocompletedResultsRequestId: '',
      autocompletedSuggestions: {},
      autocompletedSuggestionsRequestId: '',
    };
  }
  onResultClick(): void {}

  onAutocompleteResultClick(): void {}

  // フィルターを適用するヘルパーメソッド
  applyFilters(items: FuseRecord[], filters: Filter[]): FuseRecord[] {
    return items.filter((item) => {
      return filters.every((filter) => {
        // フィルターフィールド名からプレフィックスを抽出
        const isExactMatch = filter.field.startsWith('in:');
        const fieldName = this.removePrefix(filter.field);

        if (item.attributes[fieldName]) {
          const itemValue = item.attributes[fieldName];
          let itemValues: string[] = [];
          if (Array.isArray(itemValue)) {
            itemValues = itemValue;
          } else {
            itemValues = [itemValue];
          }
          // プレフィックスに基づいて検索方法を変更
          return filter.values.some((value) => {
            const valueStr = value.toString().toLowerCase();

            if (isExactMatch) {
              // 'in:' プレフィックスがある場合は完全一致
              return itemValues.some((itemValue) => itemValue.toLowerCase() === valueStr);
            } else {
              // プレフィックスがない場合は部分一致
              return itemValues.some((itemValue) => itemValue.toLowerCase().includes(valueStr));
            }
          });
        }

        // 他のフィルタータイプがあれば、ここに追加
        return true;
      });
    });
  }

  // ソート処理を行うヘルパーメソッド
  sortResults(results: FuseResult<FuseRecord>[], sortField: string, sortDirection: string): void {
    results.sort((a, b) => {
      // スコアでのソート（デフォルト）
      if (sortField === 'score') {
        return sortDirection === 'desc'
          ? (b.score || 0) - (a.score || 0)
          : (a.score || 0) - (b.score || 0);
      }

      // 属性フィールドでのソート
      const fieldPath = sortField.split('.');
      const aValue = a.item.attributes[fieldPath[0]];
      const bValue = b.item.attributes[fieldPath[0]];

      // 文字列の場合
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'desc'
          ? bValue.localeCompare(aValue)
          : aValue.localeCompare(bValue);
      }

      // 数値の場合
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'desc' ? bValue - aValue : aValue - bValue;
      }

      // 日付の場合
      if (aValue instanceof Date && bValue instanceof Date) {
        return sortDirection === 'desc'
          ? bValue.getTime() - aValue.getTime()
          : aValue.getTime() - bValue.getTime();
      }

      // 値が存在しない場合
      if (aValue === undefined && bValue !== undefined) return 1;
      if (aValue !== undefined && bValue === undefined) return -1;

      return 0;
    });
  }
}
