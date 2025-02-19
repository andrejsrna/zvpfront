interface Heading {
  text: string;
  level: number;
  id: string;
}

export function parseHeadings(content: string): { headings: Heading[], content: string } {
  const headings: Heading[] = [];
  let modifiedContent = content;

  // Find all h2 and h3 tags
  const headingRegex = /<h([23])[^>]*>(.*?)<\/h\1>/g;
  
  modifiedContent = content.replace(headingRegex, (match, level, text) => {
    // Clean text from any remaining HTML
    const cleanText = text.replace(/<[^>]*>/g, '');
    
    // Create URL-friendly ID
    const id = cleanText
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    headings.push({
      text: cleanText,
      level: parseInt(level),
      id
    });

    // Return the heading with an added ID
    return `<h${level} id="${id}">${text}</h${level}>`;
  });

  return {
    headings,
    content: modifiedContent
  };
} 