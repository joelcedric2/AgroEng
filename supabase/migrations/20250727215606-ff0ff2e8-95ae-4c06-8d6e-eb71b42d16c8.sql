-- Create crops table for main crop information
CREATE TABLE public.crops (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  scientific_name TEXT,
  description TEXT,
  category TEXT, -- vegetables, fruits, grains, etc.
  planting_season TEXT,
  harvest_season TEXT,
  growing_conditions JSONB, -- soil type, climate, water needs, etc.
  nutrition_info JSONB, -- nutritional content
  market_info JSONB, -- pricing, demand, etc.
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create crop_images table for storing images
CREATE TABLE public.crop_images (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  crop_id UUID NOT NULL REFERENCES public.crops(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  image_type TEXT NOT NULL CHECK (image_type IN ('healthy', 'diseased', 'reference')),
  description TEXT,
  ai_analysis JSONB, -- store OpenAI vision analysis results
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create diseases table
CREATE TABLE public.diseases (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  scientific_name TEXT,
  description TEXT,
  symptoms TEXT,
  causes TEXT,
  prevention TEXT,
  treatment TEXT,
  severity TEXT CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create crop_diseases junction table (many-to-many relationship)
CREATE TABLE public.crop_diseases (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  crop_id UUID NOT NULL REFERENCES public.crops(id) ON DELETE CASCADE,
  disease_id UUID NOT NULL REFERENCES public.diseases(id) ON DELETE CASCADE,
  susceptibility TEXT CHECK (susceptibility IN ('low', 'medium', 'high')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(crop_id, disease_id)
);

-- Create crop_search_vectors table for AI embeddings and search
CREATE TABLE public.crop_search_vectors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  crop_id UUID REFERENCES public.crops(id) ON DELETE CASCADE,
  disease_id UUID REFERENCES public.diseases(id) ON DELETE CASCADE,
  content_type TEXT NOT NULL CHECK (content_type IN ('crop_description', 'disease_info', 'image_analysis')),
  content TEXT NOT NULL,
  embedding VECTOR(1536), -- OpenAI ada-002 embedding dimension
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.crops ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crop_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.diseases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crop_diseases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crop_search_vectors ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (crops database should be accessible to all users)
CREATE POLICY "Crops are viewable by everyone" ON public.crops FOR SELECT USING (true);
CREATE POLICY "Crop images are viewable by everyone" ON public.crop_images FOR SELECT USING (true);
CREATE POLICY "Diseases are viewable by everyone" ON public.diseases FOR SELECT USING (true);
CREATE POLICY "Crop diseases are viewable by everyone" ON public.crop_diseases FOR SELECT USING (true);
CREATE POLICY "Search vectors are viewable by everyone" ON public.crop_search_vectors FOR SELECT USING (true);

-- Admin policies for data management
CREATE POLICY "Admins can manage crops" ON public.crops FOR ALL USING (is_admin(auth.uid()));
CREATE POLICY "Admins can manage crop images" ON public.crop_images FOR ALL USING (is_admin(auth.uid()));
CREATE POLICY "Admins can manage diseases" ON public.diseases FOR ALL USING (is_admin(auth.uid()));
CREATE POLICY "Admins can manage crop diseases" ON public.crop_diseases FOR ALL USING (is_admin(auth.uid()));
CREATE POLICY "Admins can manage search vectors" ON public.crop_search_vectors FOR ALL USING (is_admin(auth.uid()));

-- Create indexes for better performance
CREATE INDEX idx_crops_name ON public.crops(name);
CREATE INDEX idx_crops_category ON public.crops(category);
CREATE INDEX idx_crop_images_crop_id ON public.crop_images(crop_id);
CREATE INDEX idx_crop_images_type ON public.crop_images(image_type);
CREATE INDEX idx_diseases_name ON public.diseases(name);
CREATE INDEX idx_crop_diseases_crop_id ON public.crop_diseases(crop_id);
CREATE INDEX idx_crop_diseases_disease_id ON public.crop_diseases(disease_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_crops_updated_at
  BEFORE UPDATE ON public.crops
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_diseases_updated_at
  BEFORE UPDATE ON public.diseases
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for crop images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('crop-images', 'crop-images', true);

-- Create storage policies for crop images
CREATE POLICY "Crop images are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'crop-images');

CREATE POLICY "Admins can upload crop images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'crop-images' AND is_admin(auth.uid()));

CREATE POLICY "Admins can update crop images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'crop-images' AND is_admin(auth.uid()));

CREATE POLICY "Admins can delete crop images" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'crop-images' AND is_admin(auth.uid()));