-- ============================================
-- RAG SCHEMA - COD Weapon Knowledge Base
-- ============================================

-- 1. Weapon Knowledge Base (filled from JSON/crawling)
CREATE TABLE weapon_knowledge (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL, -- assault_rifle, smg, lmg, etc
    game_version VARCHAR(20) NOT NULL, -- mw3, warzone, etc
    
    -- Stats numerici
    base_damage INT,
    fire_rate INT,
    accuracy_rating INT, -- 0-100
    range_rating INT,    -- 0-100
    mobility_rating INT, -- 0-100
    control_rating INT,  -- 0-100
    
    -- Meta info
    meta_tier VARCHAR(10), -- S, A, B, C, D
    ttk_close DECIMAL(4,2), -- Time to kill (ms)
    ttk_mid DECIMAL(4,2),
    ttk_long DECIMAL(4,2),
    
    -- Descrizione per embeddings
    description TEXT,
    
    -- JSON completo
    raw_data JSONB,
    
    -- Vector embedding per RAG (1536 dimensioni per OpenAI)
    embedding VECTOR(1536),
    
    created_at TIMESTAMP DEFAULT NOW()
);

-- 2. Attachments Knowledge
CREATE TABLE attachment_knowledge (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL, -- optic, muzzle, barrel, etc
    
    -- Effetti (valori positivi/negativi)
    effects JSONB, -- {"damage": +5, "recoil": -10, "ads_speed": -50}
    
    -- Pro/Cons testuali
    pros TEXT[],
    cons TEXT[],
    
    -- Per quali armi è disponibile
    compatible_weapons TEXT[],
    
    -- Descrizione per RAG
    description TEXT,
    
    -- Embedding
    embedding VECTOR(1536),
    
    created_at TIMESTAMP DEFAULT NOW()
);

-- 3. Player Profiles (i clienti che usano la piattaforma)
CREATE TABLE player_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    
    -- Dati estratti da screenshot
    extracted_stats JSONB, -- {kd: 1.8, accuracy: 24, spm: 350}
    
    -- Armi identificate
    detected_loadouts JSONB[], -- Array di loadout
    
    -- Profilazione AI
    persona_type VARCHAR(50), -- meta_warrior, casual_camper, grinder, etc
    skill_tier VARCHAR(20),   -- bronze, silver, gold, platinum, diamond, crimson, iridescent
    playstyle_tags TEXT[],    -- ['aggressive', 'rusher', 'meta_follower']
    
    -- Scoring
    engagement_score INT,     -- 0-100 (quanto gioca)
    investment_score INT,     -- 0-100 (camo, BP, skin)
    churn_risk INT,           -- 0-100
    
    -- Embedding del profilo completo per ricerca simili
    profile_embedding VECTOR(1536),
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- 4. Analysis History
CREATE TABLE analysis_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    player_id UUID REFERENCES player_profiles(id),
    
    -- Input
    screenshot_url TEXT,
    
    -- Risultati
    detected_weapons JSONB,
    detected_attachments JSONB,
    ai_analysis TEXT,
    
    -- Raccomandazioni generate
    recommendations JSONB, -- {next_weapon: "...", content_suggestion: "..."}
    
    created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- INDICI PER RAG (Similarity Search)
-- ============================================

-- Indice IVFFlat per similarity search veloce su armi
CREATE INDEX ON weapon_knowledge 
USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);

CREATE INDEX ON attachment_knowledge 
USING ivfflat (embedding vector_cosine_ops);

CREATE INDEX ON player_profiles 
USING ivfflat (profile_embedding vector_cosine_ops);

-- Indici per filtri comuni
CREATE INDEX idx_weapon_category ON weapon_knowledge(category);
CREATE INDEX idx_weapon_meta_tier ON weapon_knowledge(meta_tier);
CREATE INDEX idx_player_persona ON player_profiles(persona_type);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Funzione: Trova armi simili (RAG)
CREATE OR REPLACE FUNCTION search_similar_weapons(
    query_embedding VECTOR(1536),
    match_threshold FLOAT,
    match_count INT
)
RETURNS TABLE (
    id UUID,
    name VARCHAR,
    category VARCHAR,
    similarity FLOAT
) LANGUAGE plpgsql AS $$
BEGIN
    RETURN QUERY
    SELECT 
        w.id,
        w.name,
        w.category,
        1 - (w.embedding <=> query_embedding) AS similarity
    FROM weapon_knowledge w
    WHERE 1 - (w.embedding <=> query_embedding) > match_threshold
    ORDER BY w.embedding <=> query_embedding
    LIMIT match_count;
END;
$$;

-- Funzione: Trova player simili (Lookalike Audience)
CREATE OR REPLACE FUNCTION find_similar_players(
    player_id UUID,
    match_count INT DEFAULT 10
)
RETURNS TABLE (
    similar_player_id UUID,
    persona_type VARCHAR,
    similarity FLOAT
) LANGUAGE plpgsql AS $$
DECLARE
    target_embedding VECTOR(1536);
BEGIN
    -- Ottieni embedding del player target
    SELECT profile_embedding INTO target_embedding
    FROM player_profiles WHERE id = player_id;
    
    RETURN QUERY
    SELECT 
        p.id,
        p.persona_type,
        1 - (p.profile_embedding <=> target_embedding) AS similarity
    FROM player_profiles p
    WHERE p.id != player_id
    ORDER BY p.profile_embedding <=> target_embedding
    LIMIT match_count;
END;
$$;

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

ALTER TABLE player_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE analysis_history ENABLE ROW LEVEL SECURITY;

-- Utente vede solo il proprio profilo
CREATE POLICY "Users can view own profile"
    ON player_profiles FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
    ON player_profiles FOR UPDATE
    USING (auth.uid() = user_id);

-- Storia analisi solo proprie
CREATE POLICY "Users can view own analysis"
    ON analysis_history FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM player_profiles 
            WHERE id = analysis_history.player_id 
            AND user_id = auth.uid()
        )
    );
