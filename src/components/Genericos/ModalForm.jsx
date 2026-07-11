import { useEffect, useRef, useState } from "react"

import {
  Dialog, 
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function ModalForm({
  open,
  onOpenChange,
  onSalvar,
  titulo,
  campos,
  dadosIniciais,
}) {

  const [form, setForm] = useState({})
  const prevOpenRef = useRef(false)

  useEffect(() => {
    if (open && !prevOpenRef.current) {
      setForm(dadosIniciais || {})
    }
    prevOpenRef.current = open
  }, [dadosIniciais, open])

  function handleChange(nome, valor) {
    setForm((prev) => ({
      ...prev,
      [nome]: valor,
    }))
  }

  function handleSubmit() {

    for (const campo of campos) {

    if (!campo.required) continue

    const valor = form[campo.name]

    if (
      valor === undefined ||
      valor === null ||
      valor === ""
    ) {
      toast.warning(`O campo "${campo.label}" é obrigatório.`)
      return
    }
  }
  
    onSalvar(form)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      disablePointerDismissal
    >
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
              ) : campo.type === "date" ? (
                <input
                  type="date"
                  className="h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-base transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50"
                  value={form[campo.name] ?? ""}
                  onChange={(e) =>
                    handleChange(campo.name, e.target.value)
                  }
                />
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