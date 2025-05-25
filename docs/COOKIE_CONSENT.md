# Cookie Consent Systém

## 🍪 Prehľad

Implementovali sme vlastný cookie consent systém v súlade s GDPR a ePrivacy smernicou EÚ, ktorý:

- ✅ Kontroluje Google Analytics a Google AdSense
- ✅ Umožňuje používateľom vybrať si kategórie cookies
- ✅ Implementuje Google Consent Mode v2
- ✅ Automaticky blokuje cookies pred súhlasom
- ✅ Poskytuje jednoduché UI pre správu preferencií

## 📋 Kategórie cookies

### 1. **Nevyhnutné cookies** (vždy povolené)

- Session cookies
- Bezpečnostné cookies
- Cookie consent preferences

### 2. **Analytické cookies**

- Google Analytics (\_ga, \_gid, \_gat)
- Sledovanie návštevnosti
- Analýza správania používateľov

### 3. **Reklamné cookies**

- Google AdSense
- Personalizované reklamy
- Remarketing

### 4. **Funkčné cookies**

- Uložené preferencie
- Jazyk a región
- Personalizácia obsahu

## 🛠️ Technická implementácia

### Komponenty:

1. **`CookieConsent.tsx`** - Hlavný banner pre súhlas
2. **`CookieSettings.tsx`** - Modal pre správu nastavení
3. **`CookieConsentInit.tsx`** - Inicializácia consent mode
4. **`cookieConsent.ts`** - Logika pre správu cookies

### Google Consent Mode v2:

```javascript
// Predvolené nastavenie - všetko odmietnuté
gtag('consent', 'default', {
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  analytics_storage: 'denied',
  functionality_storage: 'denied',
  personalization_storage: 'denied',
  security_storage: 'granted',
});
```

### Podmienečné načítanie reklám:

Reklamy sa zobrazujú len ak používateľ súhlasí s reklamými cookies:

```typescript
const preferences = getCookiePreferences();
if (preferences.advertising) {
  // Zobraziť reklamu
} else {
  // Zobraziť placeholder
}
```

## 🎨 UI/UX

### Cookie Banner:

- Zobrazuje sa pri prvej návšteve
- Jasné možnosti: Prijať všetko / Odmietnuť / Nastavenia
- Minimalistický dizajn, neruší používateľa

### Nastavenia:

- Detailný popis každej kategórie
- Toggle prepínače pre každú kategóriu
- Možnosť zmeniť nastavenia kedykoľvek cez footer

## 📊 Monitorovanie

### Metriky na sledovanie:

- **Consent Rate** - % používateľov, ktorí súhlasia
- **Category Acceptance** - Ktoré kategórie sú najčastejšie povolené
- **Bounce Rate** - Či banner neodháňa návštevníkov

### Google Analytics Events:

```javascript
gtag('event', 'cookie_consent', {
  consent_type: 'accept_all|reject_all|custom',
  analytics: true / false,
  advertising: true / false,
  functional: true / false,
});
```

## 🔧 Konfigurácia

### Pridanie nových cookies:

1. Upravte kategórie v `cookieConsent.ts`
2. Pridajte logiku do `applyPreferences()`
3. Aktualizujte UI v `CookieConsent.tsx`

### Zmena textov:

Všetky texty sú priamo v komponentoch, jednoducho ich upravte podľa potreby.

## ⚖️ Právne požiadavky

Náš systém spĺňa:

- ✅ **GDPR** - explicitný súhlas, granulárna kontrola
- ✅ **ePrivacy** - blokovanie cookies pred súhlasom
- ✅ **CCPA** - možnosť opt-out
- ✅ **Transparentnosť** - jasné informácie o účele

## 🚀 Best Practices

1. **Neobtěžujte používateľov** - banner len raz
2. **Rešpektujte voľbu** - uložte preferencie na 365 dní
3. **Buďte transparentní** - jasne popíšte účel cookies
4. **Umožnite zmenu** - jednoduché nastavenia v footer

## 🐛 Troubleshooting

**Banner sa nezobrazuje:**

- Skontrolujte, či nie je už uložený súhlas
- Vymažte cookies `cookie-consent` a `cookie-preferences`

**Reklamy sa nezobrazujú po súhlase:**

- Stránka sa musí obnoviť po zmene nastavení
- Skontrolujte AdBlock

**Analytics nefunguje:**

- Overte, že je povolená kategória "Analytické cookies"
- Skontrolujte konzolu pre chyby

## 📈 Ďalšie vylepšenia

1. **A/B Testing** - testovať rôzne texty/dizajny
2. **Geo-targeting** - rôzne správanie pre EÚ/non-EÚ
3. **Cookie Scanner** - automatická detekcia cookies
4. **Reporting** - dashboard pre consent metriky
