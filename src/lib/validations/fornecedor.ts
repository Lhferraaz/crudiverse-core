import { z } from "zod";

// Validação de CPF (formato: XXX.XXX.XXX-XX)
const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;

// Validação de CNPJ (formato: XX.XXX.XXX/XXXX-XX)
const cnpjRegex = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/;

export const fornecedorSchema = z.object({
  nome: z
    .string()
    .min(1, "Nome é obrigatório")
    .max(100, "Nome deve ter no máximo 100 caracteres")
    .trim(),
  cpf_cnpj: z
    .string()
    .min(1, "CPF/CNPJ é obrigatório")
    .refine(
      (val) => cpfRegex.test(val) || cnpjRegex.test(val),
      "Formato inválido. Use XXX.XXX.XXX-XX para CPF ou XX.XXX.XXX/XXXX-XX para CNPJ"
    ),
  pais: z.string().min(1, "País é obrigatório"),
  estado: z.string().min(1, "Estado é obrigatório"),
  cidade: z
    .string()
    .min(1, "Cidade é obrigatória")
    .max(30, "Cidade deve ter no máximo 30 caracteres")
    .trim(),
  bairro: z
    .string()
    .max(30, "Bairro deve ter no máximo 30 caracteres")
    .trim()
    .optional()
    .nullable(),
  rua_avenida: z
    .string()
    .max(50, "Rua/Avenida deve ter no máximo 50 caracteres")
    .trim()
    .optional()
    .nullable(),
  numero: z
    .number()
    .int("Número deve ser um inteiro")
    .positive("Número deve ser positivo")
    .optional()
    .nullable(),
  telefone: z
    .string()
    .max(20, "Telefone deve ter no máximo 20 caracteres")
    .regex(/^\d+$/, "Telefone deve conter apenas números")
    .optional()
    .nullable(),
  email: z
    .string()
    .max(50, "E-mail deve ter no máximo 50 caracteres")
    .email("E-mail inválido")
    .optional()
    .nullable(),
  produtos_fornecidos: z
    .string()
    .max(70, "Produtos fornecidos deve ter no máximo 70 caracteres")
    .trim()
    .optional()
    .nullable(),
  status: z.enum(["Ativo", "Inativo"]).default("Ativo"),
});

export type FornecedorFormData = z.infer<typeof fornecedorSchema>;
