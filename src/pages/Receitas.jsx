import {
  Card,
  CardContent,
} from "@/components/ui/card"

import { Button } from "@/components/ui/button"

import { Input } from "@/components/ui/input"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { Badge } from "@/components/ui/badge"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function Receitas() {

  const receitas = [
    {
      id: 1,
      data: "08/05/2026",
      produto: "Frango Corte",
      lote: "Lote #12",
      quantidade: 30,
      valor: "R$ 3.500",
      status: "Pago",
    },
    {
      id: 2,
      data: "07/05/2026",
      produto: "Ovos Brancos",
      lote: "Lote #10",
      quantidade: 120,
      valor: "R$ 1.200",
      status: "Pendente",
    },
  ]

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-4xl font-bold">
          Receitas e Vendas
        </h1>
        <p className="text-muted-foreground mt-2">
          Controle de vendas da granja
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">
              Total do mês
            </p>
            <h2 className="text-3xl font-bold mt-2 text-green-600">
              R$ 18.500
            </h2>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">
              Quantidade vendas
            </p>
            <h2 className="text-3xl font-bold mt-2">
              42
            </h2>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">
              Produto mais vendido
            </p>
            <h2 className="text-xl font-bold mt-2">
              Frango Corte
            </h2>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">
              Lote mais lucrativo
            </p>
            <h2 className="text-xl font-bold mt-2">
              Lote #12
            </h2>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="flex justify-between items-center">
            <Input
              placeholder="Buscar venda..."
              className="w-72"
            />

            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  + Nova Venda
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>
                    Nova Venda
                  </DialogTitle>
                </DialogHeader>

                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Produto
                    </label>

                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o produto" />
                      </SelectTrigger>

                      <SelectContent>
                        <SelectItem value="frango">
                          Frango Corte
                        </SelectItem>
                        <SelectItem value="ovos">
                          Ovos Brancos
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Lote
                    </label>

                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o lote" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="12">
                          Lote #12
                        </SelectItem>
                        <SelectItem value="10">
                          Lote #10
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Quantidade
                    </label>
                    <Input type="number" />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Valor
                    </label>
                    <Input placeholder="R$ 0,00" />
                  </div>
                  <div className="space-y-2 col-span-2">
                    <label className="text-sm font-medium">
                      Observação
                    </label>
                    <Input placeholder="Informações adicionais" />
                  </div>
                </div>
                <div className="flex justify-end gap-2 mt-6">
                  <Button variant="outline">
                    Cancelar
                  </Button>
                  <Button>
                    Salvar Venda
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Produto</TableHead>
                <TableHead>Lote</TableHead>
                <TableHead>Quantidade</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {receitas.map((item) => (
                <TableRow key={item.id}>

                  <TableCell>{item.data}</TableCell>

                  <TableCell className="font-medium">
                    {item.produto}
                  </TableCell>

                  <TableCell>{item.lote}</TableCell>

                  <TableCell>{item.quantidade}</TableCell>

                  <TableCell className="text-green-600 font-bold">
                    {item.valor}
                  </TableCell>

                  <TableCell>
                    <Badge>
                      {item.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}