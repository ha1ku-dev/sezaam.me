# sezaam-landing

Landing page for [Sezaam](https://sezaam.me) — deployed on GitHub Pages.

## Local development

```bash
# Open in browser (no build step needed)
open index.html

# Or use any static file server
npx serve .
python3 -m http.server 8000
```

## Deployment

### GitHub Pages

1. Push this directory to a GitHub repo
2. Repo Settings → Pages → Source: `main` branch, `/ (root)`
3. Custom domain: `sezaam.me`
4. Add `CNAME` file with `sezaam.me` (GitHub does this automatically)

### DNS

Point `sezaam.me` to GitHub Pages:
- Add a `CNAME` record for `sezaam.me` → `k0dard.github.io`
- Or use GitHub's IP addresses for apex domain (`A` records)

## API endpoint

The form POSTs to `https://app.sezaam.me/api/waitlist` (cross-origin).

The K3s endpoint needs CORS headers:
```
Access-Control-Allow-Origin: https://sezaam.me
Access-Control-Allow-Methods: POST, OPTIONS
Access-Control-Allow-Headers: Content-Type
```

## Project structure

```
index.html          # Landing page (inline CSS + JS, no dependencies)
assets/
  opener-demo.mp4   # Opener installation demo video
  lockbox.jpg       # Lockbox photo (video poster)
  marseille.jpg     # News article image
  cannes.jpeg       # News article image
  boite-a-cles.jpg  # Lockbox stock photo
  claudia.jpg       # News article image
  cannes-news.png   # News article image
tag.md              # Physical tag design for QR stickers
README.md           # This file
```

## Images

| File | Usage | Source |
|---|---|---|
| `opener-demo.mp4` | Hero video (autoplay loop) | Converted from `1000005175.gif` |
| `lockbox.jpg` | Video poster image | `1000005138.jpg` |
| `marseille.jpg` | Press section | Notion export |
| `cannes.jpeg` | Press section | `cannes-airbnb-boites-a-cles-3.jpeg` |
| `boite-a-cles.jpg` | Press section | Notion export |
| `claudia.jpg` | Press section | Notion export |
| `cannes-news.png` | Press section | Notion export |