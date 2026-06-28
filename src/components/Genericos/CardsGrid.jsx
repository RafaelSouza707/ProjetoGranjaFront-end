import { useState } from "react"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

function getValue(obj, path) {
  return path.split(".").reduce((acc, part) => acc?.[part], obj)
}

export default function CardsGrid({
  dados,
  campos,
  placeholderBusca,
  onNovo,
  onEditar,
  onExcluir,
}) {
  const [busca, setBusca] = useState("")

  const filtrados = (dados || []).filter((item) => {
    if (!busca) return true
    return JSON.stringify(item).toLowerCase().includes(busca.toLowerCase())
  })

  return (
    <div className="space-y-4">

      <div className="flex justify-between items-center">
        <Input
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder={placeholderBusca}
          className="w-72"
        />

        {onNovo && (
          <Button onClick={onNovo}>
            + Novo
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {filtrados.map((item) => (
          <Card key={item.id} className="shadow-sm bg-gray-10 border rounded-xl">

            <CardContent className="p-4 space-y-2">

              {campos.map((campo) => (
                <div key={campo.key} className="flex justify-between text-sm">
                  <span className="font-medium">
                    {campo.label}
                  </span>

                  <span className="text-muted-foreground">
                    {campo.render
                      ? campo.render(item)
                      : getValue(item, campo.key)}
                  </span>
                </div>
              ))}

              <div className="flex justify-end gap-2 pt-2">

                {onEditar && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onEditar(item)}
                  >
                    Editar
                  </Button>
                )}

                {onExcluir && (
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => onExcluir(item)}
                  >
                    Excluir
                  </Button>
                )}

              </div>

            </CardContent>
          </Card>
        ))}

      </div>
    </div>
  )
}