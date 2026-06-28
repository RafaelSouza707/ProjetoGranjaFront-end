import { useEffect, useState } from "react"

import {
  Dialog, 
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function ModalForm({
  open,
  onOpenChange,
  onSalvar,
  titulo,
  campos,
  dadosIniciais = {},
}) {

  const [form, setForm] = useState({})

  useEffect(() => {
    setForm(dadosIniciais || {})
  }, [dadosIniciais, open])

  function handleChange(nome, valor) {
    setForm((prev) => ({
      ...prev,
      [nome]: valor,
    }))
  }

  function handleSubmit() {
    onSalvar(form)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">

        <DialogHeader>
          <DialogTitle>
            {titulo}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4">

          {campos.map((campo) => (
            <div
              key={campo.name}
              className={campo.colSpan ? "col-span-2" : ""}
            >
              <label className="text-sm font-medium">
                {campo.label}
              </label>

              {campo.type === "select" ? (
                <select
                  className="w-full border rounded px-2 py-2"
                  value={form[campo.name] ?? ""}
                  onChange={(e) =>
                    handleChange(campo.name, e.target.value)
                  }
                >
                  <option value="">Selecione</option>

                  {campo.options?.map((opt) => (
                    <option
                      key={opt.value}
                      value={opt.value}
                    >
                      {opt.label}
                    </option>
                  ))}
                </select>
              ) : (
                <Input
                  type={campo.type || "text"}
                  min={campo.min}
                  value={form[campo.name] ?? ""}
                  onChange={(e) =>
                    handleChange(
                      campo.name,
                      e.target.value
                    )
                  }
                />
              )}

            </div>
          ))}

        </div>

        <div className="flex justify-end gap-2 mt-6">

          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancelar
          </Button>
          <Button onClick={handleSubmit}>
            Salvar
          </Button>

        </div>

      </DialogContent>
    </Dialog>
  )
}