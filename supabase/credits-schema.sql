-- ============================================
-- CREDITS & BILLING SCHEMA - Enterprise
-- Gestione Hero Points, Transazioni, Fatturazione
-- ============================================

-- 1. USER CREDITS BALANCE
-- Tabella saldo crediti utente
CREATE TABLE user_credits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    
    -- Saldo attuale
    balance INTEGER NOT NULL DEFAULT 0 CHECK (balance >= 0),
    
    -- Statistiche
    total_purchased INTEGER NOT NULL DEFAULT 0,
    total_spent INTEGER NOT NULL DEFAULT 0,
    total_bonus INTEGER NOT NULL DEFAULT 0,
    
    -- Livello account (sblocca feature)
    account_tier VARCHAR(20) DEFAULT 'free' CHECK (account_tier IN ('free', 'starter', 'pro', 'elite', 'legend')),
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(user_id)
);

-- Indice per lookup rapido
CREATE INDEX idx_user_credits_user_id ON user_credits(user_id);
CREATE INDEX idx_user_credits_tier ON user_credits(account_tier);

-- 2. CREDIT TRANSACTIONS
-- Storico completo movimenti
CREATE TABLE credit_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    
    -- Tipo transazione
    type VARCHAR(20) NOT NULL CHECK (type IN ('purchase', 'usage', 'bonus', 'refund', 'subscription')),
    
    -- Importo (positivo per acquisti/bonus, negativo per utilizzi)
    amount INTEGER NOT NULL,
    
    -- Saldo dopo transazione
    balance_after INTEGER NOT NULL,
    
    -- Descrizione/dettaglio
    description TEXT,
    
    -- Per acquisti: dettagli pagamento
    payment_method VARCHAR(50), -- 'stripe', 'paypal', 'crypto'
    payment_id TEXT, -- ID transazione esterna
    cost_eur DECIMAL(10,2), -- Costo in euro (se acquisto)
    
    -- Per utilizzi: riferimento analisi
    analysis_id UUID REFERENCES analysis_history(id),
    
    -- Metadata
    metadata JSONB DEFAULT '{}',
    
    -- Stato
    status VARCHAR(20) DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Indici
    CONSTRAINT valid_amount CHECK (
        (type IN ('purchase', 'bonus', 'refund') AND amount > 0) OR
        (type IN ('usage') AND amount < 0)
    )
);

-- Indici per query comuni
CREATE INDEX idx_credit_transactions_user_id ON credit_transactions(user_id);
CREATE INDEX idx_credit_transactions_type ON credit_transactions(type);
CREATE INDEX idx_credit_transactions_created_at ON credit_transactions(created_at DESC);
CREATE INDEX idx_credit_transactions_status ON credit_transactions(status);

-- 3. CREDIT PACKAGES
-- Definizione pacchetti acquistabili
CREATE TABLE credit_packages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Identificativi
    slug VARCHAR(50) UNIQUE NOT NULL, -- 'starter', 'pro', 'elite'
    name VARCHAR(100) NOT NULL,
    
    -- Contenuto
    credits_amount INTEGER NOT NULL CHECK (credits_amount > 0),
    price_eur DECIMAL(10,2) NOT NULL CHECK (price_eur >= 0),
    
    -- Visualizzazione
    description TEXT,
    is_popular BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    
    -- Limiti (opzionale)
    max_purchases_per_user INTEGER, -- NULL = illimitato
    valid_days INTEGER, -- NULL = non scade
    
    -- Ordinamento
    sort_order INTEGER DEFAULT 0,
    
    -- Feature sbloccate con questo pacchetto
    features_unlocked JSONB DEFAULT '[]', -- ['custom_avatar', 'priority_support']
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inserimento pacchetti default
INSERT INTO credit_packages (slug, name, credits_amount, price_eur, description, is_popular, sort_order) VALUES
('starter', 'STARTER', 500, 4.99, 'Perfetto per iniziare', false, 1),
('pro', 'PRO', 1500, 12.99, 'Il più popolare', true, 2),
('elite', 'ELITE', 5000, 39.99, 'Per giocatori seri', false, 3),
('legend', 'LEGEND', 15000, 99.99, 'Il massimo valore', false, 4);

-- 4. USER AVATARS
-- Avatar sbloccabili/disponibili
CREATE TABLE user_avatars (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    slug VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    
    -- Icona (nome Lucide icon)
    icon_name VARCHAR(50) NOT NULL DEFAULT 'User',
    
    -- Stili
    color_class VARCHAR(50) DEFAULT 'text-gray-400',
    bg_class VARCHAR(50) DEFAULT 'bg-gray-800',
    
    -- Requisito sblocco
    unlock_type VARCHAR(20) DEFAULT 'free' CHECK (unlock_type IN ('free', 'credits', 'tier', 'achievement')),
    unlock_credits_required INTEGER, -- Se unlock_type = 'credits'
    unlock_tier_required VARCHAR(20), -- Se unlock_type = 'tier'
    unlock_achievement_id UUID, -- Se unlock_type = 'achievement'
    
    -- Per upload custom
    is_custom BOOLEAN DEFAULT FALSE,
    image_url TEXT,
    
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inserimento avatar default
INSERT INTO user_avatars (slug, name, icon_name, color_class, bg_class, unlock_type, sort_order) VALUES
('default', 'Operative', 'User', 'text-gray-400', 'bg-gray-800', 'free', 1),
('soldier', 'Soldier', 'Shield', 'text-green-400', 'bg-green-900/30', 'free', 2),
('elite', 'Elite', 'Star', 'text-yellow-400', 'bg-yellow-900/30', 'credits', 3),
('commander', 'Commander', 'Crown', 'text-purple-400', 'bg-purple-900/30', 'credits', 4),
('legend', 'Legend', 'Award', 'text-cyan-400', 'bg-cyan-900/30', 'credits', 5),
('titan', 'Titan', 'Zap', 'text-red-400', 'bg-red-900/30', 'credits', 6);

-- 5. USER AVATAR SELECTION
-- Associazione utente-avatar (molti-a-molti)
CREATE TABLE user_avatar_selections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    avatar_id UUID REFERENCES user_avatars(id) ON DELETE CASCADE,
    
    is_selected BOOLEAN DEFAULT FALSE,
    unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(user_id, avatar_id)
);

CREATE INDEX idx_user_avatar_selections_user_id ON user_avatar_selections(user_id);

-- 6. INVOICES / FATTURE
-- Per compliance fiscale enterprise
CREATE TABLE invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    
    -- Dati fattura
    invoice_number VARCHAR(50) UNIQUE NOT NULL,
    invoice_date DATE NOT NULL DEFAULT CURRENT_DATE,
    
    -- Importi
    amount_eur DECIMAL(10,2) NOT NULL,
    tax_rate DECIMAL(5,2) DEFAULT 22.00, -- IVA Italia
    tax_amount DECIMAL(10,2) NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    
    -- Dettagli
    description TEXT NOT NULL,
    credits_purchased INTEGER,
    
    -- Dati cliente per fattura
    customer_name VARCHAR(200),
    customer_vat VARCHAR(50),
    customer_address TEXT,
    
    -- Stato
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'cancelled')),
    
    -- File
    pdf_url TEXT,
    
    -- Riferimenti pagamento
    payment_provider VARCHAR(50),
    payment_id TEXT,
    paid_at TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_invoices_user_id ON invoices(user_id);
CREATE INDEX idx_invoices_invoice_number ON invoices(invoice_number);
CREATE INDEX idx_invoices_status ON invoices(status);

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Funzione: Aggiorna saldo crediti dopo transazione
CREATE OR REPLACE FUNCTION update_user_credits_balance()
RETURNS TRIGGER AS $$
BEGIN
    -- Aggiorna o crea record user_credits
    INSERT INTO user_credits (user_id, balance, total_purchased, total_spent, total_bonus)
    VALUES (
        NEW.user_id,
        GREATEST(0, NEW.balance_after),
        CASE WHEN NEW.type = 'purchase' THEN NEW.amount ELSE 0 END,
        CASE WHEN NEW.type = 'usage' THEN ABS(NEW.amount) ELSE 0 END,
        CASE WHEN NEW.type = 'bonus' THEN NEW.amount ELSE 0 END
    )
    ON CONFLICT (user_id) 
    DO UPDATE SET
        balance = EXCLUDED.balance,
        total_purchased = user_credits.total_purchased + EXCLUDED.total_purchased,
        total_spent = user_credits.total_spent + EXCLUDED.total_spent,
        total_bonus = user_credits.total_bonus + EXCLUDED.total_bonus,
        updated_at = NOW();
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger: Aggiorna saldo dopo insert transazione
CREATE TRIGGER trg_update_credits_balance
    AFTER INSERT ON credit_transactions
    FOR EACH ROW
    EXECUTE FUNCTION update_user_credits_balance();

-- Funzione: Calcola tier in base a crediti totali acquistati
CREATE OR REPLACE FUNCTION update_user_tier()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE user_credits
    SET account_tier = CASE
        WHEN NEW.total_purchased >= 10000 THEN 'legend'
        WHEN NEW.total_purchased >= 5000 THEN 'elite'
        WHEN NEW.total_purchased >= 1500 THEN 'pro'
        WHEN NEW.total_purchased >= 500 THEN 'starter'
        ELSE 'free'
    END
    WHERE user_id = NEW.user_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_user_tier
    AFTER UPDATE OF total_purchased ON user_credits
    FOR EACH ROW
    EXECUTE FUNCTION update_user_tier();

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

ALTER TABLE user_credits ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_avatar_selections ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

-- Policies: Utente vede solo i propri dati
CREATE POLICY "Users can view own credits"
    ON user_credits FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can view own transactions"
    ON credit_transactions FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can view own avatars"
    ON user_avatar_selections FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can view own invoices"
    ON invoices FOR SELECT
    USING (auth.uid() = user_id);

-- Admin può vedere tutto
CREATE POLICY "Admin can view all credits"
    ON user_credits FOR SELECT
    USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admin can view all transactions"
    ON credit_transactions FOR SELECT
    USING (auth.jwt() ->> 'role' = 'admin');

-- ============================================
-- API FUNCTIONS
-- ============================================

-- Funzione: Acquisto crediti (da chiamare dopo pagamento Stripe)
CREATE OR REPLACE FUNCTION purchase_credits(
    p_user_id UUID,
    p_package_slug VARCHAR,
    p_payment_id TEXT,
    p_payment_method VARCHAR DEFAULT 'stripe'
)
RETURNS UUID AS $$
DECLARE
    v_package credit_packages%ROWTYPE;
    v_transaction_id UUID;
BEGIN
    -- Recupera pacchetto
    SELECT * INTO v_package FROM credit_packages WHERE slug = p_package_slug AND is_active = TRUE;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Package not found';
    END IF;
    
    -- Crea transazione
    INSERT INTO credit_transactions (
        user_id, type, amount, balance_after, description,
        payment_method, payment_id, cost_eur, status
    )
    SELECT 
        p_user_id, 'purchase', v_package.credits_amount,
        COALESCE((SELECT balance FROM user_credits WHERE user_id = p_user_id), 0) + v_package.credits_amount,
        'Purchase: ' || v_package.name,
        p_payment_method, p_payment_id, v_package.price_eur, 'completed'
    RETURNING id INTO v_transaction_id;
    
    RETURN v_transaction_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Funzione: Utilizzo crediti per analisi
CREATE OR REPLACE FUNCTION spend_credits_for_analysis(
    p_user_id UUID,
    p_analysis_id UUID,
    p_cost INTEGER DEFAULT 50
)
RETURNS BOOLEAN AS $$
DECLARE
    v_current_balance INTEGER;
BEGIN
    -- Verifica saldo
    SELECT balance INTO v_current_balance FROM user_credits WHERE user_id = p_user_id;
    
    IF v_current_balance IS NULL OR v_current_balance < p_cost THEN
        RETURN FALSE; -- Crediti insufficienti
    END IF;
    
    -- Crea transazione di utilizzo
    INSERT INTO credit_transactions (
        user_id, type, amount, balance_after, description, analysis_id
    )
    SELECT 
        p_user_id, 'usage', -p_cost,
        balance - p_cost,
        'Analysis #' || p_analysis_id,
        p_analysis_id
    FROM user_credits
    WHERE user_id = p_user_id;
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Vista: Resoconto mensile per reporting
CREATE VIEW monthly_credit_summary AS
SELECT 
    DATE_TRUNC('month', created_at) as month,
    COUNT(*) as total_transactions,
    SUM(CASE WHEN type = 'purchase' THEN 1 ELSE 0 END) as purchases_count,
    SUM(CASE WHEN type = 'purchase' THEN cost_eur ELSE 0 END) as revenue_eur,
    SUM(CASE WHEN type = 'usage' THEN ABS(amount) ELSE 0 END) as credits_used,
    SUM(CASE WHEN type = 'purchase' THEN amount ELSE 0 END) as credits_sold
FROM credit_transactions
WHERE status = 'completed'
GROUP BY DATE_TRUNC('month', created_at)
ORDER BY month DESC;
