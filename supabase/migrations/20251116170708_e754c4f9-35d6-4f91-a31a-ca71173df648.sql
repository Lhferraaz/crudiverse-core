-- Criar tabela de fornecedores
CREATE TABLE public.fornecedores (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  cpf_cnpj TEXT NOT NULL UNIQUE,
  pais TEXT NOT NULL,
  estado TEXT NOT NULL,
  cidade TEXT NOT NULL,
  bairro TEXT,
  rua_avenida TEXT,
  numero INTEGER,
  telefone TEXT,
  email TEXT,
  produtos_fornecidos TEXT,
  status TEXT NOT NULL DEFAULT 'Ativo',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de promoções
CREATE TABLE public.promocoes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  tipo_desconto TEXT NOT NULL,
  valor_desconto NUMERIC NOT NULL,
  produtos_aplicaveis TEXT[], -- Array de IDs de produtos
  aplicar_todos_produtos BOOLEAN NOT NULL DEFAULT false,
  data_inicio DATE NOT NULL,
  data_termino DATE NOT NULL,
  codigo_promocional TEXT,
  limite_uso INTEGER,
  status TEXT NOT NULL DEFAULT 'Ativo',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.fornecedores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promocoes ENABLE ROW LEVEL SECURITY;

-- Políticas para fornecedores
CREATE POLICY "Fornecedores são visíveis para todos" 
ON public.fornecedores 
FOR SELECT 
USING (true);

CREATE POLICY "Qualquer um pode inserir fornecedores" 
ON public.fornecedores 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Qualquer um pode atualizar fornecedores" 
ON public.fornecedores 
FOR UPDATE 
USING (true);

CREATE POLICY "Qualquer um pode deletar fornecedores" 
ON public.fornecedores 
FOR DELETE 
USING (true);

-- Políticas para promoções
CREATE POLICY "Promoções são visíveis para todos" 
ON public.promocoes 
FOR SELECT 
USING (true);

CREATE POLICY "Qualquer um pode inserir promoções" 
ON public.promocoes 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Qualquer um pode atualizar promoções" 
ON public.promocoes 
FOR UPDATE 
USING (true);

CREATE POLICY "Qualquer um pode deletar promoções" 
ON public.promocoes 
FOR DELETE 
USING (true);

-- Trigger para updated_at em fornecedores
CREATE TRIGGER update_fornecedores_updated_at
BEFORE UPDATE ON public.fornecedores
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger para updated_at em promoções
CREATE TRIGGER update_promocoes_updated_at
BEFORE UPDATE ON public.promocoes
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();