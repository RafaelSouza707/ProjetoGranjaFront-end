import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { TbPaperBag } from "react-icons/tb";

import { CTooltip } from "@coreui/react"

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
  Settings,
  Bird,
  ClipboardList,
  DollarSign,
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
  onConfigurar,
  onTelaLotesFrangos,
  onProdutos,
  onFinancas,
  onLoteRacao,
  acoes,
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
                    {onTelaLotesFrangos && (
                      <CTooltip content="Lote de Frangos">
                        <Button
                        variant="ghost"
                        size="icon"
                        className="h-15 w-15"
                        onClick={() => onTelaLotesFrangos(item)}
                        >
                          <Bird className="h-4 w-4"/>
                        </Button>
                      </CTooltip>
                      )
                    }

                    {onProdutos &&(
                      <CTooltip content="Produtos">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-15 w-15"
                          onClick={() => onProdutos(item)}
                        >
                          <ClipboardList className="h-4 w-4" />
                        </Button>
                      </CTooltip>
                    )}

                    {onFinancas && (
                      <CTooltip content="Finanças">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-15 w-15"
                          onClick={() => onFinancas(item)}
                        >
                          <DollarSign className="h-4 w-4" />
                        </Button>
                      </CTooltip>
                    )}

                    {onLoteRacao && (
                      <CTooltip content="Lote de Ração">
                        <Button
                        variant="ghost"
                        size="icon"
                        className={"h-15 w-15"}
                        onClick={() => onLoteRacao(item)}
                        >
                        <TbPaperBag className="h-4 w-4" />
                        </Button>
                      </CTooltip>
                    )}

                    {onEditar && (
                      <CTooltip content="Editar nome da Granja">
                        <Button
                        variant="ghost"
                          size="icon"
                          className="h-15 w-15"
                          onClick={() => onEditar(item)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </CTooltip>
                    )}

                    {onExcluir && (
                      <CTooltip content="Excluir">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-15 w-15"
                          onClick={() => onExcluir(item)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </CTooltip>
                    )}


                    {
                      onConfigurar && (
                        <CTooltip content="Configuração">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-15 w-15"
                            onClick={() => onConfigurar(item)}
                          >
                            <Settings className="h-4 w-4"/>
                          </Button>
                        </CTooltip>
                      )
                    }

                    {acoes?.(item)?.map((acao, index) => (
                      <CTooltip
                        key={index}
                        content={acao.tooltip}
                      >
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-15 w-15"
                          onClick={acao.onClick}
                        >
                          {acao.icon}
                        </Button>
                      </CTooltip>
                    ))}

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