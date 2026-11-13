# IASCAI — official website

International Applied Science Competition on Artificial Intelligence, organised by the
Indonesian Young Scientist Association (IYSA).

All content (edition, dates, categories, fees, timeline, awards, guidebook, registration form)
comes from the IYSA dashboard public API, series `IASCAI`. The edition shown is the one pinned
in the dashboard (Division IT → APIs) — moving to a new edition needs no code change.
Pages rebuild every 5 minutes (ISR).

```
npm install
npm run dev     # http://localhost:3000
npm run build
```

Optional env: `NEXT_PUBLIC_IYSA_API`, `NEXT_PUBLIC_IYSA_SERIES`.
