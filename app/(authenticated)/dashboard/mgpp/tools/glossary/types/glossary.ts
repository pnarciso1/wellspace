export interface GlossaryTerm {
  id: string;
  term: string;
  definition: string;
  etymology?: string;
  descriptors?: string[];
  categories: string[];
  related_terms: string[];
  created_at: string;
  updated_at: string;
}

export type GlossaryCategory = 
  | 'symptoms'
  | 'procedures'
  | 'conditions'
  | 'medications'
  | 'anatomy'
  | 'medical_terms';

export interface GlossaryFilters {
  search?: string;
  category?: GlossaryCategory;
  sortBy?: 'alphabetical' | 'recent';
}

// Helper type for search results
export interface GlossarySearchResult {
  terms: GlossaryTerm[];
  totalCount: number;
  hasMore: boolean;
}

// Helper type for term relationships
export interface RelatedTermInfo {
  term: string;
  category: string;
  definition: string;
} 