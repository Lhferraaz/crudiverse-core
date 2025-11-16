import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import FornecedorDialog from "./components/FornecedorDialog";
import FornecedoresFilters from "./components/FornecedoresFilters";
import FornecedoresList from "./components/FornecedoresList";

export interface Fornecedor {
  id: string;
  nome: string;
  cpf_cnpj: string;
  pais: string;
  estado: string;
  cidade: string;
  bairro: string | null;
  rua_avenida: string | null;
  numero: number | null;
  telefone: string | null;
  email: string | null;
  produtos_fornecidos: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

const FornecedoresPage = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingFornecedor, setEditingFornecedor] = useState<Fornecedor | null>(null);
  const [filters, setFilters] = useState({
    nome: "",
    cpf_cnpj: "",
    pais: "",
    estado: "",
    cidade: "",
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: fornecedores = [], isLoading } = useQuery({
    queryKey: ["fornecedores", filters],
    queryFn: async () => {
      let query = supabase.from("fornecedores").select("*").order("nome");

      if (filters.nome) {
        query = query.ilike("nome", `%${filters.nome}%`);
      }
      if (filters.cpf_cnpj) {
        query = query.ilike("cpf_cnpj", `%${filters.cpf_cnpj}%`);
      }
      if (filters.pais) {
        query = query.eq("pais", filters.pais);
      }
      if (filters.estado) {
        query = query.eq("estado", filters.estado);
      }
      if (filters.cidade) {
        query = query.ilike("cidade", `%${filters.cidade}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Fornecedor[];
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("fornecedores").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fornecedores"] });
      toast({
        title: "Sucesso",
        description: "Fornecedor excluído com sucesso",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: `Erro ao excluir fornecedor: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const handleEdit = (fornecedor: Fornecedor) => {
    setEditingFornecedor(fornecedor);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir este fornecedor?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setEditingFornecedor(null);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Fornecedores</h1>
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Novo Fornecedor
          </Button>
        </div>

        <FornecedoresFilters filters={filters} onFiltersChange={setFilters} />
        <FornecedoresList
          fornecedores={fornecedores}
          isLoading={isLoading}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        <FornecedorDialog
          open={isDialogOpen}
          onOpenChange={handleDialogClose}
          fornecedor={editingFornecedor}
        />
      </div>
    </Layout>
  );
};

export default FornecedoresPage;
