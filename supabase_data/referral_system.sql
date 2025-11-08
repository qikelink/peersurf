-- Referral System Setup
-- Simple referral points system
-- Run this in your Supabase SQL Editor

-- 1. Add points and referral_code columns to profiles
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS points INTEGER DEFAULT 0 NOT NULL;

ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS referral_code TEXT UNIQUE;

CREATE INDEX IF NOT EXISTS idx_profiles_referral_code ON profiles(referral_code);

-- 2. Create referrals table
CREATE TABLE IF NOT EXISTS referrals (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    referrer_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    referred_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    referral_code TEXT NOT NULL,
    points_awarded INTEGER DEFAULT 10 NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(referred_id)
);

CREATE INDEX IF NOT EXISTS idx_referrals_referrer_id ON referrals(referrer_id);
CREATE INDEX IF NOT EXISTS idx_referrals_referred_id ON referrals(referred_id);

-- 3. Generate 5-character alphanumeric referral code
CREATE OR REPLACE FUNCTION generate_referral_code()
RETURNS TEXT AS $$
DECLARE
    code TEXT;
    chars TEXT := '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    i INTEGER;
BEGIN
    LOOP
        code := '';
        FOR i IN 1..5 LOOP
            code := code || SUBSTRING(chars, FLOOR(RANDOM() * 36 + 1)::INTEGER, 1);
        END LOOP;
        
        -- Check if unique, exit if yes
        EXIT WHEN NOT EXISTS(SELECT 1 FROM profiles WHERE referral_code = code);
    END LOOP;
    
    RETURN code;
END;
$$ LANGUAGE plpgsql;

-- 4. Auto-generate referral code on profile creation
CREATE OR REPLACE FUNCTION auto_generate_referral_code()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.referral_code IS NULL THEN
        NEW.referral_code := generate_referral_code();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_auto_generate_referral_code ON profiles;
CREATE TRIGGER trigger_auto_generate_referral_code
    BEFORE INSERT OR UPDATE ON profiles
    FOR EACH ROW
    WHEN (NEW.referral_code IS NULL)
    EXECUTE FUNCTION auto_generate_referral_code();

-- 5. Process referral and award points
CREATE OR REPLACE FUNCTION process_referral(
    p_referral_code TEXT,
    p_referred_user_id UUID
)
RETURNS JSON AS $$
DECLARE
    v_referrer_id UUID;
    v_points INTEGER := 10;
    v_referral_id UUID;
BEGIN
    -- Find referrer
    SELECT id INTO v_referrer_id FROM profiles WHERE referral_code = UPPER(p_referral_code);
    
    IF v_referrer_id IS NULL THEN
        RETURN json_build_object('success', false, 'error', 'Invalid referral code');
    END IF;
    
    IF v_referrer_id = p_referred_user_id THEN
        RETURN json_build_object('success', false, 'error', 'Cannot use your own referral code');
    END IF;
    
    IF EXISTS(SELECT 1 FROM referrals WHERE referred_id = p_referred_user_id) THEN
        RETURN json_build_object('success', false, 'error', 'User was already referred');
    END IF;
    
    -- Create referral and award points
    INSERT INTO referrals (referrer_id, referred_id, referral_code, points_awarded)
    VALUES (v_referrer_id, p_referred_user_id, UPPER(p_referral_code), v_points)
    RETURNING id INTO v_referral_id;
    
    UPDATE profiles SET points = points + v_points WHERE id = v_referrer_id;
    
    RETURN json_build_object('success', true, 'referral_id', v_referral_id, 'points_awarded', v_points);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Set up permissions
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own referrals"
    ON referrals FOR SELECT
    USING (auth.uid() = referrer_id OR auth.uid() = referred_id);

CREATE POLICY "Users can create referrals"
    ON referrals FOR INSERT
    WITH CHECK (auth.uid() = referred_id);

CREATE POLICY "Anyone can read profiles"
    ON profiles FOR SELECT
    USING (true);

-- 7. Update existing profiles
UPDATE profiles SET referral_code = generate_referral_code() WHERE referral_code IS NULL;
UPDATE profiles SET points = 0 WHERE points IS NULL;

