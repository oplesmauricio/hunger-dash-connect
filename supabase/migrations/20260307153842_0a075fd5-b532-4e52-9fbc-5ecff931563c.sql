
-- Enum for user type
CREATE TYPE public.user_type AS ENUM ('restaurant', 'motoboy');

-- Enum for delivery status
CREATE TYPE public.delivery_status AS ENUM ('pending', 'accepted', 'collected', 'delivered');

-- Enum for app roles
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

-- Profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  phone TEXT,
  user_type public.user_type NOT NULL,
  rating NUMERIC(2,1) DEFAULT 5.0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile" ON public.profiles
  FOR SELECT TO authenticated USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE TO authenticated USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

-- Allow restaurants to see motoboy profiles (for delivery info)
CREATE POLICY "Users can read other profiles" ON public.profiles
  FOR SELECT TO authenticated USING (true);

-- User roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role public.app_role NOT NULL,
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Deliveries table
CREATE TABLE public.deliveries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID REFERENCES public.profiles(id) NOT NULL,
  motoboy_id UUID REFERENCES public.profiles(id),
  customer_name TEXT NOT NULL,
  items TEXT NOT NULL,
  value NUMERIC(10,2) NOT NULL,
  fee NUMERIC(10,2) NOT NULL,
  pickup_address TEXT NOT NULL,
  delivery_address TEXT NOT NULL,
  status public.delivery_status NOT NULL DEFAULT 'pending',
  distance TEXT,
  estimated_time TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.deliveries ENABLE ROW LEVEL SECURITY;

-- Restaurant can see their own deliveries
CREATE POLICY "Restaurant can read own deliveries" ON public.deliveries
  FOR SELECT TO authenticated USING (restaurant_id = auth.uid());

-- Motoboy can see pending deliveries and their own accepted ones
CREATE POLICY "Motoboy can read available and own deliveries" ON public.deliveries
  FOR SELECT TO authenticated USING (status = 'pending' OR motoboy_id = auth.uid());

-- Restaurant can insert deliveries
CREATE POLICY "Restaurant can create deliveries" ON public.deliveries
  FOR INSERT TO authenticated WITH CHECK (restaurant_id = auth.uid());

-- Restaurant can update own deliveries
CREATE POLICY "Restaurant can update own deliveries" ON public.deliveries
  FOR UPDATE TO authenticated USING (restaurant_id = auth.uid());

-- Motoboy can update deliveries they accepted
CREATE POLICY "Motoboy can update accepted deliveries" ON public.deliveries
  FOR UPDATE TO authenticated USING (motoboy_id = auth.uid() OR (status = 'pending' AND motoboy_id IS NULL));

-- Auto-create profile trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, name, phone, user_type)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', 'Usuário'),
    NEW.raw_user_meta_data->>'phone',
    COALESCE((NEW.raw_user_meta_data->>'user_type')::public.user_type, 'restaurant')
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Enable realtime for deliveries
ALTER PUBLICATION supabase_realtime ADD TABLE public.deliveries;
