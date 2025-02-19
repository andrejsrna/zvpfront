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

export async function getPosts(
  perPage: number = 100, 
  orderby: string = 'date',
  categoryId?: number,
  page: number = 1
): Promise<WordPressPost[]> {
  const apiUrl = process.env.NEXT_PUBLIC_WORDPRESS_API_URL;

  if (!apiUrl) {
    throw new Error('WordPress API URL is not configured');
  }

  const categoryParam = categoryId ? `&categories=${categoryId}&include_children=true` : '';
  const pageParam = `&page=${page}`;

  try {
    const response = await fetch(
      `${apiUrl}/wp/v2/posts?_embed&per_page=${perPage}&orderby=${orderby}&order=desc${categoryParam}${pageParam}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        next: {
          revalidate: 3600,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const posts = await response.json();
    return posts;
  } catch (error) {
    console.error('Error fetching WordPress posts:', error);
    throw error;
  }
}

export async function getPostBySlug(slug: string): Promise<WordPressPost | null> {
  const apiUrl = process.env.NEXT_PUBLIC_WORDPRESS_API_URL;

  if (!apiUrl) {
    throw new Error('WordPress API URL is not configured');
  }

  try {
    const response = await fetch(
      `${apiUrl}/wp/v2/posts?_embed&slug=${slug}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        next: {
          revalidate: 3600,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const posts = await response.json();
    if (posts.length === 0) return null;

    const post = posts[0];
    
    // Map embedded terms to categories and tags
    if (post._embedded && post._embedded['wp:term']) {
      // Categories are typically the first array in wp:term
      post.categories = post._embedded['wp:term'][0] || [];
      // Tags are typically the second array in wp:term
      post.tags = post._embedded['wp:term'][1] || [];
    }

    return post;
  } catch (error) {
    console.error('Error fetching WordPress post:', error);
    throw error;
  }
}


export async function getCategories(): Promise<WordPressCategory[]> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_WORDPRESS_API_URL}/wp/v2/categories?parent=0&per_page=100`,
    { next: { revalidate: 3600 } }
  );
  
  if (!response.ok) {
    throw new Error('Failed to fetch categories');
  }

  return response.json();
}

export async function getRandomPost(): Promise<WordPressPost[]> {
  const apiUrl = process.env.NEXT_PUBLIC_WORDPRESS_API_URL;

  if (!apiUrl) {
    throw new Error('WordPress API URL is not configured');
  }

  try {
    const response = await fetch(
      `${apiUrl}/custom/v1/random-posts`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        next: {
          revalidate: 3600, // Cache for 1 hour
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const posts = await response.json();
    return posts;
  } catch (error) {
    console.error('Error fetching WordPress posts:', error);
    throw error;
  }

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
  const apiUrl = process.env.NEXT_PUBLIC_WORDPRESS_API_URL;

  if (!apiUrl) {
    throw new Error('WordPress API URL is not configured');
  }

  try {
    const response = await fetch(
      `${apiUrl}/wp/v2/posts?_embed&search=${encodeURIComponent(query)}&per_page=${perPage}&page=${page}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        next: {
          revalidate: 0, // Nebudeme cachovať výsledky vyhľadávania
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const posts = await response.json();
    
    // Pridáme informáciu o celkovom počte výsledkov z hlavičky
    const total = parseInt(response.headers.get('X-WP-Total') || '0');
    const totalPages = parseInt(response.headers.get('X-WP-TotalPages') || '0');

    return {
      posts,
      total,
      totalPages
    };
  } catch (error) {
    console.error('Error searching WordPress posts:', error);
    throw error;
  }
} 