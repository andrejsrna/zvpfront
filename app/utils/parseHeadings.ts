interface Heading {
  text: string;
  level: number;
  id: string;
}

export function parseHeadings(content: string): {
  headings: Heading[];
  content: string;
} {
  if (!content || typeof content !== 'string') {
    return { headings: [], content: '' };
  }

  const headings: Heading[] = [];
  let modifiedContent = content;

  try {
    // Find all h2 and h3 tags with safety limits
    const headingRegex = /<h([23])[^>]*?>(.*?)<\/h\1>/g;
    const maxHeadings = 50; // Prevent excessive processing
    let headingCount = 0;

    modifiedContent = content.replace(headingRegex, (match, level, text) => {
      // Safety limit to prevent excessive processing
      if (headingCount >= maxHeadings) {
        return match;
      }
      headingCount++;

      // Clean text from any remaining HTML with safety check
      const cleanText = text ? text.replace(/<[^>]*>/g, '').trim() : '';

      if (!cleanText) {
        return match;
      }

      // Create URL-friendly ID with length limit
      const id = cleanText
        .toLowerCase()
        .substring(0, 100) // Limit length
        .replace(/[^a-z0-9\s-]/g, '') // Remove special chars first
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/-+/g, '-') // Replace multiple hyphens with single
        .replace(/(^-|-$)/g, ''); // Remove leading/trailing hyphens

      if (!id) {
        return match;
      }

      headings.push({
        text: cleanText,
        level: parseInt(level),
        id,
      });

      // Return the heading with an added ID
      return `<h${level} id="${id}">${text}</h${level}>`;
    });

    return {
      headings,
      content: modifiedContent,
    };
  } catch (error) {
    console.warn('Error parsing headings:', error);
    return { headings: [], content };
  }
}
