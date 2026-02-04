-- Bul Marketplace Database Schema
-- Initial migration for Haredi Professionals Directory

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE gender AS ENUM ('male', 'female');
CREATE TYPE role AS ENUM ('professional', 'store');
CREATE TYPE service_type AS ENUM ('appointment', 'project', 'emergency', 'retail');
CREATE TYPE appointment_status AS ENUM ('pending', 'confirmed', 'cancelled');
CREATE TYPE lead_status AS ENUM ('new', 'contacted', 'closed');

-- Categories table (for organizing professionals)
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    name_he TEXT NOT NULL,
    icon TEXT NOT NULL DEFAULT 'briefcase',
    parent_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Profiles table (main professionals/stores table)
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Basic info
    email TEXT NOT NULL,
    business_name TEXT NOT NULL,
    gender gender NOT NULL,
    role role NOT NULL DEFAULT 'professional',
    service_type service_type NOT NULL,
    
    -- Location
    city TEXT NOT NULL,
    address TEXT,
    
    -- Contact
    phone TEXT NOT NULL,
    whatsapp TEXT,
    
    -- Business details
    description TEXT,
    rating DECIMAL(2,1) DEFAULT 5.0 CHECK (rating >= 1 AND rating <= 5),
    review_count INTEGER DEFAULT 0,
    
    -- Media (conditional based on gender)
    -- For males: profile picture, for females: business logo only
    media_urls TEXT[] DEFAULT '{}',
    avatar_url TEXT,
    
    -- Status
    is_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    
    -- Opening hours (JSONB for flexibility)
    opening_hours JSONB,
    
    -- Categories (array of category IDs)
    categories TEXT[] DEFAULT '{}'
);

-- Reviews table (star ratings only, no text comments)
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    reviewer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    
    -- Prevent duplicate reviews
    UNIQUE(profile_id, reviewer_id)
);

-- Appointments table (for 'appointment' service type)
CREATE TABLE appointments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    requested_date DATE NOT NULL,
    requested_time TIME,
    status appointment_status DEFAULT 'pending',
    notes TEXT
);

-- Leads table (for 'project' service type)
CREATE TABLE leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    customer_email TEXT,
    message TEXT,
    status lead_status DEFAULT 'new'
);

-- Indexes for performance
CREATE INDEX idx_profiles_city ON profiles(city);
CREATE INDEX idx_profiles_service_type ON profiles(service_type);
CREATE INDEX idx_profiles_categories ON profiles USING GIN(categories);
CREATE INDEX idx_profiles_is_active ON profiles(is_active);
CREATE INDEX idx_profiles_rating ON profiles(rating DESC);
CREATE INDEX idx_reviews_profile_id ON reviews(profile_id);
CREATE INDEX idx_appointments_profile_id ON appointments(profile_id);
CREATE INDEX idx_leads_profile_id ON leads(profile_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to auto-update updated_at
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Function to update profile rating after new review
CREATE OR REPLACE FUNCTION update_profile_rating()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE profiles
    SET 
        rating = (SELECT AVG(rating)::DECIMAL(2,1) FROM reviews WHERE profile_id = NEW.profile_id),
        review_count = (SELECT COUNT(*) FROM reviews WHERE profile_id = NEW.profile_id)
    WHERE id = NEW.profile_id;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to update rating on new review
CREATE TRIGGER update_rating_on_review
    AFTER INSERT OR UPDATE OR DELETE ON reviews
    FOR EACH ROW
    EXECUTE FUNCTION update_profile_rating();

-- Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Policies for profiles
CREATE POLICY "Profiles are viewable by everyone" ON profiles
    FOR SELECT USING (is_active = true);

CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Policies for reviews
CREATE POLICY "Reviews are viewable by everyone" ON reviews
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create reviews" ON reviews
    FOR INSERT WITH CHECK (auth.uid() = reviewer_id);

CREATE POLICY "Users can update own reviews" ON reviews
    FOR UPDATE USING (auth.uid() = reviewer_id);

CREATE POLICY "Users can delete own reviews" ON reviews
    FOR DELETE USING (auth.uid() = reviewer_id);

-- Policies for appointments
CREATE POLICY "Profile owners can view their appointments" ON appointments
    FOR SELECT USING (
        profile_id IN (SELECT id FROM profiles WHERE id = auth.uid())
    );

CREATE POLICY "Anyone can create appointments" ON appointments
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Profile owners can update their appointments" ON appointments
    FOR UPDATE USING (
        profile_id IN (SELECT id FROM profiles WHERE id = auth.uid())
    );

-- Policies for leads
CREATE POLICY "Profile owners can view their leads" ON leads
    FOR SELECT USING (
        profile_id IN (SELECT id FROM profiles WHERE id = auth.uid())
    );

CREATE POLICY "Anyone can create leads" ON leads
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Profile owners can update their leads" ON leads
    FOR UPDATE USING (
        profile_id IN (SELECT id FROM profiles WHERE id = auth.uid())
    );

-- Policies for categories
CREATE POLICY "Categories are viewable by everyone" ON categories
    FOR SELECT USING (true);

-- Insert default categories
INSERT INTO categories (name, name_he, icon, sort_order) VALUES
    ('health', 'בריאות', 'heart-pulse', 1),
    ('beauty', 'יופי וטיפוח', 'sparkles', 2),
    ('home', 'בית ושיפוצים', 'home', 3),
    ('food', 'מזון ומסעדות', 'utensils', 4),
    ('education', 'חינוך והוראה', 'graduation-cap', 5),
    ('legal', 'משפטי וייעוץ', 'scale', 6),
    ('events', 'אירועים ושמחות', 'party-popper', 7),
    ('tech', 'טכנולוגיה', 'laptop', 8),
    ('transport', 'הסעות ותחבורה', 'car', 9),
    ('other', 'אחר', 'grid-2x2', 10);
