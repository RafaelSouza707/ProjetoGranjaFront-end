import { useState } from "react"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function ModalDespesa({
  open,
  onOpenChange,
  onSalvar,
}) {

  const [form, setForm] = useState({
    tipo_despesa_id: "",
    valor: "",
    data: "",
    data_vencimento: "",
    descricao: "",
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
            Nova Despesa
          </DialogTitle>

        </DialogHeader>

        <div className="grid grid-cols-2 gap-4">

          <div>
            <label>Tipo</label>

            <Input
              value={form.tipo_despesa_id}
              onChange={(e) =>
                setForm({
                  ...form,
                  tipo_despesa_id: e.target.value,
                })
              }
            />
          </div>

          <div>
            <label>Valor</label>

            <Input
              value={form.valor}
              onChange={(e) =>
                setForm({
                  ...form,
                  valor: e.target.value,
                })
              }
            />
          </div>

          <div>
            <label>Data</label>

            <Input
              type="date"
              value={form.data}
              onChange={(e) =>
                setForm({
                  ...form,
                  data: e.target.value,
                })
              }
            />
          </div>

          <div>
            <label>Vencimento</label>

            <Input
              type="date"
              value={form.data_vencimento}
              onChange={(e) =>
                setForm({
                  ...form,
                  data_vencimento: e.target.value,
                })
              }
            />
          </div>

          <div className="col-span-2">

            <label>Descrição</label>

            <Input
              value={form.descricao}
              onChange={(e) =>
                setForm({
                  ...form,
                  descricao: e.target.value,
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