import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { fornecedorSchema, FornecedorFormData } from "@/lib/validations/fornecedor";
import { Fornecedor } from "../FornecedoresPage";
import { countries, states } from "@/lib/countries";

interface FornecedorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fornecedor: Fornecedor | null;
}

const FornecedorDialog = ({ open, onOpenChange, fornecedor }: FornecedorDialogProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<FornecedorFormData>({
    resolver: zodResolver(fornecedorSchema),
    defaultValues: {
      nome: "",
      cpf_cnpj: "",
      pais: "Brasil",
      estado: "",
      cidade: "",
      bairro: "",
      rua_avenida: "",
      numero: undefined,
      telefone: "",
      email: "",
      produtos_fornecidos: "",
      status: "Ativo",
    },
  });

  useEffect(() => {
    if (fornecedor) {
      form.reset({
        nome: fornecedor.nome,
        cpf_cnpj: fornecedor.cpf_cnpj,
        pais: fornecedor.pais,
        estado: fornecedor.estado,
        cidade: fornecedor.cidade,
        bairro: fornecedor.bairro || "",
        rua_avenida: fornecedor.rua_avenida || "",
        numero: fornecedor.numero || undefined,
        telefone: fornecedor.telefone || "",
        email: fornecedor.email || "",
        produtos_fornecidos: fornecedor.produtos_fornecidos || "",
        status: fornecedor.status as "Ativo" | "Inativo",
      });
    } else {
      form.reset({
        nome: "",
        cpf_cnpj: "",
        pais: "Brasil",
        estado: "",
        cidade: "",
        bairro: "",
        rua_avenida: "",
        numero: undefined,
        telefone: "",
        email: "",
        produtos_fornecidos: "",
        status: "Ativo",
      });
    }
  }, [fornecedor, form]);

  const saveMutation = useMutation({
    mutationFn: async (data: FornecedorFormData) => {
      const payload = {
        nome: data.nome,
        cpf_cnpj: data.cpf_cnpj,
        pais: data.pais,
        estado: data.estado,
        cidade: data.cidade,
        bairro: data.bairro || null,
        rua_avenida: data.rua_avenida || null,
        numero: data.numero || null,
        telefone: data.telefone || null,
        email: data.email || null,
        produtos_fornecidos: data.produtos_fornecidos || null,
        status: data.status,
      };

      if (fornecedor) {
        const { error } = await supabase
          .from("fornecedores")
          .update(payload)
          .eq("id", fornecedor.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("fornecedores").insert([payload]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fornecedores"] });
      toast({
        title: "Sucesso",
        description: fornecedor
          ? "Fornecedor atualizado com sucesso"
          : "Fornecedor cadastrado com sucesso",
      });
      onOpenChange(false);
      form.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: error.message || "Erro ao salvar fornecedor",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: FornecedorFormData) => {
    saveMutation.mutate(data);
  };

  const selectedPais = form.watch("pais");
  const countryCode = countries.find(c => c.name === selectedPais)?.code || "BR";
  const estados = states[countryCode] || [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {fornecedor ? "Editar Fornecedor" : "Novo Fornecedor"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="nome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Fornecedor *</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Nome completo" maxLength={100} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cpf_cnpj"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CPF/CNPJ *</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="XXX.XXX.XXX-XX ou XX.XXX.XXX/XXXX-XX"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="pais"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>País *</FormLabel>
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
                        {countries.map((country) => (
                          <SelectItem key={country.code} value={country.name}>
                            {country.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="estado"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estado *</FormLabel>
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
                        {estados.map((estado) => (
                          <SelectItem key={estado} value={estado}>
                            {estado}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="cidade"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cidade *</FormLabel>
                  <FormControl>
                    <Input {...field} maxLength={30} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="bairro"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bairro</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value || ""} maxLength={30} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="rua_avenida"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rua/Avenida</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value || ""} maxLength={50} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="numero"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Número</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      value={field.value || ""}
                      onChange={(e) =>
                        field.onChange(e.target.value ? parseInt(e.target.value) : undefined)
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="telefone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefone</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value || ""} maxLength={20} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-mail</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        {...field}
                        value={field.value || ""}
                        maxLength={50}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="produtos_fornecidos"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Produtos Fornecidos</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value || ""} maxLength={70} />
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

export default FornecedorDialog;
