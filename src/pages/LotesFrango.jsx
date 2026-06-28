import { useEffect, useState } from "react"

import Tabela from "@/components/Genericos/Tabela"
import CardsGrid from "@/components/Genericos/CardsGrid"
import FinanceiroCards from "@/components/Financas/FinanceiroCards"
import ModalForm from "@/components/Genericos/ModalForm"

import {
  listarLoteFrangos,
  criarLoteFrango,
  atualizarLoteFrango,
  deletarLoteFrango,
  cardsLoteFrango
} from "@/api/aviario/loteFrangoService"

import { listarStatusFrango } from "@/api/aviario/statusLoteFrangoService"
import { renderTextoColuna } from "@/components/utils/renderers"

export default function LotesFrango() {
  const [status, setStatus] = useState([])
  const [lotesFrango, setLotesFrango] = useState([])
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [loteSelecionado, setLoteSelecionado] = useState(null)
  const [cardsLoteFrangos, setCardsLoteFrangos] = useState(null)
  const [statusLoteFrango, setStatusLoteFrango] = useState([])

  async function carregarStatus() {
    const dados = await listarStatusFrango()
    setStatus(dados)
  }

  async function carregarLotes() {
    const dados = await listarLoteFrangos()
    setLotesFrango(dados)
  }

  async function carregarCards() {
    const dados = await cardsLoteFrango()
    setCardsLoteFrangos(dados)
  }

  async function carregarTudo() {
    try {
      await Promise.all([
        carregarStatus(),
        carregarLotes(),
        carregarCards()
      ])
    } finally {
      setLoading(false)
    }
  }

  const colunas = [
    { key: "id", label: "#" },
    { key: "status.nome", label: "STATUS" },
    { key: "identificacao", label: "IDENTIFICAÇÃO" },
    { key: "quantidade_inicial", label: "QTD INICIAL" },
    { key: "data_alojamento", label: "ALOJAMENTO" },
    { key: "fornecedor", label: "FORNECEDOR" },
    { key: "quantidade_atual", label: "QTD ATUAL" },
    {
      key: "observacao",
      label: "OBSERVAÇÃO",
      render: renderTextoColuna("observacao", 10)
    }
  ]

  const campos = [
    {
      name: "status_lote_frango_id",
      label: "Status",
      type: "select",
      options: status.map((s) => ({
        value: s.id,
        label: s.nome.toUpperCase()
      }))
    },
    {
      name: "identificacao",
      label: "Identificação",
      type: "text"
    },
    {
      name: "quantidade_inicial",
      label: "Qtd Inicial",
      type: "number",
      min: 0
    },
    {
      name: "data_alojamento",
      label: "Data Alojamento",
      type: "date"
    },
    {
      name: "fornecedor",
      label: "Fornecedor",
      type: "text"
    },
    {
      name: "quantidade_atual",
      label: "Qtd Atual",
      type: "number",
      min: 0
    },
    {
      name: "observacao",
      label: "Observação",
      type: "text"
    }
  ]

  function toNumber(v) {
    if (v === "" || v == null) return null

    const n = Number(v)

    return Number.isNaN(n) ? null : n
  }

  async function salvar(payload) {
    const data = {
      ...payload,
      status_lote_frango_id: toNumber(payload.status_lote_frango_id),
      quantidade_inicial: toNumber(payload.quantidade_inicial),
      quantidade_atual: toNumber(payload.quantidade_atual)
    }

    if (loteSelecionado) {
      await atualizarLoteFrango(loteSelecionado.id, data)
    } else {
      await criarLoteFrango(data)
    }

    setOpen(false)
    setLoteSelecionado(null)

    await Promise.all([
      carregarLotes(),
      carregarCards()
    ])
  }

  async function excluir(item) {
    await deletarLoteFrango(item.id)

    await Promise.all([
      carregarLotes(),
      carregarCards()
    ])
  }

  function novo() {
    setLoteSelecionado(null)
    setOpen(true)
  }

  function editar(item) {
    setLoteSelecionado({
      ...item,
      status_lote_frango_id: item.status?.id
    })

    setOpen(true)
  }

  useEffect(() => {
    carregarTudo()
  }, [])

  if (loading) {
    return <p>Carregando...</p>
  }

  return (
    <div className="p-6">
      <h1 className="text-4xl font-bold mb-6">
        Lotes de Frango
      </h1>

      <FinanceiroCards
        cards={[
          {
            titulo: "Total de Aves",
            valor: cardsLoteFrangos?.total_aves_lote_frango ?? 0,
            cor: "text-blue-600"
          },
          {
            titulo: "Mortalidade no Mês",
            valor: cardsLoteFrangos?.mortalidade_lote_frango ?? 0,
            cor: "text-red-600"
          },
          {
            titulo: "Lotes com Baixa Quantidade de aves",
            valor: cardsLoteFrangos?.baixa_quantidade_aves_lote_frango ?? 0,
            cor: "text-amber-600"
          },
        ]}
      />

      <CardsGrid
        dados={lotesFrango}
        placeholderBusca="Buscar lote de frango..."
        onNovo={novo}
        onEditar={editar}
        onExcluir={excluir}
        campos={[
          { key: "status.nome", label: "Status" },
          { key: "identificacao", label: "Identificação" },
          { key: "quantidade_atual", label: "Qtd Atual" },
          { key: "data_alojamento", label: "Alojamento" },
          {
            key: "observacao",
            label: "Obs",
            render: (item) => item.observacao?.slice(0, 40)
          }
        ]}
      />

      <ModalForm
        open={open}
        onOpenChange={setOpen}
        titulo={loteSelecionado ? "Editar Lote" : "Novo Lote"}
        campos={campos}
        dadosIniciais={loteSelecionado}
        onSalvar={salvar}
      />
    </div>
  )
}