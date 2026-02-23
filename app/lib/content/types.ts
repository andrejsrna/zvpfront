export interface ContentTerm {
  id: number;
  name: string;
  slug: string;
  taxonomy: 'category' | 'post_tag';
}

export interface ContentPost {
  id: number;
  date: string;
  modified: string;
  slug: string;
  title: { rendered: string };
  excerpt: { rendered: string };
  content: { rendered: string };
  categories: ContentTerm[];
  tags: ContentTerm[];
  featuredImage?: string;
  seoTitle?: string;
  seoDescription?: string;
}

export interface ContentCategory {
  id: number;
  name: string;
  slug: string;
  count: number;
  description: string;
  link: string;
  taxonomy: 'category';
  parent: number;
  children?: ContentCategory[];
}

export interface ContentTag {
  id: number;
  name: string;
  slug: string;
  count: number;
  taxonomy: 'post_tag';
}

export interface ContentSearchResult {
  posts: ContentPost[];
  total: number;
  totalPages: number;
}
