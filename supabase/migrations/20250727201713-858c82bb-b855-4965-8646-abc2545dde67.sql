-- Add additional profile fields for farming app
ALTER TABLE public.profiles 
ADD COLUMN phone_number TEXT,
ADD COLUMN region TEXT,
ADD COLUMN farming_experience TEXT CHECK (farming_experience IN ('beginner', 'intermediate', 'advanced')),
ADD COLUMN primary_crops TEXT[],
ADD COLUMN farm_size_hectares DECIMAL(10,2),
ADD COLUMN location_coordinates POINT,
ADD COLUMN preferred_language TEXT DEFAULT 'english',
ADD COLUMN audio_language TEXT DEFAULT 'english',
ADD COLUMN timezone TEXT DEFAULT 'Africa/Lagos',
ADD COLUMN bio TEXT,
ADD COLUMN notification_preferences JSONB DEFAULT '{"tips": true, "alerts": true, "reminders": true}'::jsonb;