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
    }>;
    'wp:term'?: Array<Array<{
      id: number;
      name: string;
      slug: string;
      taxonomy: 'category' | 'post_tag';
    }>>;
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
  POSTS: 3600,        // 1 hodina
  CATEGORIES: 7200,   // 2 hodiny
  SINGLE_POST: 1800,  // 30 minút
  SEARCH: 0           // bez cache
};

const API_URL = process.env.NEXT_PUBLIC_WORDPRESS_API_URL;

if (!API_URL) {
  throw new Error('WordPress API URL is not configured');
}

async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    return response;
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
  const categoryParam = categoryId ? `&categories=${categoryId}&include_children=true` : '';
  const response = await fetchAPI(
    `/wp/v2/posts?_embed&per_page=${perPage}&orderby=${orderby}&order=desc${categoryParam}&page=${page}`,
    {
      next: {
        revalidate: REVALIDATE_TIME.POSTS,
        tags: ['posts', categoryId ? `category-${categoryId}` : 'all-posts'],
      },
    }
  );

  return response.json();
}

export async function getPostBySlug(slug: string): Promise<WordPressPost | null> {
  const response = await fetchAPI(
    `/wp/v2/posts?_embed&slug=${slug}&_fields=id,date,modified,title,content,excerpt,slug,categories,tags,meta,_embedded`,
    {
      next: {
        revalidate: REVALIDATE_TIME.SINGLE_POST,
        tags: [`post-${slug}`],
      },
    }
  );

  const posts = await response.json();
  if (posts.length === 0) return null;

  const post = posts[0];
  
  if (post._embedded?.['wp:term']) {
    post.categories = post._embedded['wp:term'][0] || [];
    post.tags = post._embedded['wp:term'][1] || [];
  }

  return post;
}

export async function getCategories(): Promise<WordPressCategory[]> {
  const response = await fetchAPI(
    '/wp/v2/categories?per_page=100&orderby=count&order=desc',
    {
      next: {
        revalidate: REVALIDATE_TIME.CATEGORIES,
        tags: ['categories'],
      },
    }
  );

  return response.json();
}

export async function getRandomPost(): Promise<WordPressPost[]> {
  const response = await fetchAPI(
    '/custom/v1/random-posts',
    {
      next: {
        revalidate: 60, // Cache na 1 minútu
        tags: ['random-posts'],
      },
    }
  );

  return response.json();
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
  const response = await fetchAPI(
    `/wp/v2/posts?_embed&search=${encodeURIComponent(query)}&per_page=${perPage}&page=${page}`,
    {
      next: {
        revalidate: REVALIDATE_TIME.SEARCH,
      },
    }
  );

  const posts = await response.json();
  const total = parseInt(response.headers.get('X-WP-Total') || '0');
  const totalPages = parseInt(response.headers.get('X-WP-TotalPages') || '0');

  return {
    posts,
    total,
    totalPages
  };
} 