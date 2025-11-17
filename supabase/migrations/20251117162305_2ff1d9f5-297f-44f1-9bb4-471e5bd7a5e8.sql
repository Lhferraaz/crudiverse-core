-- Step 1: Remove plaintext password storage from clientes table
ALTER TABLE public.clientes DROP COLUMN IF EXISTS senha;

-- Step 2: Create profiles table linked to auth.users
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  sobrenome TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Step 3: Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Step 4: Create user_roles table
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);

-- Step 5: Enable RLS on new tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Step 6: Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Step 7: Create trigger function for profiles updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Step 8: RLS policies for profiles
CREATE POLICY "Users can view their own profile"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Step 9: RLS policies for user_roles (admin only)
CREATE POLICY "Admins can view all roles"
  ON public.user_roles
  FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage roles"
  ON public.user_roles
  FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Step 10: Update RLS policies for clientes (admin only access)
DROP POLICY IF EXISTS "Clientes são visíveis para todos" ON public.clientes;
DROP POLICY IF EXISTS "Qualquer um pode atualizar clientes" ON public.clientes;
DROP POLICY IF EXISTS "Qualquer um pode deletar clientes" ON public.clientes;
DROP POLICY IF EXISTS "Qualquer um pode inserir clientes" ON public.clientes;

CREATE POLICY "Admins can view all clientes"
  ON public.clientes
  FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert clientes"
  ON public.clientes
  FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update clientes"
  ON public.clientes
  FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete clientes"
  ON public.clientes
  FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Step 11: Update RLS policies for produtos (admin only access)
DROP POLICY IF EXISTS "Produtos são visíveis para todos" ON public.produtos;
DROP POLICY IF EXISTS "Qualquer um pode atualizar produtos" ON public.produtos;
DROP POLICY IF EXISTS "Qualquer um pode deletar produtos" ON public.produtos;
DROP POLICY IF EXISTS "Qualquer um pode inserir produtos" ON public.produtos;

CREATE POLICY "Admins can view all produtos"
  ON public.produtos
  FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert produtos"
  ON public.produtos
  FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update produtos"
  ON public.produtos
  FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete produtos"
  ON public.produtos
  FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Step 12: Update RLS policies for fornecedores (admin only access)
DROP POLICY IF EXISTS "Fornecedores são visíveis para todos" ON public.fornecedores;
DROP POLICY IF EXISTS "Qualquer um pode atualizar fornecedores" ON public.fornecedores;
DROP POLICY IF EXISTS "Qualquer um pode deletar fornecedores" ON public.fornecedores;
DROP POLICY IF EXISTS "Qualquer um pode inserir fornecedores" ON public.fornecedores;

CREATE POLICY "Admins can view all fornecedores"
  ON public.fornecedores
  FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert fornecedores"
  ON public.fornecedores
  FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update fornecedores"
  ON public.fornecedores
  FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete fornecedores"
  ON public.fornecedores
  FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Step 13: Update RLS policies for promocoes (admin only access)
DROP POLICY IF EXISTS "Promoções são visíveis para todos" ON public.promocoes;
DROP POLICY IF EXISTS "Qualquer um pode atualizar promoções" ON public.promocoes;
DROP POLICY IF EXISTS "Qualquer um pode deletar promoções" ON public.promocoes;
DROP POLICY IF EXISTS "Qualquer um pode inserir promoções" ON public.promocoes;

CREATE POLICY "Admins can view all promocoes"
  ON public.promocoes
  FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert promocoes"
  ON public.promocoes
  FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update promocoes"
  ON public.promocoes
  FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete promocoes"
  ON public.promocoes
  FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Step 14: Keep marcas readable by all authenticated users (needed for dropdowns)
DROP POLICY IF EXISTS "Marcas são visíveis para todos" ON public.marcas;

CREATE POLICY "Authenticated users can view marcas"
  ON public.marcas
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage marcas"
  ON public.marcas
  FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));