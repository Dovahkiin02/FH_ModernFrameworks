# theGame

Cooperative local multiplayer card game built with SvelteKit, Svelte 5 runes, and Supabase authentication.

## Setup

1. Copy `.env.example` to `.env`.
2. Fill in `PUBLIC_SUPABASE_URL` and `PUBLIC_SUPABASE_PUBLISHABLE_KEY`.
3. Install dependencies with `npm install`.

## Commands

```sh
npm run dev
npm run check
npm run test
npm run build
```

## Project Areas

- `/` public landing page
- `/how-to-play` public rules page
- `/play` protected game screen
- `/lab` protected rule configuration page
- `/history` protected local run history
