import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Fornecedor } from "../FornecedoresPage";

interface FornecedoresListProps {
  fornecedores: Fornecedor[];
  isLoading: boolean;
  onEdit: (fornecedor: Fornecedor) => void;
  onDelete: (id: string) => void;
}

const FornecedoresList = ({
  fornecedores,
  isLoading,
  onEdit,
  onDelete,
}: FornecedoresListProps) => {
  if (isLoading) {
    return <div className="text-center py-8">Carregando...</div>;
  }

  if (fornecedores.length === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="text-muted-foreground">Nenhum fornecedor encontrado</p>
      </Card>
    );
  }

  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>CPF/CNPJ</TableHead>
            <TableHead>Cidade/Estado</TableHead>
            <TableHead>Telefone</TableHead>
            <TableHead>E-mail</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {fornecedores.map((fornecedor) => (
            <TableRow key={fornecedor.id}>
              <TableCell className="font-medium">{fornecedor.nome}</TableCell>
              <TableCell>{fornecedor.cpf_cnpj}</TableCell>
              <TableCell>
                {fornecedor.cidade}, {fornecedor.estado}
              </TableCell>
              <TableCell>{fornecedor.telefone || "-"}</TableCell>
              <TableCell>{fornecedor.email || "-"}</TableCell>
              <TableCell>
                <Badge variant={fornecedor.status === "Ativo" ? "default" : "secondary"}>
                  {fornecedor.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onEdit(fornecedor)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onDelete(fornecedor.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};

export default FornecedoresList;
