import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { promocaoSchema, PromocaoFormData } from "@/lib/validations/promocao";
import { Promocao } from "../PromocoesPage";

interface PromocaoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  promocao: Promocao | null;
}

const PromocaoDialog = ({ open, onOpenChange, promocao }: PromocaoDialogProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: produtos = [] } = useQuery({
    queryKey: ["produtos"],
    queryFn: async () => {
      const { data, error } = await supabase.from("produtos").select("id, nome_produto");
      if (error) throw error;
      return data;
    },
  });

  const form = useForm<PromocaoFormData>({
    resolver: zodResolver(promocaoSchema),
    defaultValues: {
      nome: "",
      tipo_desconto: "Percentual",
      valor_desconto: 0,
      produtos_aplicaveis: [],
      aplicar_todos_produtos: false,
      data_inicio: "",
      data_termino: "",
      codigo_promocional: "",
      limite_uso: undefined,
      status: "Ativo",
    },
  });

  useEffect(() => {
    if (promocao) {
      form.reset({
        nome: promocao.nome,
        tipo_desconto: promocao.tipo_desconto as "Percentual" | "Valor fixo",
        valor_desconto: Number(promocao.valor_desconto),
        produtos_aplicaveis: promocao.produtos_aplicaveis || [],
        aplicar_todos_produtos: promocao.aplicar_todos_produtos,
        data_inicio: promocao.data_inicio,
        data_termino: promocao.data_termino,
        codigo_promocional: promocao.codigo_promocional || "",
        limite_uso: promocao.limite_uso || undefined,
        status: promocao.status as "Ativo" | "Inativo",
      });
    } else {
      form.reset({
        nome: "",
        tipo_desconto: "Percentual",
        valor_desconto: 0,
        produtos_aplicaveis: [],
        aplicar_todos_produtos: false,
        data_inicio: "",
        data_termino: "",
        codigo_promocional: "",
        limite_uso: undefined,
        status: "Ativo",
      });
    }
  }, [promocao, form]);

  const saveMutation = useMutation({
    mutationFn: async (data: PromocaoFormData) => {
      const payload = {
        nome: data.nome,
        tipo_desconto: data.tipo_desconto,
        valor_desconto: data.valor_desconto,
        produtos_aplicaveis: data.produtos_aplicaveis,
        aplicar_todos_produtos: data.aplicar_todos_produtos,
        data_inicio: data.data_inicio,
        data_termino: data.data_termino,
        codigo_promocional: data.codigo_promocional || null,
        limite_uso: data.limite_uso || null,
        status: data.status,
      };

      if (promocao) {
        const { error } = await supabase
          .from("promocoes")
          .update(payload)
          .eq("id", promocao.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("promocoes").insert([payload]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["promocoes"] });
      toast({
        title: "Sucesso",
        description: promocao
          ? "Promoção atualizada com sucesso"
          : "Promoção cadastrada com sucesso",
      });
      onOpenChange(false);
      form.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: error.message || "Erro ao salvar promoção",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: PromocaoFormData) => {
    saveMutation.mutate(data);
  };

  const aplicarTodosProdutos = form.watch("aplicar_todos_produtos");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {promocao ? "Editar Promoção" : "Nova Promoção"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="nome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome da Promoção *</FormLabel>
                  <FormControl>
                    <Input {...field} maxLength={100} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="tipo_desconto"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Desconto *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Percentual">Percentual</SelectItem>
                        <SelectItem value="Valor fixo">Valor fixo</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="valor_desconto"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor do Desconto *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseFloat(e.target.value))
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="aplicar_todos_produtos"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Aplicar desconto a todos os produtos
                    </FormLabel>
                  </div>
                </FormItem>
              )}
            />

            {!aplicarTodosProdutos && (
              <FormField
                control={form.control}
                name="produtos_aplicaveis"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Produtos Aplicáveis</FormLabel>
                    <div className="space-y-2 max-h-40 overflow-y-auto border rounded-md p-2">
                      {produtos.map((produto) => (
                        <div key={produto.id} className="flex items-center space-x-2">
                          <Checkbox
                            checked={field.value?.includes(produto.id)}
                            onCheckedChange={(checked) => {
                              const current = field.value || [];
                              if (checked) {
                                field.onChange([...current, produto.id]);
                              } else {
                                field.onChange(
                                  current.filter((id) => id !== produto.id)
                                );
                              }
                            }}
                          />
                          <label className="text-sm">{produto.nome_produto}</label>
                        </div>
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="data_inicio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data de Início *</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="data_termino"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data de Término *</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="codigo_promocional"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Código Promocional</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value={field.value || ""}
                      maxLength={50}
                      placeholder="Opcional"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="limite_uso"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Limite de Uso</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      value={field.value || ""}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value ? parseInt(e.target.value) : undefined
                        )
                      }
                      placeholder="Opcional"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Ativo">Ativo</SelectItem>
                      <SelectItem value="Inativo">Inativo</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={saveMutation.isPending}>
                {saveMutation.isPending ? "Salvando..." : "Salvar"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default PromocaoDialog;
