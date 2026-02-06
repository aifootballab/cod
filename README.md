# COD COACHING ELITE - Enterprise Edition

Piattaforma AI-powered per ottimizzare le performance su Call of Duty.

## 🚀 Features

- **OCR AI**: Estrazione automatica statistiche da screenshot (GPT-4 Vision)
- **RAG System**: Ricerca semantica build ottimali con vector embeddings
- **AI Analysis**: Consigli personalizzati basati sulle tue stats
- **Build Database**: 6+ loadout META per MW3
- **Rank System**: RECRUIT → LEGEND basato su performance
- **Auth Completo**: Email, Google, Discord OAuth
- **Cloud Storage**: Screenshot su Supabase Storage

## 🛠️ Tech Stack

- **Frontend**: React + TypeScript + Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **AI**: OpenAI GPT-4 Vision + Embeddings
- **Deploy**: Vercel

## 📋 Setup

### 1. Clona repository
```bash
git clone https://github.com/aifootballab/cod.git
cd cod
```

### 2. Installa dipendenze
```bash
npm install
```

### 3. Configura environment variables
Crea file `.env`:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_OPENAI_API_KEY=sk-your-openai-key
```

### 4. Configura Supabase
1. Crea progetto su [supabase.com](https://supabase.com)
2. Esegui SQL in `supabase/schema.sql`
3. Abilita Auth providers (Email, Google, Discord)
4. Crea Storage bucket "screenshots"

### 5. Deploy su Vercel
```bash
vercel --prod
```

## 🔧 Configurazione Vercel Environment Variables

Nel dashboard Vercel, vai su **Settings → Environment Variables** e aggiungi:

| Name | Value |
|------|-------|
| `VITE_SUPABASE_URL` | https://your-project.supabase.co |
| `VITE_SUPABASE_ANON_KEY` | eyJhbG... |
| `VITE_OPENAI_API_KEY` | sk-... |

## 📁 Struttura Progetto

```
src/
├── sections/          # Page sections
│   ├── HeroSection.tsx
│   ├── UploadSection.tsx
│   └── ResultsSection.tsx
├── components/        # Reusable components
├── hooks/            # Custom hooks
│   └── useAnalysis.ts
├── lib/              # Utilities
│   ├── supabase.ts
│   └── openai.ts
├── data/             # Static data
│   └── weaponDatabase.ts
├── types/            # TypeScript types
└── App.tsx

supabase/
└── schema.sql        # Database schema
```

## 🎮 Rank System

| Rank | Punti | Colore |
|------|-------|--------|
| RECRUIT | 0-140 | Marrone |
| REGULAR | 140-190 | Grigio |
| HARDENED | 190-250 | Blu |
| VETERAN | 250-320 | Verde |
| ELITE | 320-400 | Viola |
| LEGEND | 400+ | Oro |

Formula: `Punti = K/D × 100 + Accuracy × 10`

## 📝 API Usage

### OCR - Extract Stats
```typescript
import { extractStatsFromImage } from '@/lib/openai';

const stats = await extractStatsFromImage(imageBase64);
// Returns: { kd_ratio, accuracy, spm, ... }
```

### RAG - Search Builds
```typescript
import { searchBuildsRAG } from '@/lib/supabase';

const builds = await searchBuildsRAG(embedding, 3);
```

### AI Analysis
```typescript
import { generateAIAnalysis } from '@/lib/openai';

const { analysis, tips } = await generateAIAnalysis(stats, builds);
```

## 🔒 Security

- Row Level Security (RLS) attivo su tutte le tabelle
- API keys solo lato server (env vars)
- Auth gestito da Supabase
- Upload limitato a 10MB

## 📄 License

MIT - Non affiliato con Activision.
