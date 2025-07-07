-- Create LinkedIn accounts table for multi-account support
CREATE TABLE public.linkedin_accounts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    linkedin_id TEXT UNIQUE NOT NULL,
    linkedin_access_token TEXT NOT NULL,
    linkedin_refresh_token TEXT,
    linkedin_expires_at TIMESTAMP WITH TIME ZONE,
    
    -- Account metadata
    display_name TEXT,
    profile_picture_url TEXT,
    headline TEXT,
    public_profile_url TEXT,
    
    -- Account settings
    is_primary BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_used_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraints
    UNIQUE(user_id, linkedin_id)
);

-- Create indexes
CREATE INDEX idx_linkedin_accounts_user_id ON public.linkedin_accounts(user_id);
CREATE INDEX idx_linkedin_accounts_linkedin_id ON public.linkedin_accounts(linkedin_id);
CREATE INDEX idx_linkedin_accounts_is_primary ON public.linkedin_accounts(user_id, is_primary);
CREATE INDEX idx_linkedin_accounts_is_active ON public.linkedin_accounts(user_id, is_active);

-- Add updated_at trigger
CREATE TRIGGER update_linkedin_accounts_updated_at BEFORE UPDATE ON public.linkedin_accounts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security
ALTER TABLE public.linkedin_accounts ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own LinkedIn accounts" ON public.linkedin_accounts
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own LinkedIn accounts" ON public.linkedin_accounts
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own LinkedIn accounts" ON public.linkedin_accounts
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own LinkedIn accounts" ON public.linkedin_accounts
    FOR DELETE USING (auth.uid() = user_id);

-- Function to ensure only one primary account per user
CREATE OR REPLACE FUNCTION public.ensure_single_primary_linkedin_account()
RETURNS TRIGGER AS $$
BEGIN
    -- If setting this account as primary, unset all other primary accounts for this user
    IF NEW.is_primary = TRUE THEN
        UPDATE public.linkedin_accounts 
        SET is_primary = FALSE 
        WHERE user_id = NEW.user_id AND id != NEW.id;
    END IF;
    
    -- If this is the first account for a user, make it primary
    IF NOT EXISTS (
        SELECT 1 FROM public.linkedin_accounts 
        WHERE user_id = NEW.user_id AND is_primary = TRUE AND id != NEW.id
    ) THEN
        NEW.is_primary = TRUE;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to ensure single primary account
CREATE TRIGGER ensure_single_primary_linkedin_account_trigger
    BEFORE INSERT OR UPDATE ON public.linkedin_accounts
    FOR EACH ROW EXECUTE FUNCTION public.ensure_single_primary_linkedin_account();

-- Add linkedin_account_id to posts table to track which account published each post
ALTER TABLE public.posts ADD COLUMN linkedin_account_id UUID REFERENCES public.linkedin_accounts(id) ON DELETE SET NULL;

-- Create index for the new foreign key
CREATE INDEX idx_posts_linkedin_account_id ON public.posts(linkedin_account_id);

-- Migrate existing LinkedIn data from profiles table (if any exists)
-- This will move single-account data to the new multi-account structure
DO $$
BEGIN
    -- Only migrate if profiles table exists and has LinkedIn data
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'profiles') THEN
        INSERT INTO public.linkedin_accounts (
            user_id, 
            linkedin_id, 
            linkedin_access_token, 
            linkedin_refresh_token, 
            linkedin_expires_at,
            is_primary,
            display_name,
            created_at,
            updated_at
        )
        SELECT 
            id as user_id,
            linkedin_id,
            linkedin_access_token,
            linkedin_refresh_token,
            linkedin_expires_at::timestamp with time zone,
            TRUE as is_primary, -- First account is primary
            full_name as display_name,
            COALESCE(created_at::timestamp with time zone, NOW()),
            COALESCE(updated_at::timestamp with time zone, NOW())
        FROM profiles 
        WHERE linkedin_id IS NOT NULL 
        AND linkedin_access_token IS NOT NULL
        ON CONFLICT (user_id, linkedin_id) DO NOTHING;
    END IF;
END $$;

-- Update existing posts to reference the migrated LinkedIn accounts
UPDATE public.posts 
SET linkedin_account_id = (
    SELECT la.id 
    FROM public.linkedin_accounts la 
    WHERE la.user_id = posts.user_id 
    AND la.is_primary = TRUE
    LIMIT 1
)
WHERE linkedin_post_id IS NOT NULL;