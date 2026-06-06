import { useState } from "react"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function ModalVenda({
  open,
  onOpenChange,
  onSalvar,
}) {

  const [form, setForm] = useState({
    cliente_id: "",
    data_venda: "",
    valor_total: "",
  })

  function handleSubmit() {
    onSalvar(form)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >

      <DialogContent className="max-w-xl">

        <DialogHeader>

          <DialogTitle>
            Nova Venda
          </DialogTitle>

        </DialogHeader>

        <div className="grid grid-cols-2 gap-4">

          <div>
            <label>Cliente</label>

            <Input
              value={form.cliente_id}
              onChange={(e) =>
                setForm({
                  ...form,
                  cliente_id: e.target.value,
                })
              }
            />
          </div>

          <div>
            <label>Data</label>

            <Input
              type="date"
              value={form.data_venda}
              onChange={(e) =>
                setForm({
                  ...form,
                  data_venda: e.target.value,
                })
              }
            />
          </div>

          <div className="col-span-2">

            <label>Valor Total</label>

            <Input
              value={form.valor_total}
              onChange={(e) =>
                setForm({
                  ...form,
                  valor_total: e.target.value,
                })
              }
            />

          </div>

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