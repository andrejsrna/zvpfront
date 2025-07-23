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

  // Safety check for content length
  if (content.length > 500000) {
    console.warn('Content too large for heading parsing, returning as-is');
    return { headings: [], content };
  }

  const headings: Heading[] = [];
  let modifiedContent = content;

  try {
    // Simple and safe heading detection
    const headingMatches = content.match(/<h([23])[^>]*?>(.*?)<\/h\1>/gi);

    if (!headingMatches) {
      return { headings: [], content };
    }

    // Process each heading safely
    headingMatches.slice(0, 50).forEach(match => {
      const levelMatch = match.match(/<h([23])[^>]*?>/i);
      const textMatch = match.match(/<h[23][^>]*?>(.*?)<\/h[23]>/i);

      if (!levelMatch || !textMatch) return;

      const level = parseInt(levelMatch[1]);
      const text = textMatch[1];

      // Clean text safely
      const cleanText = text
        ? text
            .replace(/<[^>]*>/g, '')
            .trim()
            .substring(0, 200)
        : '';

      if (!cleanText) return;

      // Create simple ID
      const id = cleanText
        .toLowerCase()
        .substring(0, 50)
        .replace(/[^a-z0-9\s]/g, '')
        .replace(/\s+/g, '-')
        .replace(/^-+|-+$/g, '');

      if (!id) return;

      headings.push({
        text: cleanText,
        level,
        id,
      });

      // Safe replacement without backreferences
      const headingWithId = `<h${level} id="${id}">${text}</h${level}>`;
      modifiedContent = modifiedContent.replace(match, headingWithId);
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
