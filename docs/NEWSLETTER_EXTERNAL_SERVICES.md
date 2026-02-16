# Newsletter – Brevo (Sendinblue)

Aktuálne riešenie vo fronte: `app/api/newsletter/route.ts` ukladá kontakt do **Brevo** cez ich REST API.

## Nastavenie

Do `.env.local` (a do production secrets) pridaj:

```env
BREVO_API_KEY=...
BREVO_LIST_ID=6
```

- `BREVO_API_KEY`: API key z Brevo (SMTP & API → API Keys)
- `BREVO_LIST_ID`: ID zoznamu (List) kam sa majú kontakty pridávať

## Čo sa do Brevo ukladá

- email
- priradenie do listu `BREVO_LIST_ID`

Poznámka: zámerne neposielame custom attributes, aby to nevyžadovalo dodatočnú konfiguráciu v Brevo.

## Double opt-in

Aktuálna implementácia pridá kontakt priamo (bez DOI). Ak chceš double opt-in, povedz:

- či má byť DOI povinné
- aký template / flow chceš použiť v Brevo (majú na to vlastné DOI mechanizmy)

A upravím route tak, aby to sedelo na tvoj setup.
