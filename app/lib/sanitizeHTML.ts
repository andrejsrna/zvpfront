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
    // Remove empty links or links without href with safer regex
    let sanitized = html
      // Remove links with empty href or no href attribute
      .replace(/<a\s*(?:href\s*=\s*["']?\s*["']?\s*)?[^>]*?>\s*<\/a>/gi, '')
      // Remove links with only whitespace content
      .replace(/<a[^>]*?>\s*<\/a>/gi, '')
      // Remove malformed anchor tags
      .replace(/<a\s*>\s*<\/a>/gi, '');

    // Apply URL fixes with length limits to prevent issues
    if (sanitized.length < 100000) {
      // Safety limit for large content
      sanitized = sanitized
        // Fix relative URLs to absolute URLs for WordPress content
        .replace(
          /href\s*=\s*["']\/wp-content\//gi,
          'href="https://admin.zdravievpraxi.sk/wp-content/'
        )
        // Remove target="_blank" from internal links for better UX
        .replace(
          /(<a[^>]*?href\s*=\s*["'][^"']*?zdravievpraxi\.sk[^"']*?["'][^>]*?)target\s*=\s*["']_blank["']/gi,
          '$1'
        )
        // Ensure all external links open in new tab (with safety check)
        .replace(
          /(<a[^>]*?href\s*=\s*["']https?:\/\/(?!.*zdravievpraxi\.sk)[^"']*?["'][^>]*?)(?!.*target\s*=)/gi,
          '$1 target="_blank" rel="noopener noreferrer"'
        );
    }

    return sanitized;
  } catch (error) {
    console.warn('HTML sanitization failed:', error);
    return html; // Return original if sanitization fails
  }
}

// Specific sanitization for excerpts (removes all links for simplicity)
export function sanitizeExcerpt(html: string): string {
  if (!html || typeof html !== 'string') return '';

  try {
    return (
      html
        // Remove all links from excerpts to avoid crawling issues
        .replace(/<a[^>]*?>(.*?)<\/a>/gi, '$1')
        // Clean up any remaining empty tags
        .replace(/<[^>]*?>\s*<\/[^>]*?>/gi, '')
        // Normalize whitespace
        .replace(/\s+/g, ' ')
        .trim()
        .substring(0, 500)
    ); // Safety limit
  } catch (error) {
    console.warn('Excerpt sanitization failed:', error);
    return html;
  }
}
