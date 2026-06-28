import { useState } from "react"

import FinanceiroTabela from "@/components/Genericos/Tabela"
import FinanceiroCards from "@/components/Financas/FinanceiroCards"
import ModalForm from "@/components/Genericos/ModalForm"

export default function Producao() {

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

  const producoes = [
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

  const camposProducao = [
    {
      name: "lote_frango_id",
      label: "Lote Produtor"
    },
    {
      name: "produto_id",
      label: "Produto",
    },
    {
      name: "quantidade",
      label: "Quantidade",
    },
    {
      name: "dt_producao",
      label: "Data de Produção"
    },
    {
      name: "observacao",
      label: "Observação"
    }
  ]

  const [open, setOpen] = useState(false)

  const [producaoSelecionada, setProducaoSelecionada] = useState(null)

  function novaProducao() {
    setProducaoSelecionada(null)
    setOpen(true)
  }

  function editarProducao(venda) {
    setProducaoSelecionada(venda)
    setOpen(true)
  }

  function salvarProducao(payload) {
    console.log(payload)
  }

  return (
    <div className="p-6">

      <h1 className="text-4xl font-bold mb-6">
        Produção
      </h1>

      <FinanceiroCards cards={cards} />

      <FinanceiroTabela
        dados={producoes}
        colunas={colunas}
        placeholderBusca="Buscar produção..."
        textoBotao="+ Inserir Produção"
        onNovo={novaProducao}
        onEditar={editarProducao}
        onExcluir={ (item) => console.log("Excluir", item) }
      />
      
      <ModalForm
        open={open}
        onOpenChange={setOpen}
        titulo={
          producaoSelecionada
            ? "Editar Produção"
            : "Inserir produção"
        }
        campos={camposProducao}
        dadosIniciais={producaoSelecionada}
        onSalvar={salvarProducao}
      />
      
    </div>
  )
}