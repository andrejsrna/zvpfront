// Google AdSense Ad Slots Configuration
// Nahraďte tieto hodnoty vašimi skutočnými ad slot ID z Google AdSense

export const AD_SLOTS = {
  // In-article ads
  IN_ARTICLE_1: '5030268467', // Prvá reklama v článku
  IN_ARTICLE_2: '6287704966', // Druhá reklama v článku
  IN_ARTICLE_3: '6071264074', // Tretia reklama v článku

  // Sidebar sticky ads
  SIDEBAR_STICKY: '3857975607', // Sticky reklama v sidebar

  // Native ads for article lists
  NATIVE_ARTICLE_LIST: '2583648307', // Natívna reklama v zozname článkov

  // Homepage ads
  HOMEPAGE_TOP: '4170619183', // Reklama na vrchu homepage
  HOMEPAGE_MIDDLE: '2662946458', // Reklama v strede homepage

  // Category page ads
  CATEGORY_TOP: '3647875002', // Reklama na vrchu kategórie

  // Search results ads
  SEARCH_RESULTS: '9036783110', // Reklama vo výsledkoch vyhľadávania

  // Related articles ads
  RELATED_ARTICLES: '6441559307', // Reklama v súvisiacich článkoch
};

// Optimálne pozície pre reklamy v článku
export const ARTICLE_AD_POSITIONS = {
  afterParagraphs: [3, 7, 12], // Po koľkých odstavcoch vložiť reklamu
  minParagraphs: 5, // Minimálny počet odstavcov pre zobrazenie reklám
};
