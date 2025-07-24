-- Create storage buckets for images
INSERT INTO storage.buckets (id, name, public) VALUES ('originals', 'originals', false);
INSERT INTO storage.buckets (id, name, public) VALUES ('processed', 'processed', true);

-- Create storage policies for original images (private)
CREATE POLICY "Users can upload their own images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'originals' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own images" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'originals' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own images" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'originals' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create storage policies for processed images (public for easy sharing)
CREATE POLICY "Processed images are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'processed');

CREATE POLICY "Users can upload processed images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'processed' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create table to track image processing jobs
CREATE TABLE public.image_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  original_file_path TEXT NOT NULL,
  processed_file_path TEXT,
  status TEXT NOT NULL DEFAULT 'pending', -- pending, processing, completed, failed
  job_type TEXT NOT NULL, -- background_removal, enhancement, etc
  error_message TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on image_jobs
ALTER TABLE public.image_jobs ENABLE ROW LEVEL SECURITY;

-- Create policies for image_jobs
CREATE POLICY "Users can view their own jobs" 
ON public.image_jobs 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own jobs" 
ON public.image_jobs 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own jobs" 
ON public.image_jobs 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Add trigger for updated_at
CREATE TRIGGER update_image_jobs_updated_at
BEFORE UPDATE ON public.image_jobs
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();