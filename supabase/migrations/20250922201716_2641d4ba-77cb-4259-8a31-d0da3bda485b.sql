-- Add extracted_text column to documents for OCR text
ALTER TABLE public.documents
ADD COLUMN IF NOT EXISTS extracted_text TEXT;

-- Promote first registered user to admin automatically
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, name, email, department)
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data ->> 'name', 'User'),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'department', 'Engineering')
  );

  -- If there is no admin yet, make this user admin; otherwise default to user
  IF NOT EXISTS (
    SELECT 1 FROM public.user_roles WHERE role = 'admin'
  ) THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin');
  ELSE
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'user');
  END IF;

  RETURN NEW;
END;
$$;

-- Create a private storage bucket for documents
INSERT INTO storage.buckets (id, name, public)
VALUES ('documents', 'documents', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for 'documents' bucket
-- Allow authenticated users to view their own files; admins/managers can view all
CREATE POLICY "Documents: read own or admin/manager"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'documents'
  AND (
    auth.uid()::text = (storage.foldername(name))[1]
    OR public.has_role(auth.uid(), 'admin')
    OR public.has_role(auth.uid(), 'manager')
  )
);

-- Allow users to upload to their own folder only
CREATE POLICY "Documents: upload own"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'documents'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to update/delete their own files; admins can manage all
CREATE POLICY "Documents: update own or admin"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'documents' AND (
    auth.uid()::text = (storage.foldername(name))[1]
    OR public.has_role(auth.uid(), 'admin')
  )
)
WITH CHECK (
  bucket_id = 'documents' AND (
    auth.uid()::text = (storage.foldername(name))[1]
    OR public.has_role(auth.uid(), 'admin')
  )
);

CREATE POLICY "Documents: delete own or admin"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'documents' AND (
    auth.uid()::text = (storage.foldername(name))[1]
    OR public.has_role(auth.uid(), 'admin')
  )
);
