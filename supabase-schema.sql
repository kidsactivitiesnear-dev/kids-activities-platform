-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE user_role AS ENUM ('user', 'admin');
CREATE TYPE request_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE request_type AS ENUM ('claim', 'new');
CREATE TYPE age_group AS ENUM ('infants', 'toddlers', 'preschool', 'elementary', 'middle_school', 'high_school', 'all_ages');
CREATE TYPE activity_category AS ENUM (
  'daycare', 'preschool', 'after_school_academic', 'after_school_sports', 
  'after_school_arts', 'after_school_stem', 'summer_camp_traditional', 
  'summer_camp_sports', 'summer_camp_arts', 'summer_camp_stem', 
  'summer_camp_specialty', 'sports_fitness', 'arts_creative'
);

-- Users/Profiles table
CREATE TABLE profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    role user_role DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Cities table
CREATE TABLE cities (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    state TEXT NOT NULL,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    population INTEGER,
    tier INTEGER CHECK (tier IN (1, 2, 3)) DEFAULT 3,
    target_activities INTEGER DEFAULT 100,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(name, state)
);

-- Activity themes/specializations
CREATE TABLE activity_themes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    category activity_category NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Activities table with enhanced categorization
CREATE TABLE activities (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    category activity_category NOT NULL,
    subcategory TEXT, -- More specific categorization
    themes TEXT[], -- Array of theme names (religious, bilingual, montessori, etc.)
    age_groups age_group[] NOT NULL, -- Array of age groups served
    min_age INTEGER, -- Minimum age in months
    max_age INTEGER, -- Maximum age in months
    address TEXT NOT NULL,
    city_id UUID REFERENCES cities(id) ON DELETE CASCADE,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    phone TEXT,
    email TEXT,
    website TEXT,
    rating DECIMAL(3, 2) CHECK (rating >= 0 AND rating <= 5),
    review_count INTEGER DEFAULT 0,
    price_range TEXT,
    hours JSONB,
    amenities TEXT[],
    languages TEXT[], -- Languages offered (English, Spanish, French, etc.)
    religious_affiliation TEXT, -- Catholic, Jewish, Islamic, etc.
    accreditation TEXT[], -- NAEYC, state licensing, etc.
    capacity INTEGER,
    teacher_student_ratio TEXT,
    foursquare_id TEXT UNIQUE,
    featured BOOLEAN DEFAULT FALSE,
    verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Favorites table
CREATE TABLE favorites (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    activity_id UUID REFERENCES activities(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, activity_id)
);

-- Business claim requests table
CREATE TABLE business_claim_requests (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    request_type request_type NOT NULL,
    business_name TEXT NOT NULL,
    category activity_category NOT NULL,
    subcategory TEXT,
    themes TEXT[],
    age_groups age_group[],
    min_age INTEGER,
    max_age INTEGER,
    description TEXT,
    address TEXT,
    city TEXT,
    state TEXT,
    zip_code TEXT,
    phone TEXT,
    email TEXT,
    website TEXT,
    hours TEXT,
    capacity TEXT,
    pricing TEXT,
    amenities TEXT[],
    languages TEXT[],
    religious_affiliation TEXT,
    accreditation TEXT[],
    teacher_student_ratio TEXT,
    owner_name TEXT NOT NULL,
    owner_email TEXT NOT NULL,
    owner_phone TEXT,
    relationship TEXT,
    additional_info TEXT,
    status request_status DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Import stats table (for tracking Foursquare imports)
CREATE TABLE import_stats (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    total_imported INTEGER DEFAULT 0,
    successful INTEGER DEFAULT 0,
    failed INTEGER DEFAULT 0,
    city_breakdown JSONB DEFAULT '{}',
    category_breakdown JSONB DEFAULT '{}',
    theme_breakdown JSONB DEFAULT '{}',
    age_group_breakdown JSONB DEFAULT '{}',
    last_import TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_activities_city_id ON activities(city_id);
CREATE INDEX idx_activities_category ON activities(category);
CREATE INDEX idx_activities_age_groups ON activities USING GIN(age_groups);
CREATE INDEX idx_activities_themes ON activities USING GIN(themes);
CREATE INDEX idx_activities_languages ON activities USING GIN(languages);
CREATE INDEX idx_activities_rating ON activities(rating DESC);
CREATE INDEX idx_activities_featured ON activities(featured);
CREATE INDEX idx_activities_foursquare_id ON activities(foursquare_id);
CREATE INDEX idx_activities_religious_affiliation ON activities(religious_affiliation);
CREATE INDEX idx_favorites_user_id ON favorites(user_id);
CREATE INDEX idx_favorites_activity_id ON favorites(activity_id);
CREATE INDEX idx_business_requests_status ON business_claim_requests(status);

-- Insert initial cities data with higher targets for top 5
INSERT INTO cities (name, state, latitude, longitude, population, tier, target_activities) VALUES
('New York', 'NY', 40.7128, -74.0060, 8336817, 1, 400),
('Los Angeles', 'CA', 34.0522, -118.2437, 3979576, 1, 400),
('Chicago', 'IL', 41.8781, -87.6298, 2693976, 1, 400),
('Houston', 'TX', 29.7604, -95.3698, 2320268, 1, 400),
('Phoenix', 'AZ', 33.4484, -112.0740, 1680992, 1, 400),
('Philadelphia', 'PA', 39.9526, -75.1652, 1584064, 2, 200),
('San Antonio', 'TX', 29.4241, -98.4936, 1547253, 2, 180),
('San Diego', 'CA', 32.7157, -117.1611, 1423851, 2, 180),
('Dallas', 'TX', 32.7767, -96.7970, 1343573, 2, 200),
('Austin', 'TX', 30.2672, -97.7431, 978908, 2, 180),
('Washington', 'DC', 38.9072, -77.0369, 705749, 2, 200),
('Jacksonville', 'FL', 30.3322, -81.6557, 949611, 3, 140),
('Fort Worth', 'TX', 32.7555, -97.3308, 918915, 3, 130),
('Columbus', 'OH', 39.9612, -82.9988, 905748, 3, 130),
('Charlotte', 'NC', 35.2271, -80.8431, 885708, 3, 120),
('San Francisco', 'CA', 37.7749, -122.4194, 881549, 2, 200),
('Indianapolis', 'IN', 39.7684, -86.1581, 876384, 3, 120),
('Seattle', 'WA', 47.6062, -122.3321, 753675, 2, 180),
('Denver', 'CO', 39.7392, -104.9903, 715522, 2, 160),
('Boston', 'MA', 42.3601, -71.0589, 695506, 2, 180),
('El Paso', 'TX', 31.7619, -106.4850, 695044, 3, 110),
('Detroit', 'MI', 42.3314, -83.0458, 670031, 3, 120),
('Nashville', 'TN', 36.1627, -86.7816, 689447, 3, 130),
('Portland', 'OR', 45.5152, -122.6784, 652503, 3, 140),
('Memphis', 'TN', 35.1495, -90.0490, 651073, 3, 110),
('Oklahoma City', 'OK', 35.4676, -97.5164, 695057, 3, 110);

-- Insert activity themes
INSERT INTO activity_themes (name, category, description) VALUES
-- Daycare themes
('Infant Care', 'daycare', 'Specialized care for babies 0-12 months'),
('Toddler Care', 'daycare', 'Care for toddlers 12-36 months'),
('Drop-in Care', 'daycare', 'Flexible hourly childcare'),
('Extended Hours', 'daycare', 'Early morning or late evening care'),

-- Preschool themes
('Montessori', 'preschool', 'Montessori educational approach'),
('Waldorf', 'preschool', 'Waldorf/Steiner educational philosophy'),
('Reggio Emilia', 'preschool', 'Reggio Emilia approach'),
('Play-Based Learning', 'preschool', 'Learning through play methodology'),
('Academic Prep', 'preschool', 'Kindergarten readiness focus'),
('Bilingual Education', 'preschool', 'Dual language instruction'),
('Religious Education', 'preschool', 'Faith-based early education'),
('Nature-Based', 'preschool', 'Outdoor and environmental focus'),

-- After-school academic themes
('Homework Help', 'after_school_academic', 'Supervised homework assistance'),
('Tutoring', 'after_school_academic', 'One-on-one or small group tutoring'),
('Test Prep', 'after_school_academic', 'Standardized test preparation'),
('Reading Programs', 'after_school_academic', 'Literacy and reading skills'),
('Math Programs', 'after_school_academic', 'Mathematics enrichment'),

-- After-school STEM themes
('Coding', 'after_school_stem', 'Computer programming and coding'),
('Robotics', 'after_school_stem', 'Robot building and programming'),
('Science Experiments', 'after_school_stem', 'Hands-on science activities'),
('Engineering', 'after_school_stem', 'Engineering design challenges'),
('Math Enrichment', 'after_school_stem', 'Advanced mathematics'),

-- After-school arts themes
('Theater', 'after_school_arts', 'Drama and theatrical performance'),
('Music Lessons', 'after_school_arts', 'Individual or group music instruction'),
('Art Classes', 'after_school_arts', 'Visual arts and crafts'),
('Dance', 'after_school_arts', 'Various dance styles and techniques'),
('Creative Writing', 'after_school_arts', 'Writing and storytelling'),

-- After-school sports themes
('Soccer', 'after_school_sports', 'Soccer training and leagues'),
('Basketball', 'after_school_sports', 'Basketball skills and games'),
('Baseball/Softball', 'after_school_sports', 'Baseball and softball programs'),
('Swimming', 'after_school_sports', 'Swimming lessons and teams'),
('Martial Arts', 'after_school_sports', 'Karate, taekwondo, and other martial arts'),
('Gymnastics', 'after_school_sports', 'Gymnastics training and classes'),
('Tennis', 'after_school_sports', 'Tennis lessons and clinics'),
('Track and Field', 'after_school_sports', 'Running and field events'),

-- Summer camp themes
('Traditional Camp', 'summer_camp_traditional', 'Classic summer camp activities'),
('Day Camp', 'summer_camp_traditional', 'Non-overnight summer programs'),
('Adventure Camp', 'summer_camp_specialty', 'Outdoor adventure activities'),
('Sports Camp', 'summer_camp_sports', 'Multi-sport or sport-specific camps'),
('Arts Camp', 'summer_camp_arts', 'Creative arts and crafts focus'),
('STEM Camp', 'summer_camp_stem', 'Science, technology, engineering, math'),
('Theater Camp', 'summer_camp_arts', 'Drama and performance arts'),
('Music Camp', 'summer_camp_arts', 'Musical instruction and performance'),
('Nature Camp', 'summer_camp_specialty', 'Environmental and nature education'),
('Academic Enrichment', 'summer_camp_specialty', 'Educational summer programs');

-- Row Level Security (RLS) policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_claim_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE import_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_themes ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can view all profiles" ON profiles FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Activities policies
CREATE POLICY "Anyone can view activities" ON activities FOR SELECT USING (true);
CREATE POLICY "Admins can manage activities" ON activities FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Activity themes policies
CREATE POLICY "Anyone can view themes" ON activity_themes FOR SELECT USING (true);
CREATE POLICY "Admins can manage themes" ON activity_themes FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Favorites policies
CREATE POLICY "Users can view their own favorites" ON favorites FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own favorites" ON favorites FOR ALL USING (auth.uid() = user_id);

-- Business requests policies
CREATE POLICY "Anyone can create business requests" ON business_claim_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can view their own requests" ON business_claim_requests FOR SELECT USING (
    owner_email = (SELECT email FROM profiles WHERE id = auth.uid())
);
CREATE POLICY "Admins can manage all requests" ON business_claim_requests FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Import stats policies
CREATE POLICY "Admins can manage import stats" ON import_stats FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Functions and triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_activities_updated_at BEFORE UPDATE ON activities
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_business_requests_updated_at BEFORE UPDATE ON business_claim_requests
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, avatar_url)
    VALUES (
        NEW.id,
        NEW.email,
        NEW.raw_user_meta_data->>'full_name',
        NEW.raw_user_meta_data->>'avatar_url'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user registration
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Helper function to convert age in years to months
CREATE OR REPLACE FUNCTION age_years_to_months(years INTEGER)
RETURNS INTEGER AS $$
BEGIN
    RETURN years * 12;
END;
$$ LANGUAGE plpgsql;

