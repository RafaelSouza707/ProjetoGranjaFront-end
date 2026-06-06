import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import {
  Card,
  CardContent,
} from "@/components/ui/card"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export default function FinanceiroTabela({
  dados,
  colunas,
  placeholderBusca,
  textoBotao,
  onNovo,
}) {
  return (
    <Card>

      <CardContent className="p-6 space-y-4">

        <div className="flex justify-between items-center">

          <Input
            placeholder={placeholderBusca}
            className="w-72"
          />

          <Button onClick={onNovo}>
            {textoBotao}
          </Button>

        </div>

        <Table>

          <TableHeader>

            <TableRow>

              {colunas.map((coluna) => (
                <TableHead key={coluna.key}>
                  {coluna.label}
                </TableHead>
              ))}

            </TableRow>

          </TableHeader>

          <TableBody>

            {dados.map((item) => (

              <TableRow key={item.id}>

                {colunas.map((coluna) => (

                  <TableCell key={coluna.key}>

                    {coluna.render
                      ? coluna.render(item)
                      : item[coluna.key]}

                  </TableCell>

                ))}

              </TableRow>

            ))}

          </TableBody>

        </Table>

      </CardContent>

    </Card>
  )
}