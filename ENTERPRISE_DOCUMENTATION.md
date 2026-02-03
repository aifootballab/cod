# 🎮 COD INTELLIGENCE PLATFORM - Enterprise Documentation

> **Piattaforma RAG (Retrieval Augmented Generation) per profilazione giocatori Call of Duty**
> 
> Version: 1.0 | Last Updated: 2026-02-03

---

## 📋 INDICE

1. [Architettura Overview](#1-architettura-overview)
2. [Stack Tecnologico](#2-stack-tecnologico)
3. [Componenti Core](#3-componenti-core)
4. [Flusso Dati](#4-flusso-dati)
5. [Database Schema](#5-database-schema)
6. [API Reference](#6-api-reference)
7. [Use Cases Enterprise](#7-use-cases-enterprise)
8. [Roadmap](#8-roadmap)

---

## 1. ARCHITETTURA OVERVIEW

### 🎯 Vision
Piattaforma enterprise che combina **Computer Vision**, **RAG (Retrieval Augmented Generation)** e **Machine Learning** per profilare giocatori Call of Duty con precisione chirurgica.

### 🏗️ Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────────┐  │
│  │  React App   │  │ Upload Flow  │  │ Enterprise Dashboard     │  │
│  │  (Vite/TS)   │  │ (Drag&Drop)  │  │ (Analytics & Reporting)  │  │
│  └──────┬───────┘  └──────┬───────┘  └───────────┬──────────────┘  │
└─────────┼─────────────────┼──────────────────────┼─────────────────┘
          │                 │                      │
          └─────────────────┼──────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────────┐
│                      PROCESSING LAYER                               │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                    RAG PIPELINE                               │  │
│  │  ┌──────────┐    ┌──────────┐    ┌──────────────────────┐   │  │
│  │  │   OCR    │───→│  Vector  │───→│   Profile Engine     │   │  │
│  │  │ (GPT-4V) │    │  Search  │    │  (Classification)    │   │  │
│  │  └──────────┘    │(pgvector)│    └──────────────────────┘   │  │
│  │                  └──────────┘                                 │  │
│  └──────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────────┐
│                        DATA LAYER                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────────┐  │
│  │   Supabase   │  │  Knowledge   │  │    Vector Embeddings     │  │
│  │  (Postgres)  │  │    Base      │  │    (1536 dimensions)     │  │
│  └──────────────┘  └──────────────┘  └──────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 2. STACK TECNOLOGICO

### Frontend
| Tecnologia | Versione | Scopo |
|------------|----------|-------|
| React | 19.2.0 | UI Framework |
| TypeScript | 5.9.3 | Type Safety |
| Vite | 7.3.0 | Build Tool |
| Tailwind CSS | 3.4.19 | Styling |
| Lucide React | 0.562.0 | Icons |

### Backend & AI
| Tecnologia | Versione | Scopo |
|------------|----------|-------|
| OpenAI GPT-4o-mini | Latest | OCR & Analysis |
| Supabase | Latest | Database & Auth |
| pgvector | 0.8.0 | Vector Search |

### Knowledge Base
- **Weapon Database**: 17 armi MW3/Warzone complete di stats
- **Attachment Database**: 10 attachments con meta scoring
- **Persona Classification**: 7 tipi di giocatore identificati

---

## 3. COMPONENTI CORE

### 3.1 RAG Engine (`src/lib/rag-engine.ts`)

#### `recognizeWeaponAndRetrieve(imageBase64)`
```typescript
// Input: Screenshot arma (base64)
// Output: Dati completi arma + similar weapons + suggested attachments

const result = await recognizeWeaponAndRetrieve(imageBase64);
// {
//   detected: { name, confidence, category, attachments },
//   similarWeapons: [...],
//   suggestedAttachments: [...],
//   knowledgeBaseMatch: {...}
// }
```

#### `generatePlayerProfile(stats, detectedWeapons)`
```typescript
// Input: Stats profilo + Array armi rilevate
// Output: Profilo completo con persona type, scoring, recommendations

const profile = await generatePlayerProfile(stats, weapons);
// {
//   id: UUID,
//   personaType: 'meta_warrior' | 'aggressive_grinder' | ...,
//   skillTier: 'bronze' | 'silver' | ... | 'iridescent',
//   playstyleTags: ['aggressive', 'rusher', 'meta_follower'],
//   engagementScore: 0-100,
//   investmentScore: 0-100,
//   churnRisk: 0-100,
//   recommendations: [...]
// }
```

### 3.2 Persona Classification System

| Persona Type | Trigger | Caratteristiche |
|--------------|---------|-----------------|
| **meta_warrior** | 70%+ armi meta + K/D > 1.2 + 200h+ | Segue sempre il meta, hardcore |
| **skilled_hipster** | K/D > 1.3 + armi non-meta | Buono ma usa build originali |
| **completionist** | 4+ categorie armi + 300h+ | Vuole sbloccare tutto |
| **aggressive_grinder** | SPM > 400 + rusher tag | Rush constante, alta energia |
| **tactical_sniper** | Accuracy > 30% + methodical | Posizionamento, precisione |
| **support_player** | LMG + team_player | Gioca per il team |
| **casual_rookie** | < 50h giocate | Nuovo giocatore |

### 3.3 Scoring Algorithm

#### Skill Tier Formula
```
Score = (K/D × 100) + (Accuracy × 10) + (SPM / 10)

Tier Mapping:
- Iridescent: > 500
- Crimson: > 450
- Diamond: > 400
- Platinum: > 350
- Gold: > 300
- Silver: > 250
- Bronze: < 250
```

#### Engagement Score
```
Score = min(hours/10, 50) + min(kills/1000, 30) + min(level/2, 20)
Range: 0-100
```

#### Churn Risk Prediction
```
- Hardcore (300h+, engagement 70+): 5%
- Regular (150h+, engagement 50+): 15%
- New (< 20h): 85%
- Low engagement (< 30): 70%
- Default: 40%
```

---

## 4. FLUSSO DATI

### 4.1 Profile Creation Flow

```
1. USER UPLOADS
   ├── Screenshot profilo COD (stats page)
   └── 1-5 screenshot armi (loadout)

2. OCR PROCESSING
   ├── GPT-4V estrae dati testuali
   └── Validazione formato COD

3. WEAPON RECOGNITION
   ├── Matching con Knowledge Base (17 armi)
   ├── Attachment detection
   └── Playstyle inference

4. RAG RETRIEVAL
   ├── Vector search armi simili
   ├── Suggested attachments
   └── Meta build recommendations

5. PROFILING ENGINE
   ├── Cross-reference stats + armi
   ├── Persona classification
   ├── Skill tier calculation
   └── Scoring (engagement, investment, churn)

6. OUTPUT
   ├── Player Profile (JSON)
   ├── Recommendations
   └── Lookalike audience matching
```

### 4.2 Data Model

```typescript
// Player Profile Core
interface PlayerProfile {
  id: string;                    // UUID
  personaType: string;           // meta_warrior, etc.
  skillTier: string;             // bronze → iridescent
  playstyleTags: string[];       // ['aggressive', 'rusher']
  
  // Scoring
  engagementScore: number;       // 0-100
  investmentScore: number;       // 0-100  
  churnRisk: number;             // 0-100
  
  // Data
  weaponPreferences: string[];   // ['MCW', 'Striker']
  recommendations: Recommendation[];
}

// Weapon Detection
interface DetectedWeapon {
  name: string;
  confidence: number;            // 0.0-1.0
  category: string;              // assault_rifle, smg, etc.
  attachments: DetectedAttachment[];
}
```

---

## 5. DATABASE SCHEMA

### 5.1 Core Tables

#### `weapon_knowledge`
```sql
CREATE TABLE weapon_knowledge (
    id UUID PRIMARY KEY,
    weapon_id VARCHAR(50) UNIQUE,    -- 'mcw', 'striker'
    name VARCHAR(100),                -- 'MCW'
    category VARCHAR(50),             -- 'assault_rifle'
    
    -- Stats 0-100
    stat_damage INT,
    stat_fire_rate INT,
    stat_accuracy INT,
    stat_range INT,
    stat_mobility INT,
    stat_control INT,
    
    meta_tier VARCHAR(10),            -- 'S', 'A', 'B', 'C', 'D'
    ttk_close DECIMAL(5,2),          -- milliseconds
    ttk_mid DECIMAL(5,2),
    ttk_long DECIMAL(5,2),
    
    playstyle_tags TEXT[],            -- ['aggressive', 'meta']
    embedding VECTOR(1536)            -- OpenAI embedding
);
```

#### `player_profiles`
```sql
CREATE TABLE player_profiles (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES auth.users,
    
    -- Profilazione
    persona_type VARCHAR(50),
    skill_tier VARCHAR(20),
    playstyle_tags TEXT[],
    
    -- Scoring
    engagement_score INT,
    investment_score INT,
    churn_risk INT,
    ltv_predicted DECIMAL(10,2),
    
    -- Vector per lookalike
    profile_embedding VECTOR(1536)
);
```

### 5.2 Functions

#### `search_similar_weapons(query_embedding, threshold, count)`
Ricerca semantica armi simili usando cosine similarity su embeddings.

#### `find_similar_players(player_id, count)`
Trova giocatori con profilo simile (lookalike audience per marketing).

---

## 6. API REFERENCE

### 6.1 Internal APIs

#### Weapon Recognition
```typescript
POST /api/analyze-weapon
Content-Type: multipart/form-data

Body:
  - image: File (screenshot arma)

Response:
{
  "detected": {
    "name": "MCW",
    "confidence": 0.94,
    "category": "assault_rifle",
    "attachments": [...]
  },
  "similarWeapons": [...],
  "suggestedAttachments": [...]
}
```

#### Profile Generation
```typescript
POST /api/generate-profile
Content-Type: application/json

Body:
{
  "stats": {
    "kd_ratio": 1.45,
    "accuracy": 22.5,
    "spm": 385,
    ...
  },
  "weapons": [...]
}

Response:
{
  "id": "uuid",
  "personaType": "aggressive_grinder",
  "skillTier": "platinum",
  "playstyleTags": ["aggressive", "rusher"],
  "engagementScore": 78,
  "churnRisk": 15,
  "recommendations": [...]
}
```

### 6.2 External APIs Used

| Provider | Endpoint | Usage |
|----------|----------|-------|
| OpenAI | `/v1/chat/completions` | OCR with GPT-4o-mini |
| OpenAI | `/v1/embeddings` | Vector generation |
| Supabase | `/rest/v1/rpc/*` | Vector search functions |

---

## 7. USE CASES ENTERPRISE

### 7.1 Per Esports Teams
**Problema**: Trovare talenti con specifiche caratteristiche

**Soluzione**:
```
Query: "Trova giocatori con persona='aggressive_grinder', 
        skillTier='diamond', K/D > 1.5"

Output: Lista candidati con contatti e statistiche
```

### 7.2 Per Publisher (Activision)
**Problema**: Capire il meta-game e bilanciare armi

**Soluzione**:
```
Analytics Dashboard:
- 34% dei giocatori hardcore usa solo 3 armi
- Distribution persona types
- Churn prediction per season
```

### 7.3 Per Content Creator Network
**Problema**: Matchmaking contenuto-audience

**Soluzione**:
```
Viewer Analysis:
- 65% della audience è "Meta-Warrior"
- Recommendation: "Fai video tier-list"
- Predicted engagement: +40%
```

### 7.4 Per Marketing Agency
**Problema**: Segmentazione utenti per campagne

**Soluzione**:
```
Cluster Analysis:
- Cluster "Aggressive Whales": 8% MAU, 45% revenue
- Target: Bundle armi aggressive
- Channel: YouTube pre-roll
```

---

## 8. ROADMAP

### ✅ Phase 1: MVP (COMPLETATO)
- [x] RAG Engine core
- [x] Weapon Knowledge Base (17 armi)
- [x] Persona classification (7 tipi)
- [x] Basic profiling flow
- [x] TypeScript strict compliance

### 🚧 Phase 2: Enhanced Accuracy (WEEK 1-2)
- [ ] Espandere Knowledge Base a 50+ armi
- [ ] Aggiungere tutti gli attachments MW3
- [ ] Training embeddings su dataset reale
- [ ] Validazione OCR con confidence threshold
- [ ] Fallback mechanism per low-confidence

### 📊 Phase 3: Analytics Dashboard (WEEK 3-4)
- [ ] Admin dashboard per analytics
- [ ] Grafici e visualizzazioni dati
- [ ] Export CSV/JSON
- [ ] API rate limiting
- [ ] Webhook per eventi

### 🔐 Phase 4: Enterprise Features (WEEK 5-6)
- [ ] Multi-tenant support
- [ ] Role-based access control (RBAC)
- [ ] Audit logging
- [ ] SLA monitoring
- [ ] White-label options

### 🚀 Phase 5: Scale (WEEK 7-8)
- [ ] Caching layer (Redis)
- [ ] Queue system per analisi pesanti
- [ ] CDN per assets
- [ ] Load balancing
- [ ] Monitoring & alerting

---

## APPENDICE

### A. Environment Variables
```env
# Required
VITE_OPENAI_API_KEY=sk-...
VITE_SUPABASE_URL=https://...
VITE_SUPABASE_ANON_KEY=eyJ...

# Optional
VITE_GITHUB_TOKEN=ghp_...  # Per scraping dati armi
```

### B. Development Commands
```bash
# Install
npm install

# Dev
npm run dev

# Build
npm run build

# Type check
npx tsc --noEmit
```

### C. Deployment Checklist
- [ ] Environment variables configurate
- [ ] Supabase migrations eseguite
- [ ] pgvector extension abilitato
- [ ] Edge functions deployate (se usate)
- [ ] CDN configurato per assets
- [ ] SSL/HTTPS attivo

---

## CONTATTI

**Repository**: https://github.com/aifootballab/cod

**Documentation**: This file

**Support**: enterprise@cod-intelligence.com

---

*Documento generato automaticamente per COD Intelligence Platform v1.0*
