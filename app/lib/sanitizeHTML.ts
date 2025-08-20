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

    // 3. Add target/rel to truly external links (and only external)
    //    We rebuild the <a ...> tag safely so attributes are placed before the closing '>'
    sanitized = sanitized.replace(
      /<a\b([^>]*)>/gi,
      (fullMatch: string, attrString: string) => {
        // Find href value
        const hrefMatch = attrString.match(/href\s*=\s*["']?([^"'\s>]+)["']?/i);
        if (!hrefMatch) {
          return fullMatch;
        }

        const hrefValue = hrefMatch[1];
        const isHttp = /^https?:\/\//i.test(hrefValue);
        const isInternalDomain = /zdravievpraxi\.sk/i.test(hrefValue);
        const isExternal = isHttp && !isInternalDomain;

        if (!isExternal) {
          return fullMatch;
        }

        let updatedAttrString = attrString;

        if (!/\btarget\s*=\s*/i.test(updatedAttrString)) {
          updatedAttrString += ' target="_blank"';
        }
        if (!/\brel\s*=\s*/i.test(updatedAttrString)) {
          updatedAttrString += ' rel="noopener noreferrer"';
        }

        return `<a${updatedAttrString}>`;
      }
    );

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
