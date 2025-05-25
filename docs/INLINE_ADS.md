# Inline vkladanie reklám do článkov

## 📝 Prehľad

Implementovali sme automatické vkladanie reklám priamo do obsahu článkov. Systém inteligentne rozmiestňuje reklamy na základe dĺžky článku.

## 🎯 Ako to funguje

### 1. **ArticleContent komponent**

- Analyzuje obsah článku a počíta odstavce
- Automaticky vkladá reklamy na optimálne pozície
- Zachováva štruktúru a formátovanie článku

### 2. **Pravidlá umiestnenia**

#### Krátke články (5 odstavcov):

- 1 reklama v strede (50%)

#### Stredné články (6-7 odstavcov):

- 2 reklamy na pozíciách 33% a 66%

#### Dlhé články (8+ odstavcov):

- 3 reklamy na pozíciách 25%, 50% a 75%

#### Veľmi krátke články (<5 odstavcov):

- Žiadne reklamy

## 🔧 Technická implementácia

### Komponent ArticleContent:

```typescript
<ArticleContent
  content={decodedContent}
  className="prose prose-lg..."
/>
```

### Algoritmus:

1. **Parsing obsahu** - DOMParser analyzuje HTML
2. **Počítanie odstavcov** - Identifikuje všetky `<p>` tagy
3. **Výpočet pozícií** - Určí optimálne miesta pre reklamy
4. **Rozdelenie obsahu** - Rozdelí článok na sekcie
5. **Vloženie reklám** - Pridá AdUnit komponenty medzi sekcie

## 📊 Výhody

### Pre používateľov:

- **Prirodzené umiestnenie** - Reklamy nerušia čítanie
- **Responzívny dizajn** - Prispôsobujú sa obrazovke
- **Jasné označenie** - "Reklama" label

### Pre vydavateľa:

- **Vyššie príjmy** - Viac reklamných pozícií
- **Lepšia viditeľnosť** - Reklamy v obsahu majú vyššiu CTR
- **Automatizácia** - Nie je potrebné manuálne vkladanie

## ⚙️ Konfigurácia

### Zmena pozícií reklám:

V súbore `ArticleContent.tsx` upravte funkciu `calculateAdPositions`:

```typescript
function calculateAdPositions(totalParagraphs: number): number[] {
  // Upravte percentá podľa potreby
  positions.push(Math.floor(totalParagraphs * 0.25));
}
```

### Pridanie/odobranie ad slotov:

V súbore `adSlots.ts` pridajte nové sloty:

```typescript
export const AD_SLOTS = {
  IN_ARTICLE_1: 'váš-ad-slot-1',
  IN_ARTICLE_2: 'váš-ad-slot-2',
  IN_ARTICLE_3: 'váš-ad-slot-3',
  IN_ARTICLE_4: 'váš-ad-slot-4', // Nový slot
};
```

## 🎨 Štýlovanie

### CSS triedy pre reklamy:

```css
.in-article-ad {
  margin: 2rem 0;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 0.5rem;
}
```

### Responzívne správanie:

- Desktop: Plná šírka s paddingom
- Tablet: Prispôsobená šírka
- Mobil: Plná šírka bez bočných marginov

## 📈 Optimalizácia

### Best practices:

1. **Nepreháňajte to** - Max 3-4 reklamy na článok
2. **Dodržte odstupy** - Min. 3 odstavce medzi reklamami
3. **Testujte výkon** - A/B testy rôznych pozícií
4. **Mobile-first** - Optimalizujte pre mobilné zariadenia

### Metriky na sledovanie:

- **Viewability** - % videných reklám
- **CTR** - Click-through rate
- **Scroll depth** - Ako ďaleko čitatelia scrollujú
- **Bounce rate** - Či reklamy neodháňajú čitateľov

## 🐛 Riešenie problémov

### Reklamy sa nezobrazujú:

1. Skontrolujte ad slot ID
2. Overte cookie consent pre reklamy
3. Skontrolujte dĺžku článku (min. 5 odstavcov)

### Nesprávne pozície:

1. Overte štruktúru HTML obsahu
2. Skontrolujte počet odstavcov
3. Debug cez console.log v komponente

### Layout shift:

1. Nastavte min-height pre reklamy
2. Použite placeholder počas načítania
3. Implementujte lazy loading

## 🚀 Ďalšie vylepšenia

1. **Smart placement** - AI-based umiestnenie podľa obsahu
2. **A/B testing** - Automatické testovanie pozícií
3. **Performance tracking** - Sledovanie výkonu každej pozície
4. **Dynamic loading** - Načítanie reklám až pri scrollovaní
