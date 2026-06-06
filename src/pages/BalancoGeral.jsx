import { useState } from "react"

import FinanceiroTabela from "@/components/Financas/FinanceiroTabela"
import FinanceiroCards from "@/components/Financas/FinanceiroCards"
import ModalVenda from "@/components/Financas/ModalVenda"

export default function BalancoGeral() {

  const [open, setOpen] = useState(false)

  const vendas = [
    {
      id: "1",
      tipo: "Venda",
      data: "01-06-2000",
      valor_total: "200,00"
    }
  ]

  const cards = [
    {
      titulo: "Lucro no Mês",
      valor: "R$ 15.230",
      descricao: "Lucro liquido contando a partir primeiro dia desse mês.",
      cor: "text-green-600",
    },
    {
      titulo: "Quantidade de Vendas",
      valor: 34,
    },
    {
      titulo: "Ticket Médio",
      valor: "R$ 448",
    },
    {
      titulo: "Total em Receitas",
      valor: "R$ 2.350",
    },  
    {
      titulo: "Total em Despesas",
      valor: "R$ 2.350",
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
      key: "data",
      label: "Data",
    },
    {
      key: "valor_total",
      label: "Valor",
    },
  ]

  function salvarVenda(payload) {
    console.log(payload)
  }

  return (
    <div className="p-6">
      <h1 className="text-4xl font-bold mb-6">
        Banlanço Geral
      </h1>
      
      <FinanceiroCards cards={cards} />

      <FinanceiroTabela
        dados={vendas}
        colunas={colunas}
        placeholderBusca="Buscar venda..."
        textoBotao="+ Nova Venda"
        onNovo={() => setOpen(true)}
      />

      <ModalVenda
        open={open}
        onOpenChange={setOpen}
        onSalvar={salvarVenda}
      />

    </div>
  )
}