# Newsletter - Integrácia s externými službami

## 🚀 Odporúčané riešenia

Pre produkčné použitie odporúčam použiť špecializované služby namiesto ukladania emailov vo WordPress.

## 1. Mailchimp

### Výhody:

- ✅ Zdarma do 2000 kontaktov
- ✅ Automatizácie a kampane
- ✅ Detailné štatistiky
- ✅ GDPR compliant

### Implementácia v Next.js:

```typescript
// app/api/newsletter/route.ts
import { NextResponse } from 'next/server';

const MAILCHIMP_API_KEY = process.env.MAILCHIMP_API_KEY;
const MAILCHIMP_LIST_ID = process.env.MAILCHIMP_LIST_ID;
const MAILCHIMP_SERVER = process.env.MAILCHIMP_SERVER; // napr. us1

export async function POST(request: Request) {
  try {
    const { email, acceptPrivacy } = await request.json();

    const response = await fetch(
      `https://${MAILCHIMP_SERVER}.api.mailchimp.com/3.0/lists/${MAILCHIMP_LIST_ID}/members`,
      {
        method: 'POST',
        headers: {
          Authorization: `apikey ${MAILCHIMP_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email_address: email,
          status: 'subscribed',
          merge_fields: {
            GDPR: acceptPrivacy ? 'Yes' : 'No',
          },
          tags: ['website-signup'],
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();

      // Handle duplicate email
      if (error.title === 'Member Exists') {
        return NextResponse.json(
          { error: 'Email už je prihlásený' },
          { status: 400 }
        );
      }

      throw new Error(error.detail || 'Mailchimp error');
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Newsletter signup error:', error);
    return NextResponse.json(
      { error: 'Nepodarilo sa prihlásiť na odber' },
      { status: 500 }
    );
  }
}
```

### Nastavenie:

1. Vytvorte účet na [mailchimp.com](https://mailchimp.com)
2. Získajte API kľúč: Account → Extras → API keys
3. Vytvorte Audience (zoznam kontaktov)
4. Pridajte do `.env.local`:

```env
MAILCHIMP_API_KEY=your-api-key
MAILCHIMP_LIST_ID=your-list-id
MAILCHIMP_SERVER=us1
```

## 2. ConvertKit

### Výhody:

- ✅ Zdarma do 1000 kontaktov
- ✅ Pokročilé automatizácie
- ✅ Tagovací systém
- ✅ Jednoduché API

### Implementácia:

```typescript
// app/api/newsletter/route.ts
const CONVERTKIT_API_KEY = process.env.CONVERTKIT_API_KEY;
const CONVERTKIT_FORM_ID = process.env.CONVERTKIT_FORM_ID;

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    const response = await fetch(
      `https://api.convertkit.com/v3/forms/${CONVERTKIT_FORM_ID}/subscribe`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          api_key: CONVERTKIT_API_KEY,
          email: email,
          tags: ['zdravie-v-praxi'],
        }),
      }
    );

    if (!response.ok) {
      throw new Error('ConvertKit error');
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Nepodarilo sa prihlásiť na odber' },
      { status: 500 }
    );
  }
}
```

## 3. SendGrid

### Výhody:

- ✅ 100 emailov/deň zdarma
- ✅ Transactional + Marketing
- ✅ Vysoká deliverability
- ✅ Detailné API

### Implementácia:

```typescript
// app/api/newsletter/route.ts
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    // Add to contacts
    const contactResponse = await fetch(
      'https://api.sendgrid.com/v3/marketing/contacts',
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${process.env.SENDGRID_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contacts: [
            {
              email: email,
              custom_fields: {
                source: 'website',
                signup_date: new Date().toISOString(),
              },
            },
          ],
        }),
      }
    );

    if (!contactResponse.ok) {
      throw new Error('SendGrid error');
    }

    // Send welcome email
    await sgMail.send({
      to: email,
      from: 'newsletter@zdravievpraxi.sk',
      subject: 'Vitajte v našom newsletteri!',
      html: `
        <h1>Ďakujeme za prihlásenie!</h1>
        <p>Tešíme sa, že vás môžeme informovať o novinkách zo sveta zdravia.</p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Nepodarilo sa prihlásiť na odber' },
      { status: 500 }
    );
  }
}
```

## 4. Jednoduchá EmailJS integrácia

Pre malé projekty môžete použiť EmailJS:

```typescript
// app/components/Newsletter.tsx
import emailjs from '@emailjs/browser';

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    await emailjs.send(
      'YOUR_SERVICE_ID',
      'YOUR_TEMPLATE_ID',
      {
        to_email: 'admin@zdravievpraxi.sk',
        from_email: formData.email,
        message: `Nový odber newslettera: ${formData.email}`,
      },
      'YOUR_PUBLIC_KEY'
    );

    setStatus('success');
  } catch (error) {
    setStatus('error');
  }
};
```

## 📊 Porovnanie služieb

| Služba     | Free tier      | Cena | Automatizácie | API        |
| ---------- | -------------- | ---- | ------------- | ---------- |
| Mailchimp  | 2000 kontaktov | $$$$ | ⭐⭐⭐⭐⭐    | ⭐⭐⭐⭐   |
| ConvertKit | 1000 kontaktov | $$$  | ⭐⭐⭐⭐⭐    | ⭐⭐⭐⭐⭐ |
| SendGrid   | 100/deň        | $$   | ⭐⭐⭐        | ⭐⭐⭐⭐⭐ |
| EmailJS    | 200/mesiac     | $    | ⭐            | ⭐⭐⭐     |

## 🔧 Upravený Newsletter komponent

Pre použitie s externými službami upravte error handling:

```typescript
// app/components/Newsletter.tsx
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!formData.acceptPrivacy) {
    setErrorMessage('Prosím, potvrďte súhlas so spracovaním osobných údajov');
    return;
  }

  setStatus('loading');
  setErrorMessage('');

  try {
    const response = await fetch('/api/newsletter', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (!response.ok) {
      // Handle specific errors
      if (response.status === 400 && data.error) {
        setErrorMessage(data.error);
      } else {
        throw new Error('Nepodarilo sa prihlásiť na odber');
      }
      setStatus('error');
      return;
    }

    setStatus('success');
    setFormData({ email: '', acceptPrivacy: false });

    // Track conversion
    if (window.gtag) {
      window.gtag('event', 'newsletter_signup', {
        event_category: 'engagement',
        event_label: 'footer',
      });
    }
  } catch (error) {
    setStatus('error');
    setErrorMessage('Nastala chyba pri prihlásení. Skúste to prosím neskôr.');
  }
};
```

## ✅ Odporúčanie

Pre váš projekt odporúčam:

1. **Začať s Mailchimp** - jednoduchá integrácia, veľký free tier
2. **Migrovať na ConvertKit** keď potrebujete pokročilé automatizácie
3. **SendGrid** ak plánujete posielať aj transakčné emaily

Všetky tieto služby sú GDPR compliant a poskytujú double opt-in možnosti.
