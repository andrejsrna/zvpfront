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
- `orderby: relevance`: Triedenie podľa relevancie (interné skórovanie)
- Lepšie spracovanie dotazov (trim, lowercase)

## Odporúčania pre ďalšie vylepšenia

### 1. Elasticsearch / OpenSearch riešenie

- Najlepšie pre veľké weby a veľa obsahu
- Rýchle vyhľadávanie, pokročilé filtre, faceted search, autocomplete

### 2. Implementácia synonym

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

### 3. Implementácia autocomplete

```typescript
// Vytvoriť endpoint pre autocomplete
export async function getSearchSuggestions(query: string) {
  // Vrátiť populárne vyhľadávania
  // Vrátiť kategórie
  // Vrátiť tagy
}
```

### 4. Analytics a A/B testovanie

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

### 5. Optimalizácia pre mobilné zariadenia

- Touch-friendly vyhľadávacie rozhranie
- Voice search podpora
- Autocomplete s touch gestures

### 6. SEO optimalizácie

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

