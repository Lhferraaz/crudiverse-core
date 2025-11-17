import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";

interface PromocoesFiltersProps {
  filters: {
    nome: string;
    tipo_desconto: string;
    data_inicio: string;
    data_termino: string;
    tem_codigo: boolean;
    status: string;
  };
  onFiltersChange: (filters: any) => void;
}

const PromocoesFilters = ({ filters, onFiltersChange }: PromocoesFiltersProps) => {
  return (
    <Card className="p-4">
      <h2 className="text-lg font-semibold mb-4">Filtros</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="nome">Nome da Promoção</Label>
          <Input
            id="nome"
            placeholder="Filtrar por nome"
            value={filters.nome}
            onChange={(e) =>
              onFiltersChange({ ...filters, nome: e.target.value })
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="tipo_desconto">Tipo de Desconto</Label>
          <Select
            value={filters.tipo_desconto}
            onValueChange={(value) =>
              onFiltersChange({ ...filters, tipo_desconto: value === "__EMPTY__" ? "" : value })
            }
          >
            <SelectTrigger id="tipo_desconto">
              <SelectValue placeholder="Todos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__EMPTY__">Todos</SelectItem>
              <SelectItem value="Percentual">Percentual</SelectItem>
              <SelectItem value="Valor fixo">Valor fixo</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="data_inicio">Data de Início</Label>
          <Input
            id="data_inicio"
            type="date"
            value={filters.data_inicio}
            onChange={(e) =>
              onFiltersChange({ ...filters, data_inicio: e.target.value })
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="data_termino">Data de Término</Label>
          <Input
            id="data_termino"
            type="date"
            value={filters.data_termino}
            onChange={(e) =>
              onFiltersChange({ ...filters, data_termino: e.target.value })
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select
            value={filters.status}
            onValueChange={(value) =>
              onFiltersChange({ ...filters, status: value === "__EMPTY__" ? "" : value })
            }
          >
            <SelectTrigger id="status">
              <SelectValue placeholder="Todos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__EMPTY__">Todos</SelectItem>
              <SelectItem value="Ativo">Ativo</SelectItem>
              <SelectItem value="Inativo">Inativo</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-end">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="tem_codigo"
              checked={filters.tem_codigo}
              onCheckedChange={(checked) =>
                onFiltersChange({ ...filters, tem_codigo: checked })
              }
            />
            <Label htmlFor="tem_codigo" className="cursor-pointer">
              Apenas com código promocional
            </Label>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default PromocoesFilters;
