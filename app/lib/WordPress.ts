export type WordPressPost = {
  id: number;
  date: string;
  modified: string;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
  };
  excerpt: {
    rendered: string;
  };
  slug: string;
  categories: {
    id: number;
    name: string;
    slug: string;
  }[];
  meta: {
    post_views: number;
    _zdroje_referencie: {
      nazov: string;
      odkaz: string;
    }[];
  };
  tags: {
    id: number;
    name: string;
    slug: string;
  }[];
  featured_media?: number;
  _embedded?: {
    'wp:featuredmedia'?: Array<{
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
    }>;
    'wp:term'?: Array<
      Array<{
        id: number;
        name: string;
        slug: string;
        taxonomy: 'category' | 'post_tag';
      }>
    >;
  };
};

export type WordPressCategory = {
  id: number;
  count: number;
  description: string;
  link: string;
  name: string;
  slug: string;
  taxonomy: string;
  parent: number;
  children?: WordPressCategory[];
};

const REVALIDATE_TIME = {
  POSTS: 3600, // 1 hodina
  CATEGORIES: 7200, // 2 hodiny
  SINGLE_POST: 1800, // 30 minút
  SEARCH: 0, // bez cache
};

// Helper function to transform WordPress URLs to use local proxy
export function transformWordPressUrl(url: string): string {
  if (!url) return url;

  // Transform WordPress content URLs to use proxy in client-side
  if (typeof window !== 'undefined' && url.includes('admin.zdravievpraxi.sk')) {
    return url.replace('https://admin.zdravievpraxi.sk', '');
  }

  return url;
}

// Helper function to get WordPress API URL
const getWordPressApiUrl = () => {
  // Check if we're running on the server
  if (typeof window === 'undefined') {
    // Server-side: connect directly to WordPress API
    return 'https://admin.zdravievpraxi.sk/wp-json';
  }
  // Client-side: use relative URL that gets proxied by middleware
  return '/wp-json';
};

// Helper function to fetch with error handling and timeout
async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const WORDPRESS_API_URL = getWordPressApiUrl();
  const url = `${WORDPRESS_API_URL}${endpoint}`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout

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

    return response.json();
  } catch (error) {
    console.error(`Failed fetching ${endpoint}:`, error);
    throw error;
  }
}

export async function getPosts(
  perPage: number = 12,
  orderby: string = 'date',
  categoryId?: number,
  page: number = 1
): Promise<WordPressPost[]> {
  const categoryParam = categoryId
    ? `&categories=${categoryId}&include_children=true`
    : '';
  return fetchAPI(
    `/wp/v2/posts?_embed&per_page=${perPage}&orderby=${orderby}&order=desc${categoryParam}&page=${page}`,
    {
      next: {
        revalidate: REVALIDATE_TIME.POSTS,
        tags: ['posts', categoryId ? `category-${categoryId}` : 'all-posts'],
      },
    }
  );
}

export async function getPostBySlug(
  slug: string
): Promise<WordPressPost | null> {
  try {
    // Najprv získame post
    const posts = await fetchAPI(`/wp/v2/posts?_embed&slug=${slug}`, {
      next: {
        revalidate: REVALIDATE_TIME.SINGLE_POST,
        tags: [`post-${slug}`],
      },
    });

    if (posts.length === 0) return null;
    const post = posts[0];

    // Získame informácie o kategóriách
    if (post.categories && post.categories.length > 0) {
      const categoryIds = post.categories.join(',');
      const categoriesData = await fetchAPI(
        `/wp/v2/categories?include=${categoryIds}`,
        {
          next: {
            revalidate: REVALIDATE_TIME.CATEGORIES,
          },
        }
      );
      post.categories = categoriesData;
    }

    // Spracuj tagy z _embedded
    if (post._embedded?.['wp:term']) {
      post.tags = post._embedded['wp:term'][1] || [];
    }

    return post;
  } catch (error) {
    console.error('Error fetching post:', error);
    return null;
  }
}

export async function getCategories(): Promise<WordPressCategory[]> {
  return fetchAPI('/wp/v2/categories?per_page=100&orderby=count&order=desc', {
    next: {
      revalidate: REVALIDATE_TIME.CATEGORIES,
      tags: ['categories'],
    },
  });
}

export async function getRandomPost(): Promise<WordPressPost[]> {
  return fetchAPI('/custom/v1/random-posts', {
    next: {
      revalidate: 60, // Cache na 1 minútu
      tags: ['random-posts'],
    },
  });
}

interface SearchResult {
  posts: WordPressPost[];
  total: number;
  totalPages: number;
}

export async function searchPosts(
  query: string,
  perPage: number = 10,
  page: number = 1
): Promise<SearchResult> {
  // For search, we need to access headers, so we'll use direct fetch
  const WORDPRESS_API_URL = getWordPressApiUrl();
  const url = `${WORDPRESS_API_URL}/wp/v2/posts?_embed&search=${encodeURIComponent(query)}&per_page=${perPage}&page=${page}`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      next: {
        revalidate: REVALIDATE_TIME.SEARCH,
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Search API Error: ${response.status}`);
    }

    const posts = await response.json();
    const total = parseInt(response.headers.get('X-WP-Total') || '0');
    const totalPages = parseInt(response.headers.get('X-WP-TotalPages') || '0');

    return {
      posts,
      total,
      totalPages,
    };
  } catch (error) {
    console.error('Search error:', error);
    throw error;
  }
}
