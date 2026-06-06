import { useState } from "react"

import FinanceiroTabela from "@/components/Financas/FinanceiroTabela"
import FinanceiroCards from "@/components/Financas/FinanceiroCards"
import ModalVenda from "@/components/Financas/ModalVenda"

export default function Producao() {

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
      titulo: "Ovos Produzidos",
      valor: "450 ovos",
      descricao: "Qunatidade de ovos produzidos contando a partir primeiro dia desse mês.",
      cor: "text-green-600",
    },
    {
      titulo: "Quilos de Carne de Corte Produzidos",
      valor: "410.50 kg",
      descricao: "Quantidade de quilos de carne produzida contando a partir primeiro dia desse mês.",
    },
    {
      titulo: "Quilos de Esterco Produzido",
      valor: "130 kg",
      descricao: "Quantidade de quilos de esterco produzido contando a partir primeiro dia desse mês.",
    },
    {
      titulo: "Quantidade de Pitinhos Nascidos",
      valor: "45 pinthinhos",
      descricao: "Quantidade de pintinhos nacidos contando a partir primeiro dia desse mês.",
    },  
    {
      titulo: "",
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

      <h1 className="text-4xl font-bold mb-6" style={{marginBottom:`40px`}}>
        Produção
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