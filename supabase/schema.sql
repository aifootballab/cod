-- ============================================
-- SUPABASE SCHEMA - COD COACHING ELITE
-- Enterprise Edition
-- ============================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";

-- ============================================
-- TABLES
-- ============================================

-- User Profiles
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  email TEXT,
  rank TEXT DEFAULT 'RECRUIT' CHECK (rank IN ('RECRUIT', 'REGULAR', 'HARDENED', 'VETERAN', 'ELITE', 'LEGEND')),
  rank_points INTEGER DEFAULT 0,
  total_analyses INTEGER DEFAULT 0,
  favorite_weapon TEXT,
  playstyle TEXT DEFAULT 'balanced' CHECK (playstyle IN ('aggressive', 'defensive', 'balanced', 'camper')),
  subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'pro', 'elite')),
  subscription_expires_at TIMESTAMP WITH TIME ZONE,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Analyses (OCR results)
CREATE TABLE IF NOT EXISTS analyses (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  screenshot_url TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  
  -- Extracted stats
  kd_ratio DECIMAL(4,2),
  accuracy DECIMAL(5,2),
  spm INTEGER,
  win_rate DECIMAL(5,2),
  total_kills INTEGER,
  total_deaths INTEGER,
  headshot_percent DECIMAL(5,2),
  play_time_hours INTEGER,
  best_weapon TEXT,
  level INTEGER,
  playstyle_detected TEXT,
  
  -- AI results
  recommended_builds JSONB,
  ai_analysis TEXT,
  tips JSONB,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Weapon Builds (with vector embeddings for RAG)
CREATE TABLE IF NOT EXISTS weapon_builds (
  id TEXT PRIMARY KEY,
  weapon_name TEXT NOT NULL,
  build_name TEXT NOT NULL,
  description TEXT,
  category TEXT CHECK (category IN ('assault_rifle', 'smg', 'lmg', 'sniper', 'shotgun', 'marksman')),
  game_version TEXT DEFAULT 'mw3',
  
  -- Stats (0-100 scale)
  stat_damage INTEGER CHECK (stat_damage BETWEEN 0 AND 100),
  stat_accuracy INTEGER CHECK (stat_accuracy BETWEEN 0 AND 100),
  stat_range INTEGER CHECK (stat_range BETWEEN 0 AND 100),
  stat_fire_rate INTEGER CHECK (stat_fire_rate BETWEEN 0 AND 100),
  stat_mobility INTEGER CHECK (stat_mobility BETWEEN 0 AND 100),
  stat_control INTEGER CHECK (stat_control BETWEEN 0 AND 100),
  
  -- Build data
  attachments JSONB,
  pros JSONB,
  cons JSONB,
  
  -- Metadata
  is_meta BOOLEAN DEFAULT false,
  is_official BOOLEAN DEFAULT true,
  difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard')),
  recommended_kd_min DECIMAL(4,2),
  recommended_kd_max DECIMAL(4,2),
  recommended_accuracy_min INTEGER,
  recommended_accuracy_max INTEGER,
  recommended_playstyles JSONB,
  
  -- Engagement
  likes_count INTEGER DEFAULT 0,
  usage_count INTEGER DEFAULT 0,
  
  -- Vector embedding for RAG (1536 dimensions for OpenAI)
  embedding VECTOR(1536),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- User Build Favorites
CREATE TABLE IF NOT EXISTS user_favorite_builds (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  build_id TEXT REFERENCES weapon_builds(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  UNIQUE(user_id, build_id)
);

-- Achievements
CREATE TABLE IF NOT EXISTS achievements (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  category TEXT CHECK (category IN ('stats', 'social', 'mastery', 'special')),
  points INTEGER DEFAULT 0,
  requirement_type TEXT,
  requirement_value INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- User Achievements
CREATE TABLE IF NOT EXISTS user_achievements (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  achievement_id TEXT REFERENCES achievements(id) ON DELETE CASCADE,
  unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  UNIQUE(user_id, achievement_id)
);

-- Challenges
CREATE TABLE IF NOT EXISTS challenges (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  type TEXT CHECK (type IN ('daily', 'weekly', 'monthly', 'special')),
  requirement_type TEXT,
  requirement_target INTEGER,
  reward_points INTEGER DEFAULT 0,
  starts_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- User Challenge Progress
CREATE TABLE IF NOT EXISTS user_challenge_progress (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  challenge_id UUID REFERENCES challenges(id) ON DELETE CASCADE,
  progress INTEGER DEFAULT 0,
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(user_id, challenge_id)
);

-- Leaderboard
CREATE TABLE IF NOT EXISTS leaderboard (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  username TEXT,
  rank_tier TEXT,
  kd_ratio DECIMAL(4,2),
  accuracy DECIMAL(5,2),
  spm INTEGER,
  win_rate DECIMAL(5,2),
  total_score INTEGER,
  period TEXT CHECK (period IN ('all_time', 'monthly', 'weekly')),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  UNIQUE(user_id, period)
);

-- API Keys (for external integrations)
CREATE TABLE IF NOT EXISTS user_api_keys (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  key_name TEXT,
  key_hash TEXT,
  permissions JSONB,
  last_used_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX IF NOT EXISTS idx_analyses_user_id ON analyses(user_id);
CREATE INDEX IF NOT EXISTS idx_analyses_created_at ON analyses(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_weapon_builds_category ON weapon_builds(category);
CREATE INDEX IF NOT EXISTS idx_weapon_builds_is_meta ON weapon_builds(is_meta);
CREATE INDEX IF NOT EXISTS idx_weapon_builds_embedding ON weapon_builds USING ivfflat (embedding vector_cosine_ops);
CREATE INDEX IF NOT EXISTS idx_leaderboard_period_score ON leaderboard(period, total_score DESC);
CREATE INDEX IF NOT EXISTS idx_user_achievements_user_id ON user_achievements(user_id);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE weapon_builds ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_favorite_builds ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_challenge_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE leaderboard ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_api_keys ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE USING (auth.uid() = id);

-- Analyses policies
CREATE POLICY "Users can view own analyses"
  ON analyses FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own analyses"
  ON analyses FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own analyses"
  ON analyses FOR DELETE USING (auth.uid() = user_id);

-- Weapon builds policies (public read)
CREATE POLICY "Weapon builds are viewable by everyone"
  ON weapon_builds FOR SELECT USING (true);

-- User favorites policies
CREATE POLICY "Users can view own favorites"
  ON user_favorite_builds FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own favorites"
  ON user_favorite_builds FOR ALL USING (auth.uid() = user_id);

-- Achievements policies
CREATE POLICY "Achievements are viewable by everyone"
  ON achievements FOR SELECT USING (true);

CREATE POLICY "Users can view own achievements"
  ON user_achievements FOR SELECT USING (auth.uid() = user_id);

-- Leaderboard policies (public read)
CREATE POLICY "Leaderboard is viewable by everyone"
  ON leaderboard FOR SELECT USING (true);

-- API keys policies
CREATE POLICY "Users can manage own API keys"
  ON user_api_keys FOR ALL USING (auth.uid() = user_id);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_weapon_builds_updated_at BEFORE UPDATE ON weapon_builds
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Search builds by similarity (RAG)
CREATE OR REPLACE FUNCTION search_builds_by_embedding(
  query_embedding VECTOR(1536),
  match_threshold FLOAT,
  match_count INT
)
RETURNS TABLE (
  id TEXT,
  weapon_name TEXT,
  build_name TEXT,
  description TEXT,
  similarity FLOAT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    wb.id,
    wb.weapon_name,
    wb.build_name,
    wb.description,
    1 - (wb.embedding <=> query_embedding) AS similarity
  FROM weapon_builds wb
  WHERE 1 - (wb.embedding <=> query_embedding) > match_threshold
  ORDER BY wb.embedding <=> query_embedding
  LIMIT match_count;
END;
$$ LANGUAGE plpgsql;

-- Get user rank
CREATE OR REPLACE FUNCTION calculate_user_rank(user_kd DECIMAL, user_accuracy DECIMAL)
RETURNS TEXT AS $$
DECLARE
  score INTEGER;
BEGIN
  score := (user_kd * 100 + user_accuracy * 10)::INTEGER;
  
  IF score >= 400 THEN RETURN 'LEGEND';
  ELSIF score >= 320 THEN RETURN 'ELITE';
  ELSIF score >= 250 THEN RETURN 'VETERAN';
  ELSIF score >= 190 THEN RETURN 'HARDENED';
  ELSIF score >= 140 THEN RETURN 'REGULAR';
  ELSE RETURN 'RECRUIT';
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Increment build usage
CREATE OR REPLACE FUNCTION increment_build_usage(build_id TEXT)
RETURNS VOID AS $$
BEGIN
  UPDATE weapon_builds
  SET usage_count = usage_count + 1
  WHERE id = build_id;
END;
$$ LANGUAGE plpgsql;

-- Get leaderboard for period
CREATE OR REPLACE FUNCTION get_leaderboard(period_type TEXT, limit_count INT)
RETURNS TABLE (
  rank BIGINT,
  user_id UUID,
  username TEXT,
  rank_tier TEXT,
  kd_ratio DECIMAL,
  accuracy DECIMAL,
  spm INTEGER,
  total_score INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    ROW_NUMBER() OVER (ORDER BY l.total_score DESC)::BIGINT AS rank,
    l.user_id,
    l.username,
    l.rank_tier,
    l.kd_ratio,
    l.accuracy,
    l.spm,
    l.total_score
  FROM leaderboard l
  WHERE l.period = period_type
  ORDER BY l.total_score DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- SEED DATA - Weapon Builds
-- ============================================

INSERT INTO weapon_builds (id, weapon_name, build_name, description, category, stat_damage, stat_accuracy, stat_range, stat_fire_rate, stat_mobility, stat_control, attachments, pros, cons, is_meta, difficulty, recommended_kd_min, recommended_kd_max, recommended_accuracy_min, recommended_accuracy_max, recommended_playstyles)
VALUES
('mcw-meta', 'MCW', 'TACTICAL ELITE', 'La configurazione META per MCW. Equilibrio perfetto tra precisione e potenza di fuoco.', 'assault_rifle', 82, 86, 90, 72, 76, 89, 
 '[{"slot": "CANNA", "name": "Second Line Mammoth Heavy"}, {"slot": "BOCCA", "name": "Shadowstrike Suppressor"}, {"slot": "OTTICA", "name": "MK. 3 Reflector"}, {"slot": "SOTTOCANNA", "name": "DR-6 Handstop"}, {"slot": "IMPUGNATURA", "name": "RB Claw-Psl Grip"}]'::jsonb,
 '["Versatile a ogni distanza", "Rinculo controllabile", "Silenziata", "TTK competitivo"]'::jsonb,
 '["ADS leggermente lento", "Richiede unlock alto"]'::jsonb,
 true, 'medium', 1.0, 3.0, 18, 35, '["balanced", "defensive"]'::jsonb),

('striker-meta', 'STRIKER', 'SMG SUPREME', 'La SMG più letale del gioco. TTK devastante, controllabile, versatile.', 'smg', 74, 84, 72, 82, 85, 88,
 '[{"slot": "CANNA", "name": "Striker Recon Long Barrel"}, {"slot": "BOCCA", "name": "Zehmn35 Compensated"}, {"slot": "CALCIO", "name": "Assault Stock"}, {"slot": "SOTTOCANNA", "name": "DR-6 Handstop"}, {"slot": "IMPUGNATURA", "name": "Sakin ZX Grip"}]'::jsonb,
 '["TTK eccezionale", "Versatile", "Controllabile", "META in Warzone"]'::jsonb,
 '["Richiede unlock alto"]'::jsonb,
 true, 'medium', 1.0, 3.0, 18, 35, '["aggressive", "balanced"]'::jsonb),

('striker-noob', 'STRIKER', 'STABILITY MASTER', 'Configurazione per chi inizia. Controllo rinculo massimo.', 'smg', 70, 88, 60, 82, 78, 95,
 '[{"slot": "CANNA", "name": "Striker Factory"}, {"slot": "BOCCA", "name": "Purifier Muzzle Brake"}, {"slot": "CALCIO", "name": "Heavy Support Stock"}, {"slot": "SOTTOCANNA", "name": "SL Skeletal Vertical"}, {"slot": "IMPUGNATURA", "name": "Rubberized Grip"}]'::jsonb,
 '["Rinculo minimo", "Facile da usare", "Perdonante", "Ideale per beginners"]'::jsonb,
 '["Danno ridotto", "ADS lento"]'::jsonb,
 false, 'easy', 0.5, 1.2, 12, 22, '["balanced", "defensive"]'::jsonb),

('superi-meta', 'SUPERI 46', 'ALL-ROUNDER PRO', 'SMG che eccelle a tutte le distanze. La scelta dei professionisti.', 'smg', 77, 85, 78, 80, 84, 84,
 '[{"slot": "CANNA", "name": "Superi Long Barrel"}, {"slot": "BOCCA", "name": "Shadowstrike Suppressor"}, {"slot": "OTTICA", "name": "Slate Reflector"}, {"slot": "SOTTOCANNA", "name": "XRK Edge BW-4"}, {"slot": "IMPUGNATURA", "name": "FTAC MSP-98"}]'::jsonb,
 '["Range eccezionale per SMG", "Versatile", "Silenziata", "TTK ottimo"]'::jsonb,
 '["ADS medio", "Sblocca tardi"]'::jsonb,
 true, 'medium', 1.0, 2.5, 18, 32, '["balanced", "aggressive"]'::jsonb),

('kv-sniper', 'KV INHIBITOR', 'ONE-SHOT KILL', 'Sniper bolt-action devastante. One-shot kill alla testa e torso.', 'sniper', 100, 94, 110, 30, 35, 78,
 '[{"slot": "CANNA", "name": "Kastovia Long Barrel"}, {"slot": "BOCCA", "name": "Sonic Suppressor XL"}, {"slot": "LASER", "name": "SL Razorhawk"}, {"slot": "OTTURATORE", "name": "Quick Bolt"}, {"slot": "IMPUGNATURA", "name": "Stip-40 Grip"}]'::jsonb,
 '["One-shot kill", "Range infinito", "Silenziata", "Danno estremo"]'::jsonb,
 '["ADS lento", "Richiede precisione", "Punisce errori"]'::jsonb,
 true, 'hard', 0.8, 3.0, 20, 40, '["defensive", "camper"]'::jsonb),

('basb-meta', 'BAS-B', 'BATTLE RIFLE GOD', 'Battle rifle devastante. Danno elevato, range eccezionale, TTK basso.', 'marksman', 92, 88, 92, 58, 62, 88,
 '[{"slot": "CANNA", "name": "BAS-B Long Barrel"}, {"slot": "BOCCA", "name": "VT-7 Spiritfire"}, {"slot": "OTTICA", "name": "JAK Glassless"}, {"slot": "SOTTOCANNA", "name": "Bruen Heavy Support"}, {"slot": "IMPUGNATURA", "name": "Stip-40 Grip"}]'::jsonb,
 '["Danno estremo", "Range eccezionale", "TTK basso", "Versatile"]'::jsonb,
 '["Cadenza bassa", "Richiede buona mira"]'::jsonb,
 true, 'hard', 1.2, 3.5, 22, 38, '["balanced", "defensive"]'::jsonb);

-- Seed achievements
INSERT INTO achievements (id, name, description, icon, category, points, requirement_type, requirement_value) VALUES
('first_analysis', 'First Blood', 'Completa la tua prima analisi', '🎯', 'stats', 100, 'analyses_count', 1),
('kd_positive', 'Positive K/D', 'Raggiungi un K/D superiore a 1.0', '📈', 'stats', 200, 'kd_ratio', 100),
('kd_elite', 'Elite Shooter', 'Raggiungi un K/D superiore a 2.0', '🔥', 'stats', 500, 'kd_ratio', 200),
('accuracy_master', 'Sharpshooter', 'Raggiungi accuracy superiore al 30%', '🎯', 'stats', 300, 'accuracy', 30),
('spm_beast', 'Score Beast', 'Raggiungi SPM superiore a 400', '⚡', 'stats', 400, 'spm', 400),
('weapon_master', 'Arsenal', 'Prova 5 armi diverse', '🔫', 'mastery', 250, 'unique_weapons', 5),
('analysis_streak', 'Consistency', '3 analisi in 7 giorni', '📅', 'mastery', 300, 'analysis_streak', 3);

-- ============================================
-- TRIGGERS FOR REALTIME
-- ============================================

-- Notify on analysis completion
CREATE OR REPLACE FUNCTION notify_analysis_complete()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'completed' AND OLD.status = 'processing' THEN
    PERFORM pg_notify('analysis_complete', json_build_object('user_id', NEW.user_id, 'analysis_id', NEW.id)::text);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER analysis_complete_trigger
  AFTER UPDATE ON analyses
  FOR EACH ROW EXECUTE FUNCTION notify_analysis_complete();
