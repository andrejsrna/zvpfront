# WordPress → Markdown export

Tento projekt vie stiahnuť všetky WordPress články cez REST API a uložiť ich ako lokálne Markdown súbory.

## Spustenie

1) (Voliteľné) skontroluj `.env.local`:
- `WORDPRESS_API_URL` (napr. `https://admin.zdravievpraxi.sk/wp-json`)
- `WORDPRESS_AUTH_TOKEN` (iba ak potrebuješ export aj pre `status != publish`)

2) Nainštaluj závislosti:

```bash
npm install
```

3) Exportni články:

```bash
npm run wp:export
```

Výstup je v `content/posts` a index v `content/posts/_index.json`.

## Médiá (obrázky)

Ak chceš stiahnuť obrázky z `wp-content/uploads` a prepísať odkazy v Markdown:

```bash
npm run wp:export -- --download-media
```

Médiá sa uložia do `public/wp-media` a v Markdown sa budú odkazovať ako `/wp-media/...`.

## Médiá → Cloudflare R2

Ak chceš nahrať všetky obrázky, ktoré sa nachádzajú v exportovaných Markdown súboroch (URL na `.../wp-content/uploads/...`), do Cloudflare R2 a zároveň prepísať odkazy v Markdown na R2:

```bash
npm run wp:media:r2
```

Skript načíta R2 nastavenia z `.env.local` (`R2_BUCKET_NAME`, `R2_ACCESS_KEY`, `R2_SECRET_KEY`, `R2_ENDPOINT_URL`, `R2_API_URL`).

## Užitočné voľby

- Zmeniť výstupný adresár: `--out content/clanky`
- Export iného statusu: `--status draft` (typicky vyžaduje auth)
- Zmeniť API base: `--api https://example.com/wp-json`
