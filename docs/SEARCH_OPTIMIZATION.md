# Optimalizácia vyhľadávania

## Aktuálne implementované vylepšenia

### 1. Pokročilé vyhľadávanie (advancedSearch)

- **Lepšie skórovanie relevantnosti**: Články sa hodnotia podľa toho, kde sa hľadané slová nachádzajú
- **Prioritizácia nadpisov**: Zhody v nadpisoch dostávajú najvyššie skóre (15 bodov)
- **Obsah a výťah**: Zhody v obsahu (5 bodov) a výťahu (3 body)
- **Presné frázy**: Bonus za presné zhody fráz
- **Čerstvosť obsahu**: Novšie články dostávajú malý bonus

### 2. Vylepšené parametre vyhľadávania

- `search_fields`: Vyhľadávanie v nadpisoch, obsahu a výťahoch
- `orderby: relevance`: WordPress vlastné hodnotenie relevantnosti
- Lepšie spracovanie dotazov (trim, lowercase)

## Odporúčania pre ďalšie vylepšenia

### 1. WordPress Plugin riešenia

#### Relevanssi

```bash
# Najlepšie riešenie pre WordPress
# - Pokročilé skórovanie relevantnosti
# - Fuzzy matching
# - Synonymá a stopwords
# - Custom fields vyhľadávanie
```

#### SearchWP

```bash
# Alternatíva k Relevanssi
# - Drag & drop konfigurácia
# - Custom post types podpora
# - Analytics
```

### 2. Elasticsearch riešenie

#### WP Elasticsearch

```bash
# Najlepšie pre veľké weby
# - Rýchle vyhľadávanie
# - Pokročilé filtre
# - Faceted search
# - Autocomplete
```

### 3. Implementácia synonym

```typescript
// Pridať do advancedSearch funkcie
const synonyms: Record<string, string[]> = {
  vitamín: ['vitamin', 'vitamín c', 'vitamín d'],
  zdravie: ['zdravý', 'zdravotný', 'wellness'],
  cvičenie: ['šport', 'tréning', 'fitness', 'cvičiť'],
};

// Rozšíriť vyhľadávanie o synonymá
const expandedQuery = expandQueryWithSynonyms(cleanQuery, synonyms);
```

### 4. Implementácia autocomplete

```typescript
// Vytvoriť endpoint pre autocomplete
export async function getSearchSuggestions(query: string) {
  // Vrátiť populárne vyhľadávania
  // Vrátiť kategórie
  // Vrátiť tagy
}
```

### 5. Analytics a A/B testovanie

```typescript
// Sledovať úspešnosť vyhľadávania
interface SearchAnalytics {
  query: string;
  resultsCount: number;
  clickedResult?: number;
  timeSpent: number;
  noResults: boolean;
}
```

### 6. Optimalizácia pre mobilné zariadenia

- Touch-friendly vyhľadávacie rozhranie
- Voice search podpora
- Autocomplete s touch gestures

### 7. SEO optimalizácie

- Vyhľadávacie sitemapy
- Structured data pre vyhľadávacie výsledky
- Meta tags pre vyhľadávacie stránky

## Implementačné kroky

1. **Okamžite**: Aktuálne vylepšenia sú implementované
2. **Krátkodobo**: Pridať synonymá a autocomplete
3. **Strednodobo**: Implementovať Elasticsearch alebo Relevanssi
4. **Dlhodobo**: Analytics a pokročilé funkcie

## Metriky úspechu

- **Click-through rate** vyhľadávacích výsledkov
- **Čas strávený** na vyhľadávacích stránkach
- **Počet "no results"** vyhľadávaní
- **Konverzie** z vyhľadávania
