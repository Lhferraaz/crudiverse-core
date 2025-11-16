import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import PromocaoDialog from "./components/PromocaoDialog";
import PromocoesFilters from "./components/PromocoesFilters";
import PromocoesList from "./components/PromocoesList";

export interface Promocao {
  id: string;
  nome: string;
  tipo_desconto: string;
  valor_desconto: number;
  produtos_aplicaveis: string[];
  aplicar_todos_produtos: boolean;
  data_inicio: string;
  data_termino: string;
  codigo_promocional: string | null;
  limite_uso: number | null;
  status: string;
  created_at: string;
  updated_at: string;
}

const PromocoesPage = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPromocao, setEditingPromocao] = useState<Promocao | null>(null);
  const [filters, setFilters] = useState({
    nome: "",
    tipo_desconto: "",
    data_inicio: "",
    data_termino: "",
    tem_codigo: false,
    status: "",
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: promocoes = [], isLoading } = useQuery({
    queryKey: ["promocoes", filters],
    queryFn: async () => {
      let query = supabase.from("promocoes").select("*").order("nome");

      if (filters.nome) {
        query = query.ilike("nome", `%${filters.nome}%`);
      }
      if (filters.tipo_desconto) {
        query = query.eq("tipo_desconto", filters.tipo_desconto);
      }
      if (filters.data_inicio) {
        query = query.gte("data_inicio", filters.data_inicio);
      }
      if (filters.data_termino) {
        query = query.lte("data_termino", filters.data_termino);
      }
      if (filters.tem_codigo) {
        query = query.not("codigo_promocional", "is", null);
      }
      if (filters.status) {
        query = query.eq("status", filters.status);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Promocao[];
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("promocoes").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["promocoes"] });
      toast({
        title: "Sucesso",
        description: "Promoção excluída com sucesso",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: `Erro ao excluir promoção: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const handleEdit = (promocao: Promocao) => {
    setEditingPromocao(promocao);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir esta promoção?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setEditingPromocao(null);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Promoções</h1>
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Nova Promoção
          </Button>
        </div>

        <PromocoesFilters filters={filters} onFiltersChange={setFilters} />
        <PromocoesList
          promocoes={promocoes}
          isLoading={isLoading}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        <PromocaoDialog
          open={isDialogOpen}
          onOpenChange={handleDialogClose}
          promocao={editingPromocao}
        />
      </div>
    </Layout>
  );
};

export default PromocoesPage;
