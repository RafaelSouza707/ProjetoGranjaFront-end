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

export default function Despesas() {

  const despesas = [
    {
      id: 1,
      data: "08/05/2026",
      tipo: "Ração",
      lote: "Lote #12",
      descricao: "Compra de ração inicial",
      valor: "R$ 2.500",
      vencimento: "15/05/2026",
      status: "Pago",
    },
    {
      id: 2,
      data: "06/05/2026",
      tipo: "Energia",
      lote: "Aviário 01",
      descricao: "Conta de energia",
      valor: "R$ 850",
      vencimento: "10/05/2026",
      status: "Pendente",
    },
  ]

  return (
    <div className="p-6 space-y-6">

      <div>
        <h1 className="text-4xl font-bold">
          Despesas Operacionais
        </h1>

        <p className="text-muted-foreground mt-2">
          Controle de custos da granja
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">
              Total do mês
            </p>

            <h2 className="text-3xl font-bold mt-2 text-red-600">
              R$ 9.320
            </h2>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">
              Despesas pendentes
            </p>

            <h2 className="text-3xl font-bold mt-2">
              12
            </h2>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">
              Maior despesa
            </p>

            <h2 className="text-xl font-bold mt-2">
              Ração
            </h2>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">
              Lote mais caro
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
              placeholder="Buscar despesa..."
              className="w-72"
            />

            <Dialog>

              <DialogTrigger asChild>
                <Button variant="destructive">
                  + Nova Despesa
                </Button>
              </DialogTrigger>

              <DialogContent className="max-w-2xl">

                <DialogHeader>
                  <DialogTitle>
                    Nova Despesa
                  </DialogTitle>
                </DialogHeader>

                <div className="grid grid-cols-2 gap-4 mt-4">

                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Tipo Despesa
                    </label>

                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>

                      <SelectContent>
                        <SelectItem value="racao">
                          Ração
                        </SelectItem>

                        <SelectItem value="energia">
                          Energia
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
                      Valor
                    </label>

                    <Input placeholder="R$ 0,00" />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Data de vencimento
                    </label>

                    <Input type="date" />
                  </div>

                  <div className="space-y-2 col-span-2">
                    <label className="text-sm font-medium">
                      Descrição
                    </label>

                    <Input placeholder="Descrição da despesa" />
                  </div>

                </div>

                <div className="flex justify-end gap-2 mt-6">

                  <Button variant="outline">
                    Cancelar
                  </Button>

                  <Button variant="destructive">
                    Salvar Despesa
                  </Button>

                </div>

              </DialogContent>

            </Dialog>

          </div>

          <Table>

            <TableHeader>

              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Lote</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Vencimento</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>

            </TableHeader>

            <TableBody>

              {despesas.map((item) => (

                <TableRow key={item.id}>

                  <TableCell>{item.data}</TableCell>

                  <TableCell className="font-medium">
                    {item.tipo}
                  </TableCell>

                  <TableCell>{item.lote}</TableCell>

                  <TableCell>{item.descricao}</TableCell>

                  <TableCell className="text-red-600 font-bold">
                    {item.valor}
                  </TableCell>

                  <TableCell>{item.vencimento}</TableCell>

                  <TableCell>
                    <Badge variant="secondary">
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