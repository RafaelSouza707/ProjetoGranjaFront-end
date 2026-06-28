import { useState } from "react"

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

import {
  Pencil,
  Trash2,
} from "lucide-react"

function getValue(obj, path) {
  return path.split(".").reduce((acc, part) => acc?.[part], obj)
}

export default function Tabela({
  dados,
  colunas,
  placeholderBusca,
  textoBotao,
  onNovo,
  onEditar,
  onExcluir,
}) {
  const [busca, setBusca] = useState("")

  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" })

  function handleSort(key) {
    setSortConfig((prev) => {
      if (prev.key === key) {
        return {
          key,
          direction: prev.direction === "asc" ? "desc" : "asc"
        }
      }
      return { key, direction: "asc" }
    })
  }

  const dadosFiltrados = (dados || []).filter((item) => {
    if (!busca) return true
    return JSON.stringify(item).toLowerCase().includes(busca.toLowerCase())
  })

  const dadosOrdenados = [...dadosFiltrados].sort((a, b) => {
    if (!sortConfig.key) return 0

    let aValue = getValue(a, sortConfig.key)
    let bValue = getValue(b, sortConfig.key)

    const isNumeric =
      !isNaN(aValue) &&
      !isNaN(bValue) &&
      aValue !== "" &&
      bValue !== ""

    if (isNumeric) {
      aValue = Number(aValue)
      bValue = Number(bValue)
    }

    if (aValue == null) return 1
    if (bValue == null) return -1

    if (typeof aValue === "number" && typeof bValue === "number") {
      return sortConfig.direction === "asc" ? aValue - bValue : bValue - aValue
    }

    return sortConfig.direction === "asc"
      ? String(aValue).localeCompare(String(bValue))
      : String(bValue).localeCompare(String(aValue))
  })

  return (
    <Card>
      <CardContent className="p-6 space-y-4">

        <div className="flex justify-between items-center">
          <Input
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder={placeholderBusca}
            className="w-72"
          />

          {onNovo && (
            <Button onClick={onNovo}>
              {textoBotao ?? "Novo"}
            </Button>
          )}
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              {colunas.map((coluna) => (
                <TableHead
                  key={coluna.key}
                  className={"cursor-pointer " + (coluna.className || "")}
                  onClick={() => handleSort(coluna.key)}
                >
                  {coluna.label}
                  {sortConfig.key === coluna.key &&
                    (sortConfig.direction === "asc" ? " ▲" : " ▼")}
                </TableHead>
              ))}

              <TableHead className="w-24 text-center">
                Ações
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {dadosOrdenados.map((item) => (
              <TableRow key={item.id}>
                {colunas.map((coluna) => (
                  <TableCell
                    key={coluna.key}
                    className={coluna.className}
                  >
                    {coluna.render
                      ? coluna.render(item)
                      : getValue(item, coluna.key)}
                  </TableCell>
                ))}

                <TableCell>
                  <div className="flex justify-center gap-1">

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEditar(item)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onExcluir(item)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>

                  </div>
                </TableCell>

              </TableRow>
            ))}
          </TableBody>

        </Table>

      </CardContent>
    </Card>
  )
}