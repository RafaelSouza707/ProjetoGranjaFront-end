import { useState } from "react"

import FinanceiroTabela from "@/components/Genericos/Tabela"
import FinanceiroCards from "@/components/Financas/FinanceiroCards"
import ModalForm from "@/components/Genericos/ModalForm"

export default function Estoque() {

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
      key: "unidade_medida",
      label: "Unidade de Medida",
    },
    {
      key: "quantidade_produto",
      label: "Quantidde",
    },
  ]

  const vendas = [
    {
      id: "1",
      tipo: "Ovo",
      unidade_medida: "Grande",
      quantidade_produto: "200"
    }
  ]

  const cards = [
    {
      titulo: "Total Vendido",
      valor: "R$ 15.230",
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
      titulo: "Maior Venda",
      valor: "R$ 2.350",
    },
  ]


  const camposVenda = [
    {
      name: "cliente_id",
      label: "Cliente",
    },
    {
      name: "data_venda",
      label: "Data",
      type: "date",
    },
    { 
      name: "valor_total",
      label: "Valor Total",
    },
  ]

  const [open, setOpen] = useState(false)

  const [vendaSelecionada, setVendaSelecionada] = useState(null)

  function novaVenda() {
    setVendaSelecionada(null)
    setOpen(true)
  }

  function editarVenda(venda) {
    setVendaSelecionada(venda)
    setOpen(true)
  }

  function salvarVenda(payload) {
    console.log(payload)
  }

  return (
    <div className="p-6">
      <h1 className="text-4xl font-bold mb-6">
        Estoque
      </h1>
    
      <FinanceiroCards cards={cards} />

      <FinanceiroTabela
        dados={vendas}
        colunas={colunas}
        placeholderBusca="Buscar venda..."
        textoBotao="+ Nova Venda"
        onNovo={novaVenda}
        onEditar={editarVenda}
        onExcluir={ (item) => console.log("Excluir", item) }
      />

      <ModalForm
        open={open}
        onOpenChange={setOpen}
        titulo={
          vendaSelecionada
            ? "Editar Venda"
            : "Nova Venda"
        }
        campos={camposVenda}
        dadosIniciais={vendaSelecionada}
        onSalvar={salvarVenda}
      />
    </div>
  )
}