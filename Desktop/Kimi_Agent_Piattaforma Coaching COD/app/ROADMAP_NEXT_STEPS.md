# 🚀 ROADMAP - Prossimi Passi

> COD Intelligence Platform - Piano di sviluppo immediato

---

## 📍 STATO ATTUALE

✅ **Fase 1 COMPLETATA** - MVP Funzionante
- Build passa su Vercel
- RAG Engine operativo
- Knowledge Base con 17 armi
- Profiling flow completo
- Persona classification (7 tipi)

---

## 🎯 PRIORITÀ 1: Espansione Knowledge Base

### Settimana 1-2

#### Task 1.1: Aggiungere tutte le armi MW3
**Stima**: 4-6 ore
**File**: `src/data/weaponKnowledgeBase.ts`

Armi da aggiungere:
```
ASSAULT RIFLES (mancanti):
- SVA 545
- MTZ-556
- Holger 556
- DG-58
- FR 5.56
- M16
- M4
- TAQ-56
- Lachmann-556
- STB 556
- Kastov 762
- Kastov 545
- Chimera

SMGs (mancanti):
- Lachmann Sub
- VEL 46
- FSS Hurricane
- BAS-P
- MX9
- PDSW 528
- Fennec 45

LMGs (mancanti):
- 556 Icarus
- HCR 56
- RAAL MG
- RPK
- SAKIN MG38

SNIPERS (mancanti):
- Signal 50
- Victus XMR
- MCPR-300
- LA-B 330
- SP-X 80

SHOTGUNS (mancanti):
- Expedite 12
- Bryson 800
- Bryson 890
- KV Broadside
```

**Fonti dati**:
- https://sym.gg/
- https://www.truegamedata.com/
- https://wzstats.gg/

---

#### Task 1.2: Aggiungere tutti gli attachments
**Stima**: 6-8 ore
**File**: `src/data/weaponKnowledgeBase.ts`

Categorie da completare:
- [ ] Ottiche (20+ scope/sight)
- [ ] Muzzle (15+ flash hider/suppressor)
- [ ] Barrels (30+ short/long)
- [ ] Magazines (20+ extended/fast reload)
- [ ] Grips (15+ vertical/angled)
- [ ] Stocks (15+ heavy/light/no stock)
- [ ] Lasers (5+)
- [ ] Underbarrels (10+)

---

#### Task 1.3: Popolare database Supabase
**Stima**: 2-3 ore
**File**: `supabase/rag-schema.sql`

```sql
-- Script per inserire tutte le armi con embeddings
-- Usare OpenAI API per generare embeddings
-- Batch insert per performance
```

**Tool suggerito**: Script Node.js per automatizzare

---

## 🎯 PRIORITÀ 2: Migliorare Accuracy OCR

### Settimana 2-3

#### Task 2.1: Validazione immagini
**Stima**: 3-4 ore
**File**: `src/lib/rag-engine.ts`

Aggiungere controllo:
```typescript
// Prima di fare OCR, verifica che sia davvero COD
const isValidCodScreenshot = await validateImage(imageBase64);
if (!isValid) {
  throw new Error('Questa non sembra una schermata COD');
}
```

#### Task 2.2: Confidence scoring
**Stima**: 2-3 ore

```typescript
interface OCRResult {
  data: any;
  confidence: number;  // 0-1
  warnings: string[];  // "Low accuracy detected"
}

// Se confidence < 0.7, chiedi nuova foto
```

#### Task 2.3: Retry mechanism
**Stima**: 2 ore

- Max 3 tentativi OCR
- Fallback a prompts diversi
- Notifica utente se fallisce

---

## 🎯 PRIORITÀ 3: Dashboard Analytics

### Settimana 3-4

#### Task 3.1: Admin Panel
**Stima**: 8-10 ore
**Nuovo file**: `src/sections/AdminDashboard.tsx`

Features:
- [ ] Grafico distribuzione persona types
- [ ] Grafico skill tiers
- [ ] Top armi più usate
- [ ] Trend nel tempo
- [ ] Tabella ultimi profili creati

**Libreria**: Recharts (già installata)

#### Task 3.2: Export dati
**Stima**: 3-4 ore

```typescript
// Export CSV
function exportToCSV(profiles: PlayerProfile[]): string {
  // headers + rows
}

// Export JSON
function exportToJSON(profiles: PlayerProfile[]): string {
  // formatted JSON
}
```

#### Task 3.3: API Endpoints
**Stima**: 4-5 ore
**Nuovo file**: `src/lib/api.ts`

```typescript
// GET /api/profiles
// GET /api/profiles/:id
// GET /api/analytics/overview
// POST /api/export
```

---

## 🎯 PRIORITÀ 4: Enterprise Features

### Settimana 5-6

#### Task 4.1: Multi-tenant
**Stima**: 6-8 ore

```sql
-- Aggiungere organization_id
ALTER TABLE player_profiles 
ADD COLUMN organization_id UUID REFERENCES organizations(id);

-- RLS policy per isolamento
CREATE POLICY "tenant_isolation" 
ON player_profiles FOR ALL
USING (organization_id = current_tenant_id());
```

#### Task 4.2: RBAC (Role Based Access Control)
**Stima**: 4-5 ore

Ruoli:
- `admin`: Tutti i permessi
- `analyst`: Solo lettura + export
- `viewer`: Solo dashboard

#### Task 4.3: Audit Logging
**Stima**: 3-4 ore

```sql
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY,
  user_id UUID,
  action VARCHAR(50),  -- 'create_profile', 'export_data'
  resource_type VARCHAR(50),
  resource_id UUID,
  metadata JSONB,
  created_at TIMESTAMP
);
```

---

## 🎯 PRIORITÀ 5: Ottimizzazioni

### Settimana 7-8

#### Task 5.1: Caching
**Stima**: 4-5 ore

```typescript
// Cache risultati OCR per stessa immagine
const cacheKey = hash(imageBase64);
const cached = await redis.get(cacheKey);
if (cached) return JSON.parse(cached);
```

#### Task 5.2: Queue System
**Stima**: 6-8 ore

Per analisi pesanti:
- Upload immagine → Queue
- Background processing
- WebSocket per notifica completamento

#### Task 5.3: Rate Limiting
**Stima**: 2-3 ore

```typescript
// Max 10 analisi/minuto per utente
// Max 1000/mese per organizzazione
```

---

## 📊 TIMELINE RIASSUNTIVA

| Settimana | Focus | Deliverable |
|-----------|-------|-------------|
| 1 | Knowledge Base | 50+ armi, 100+ attachments |
| 2 | Accuracy | OCR validation, confidence scoring |
| 3 | Dashboard v1 | Grafici base, export CSV |
| 4 | Dashboard v2 | API, analytics avanzati |
| 5 | Enterprise | Multi-tenant, RBAC |
| 6 | Enterprise | Audit, security |
| 7 | Scale | Caching, ottimizzazioni |
| 8 | Scale | Queue, monitoring |

---

## 💰 BUSINESS MODEL SUGGERITO

### Tiering

| Piano | Prezzo | Include |
|-------|--------|---------|
| **Free** | €0 | 10 profili/mese, basic analytics |
| **Pro** | €49/mese | 1000 profili, full analytics, export |
| **Enterprise** | €499/mese | Illimitato, API access, white-label |
| **Custom** | Su richiesta | On-premise, SLA, supporto 24/7 |

### Metriche di Successo

**MVP (Settimana 4)**:
- [ ] 100 profili creati
- [ ] 10 clienti Pro
- [ ] Accuracy OCR > 85%

**Scale (Settimana 8)**:
- [ ] 10,000 profili
- [ ] 50 clienti Pro
- [ ] 5 clienti Enterprise

---

## 🛠️ TOOLS CONSIGLIATI

### Per Task 1.1 (Armi)
- Web scraper per sym.gg
- Script Node.js per parsing
- OpenAI batch API per embeddings

### Per Task 3.1 (Dashboard)
- Recharts (già installato)
- TanStack Table per tabelle
- date-fns per date formatting

### Per Task 5.2 (Queue)
- Bull Queue (Redis)
- Serverless Functions (Vercel/Netlify)

---

## ✅ CHECKLIST PROSSIMA SPRINT

### Questa Settimana (Priorità 1)
- [ ] Aggiungere 20 armi al Knowledge Base
- [ ] Testare accuracy con screenshot reali
- [ ] Documentare API interne
- [ ] Preparare demo per stakeholder

### Prossima Settimana (Priorità 2)
- [ ] Implementare confidence scoring
- [ ] Aggiungere validazione immagini
- [ ] Iniziare dashboard analytics
- [ ] Raccogliere feedback utenti

---

## 🆘 SUPPORTO

**Per domande tecniche**:
- Controlla `ENTERPRISE_DOCUMENTATION.md`
- Apri issue su GitHub
- Tag: `help wanted`, `question`

**Per bug**:
- Log dettagliato
- Screenshot
- Steps to reproduce

---

*Ultimo aggiornamento: 2026-02-03*
*Versione: 1.0*
