import { z } from "zod";

export const promocaoSchema = z.object({
  nome: z
    .string()
    .min(1, "Nome da promoção é obrigatório")
    .max(100, "Nome deve ter no máximo 100 caracteres")
    .trim(),
  tipo_desconto: z.enum(["Percentual", "Valor fixo"], {
    required_error: "Tipo de desconto é obrigatório",
  }),
  valor_desconto: z
    .number()
    .positive("Valor do desconto deve ser positivo")
    .refine(
      (val) => val > 0,
      "Valor do desconto deve ser maior que zero"
    ),
  produtos_aplicaveis: z.array(z.string()).default([]),
  aplicar_todos_produtos: z.boolean().default(false),
  data_inicio: z.string().min(1, "Data de início é obrigatória"),
  data_termino: z.string().min(1, "Data de término é obrigatória"),
  codigo_promocional: z
    .string()
    .max(50, "Código promocional deve ter no máximo 50 caracteres")
    .trim()
    .optional()
    .nullable(),
  limite_uso: z
    .number()
    .int("Limite de uso deve ser um inteiro")
    .positive("Limite de uso deve ser positivo")
    .optional()
    .nullable(),
  status: z.enum(["Ativo", "Inativo"]).default("Ativo"),
}).refine(
  (data) => {
    if (data.data_inicio && data.data_termino) {
      return new Date(data.data_inicio) <= new Date(data.data_termino);
    }
    return true;
  },
  {
    message: "Data de término deve ser maior ou igual à data de início",
    path: ["data_termino"],
  }
);

export type PromocaoFormData = z.infer<typeof promocaoSchema>;
