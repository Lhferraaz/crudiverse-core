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
import { Promocao } from "../PromocoesPage";
import { format } from "date-fns";

interface PromocoesListProps {
  promocoes: Promocao[];
  isLoading: boolean;
  onEdit: (promocao: Promocao) => void;
  onDelete: (id: string) => void;
}

const PromocoesList = ({
  promocoes,
  isLoading,
  onEdit,
  onDelete,
}: PromocoesListProps) => {
  if (isLoading) {
    return <div className="text-center py-8">Carregando...</div>;
  }

  if (promocoes.length === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="text-muted-foreground">Nenhuma promoção encontrada</p>
      </Card>
    );
  }

  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Valor</TableHead>
            <TableHead>Período</TableHead>
            <TableHead>Código</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {promocoes.map((promocao) => (
            <TableRow key={promocao.id}>
              <TableCell className="font-medium">{promocao.nome}</TableCell>
              <TableCell>{promocao.tipo_desconto}</TableCell>
              <TableCell>
                {promocao.tipo_desconto === "Percentual"
                  ? `${promocao.valor_desconto}%`
                  : `R$ ${Number(promocao.valor_desconto).toFixed(2)}`}
              </TableCell>
              <TableCell>
                {format(new Date(promocao.data_inicio), "dd/MM/yyyy")} -{" "}
                {format(new Date(promocao.data_termino), "dd/MM/yyyy")}
              </TableCell>
              <TableCell>{promocao.codigo_promocional || "-"}</TableCell>
              <TableCell>
                <Badge variant={promocao.status === "Ativo" ? "default" : "secondary"}>
                  {promocao.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onEdit(promocao)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onDelete(promocao.id)}
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

export default PromocoesList;
