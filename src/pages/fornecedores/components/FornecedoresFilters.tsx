import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { countries, states } from "@/lib/countries";

interface FornecedoresFiltersProps {
  filters: {
    nome: string;
    cpf_cnpj: string;
    pais: string;
    estado: string;
    cidade: string;
  };
  onFiltersChange: (filters: any) => void;
}

const FornecedoresFilters = ({ filters, onFiltersChange }: FornecedoresFiltersProps) => {
  const countryCode = countries.find(c => c.name === filters.pais)?.code || "BR";
  const estados = states[countryCode] || [];

  return (
    <Card className="p-4">
      <h2 className="text-lg font-semibold mb-4">Filtros</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="nome">Nome do Fornecedor</Label>
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
          <Label htmlFor="cpf_cnpj">CPF/CNPJ</Label>
          <Input
            id="cpf_cnpj"
            placeholder="Filtrar por CPF/CNPJ"
            value={filters.cpf_cnpj}
            onChange={(e) =>
              onFiltersChange({ ...filters, cpf_cnpj: e.target.value })
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="pais">País</Label>
          <Select
            value={filters.pais}
            onValueChange={(value) =>
              onFiltersChange({ ...filters, pais: value, estado: "" })
            }
          >
            <SelectTrigger id="pais">
              <SelectValue placeholder="Todos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todos</SelectItem>
              {countries.map((country) => (
                <SelectItem key={country.code} value={country.name}>
                  {country.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="estado">Estado</Label>
          <Select
            value={filters.estado}
            onValueChange={(value) =>
              onFiltersChange({ ...filters, estado: value })
            }
          >
            <SelectTrigger id="estado">
              <SelectValue placeholder="Todos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todos</SelectItem>
              {estados.map((estado) => (
                <SelectItem key={estado} value={estado}>
                  {estado}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="cidade">Cidade</Label>
          <Input
            id="cidade"
            placeholder="Filtrar por cidade"
            value={filters.cidade}
            onChange={(e) =>
              onFiltersChange({ ...filters, cidade: e.target.value })
            }
          />
        </div>
      </div>
    </Card>
  );
};

export default FornecedoresFilters;
