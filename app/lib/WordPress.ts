import { unstable_cache } from 'next/cache';
import { safeHeDecode } from './sanitizeHTML';

// Types
interface WordPressTerm {
  id: number;
  name: string;
  slug: string;
  taxonomy?: 'category' | 'post_tag';
}

interface WordPressMedia {
  source_url: string;
  alt_text: string;
  media_details?: {
    sizes?: Record<
      string,
      {
        source_url: string;
        width: number;
        height: number;
      }
    >;
  };
}

interface WordPressReference {
  nazov: string;
  odkaz: string;
}

export interface WordPressPost {
  id: number;
  date: string;
  modified: string;
  title: { rendered: string };
  content: { rendered: string };
  excerpt: { rendered: string };
  slug: string;
  categories: WordPressTerm[];
  meta?: {
    post_views?: number;
    _zdroje_referencie?: WordPressReference[];
    rank_math_title?: string;
    rank_math_description?: string;
  };
  tags: WordPressTerm[];
  featured_media?: number;
  _embedded?: {
    'wp:featuredmedia'?: WordPressMedia[];
    'wp:term'?: WordPressTerm[][];
  };
}

export interface WordPressCategory extends WordPressTerm {
  count: number;
  description: string;
  link: string;
  taxonomy: 'category' | 'post_tag';
  parent: number;
  children?: WordPressCategory[];
}

// Constants
const API_CONFIG = {
  BASE_URL: 'https://admin.zdravievpraxi.sk/wp-json',
  TIMEOUT: 3000,
  SEARCH_TIMEOUT: 5000,
  REVALIDATE: {
    POSTS: 3600,
    CATEGORIES: 7200,
    SINGLE_POST: 1800,
    SEARCH: 0,
  },
} as const;

// API Client
class WordPressClient {
  private static getApiUrl(): string {
    return typeof window === 'undefined' ? API_CONFIG.BASE_URL : '/wp-json';
  }

  private static extractRankMathMeta(
    head: string
  ): { title?: string; description?: string } {
    const titleMatch = head.match(/<title>([^<]*)<\/title>/i);
    const descriptionMatch = head.match(
      /<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i
    );

    return {
      title: titleMatch ? safeHeDecode(titleMatch[1].trim()) : undefined,
      description: descriptionMatch
        ? safeHeDecode(descriptionMatch[1].trim())
        : undefined,
    };
  }

  private static async fetchWithTimeout(
    url: string,
    options: RequestInit = {},
    timeout: number = API_CONFIG.TIMEOUT
  ): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(
          `API Error: ${response.status} - ${response.statusText}`
        );
      }

      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error(`Request timeout after ${timeout}ms`);
      }
      throw error;
    }
  }

  static transformUrl(url: string): string {
    if (!url) return url;
    return typeof window !== 'undefined' && url.includes(API_CONFIG.BASE_URL)
      ? url.replace(API_CONFIG.BASE_URL, '')
      : url;
  }

  static async fetch<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    try {
      const url = `${this.getApiUrl()}${endpoint}`;
      const response = await this.fetchWithTimeout(url, options);
      return response.json();
    } catch (error) {
      console.error(`WordPress API Error for ${endpoint}:`, error);
      throw error;
    }
  }

  private static async getPostsUncached(
    perPage: number = 12,
    orderby: string = 'date',
    categoryId?: number,
    page: number = 1
  ): Promise<WordPressPost[]> {
    const categoryParam = categoryId
      ? `&categories=${categoryId}&include_children=true`
      : '';
    const posts = await this.fetch<WordPressPost[]>(
      `/wp/v2/posts?_embed&per_page=${perPage}&orderby=${orderby}&order=desc${categoryParam}&page=${page}`
    );

    // Process embedded terms for categories and tags
    return posts.map(post => {
      if (post._embedded?.['wp:term']) {
        post.categories = post._embedded['wp:term'][0] || post.categories;
        post.tags = post._embedded['wp:term'][1] || post.tags;
      }
      return post;
    });
  }

  private static async getCategoriesUncached(): Promise<WordPressCategory[]> {
    return this.fetch<WordPressCategory[]>(
      '/wp/v2/categories?per_page=100&orderby=count&order=desc'
    );
  }

  // Server-side cached versions
  private static getPostsCached = unstable_cache(
    async (
      perPage: number = 12,
      orderby: string = 'date',
      categoryId?: number,
      page: number = 1
    ) => {
      try {
        return await this.getPostsUncached(perPage, orderby, categoryId, page);
      } catch (error) {
        console.error('Error fetching posts:', error);
        return [];
      }
    },
    ['wordpress-posts'],
    {
      revalidate: API_CONFIG.REVALIDATE.POSTS,
      tags: ['posts'],
    }
  );

  private static getCategoriesCached = unstable_cache(
    async () => {
      try {
        return await this.getCategoriesUncached();
      } catch (error) {
        console.error('Error fetching categories:', error);
        return [];
      }
    },
    ['wordpress-categories'],
    {
      revalidate: API_CONFIG.REVALIDATE.CATEGORIES,
      tags: ['categories'],
    }
  );

  // Public methods that choose cached or uncached based on environment
  static async getPosts(
    perPage: number = 12,
    orderby: string = 'date',
    categoryId?: number,
    page: number = 1
  ): Promise<WordPressPost[]> {
    // Use cached version only on server-side
    if (typeof window === 'undefined') {
      return this.getPostsCached(perPage, orderby, categoryId, page);
    }
    // Use uncached version on client-side
    try {
      return await this.getPostsUncached(perPage, orderby, categoryId, page);
    } catch (error) {
      console.error('Error fetching posts:', error);
      return [];
    }
  }

  static async getCategories(): Promise<WordPressCategory[]> {
    // Use cached version only on server-side
    if (typeof window === 'undefined') {
      return this.getCategoriesCached();
    }
    // Use uncached version on client-side
    try {
      return await this.getCategoriesUncached();
    } catch (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
  }

  static async getPostBySlug(slug: string): Promise<WordPressPost | null> {
    try {
      // Validate slug format
      if (!slug || typeof slug !== 'string' || slug.trim() === '') {
        console.warn('Invalid slug provided:', slug);
        return null;
      }

      // Sanitize slug to prevent issues
      const cleanSlug = slug.trim().toLowerCase();

      const url = `${this.getApiUrl()}/wp/v2/posts?_embed&slug=${encodeURIComponent(cleanSlug)}`;
      const response = await this.fetchWithTimeout(url, {}, API_CONFIG.TIMEOUT);
      const posts = await response.json();

      if (!Array.isArray(posts) || posts.length === 0) {
        console.info(`No post found for slug: ${cleanSlug}`);
        return null;
      }

      const post = posts[0];

      if (post._embedded?.['wp:term']) {
        post.categories = post._embedded['wp:term'][0] || post.categories;
        post.tags = post._embedded['wp:term'][1] || post.tags;
      }

      return post;
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('404')) {
          console.info(`Post not found for slug: ${slug}`);
          return null;
        }
        if (error.message.includes('timeout')) {
          console.warn(`Request timeout for slug: ${slug}`);
          return null;
        }
      }
      console.error('Error fetching post:', error);
      return null;
    }
  }

  static async getRandomPost(): Promise<WordPressPost[]> {
    try {
      const url = `${this.getApiUrl()}/custom/v1/random-posts`;
      const response = await this.fetchWithTimeout(url);
      return response.json();
    } catch (error) {
      console.error('Error fetching random posts:', error);
      return [];
    }
  }

  static async getRankMathSeo(
    post: WordPressPost
  ): Promise<{ title?: string; description?: string }> {
    if (!post?.id || !post.slug) return {};

    const baseUrl =
      process.env.NEXT_PUBLIC_SITE_URL || 'https://admin.zdravievpraxi.sk';
    const urlParam = `${baseUrl.replace(/\/$/, '')}/${post.slug}`;
    const apiUrl = `${this.getApiUrl()}/rankmath/v1/getHead?objectID=${post.id}&objectType=post&url=${encodeURIComponent(urlParam)}`;

    try {
      const response = await this.fetchWithTimeout(apiUrl, {});
      const data = await response.json();

      if (!data?.success || !data.head || typeof data.head !== 'string') {
        return {};
      }

      return this.extractRankMathMeta(data.head);
    } catch (error) {
      console.warn('Rank Math meta fetch failed:', error);
      return {};
    }
  }

  static async searchPosts(
    query: string,
    perPage: number = 10,
    page: number = 1
  ): Promise<{ posts: WordPressPost[]; total: number; totalPages: number }> {
    try {
      // Clean and prepare search query
      const cleanQuery = query.trim().toLowerCase();

      // Use multiple search parameters for better relevance
      const searchParams = new URLSearchParams({
        search: cleanQuery,
        per_page: perPage.toString(),
        page: page.toString(),
        _embed: '1',
        // Add search in title and content
        search_fields: 'title,content,excerpt',
        // Order by relevance (WordPress default)
        orderby: 'relevance',
        order: 'desc',
      });

      const url = `${this.getApiUrl()}/wp/v2/posts?${searchParams.toString()}`;

      const response = await this.fetchWithTimeout(
        url,
        {},
        API_CONFIG.SEARCH_TIMEOUT
      );
      const posts = await response.json();
      const total = parseInt(response.headers.get('X-WP-Total') || '0');
      const totalPages = parseInt(
        response.headers.get('X-WP-TotalPages') || '0'
      );

      // Process embedded terms for categories and tags
      const processedPosts = posts.map((post: WordPressPost) => {
        if (post._embedded?.['wp:term']) {
          post.categories = post._embedded['wp:term'][0] || post.categories;
          post.tags = post._embedded['wp:term'][1] || post.tags;
        }
        return post;
      });

      // Sort posts by relevance using WordPress's built-in relevance ordering
      // The API already returns posts ordered by relevance when using search parameter
      return {
        posts: processedPosts,
        total,
        totalPages,
      };
    } catch (error) {
      console.error('Error searching posts:', error);
      return { posts: [], total: 0, totalPages: 0 };
    }
  }

  // Advanced search with better relevance scoring
  static async advancedSearch(
    query: string,
    perPage: number = 10,
    page: number = 1
  ): Promise<{ posts: WordPressPost[]; total: number; totalPages: number }> {
    try {
      const cleanQuery = query.trim().toLowerCase();
      const queryWords = cleanQuery.split(' ').filter(word => word.length > 2);

      // Get more results than needed for better scoring
      const searchParams = new URLSearchParams({
        search: cleanQuery,
        per_page: Math.min(perPage * 2, 50).toString(), // Get more results for better scoring
        page: '1', // Always get first page for scoring
        _embed: '1',
        orderby: 'relevance',
        order: 'desc',
      });

      const url = `${this.getApiUrl()}/wp/v2/posts?${searchParams.toString()}`;
      const response = await this.fetchWithTimeout(
        url,
        {},
        API_CONFIG.SEARCH_TIMEOUT
      );
      const allPosts = await response.json();
      const total = parseInt(response.headers.get('X-WP-Total') || '0');

      // Process embedded terms
      const processedPosts = allPosts.map((post: WordPressPost) => {
        if (post._embedded?.['wp:term']) {
          post.categories = post._embedded['wp:term'][0] || post.categories;
          post.tags = post._embedded['wp:term'][1] || post.tags;
        }
        return post;
      });

      // Score posts based on relevance
      const scoredPosts = processedPosts.map((post: WordPressPost) => {
        const title = post.title.rendered.toLowerCase();
        const content = post.content.rendered.toLowerCase();
        const excerpt = post.excerpt.rendered.toLowerCase();

        let score = 0;

        // Score individual words
        queryWords.forEach(word => {
          if (title.includes(word)) score += 15;
          if (content.includes(word)) score += 5;
          if (excerpt.includes(word)) score += 3;
        });

        // Exact phrase matches get bonus
        if (title.includes(cleanQuery)) score += 30;
        if (content.includes(cleanQuery)) score += 15;

        // Recent posts get small bonus
        const postDate = new Date(post.date);
        const daysSincePublished =
          (Date.now() - postDate.getTime()) / (1000 * 60 * 60 * 24);
        if (daysSincePublished < 30) score += 2;
        if (daysSincePublished < 7) score += 3;

        return { post, score };
      });

      // Sort by score and take only requested number
      scoredPosts.sort(
        (
          a: { post: WordPressPost; score: number },
          b: { post: WordPressPost; score: number }
        ) => b.score - a.score
      );
      const paginatedPosts = scoredPosts
        .slice((page - 1) * perPage, page * perPage)
        .map((item: { post: WordPressPost; score: number }) => item.post);

      const totalPages = Math.ceil(Math.min(total, perPage * 2) / perPage);

      return {
        posts: paginatedPosts,
        total: Math.min(total, perPage * 2),
        totalPages,
      };
    } catch (error) {
      console.error('Error in advanced search:', error);
      return { posts: [], total: 0, totalPages: 0 };
    }
  }
}

// Export public API with proper context binding
export const transformUrl = WordPressClient.transformUrl.bind(WordPressClient);
export const getPosts = WordPressClient.getPosts.bind(WordPressClient);
export const getPostBySlug =
  WordPressClient.getPostBySlug.bind(WordPressClient);
export const getCategories =
  WordPressClient.getCategories.bind(WordPressClient);
export const getRandomPost =
  WordPressClient.getRandomPost.bind(WordPressClient);
export const searchPosts = WordPressClient.searchPosts.bind(WordPressClient);
export const advancedSearch =
  WordPressClient.advancedSearch.bind(WordPressClient);
export const getRankMathSeo =
  WordPressClient.getRankMathSeo.bind(WordPressClient);
