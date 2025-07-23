import he from 'he';

// Safe HTML entity decoding with recursion protection
export function safeHeDecode(text: string): string {
  if (!text || typeof text !== 'string') return '';

  try {
    // Limit iterations to prevent infinite loops
    let decoded = text;
    let iterations = 0;
    const maxIterations = 5;

    while (iterations < maxIterations) {
      const prevDecoded = decoded;
      decoded = he.decode(decoded);

      // Break if no change (fully decoded) or if we're in a loop
      if (decoded === prevDecoded) break;

      iterations++;
    }

    return decoded;
  } catch (error) {
    console.warn('HTML entity decoding failed:', error);
    return text; // Return original text if decoding fails
  }
}

// Utility function to sanitize HTML content from WordPress
export function sanitizeHTML(html: string): string {
  if (!html || typeof html !== 'string') return '';

  try {
    let sanitized = html;

    // Safety check for content length
    if (sanitized.length > 100000) {
      console.warn('Content too large for sanitization, returning as-is');
      return html;
    }

    // Simple and safe replacements without problematic backreferences

    // 1. Remove empty anchor tags (safer approach)
    sanitized = sanitized.replace(/<a\s*>\s*<\/a>/gi, '');
    sanitized = sanitized.replace(
      /<a\s+href\s*=\s*["']?\s*["']?\s*[^>]*>\s*<\/a>/gi,
      ''
    );

    // 2. Fix WordPress content URLs (simple replacement)
    sanitized = sanitized.replace(
      /href\s*=\s*["']\/wp-content\//gi,
      'href="https://admin.zdravievpraxi.sk/wp-content/'
    );

    // 3. Handle external links in two safe steps
    // First, mark internal links to avoid touching them
    const internalLinkMarker = '___INTERNAL_LINK___';
    sanitized = sanitized.replace(
      /(<a[^>]*href\s*=\s*["'][^"']*zdravievpraxi\.sk[^"']*["'][^>]*>)/gi,
      `${internalLinkMarker}$1`
    );

    // Then add target="_blank" to unmarked external links
    sanitized = sanitized.replace(
      /(<a[^>]*href\s*=\s*["']https?:\/\/[^"']*["'][^>]*?)>/gi,
      match => {
        if (match.includes(internalLinkMarker)) {
          return match.replace(internalLinkMarker, '');
        }
        if (match.includes('target=')) {
          return match + '>';
        }
        return match + ' target="_blank" rel="noopener noreferrer">';
      }
    );

    // Clean up any remaining markers
    sanitized = sanitized.replace(new RegExp(internalLinkMarker, 'g'), '');

    return sanitized;
  } catch (error) {
    console.warn('HTML sanitization failed:', error);
    return html;
  }
}

// Specific sanitization for excerpts (removes all links for simplicity)
export function sanitizeExcerpt(html: string): string {
  if (!html || typeof html !== 'string') return '';

  try {
    let result = html;

    // Safety limit
    if (result.length > 1000) {
      result = result.substring(0, 1000);
    }

    // Simple link removal without backreferences
    result = result.replace(/<a[^>]*>/gi, '');
    result = result.replace(/<\/a>/gi, '');

    // Remove other HTML tags
    result = result.replace(/<[^>]*>/g, '');

    // Normalize whitespace
    result = result.replace(/\s+/g, ' ').trim();

    return result.substring(0, 500);
  } catch (error) {
    console.warn('Excerpt sanitization failed:', error);
    return html.substring(0, 200);
  }
}
