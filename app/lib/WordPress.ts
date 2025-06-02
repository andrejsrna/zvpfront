// Types
type WordPressTerm = {
  id: number;
  name: string;
  slug: string;
  taxonomy?: 'category' | 'post_tag';
};

type WordPressMedia = {
  source_url: string;
  alt_text: string;
  media_details?: {
    sizes?: {
      [key: string]: {
        source_url: string;
        width: number;
        height: number;
      };
    };
  };
};

type WordPressReference = {
  nazov: string;
  odkaz: string;
};

export type WordPressPost = {
  id: number;
  date: string;
  modified: string;
  title: { rendered: string };
  content: { rendered: string };
  excerpt: { rendered: string };
  slug: string;
  categories: WordPressTerm[];
  meta: {
    post_views: number;
    _zdroje_referencie: WordPressReference[];
  };
  tags: WordPressTerm[];
  featured_media?: number;
  _embedded?: {
    'wp:featuredmedia'?: WordPressMedia[];
    'wp:term'?: WordPressTerm[][];
  };
};

export type WordPressCategory = WordPressTerm & {
  count: number;
  description: string;
  link: string;
  taxonomy: string;
  parent: number;
  children?: WordPressCategory[];
};

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

  private static async fetchWithTimeout(
    url: string,
    options: RequestInit = {},
    timeout: number = API_CONFIG.TIMEOUT
  ) {
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
        throw new Error(`API Error: ${response.status}`);
      }

      return response;
    } catch (error) {
      clearTimeout(timeoutId);
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
    const url = `${this.getApiUrl()}${endpoint}`;
    const response = await this.fetchWithTimeout(url, options);
    return response.json();
  }

  static async getPosts(
    perPage: number = 12,
    orderby: string = 'date',
    categoryId?: number,
    page: number = 1
  ): Promise<WordPressPost[]> {
    const categoryParam = categoryId
      ? `&categories=${categoryId}&include_children=true`
      : '';
    return this.fetch<WordPressPost[]>(
      `/wp/v2/posts?_embed&per_page=${perPage}&orderby=${orderby}&order=desc${categoryParam}&page=${page}`,
      {
        next: {
          revalidate: API_CONFIG.REVALIDATE.POSTS,
          tags: ['posts', categoryId ? `category-${categoryId}` : 'all-posts'],
        },
      }
    );
  }

  static async getPostBySlug(slug: string): Promise<WordPressPost | null> {
    try {
      const posts = await this.fetch<WordPressPost[]>(
        `/wp/v2/posts?_embed&slug=${slug}`,
        {
          next: {
            revalidate: API_CONFIG.REVALIDATE.SINGLE_POST,
            tags: [`post-${slug}`],
          },
        }
      );

      if (posts.length === 0) return null;
      const post = posts[0];

      if (post._embedded?.['wp:term']) {
        post.categories = post._embedded['wp:term'][0] || post.categories;
        post.tags = post._embedded['wp:term'][1] || post.tags;
      }

      return post;
    } catch (error) {
      console.error('Error fetching post:', error);
      return null;
    }
  }

  static async getCategories(): Promise<WordPressCategory[]> {
    return this.fetch<WordPressCategory[]>(
      '/wp/v2/categories?per_page=100&orderby=count&order=desc',
      {
        next: {
          revalidate: API_CONFIG.REVALIDATE.CATEGORIES,
          tags: ['categories'],
        },
      }
    );
  }

  static async getRandomPost(): Promise<WordPressPost[]> {
    return this.fetch<WordPressPost[]>('/custom/v1/random-posts', {
      next: {
        revalidate: 60,
        tags: ['random-posts'],
      },
    });
  }

  static async searchPosts(
    query: string,
    perPage: number = 10,
    page: number = 1
  ): Promise<{ posts: WordPressPost[]; total: number; totalPages: number }> {
    const url = `${this.getApiUrl()}/wp/v2/posts?_embed&search=${encodeURIComponent(
      query
    )}&per_page=${perPage}&page=${page}`;

    const response = await this.fetchWithTimeout(
      url,
      {},
      API_CONFIG.SEARCH_TIMEOUT
    );
    const posts = await response.json();
    const total = parseInt(response.headers.get('X-WP-Total') || '0');
    const totalPages = parseInt(response.headers.get('X-WP-TotalPages') || '0');

    return { posts, total, totalPages };
  }
}

// Export public API
export const {
  transformUrl,
  getPosts,
  getPostBySlug,
  getCategories,
  getRandomPost,
  searchPosts,
} = WordPressClient;
