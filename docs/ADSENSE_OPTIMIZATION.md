# Google AdSense Optimalizácia

## 🎯 Stratégie pre zvýšenie ziskov

### 1. **Optimálne umiestnenie reklám**

- **Sticky sidebar reklamy** - zobrazujú sa pri scrollovaní, vysoká viditeľnosť
- **In-article reklamy** - prirodzene umiestnené v obsahu článku
- **Natívne reklamy** - vyzerajú ako súčasť obsahu, vyššia CTR
- **Above-the-fold reklamy** - viditeľné bez scrollovania

### 2. **Konfigurácia Ad Slotov**

Upravte súbor `app/config/adSlots.ts` a nahraďte vzorové ID vašimi skutočnými ad slot ID z Google AdSense:

```typescript
export const AD_SLOTS = {
  IN_ARTICLE_1: 'váš-skutočný-ad-slot-id',
  IN_ARTICLE_2: 'váš-skutočný-ad-slot-id',
  // ... atď
};
```

### 3. **Vytvorenie Ad Units v Google AdSense**

1. Prihláste sa do [Google AdSense](https://www.google.com/adsense/)
2. Prejdite na **Ads → By ad unit**
3. Vytvorte nasledujúce typy reklám:

#### Display ads:

- **In-article ads** (3x) - Responsive, In-article format
- **Sidebar sticky** - Fixed size 300x250 alebo 300x600
- **Homepage ads** (2x) - Responsive

#### Native ads:

- **In-feed ads** - pre zoznamy článkov
- **Matched content** - pre súvisiace články

### 4. **Optimalizačné tipy**

#### A. Zvýšenie CTR (Click-Through Rate):

- Používajte **kontrastné farby** pre reklamy
- Umiestnite reklamy **blízko obsahu**
- Testujte rôzne **veľkosti a formáty**
- Používajte **text + display** reklamy

#### B. Zvýšenie RPM (Revenue Per Mille):

- Zamerajte sa na **kvalitný obsah**
- Optimalizujte pre **mobilné zariadenia**
- Používajte **AMP** pre rýchlejšie načítanie
- Implementujte **lazy loading** pre reklamy

#### C. A/B Testing:

- Testujte rôzne **pozície reklám**
- Experimentujte s **farbami a štýlmi**
- Merajte výkon cez **Google Analytics**

### 5. **Implementované funkcie**

✅ **Automatické vkladanie reklám do článkov**

- Reklamy sa vkladajú po určitom počte odstavcov
- Prispôsobiteľné pozície v `ARTICLE_AD_POSITIONS`

✅ **Sticky sidebar reklamy**

- Zobrazujú sa po scrollovaní 300px
- Skryté na mobilných zariadeniach

✅ **Lazy loading**

- Reklamy sa načítajú až keď sú potrebné
- Zlepšuje výkon stránky

✅ **Responsive dizajn**

- Reklamy sa prispôsobujú veľkosti obrazovky
- Optimalizované pre desktop aj mobil

### 6. **Monitorovanie výkonu**

#### Kľúčové metriky:

- **CTR** - Click-through rate (cieľ: 1-3%)
- **RPM** - Revenue per thousand impressions
- **Viewability** - % viditeľných reklám (cieľ: >70%)
- **Fill rate** - % vyplnených reklamných priestorov

#### Nástroje:

- **Google AdSense Dashboard** - základné metriky
- **Google Analytics** - detailná analýza správania
- **PageSpeed Insights** - výkon stránky

### 7. **Best Practices**

1. **Neprekračujte limit reklám**

   - Max 3 display reklamy na stránku
   - Unlimited native/in-article ads

2. **Dodržujte AdSense politiky**

   - Žiadne klikanie na vlastné reklamy
   - Žiadne umiestnenie blízko klikateľných prvkov
   - Jasné označenie "Reklama" alebo "Sponzorované"

3. **Optimalizujte pre Core Web Vitals**
   - LCP < 2.5s
   - FID < 100ms
   - CLS < 0.1

### 8. **Troubleshooting**

**Reklamy sa nezobrazujú:**

- Skontrolujte ad slot ID
- Overte schválenie účtu AdSense
- Skontrolujte konzolu pre chyby

**Nízke zisky:**

- Zvýšte návštevnosť stránky
- Zlepšite kvalitu obsahu
- Optimalizujte umiestnenie reklám

**Pomalé načítanie:**

- Implementujte lazy loading
- Optimalizujte veľkosť obrázkov
- Použite CDN

### 9. **Ďalšie kroky**

1. **Implementujte Google Ad Manager** pre pokročilé možnosti
2. **Pridajte header bidding** pre vyššie CPM
3. **Testujte video reklamy** pre vyššie zisky
4. **Vytvorte AMP verzie** článkov

## 📊 Očakávané výsledky

Po implementácii týchto optimalizácií môžete očakávať:

- **30-50% zvýšenie CTR**
- **20-40% zvýšenie RPM**
- **Lepšiu používateľskú skúsenosť**
- **Vyššie celkové príjmy**

Pravidelne monitorujte výkon a upravujte stratégiu podľa výsledkov!
