-- ============================================
-- RAG SCHEMA - COD Intelligence Platform
-- Complete schema for player profiling
-- ============================================

-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- ============================================
-- 1. WEAPON KNOWLEDGE BASE
-- ============================================

CREATE TABLE weapon_knowledge (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    weapon_id VARCHAR(50) UNIQUE NOT NULL, -- 'mcw', 'striker', etc
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL CHECK (category IN ('assault_rifle', 'smg', 'lmg', 'sniper', 'shotgun', 'marksman', 'pistol')),
    game_version VARCHAR(20) NOT NULL DEFAULT 'mw3', -- mw3, warzone, etc
    
    -- Stats numeriche 0-100
    stat_damage INT CHECK (stat_damage BETWEEN 0 AND 100),
    stat_fire_rate INT CHECK (stat_fire_rate BETWEEN 0 AND 100),
    stat_accuracy INT CHECK (stat_accuracy BETWEEN 0 AND 100),
    stat_range INT CHECK (stat_range BETWEEN 0 AND 100),
    stat_mobility INT CHECK (stat_mobility BETWEEN 0 AND 100),
    stat_control INT CHECK (stat_control BETWEEN 0 AND 100),
    
    -- Meta info
    meta_tier VARCHAR(10) CHECK (meta_tier IN ('S', 'A', 'B', 'C', 'D')),
    ttk_close DECIMAL(5,2), -- in milliseconds
    ttk_mid DECIMAL(5,2),
    ttk_long DECIMAL(5,2),
    
    -- Descrizione e tags
    description TEXT,
    playstyle_tags TEXT[], -- ['aggressive', 'meta', 'rusher']
    
    -- JSON completo per flessibilità
    raw_data JSONB,
    
    -- Vector embedding per RAG (1536 dimensioni per OpenAI)
    embedding VECTOR(1536),
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Indici per weapon_knowledge
CREATE INDEX idx_weapon_category ON weapon_knowledge(category);
CREATE INDEX idx_weapon_meta_tier ON weapon_knowledge(meta_tier);
CREATE INDEX idx_weapon_game_version ON weapon_knowledge(game_version);
CREATE INDEX idx_weapon_embedding ON weapon_knowledge USING ivfflat (embedding vector_cosine_ops);

-- ============================================
-- 2. ATTACHMENT KNOWLEDGE BASE
-- ============================================

CREATE TABLE attachment_knowledge (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    attachment_id VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL CHECK (category IN ('optic', 'muzzle', 'barrel', 'magazine', 'grip', 'stock', 'laser', 'underbarrel')),
    
    -- Effetti
    description TEXT,
    pros TEXT[],
    cons TEXT[],
    
    -- Compatibilità
    compatible_weapons TEXT[], -- ['MCW', 'Striker']
    compatible_categories TEXT[], -- ['assault_rifle', 'smg']
    
    -- Meta scoring
    meta_score INT CHECK (meta_score BETWEEN 0 AND 100), -- 0-100, più alto = più usato nei loadout meta
    usage_rate DECIMAL(5,2), -- percentuale di utilizzo
    
    -- Per ricerca semantica
    embedding VECTOR(1536),
    
    created_at TIMESTAMP DEFAULT NOW()
);

-- Indici
CREATE INDEX idx_attachment_category ON attachment_knowledge(category);
CREATE INDEX idx_attachment_meta_score ON attachment_knowledge(meta_score DESC);
CREATE INDEX idx_attachment_embedding ON attachment_knowledge USING ivfflat (embedding vector_cosine_ops);

-- ============================================
-- 3. PLAYER PROFILES
-- ============================================

CREATE TABLE player_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Identificazione
    cod_username VARCHAR(100),
    platform VARCHAR(20) CHECK (platform IN ('playstation', 'xbox', 'pc', 'battle.net')),
    
    -- Dati estratti da screenshot (RAW)
    extracted_stats JSONB, -- {kd: 1.8, accuracy: 24, spm: 350, ...}
    stats_confidence DECIMAL(3,2), -- 0.0-1.0, quanto siamo sicuri dei dati OCR
    
    -- Armi identificate
    detected_loadouts JSONB[], -- Array di loadout analizzati
    
    -- PROFILAZIONE AI (Output principale)
    persona_type VARCHAR(50) NOT NULL, -- meta_warrior, casual_rookie, etc
    skill_tier VARCHAR(20) NOT NULL CHECK (skill_tier IN ('bronze', 'silver', 'gold', 'platinum', 'diamond', 'crimson', 'iridescent')),
    playstyle_tags TEXT[], -- ['aggressive', 'rusher', 'meta_follower']
    
    -- Scoring
    engagement_score INT CHECK (engagement_score BETWEEN 0 AND 100),
    investment_score INT CHECK (investment_score BETWEEN 0 AND 100),
    churn_risk INT CHECK (churn_risk BETWEEN 0 AND 100),
    
    -- Valore predetto
    ltv_predicted DECIMAL(10,2), -- Lifetime Value in €
    
    -- Embedding del profilo completo per ricerca simili
    profile_embedding VECTOR(1536),
    
    -- Timestamp
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Indici player_profiles
CREATE INDEX idx_player_user_id ON player_profiles(user_id);
CREATE INDEX idx_player_persona ON player_profiles(persona_type);
CREATE INDEX idx_player_skill_tier ON player_profiles(skill_tier);
CREATE INDEX idx_player_churn ON player_profiles(churn_risk) WHERE churn_risk > 50;
CREATE INDEX idx_player_embedding ON player_profiles USING ivfflat (profile_embedding vector_cosine_ops);

-- ============================================
-- 4. ANALYSIS HISTORY
-- ============================================

CREATE TABLE analysis_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    player_id UUID REFERENCES player_profiles(id) ON DELETE CASCADE,
    
    -- Input
    screenshot_url TEXT,
    analysis_type VARCHAR(50) NOT NULL CHECK (analysis_type IN ('profile_stats', 'weapon_loadout', 'complete_profile')),
    
    -- Risultati OCR
    ocr_raw_output TEXT,
    ocr_confidence DECIMAL(3,2),
    
    -- Risultati AI
    detected_weapons JSONB,
    detected_attachments JSONB,
    ai_analysis_text TEXT,
    
    -- Raccomandazioni generate
    recommendations JSONB,
    
    -- Validazione (per training)
    user_feedback JSONB, -- {accuracy_rating: 5, correct_weapon: true}
    
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_analysis_player ON analysis_history(player_id);
CREATE INDEX idx_analysis_type ON analysis_history(analysis_type);
CREATE INDEX idx_analysis_date ON analysis_history(created_at DESC);

-- ============================================
-- 5. LOOKALIKE CLUSTERS (Per Marketing)
-- ============================================

CREATE TABLE player_clusters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cluster_name VARCHAR(100) NOT NULL, -- "Aggressive Meta Followers", "Casual Campers"
    cluster_description TEXT,
    
    -- Caratteristiche del cluster
    persona_types TEXT[], -- ['meta_warrior', 'aggressive_grinder']
    skill_tiers TEXT[],
    playstyle_tags TEXT[],
    
    -- Statistiche aggregate
    avg_kd DECIMAL(4,2),
    avg_spm DECIMAL(6,1),
    avg_engagement INT,
    avg_ltv DECIMAL(10,2),
    player_count INT DEFAULT 0,
    
    -- Embedding del centroide
    centroid_embedding VECTOR(1536),
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Funzione: Cerca armi simili (RAG)
CREATE OR REPLACE FUNCTION search_similar_weapons(
    query_embedding VECTOR(1536),
    match_threshold FLOAT,
    match_count INT
)
RETURNS TABLE (
    id UUID,
    weapon_id VARCHAR,
    name VARCHAR,
    category VARCHAR,
    meta_tier VARCHAR,
    similarity FLOAT
) LANGUAGE plpgsql AS $$
BEGIN
    RETURN QUERY
    SELECT 
        w.id,
        w.weapon_id,
        w.name,
        w.category,
        w.meta_tier,
        1 - (w.embedding <=> query_embedding) AS similarity
    FROM weapon_knowledge w
    WHERE 1 - (w.embedding <=> query_embedding) > match_threshold
    ORDER BY w.embedding <=> query_embedding
    LIMIT match_count;
END;
$$;

-- Funzione: Cerca attachments simili
CREATE OR REPLACE FUNCTION search_similar_attachments(
    query_embedding VECTOR(1536),
    p_weapon_name VARCHAR,
    match_count INT DEFAULT 5
)
RETURNS TABLE (
    id UUID,
    name VARCHAR,
    category VARCHAR,
    meta_score INT,
    similarity FLOAT
) LANGUAGE plpgsql AS $$
BEGIN
    RETURN QUERY
    SELECT 
        a.id,
        a.name,
        a.category,
        a.meta_score,
        1 - (a.embedding <=> query_embedding) AS similarity
    FROM attachment_knowledge a
    WHERE a.compatible_weapons @> ARRAY[p_weapon_name]
      AND 1 - (a.embedding <=> query_embedding) > 0.6
    ORDER BY a.embedding <=> query_embedding
    LIMIT match_count;
END;
$$;

-- Funzione: Trova player simili (Lookalike)
CREATE OR REPLACE FUNCTION find_similar_players(
    p_player_id UUID,
    match_count INT DEFAULT 10
)
RETURNS TABLE (
    similar_player_id UUID,
    persona_type VARCHAR,
    skill_tier VARCHAR,
    engagement_score INT,
    similarity FLOAT
) LANGUAGE plpgsql AS $$
DECLARE
    target_embedding VECTOR(1536);
BEGIN
    -- Ottieni embedding del player target
    SELECT profile_embedding INTO target_embedding
    FROM player_profiles 
    WHERE id = p_player_id;
    
    IF target_embedding IS NULL THEN
        RETURN;
    END IF;
    
    RETURN QUERY
    SELECT 
        p.id,
        p.persona_type,
        p.skill_tier,
        p.engagement_score,
        1 - (p.profile_embedding <=> target_embedding) AS similarity
    FROM player_profiles p
    WHERE p.id != p_player_id
      AND 1 - (p.profile_embedding <=> target_embedding) > 0.7
    ORDER BY p.profile_embedding <=> target_embedding
    LIMIT match_count;
END;
$$;

-- Funzione: Aggiorna timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers per updated_at
CREATE TRIGGER update_weapon_knowledge_updated_at 
    BEFORE UPDATE ON weapon_knowledge 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_player_profiles_updated_at 
    BEFORE UPDATE ON player_profiles 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_player_clusters_updated_at 
    BEFORE UPDATE ON player_clusters 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

ALTER TABLE player_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE analysis_history ENABLE ROW LEVEL SECURITY;

-- Politiche per player_profiles
CREATE POLICY "Users can view own profile"
    ON player_profiles FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile"
    ON player_profiles FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
    ON player_profiles FOR UPDATE
    USING (auth.uid() = user_id);

-- Admin può vedere tutto (per analytics)
CREATE POLICY "Admin can view all profiles"
    ON player_profiles FOR SELECT
    USING (auth.jwt() ->> 'role' = 'admin');

-- Politiche per analysis_history
CREATE POLICY "Users can view own analysis"
    ON analysis_history FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM player_profiles 
            WHERE id = analysis_history.player_id 
            AND user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert own analysis"
    ON analysis_history FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM player_profiles 
            WHERE id = analysis_history.player_id 
            AND user_id = auth.uid()
        )
    );

-- Knowledge base è public read
ALTER TABLE weapon_knowledge ENABLE ROW LEVEL SECURITY;
ALTER TABLE attachment_knowledge ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read weapon knowledge"
    ON weapon_knowledge FOR SELECT TO anon, authenticated
    USING (true);

CREATE POLICY "Public read attachment knowledge"
    ON attachment_knowledge FOR SELECT TO anon, authenticated
    USING (true);
