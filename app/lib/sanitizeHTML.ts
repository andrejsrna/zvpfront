// Utility function to sanitize HTML content from WordPress
export function sanitizeHTML(html: string): string {
  if (!html) return '';

  // Remove empty links or links without href
  const sanitized = html
    // Remove links with empty href or no href attribute
    .replace(/<a\s*(?:href\s*=\s*["']?\s*["']?\s*)?[^>]*>\s*<\/a>/gi, '')
    // Remove links with only whitespace content
    .replace(/<a[^>]*>\s*<\/a>/gi, '')
    // Remove malformed anchor tags
    .replace(/<a\s*>\s*<\/a>/gi, '')
    // Fix relative URLs to absolute URLs for WordPress content
    .replace(
      /href\s*=\s*["']\/wp-content\//gi,
      'href="https://admin.zdravievpraxi.sk/wp-content/'
    )
    // Remove target="_blank" from internal links for better UX
    .replace(
      /(<a[^>]*href\s*=\s*["'][^"']*zdravievpraxi\.sk[^"']*["'][^>]*)target\s*=\s*["']_blank["']/gi,
      '$1'
    )
    // Ensure all external links open in new tab
    .replace(
      /(<a[^>]*href\s*=\s*["']https?:\/\/(?!.*zdravievpraxi\.sk)[^"']*["'][^>]*)(?!.*target\s*=)/gi,
      '$1 target="_blank" rel="noopener noreferrer"'
    );

  return sanitized;
}

// Specific sanitization for excerpts (removes all links for simplicity)
export function sanitizeExcerpt(html: string): string {
  if (!html) return '';

  return (
    html
      // Remove all links from excerpts to avoid crawling issues
      .replace(/<a[^>]*>(.*?)<\/a>/gi, '$1')
      // Clean up any remaining empty tags
      .replace(/<[^>]*>\s*<\/[^>]*>/gi, '')
      // Normalize whitespace
      .replace(/\s+/g, ' ')
      .trim()
  );
}
