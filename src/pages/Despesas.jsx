import { useState } from "react"

import FinanceiroTabela from "@/components/Financas/FinanceiroTabela"
import FinanceiroCards from "@/components/Financas/FinanceiroCards"
import ModalDespesa from "@/components/Financas/ModalDespesa"

export default function Despesas() {

  const [open, setOpen] = useState(false)

  const despesas = [
    {
      id: 11,
      tipo: "Cavalo",
      valor: "100,00",
      data_vencimento: "2026/06/10"
    },
    {
      id: 11,
      tipo: "Cavalo",
      valor: "100,00",
      data_vencimento: "2026/06/10"
    },
    {
      id: 11,
      tipo: "Cavalo",
      valor: "100,00",
      data_vencimento: "2026/06/10"
    },
    {
      id: 11,
      tipo: "Cavalo",
      valor: "100,00",
      data_vencimento: "2026/06/10"
    },
    {
      id: 11,
      tipo: "Cavalo",
      valor: "100,00",
      data_vencimento: "2026/06/10"
    },
    {
      id: 11,
      tipo: "Cavalo",
      valor: "100,00",
      data_vencimento: "2026/06/10"
    },
    {
      id: 11,
      tipo: "Cavalo",
      valor: "100,00",
      data_vencimento: "2026/06/10"
    },
    {
      id: 11,
      tipo: "Cavalo",
      valor: "100,00",
      data_vencimento: "2026/06/10"
    },
    {
      id: 11,
      tipo: "Cavalo",
      valor: "100,00",
      data_vencimento: "2026/06/10"
    },

  ]
  const cards = [
    {
      titulo: "Total Gasto no Mês",
      valor: "R$ 9.112",
      cor: "text-red-600",
    },
    {
      titulo: "Maior Gasto",
      valor: "R$ 2.350",
      descricao: "Ração",
    },
  ]

  const colunas = [
    {
      key: "id",
      label: "#",
    },
    {
      key: "tipo",
      label: "Tipo",
    },
    {
      key: "valor",
      label: "Valor",
    },
    {
      key: "data_vencimento",
      label: "Vencimento",
    },
    {
      key: "status",
      label: "Status",
    }
  ]

  function salvarDespesa(payload) {
    console.log(payload)
  }

  return (
    <div className="p-6">
      
      <h1 className="text-4xl font-bold mb-6">
        Despesas
      </h1>
      
      <FinanceiroCards cards={cards} />

      <FinanceiroTabela
        dados={despesas}
        colunas={colunas}
        placeholderBusca="Buscar despesa..."
        textoBotao="+ Nova Despesa"
        onNovo={() => setOpen(true)}
      />

      <ModalDespesa
        open={open}
        onOpenChange={setOpen}
        onSalvar={salvarDespesa}
      />

    </div>
  )
}