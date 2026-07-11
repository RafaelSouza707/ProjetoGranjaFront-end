import { useEffect, useState } from "react"

import CardsGrid from "@/components/Genericos/CardsGrid"
import FinanceiroCards from "@/components/Financas/FinanceiroCards"
import ModalForm from "@/components/Genericos/ModalForm"
import { useNavigate } from "react-router-dom"

import { useParams } from "react-router-dom"

import {
  listarLoteFrangos,
  criarLoteFrango,
  atualizarLoteFrango,
  deletarLoteFrango,
} from "@/api/aviario/loteFrangoService"

import { cardsGranja } from "@/api/granja/granjaService"

import { listarStatusFrango } from "@/api/aviario/statusLoteFrangoService"

export default function LotesFrango() {

  const navigate = useNavigate()

  const [status, setStatus] = useState([])
  const [lotesFrango, setLotesFrango] = useState([])
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [loteSelecionado, setLoteSelecionado] = useState(null)
  const [cardsLoteFrangos, setCardsLoteFrangos] = useState(null)

  const { granjaId } = useParams()

  async function carregarStatus() {
    const dados = await listarStatusFrango(granjaId)
    setStatus(dados)
  }

  async function carregarLotes() {
    const dados = await listarLoteFrangos(granjaId)
    setLotesFrango(dados)
  }

  async function carregarCards() {
    const dados = await cardsGranja(granjaId)
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

  useEffect(() => {
    carregarTudo()
  }, [granjaId])

  const campos = [
    {
      name: "status_lote_frango_id",
      label: "Status",
      type: "select",
      options: status.map((s) => ({
        value: s.id,
        label: s.nome.toUpperCase()
      })),
      required: true
    },
    {
      name: "identificacao",
      label: "Identificação",
      type: "text",
      required: true
    },
    {
      name: "quantidade_inicial",
      label: "Qtd Inicial",
      type: "number",
      min: 0,
      required: true
    },
    {
      name: "data_alojamento",
      label: "Data Alojamento",
      type: "date",
      required: true
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
      min: 0,
      required: true
    },
    {
      name: "observacao",
      label: "Observação",
      type: "text",
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
      granja_id: Number(granjaId),
      status_lote_frango_id: toNumber(payload.status_lote_frango_id),
      quantidade_inicial: toNumber(payload.quantidade_inicial),
      quantidade_atual: toNumber(payload.quantidade_atual)
    }

    if (loteSelecionado) {
      await atualizarLoteFrango(
        loteSelecionado.id,
        data
      )
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
            valor: cardsLoteFrangos?.total_aves_granja ?? 0,
            cor: "text-blue-600"
          },
          {
            titulo: "Mortalidade no Mês",
            valor: cardsLoteFrangos?.mortalidade_granja_mes ?? 0,
            cor: "text-red-600"
          },
          {
            titulo: "Lotes com Baixa Quantidade de aves",
            valor:
              cardsLoteFrangos?.baixa_quantidade_aves_lote_frango ?? 0,
            cor: "text-amber-600"
          }
        ]}
      />

      <CardsGrid
        dados={lotesFrango}
        placeholderBusca="Buscar lote de frango..."
        onNovo={novo}
        onEditar={editar}
        onExcluir={excluir}
        onClickCard={(item) =>
          navigate(`/granja/${granjaId}/lotes_frangos/${item.id}`)
        }
        campos={[
          {
            key: "identificacao",
            label: "Identificação",
            render: (item) =>
              item.identificacao.toUpperCase()
          },
          {
            key: "status.nome",
            label: "Status"
          },
          {
            key: "quantidade_inicial",
            label: "Qtd Inicial"
          },
          {
            key: "quantidade_atual",
            label: "Qtd Atual"
          },
          {
            key: "data_alojamento",
            label: "Alojamento"
          },
          {
            key: "fornecedor",
            label: "Fornecedor"
          },
          {
            key: "observacao",
            label: "Obs",
            render: (item) =>
              item.observacao?.slice(0, 40)
          }
        ]}
      />

      <ModalForm
        open={open}
        onOpenChange={setOpen}
        titulo={
          loteSelecionado
            ? "Editar Lote"
            : "Novo Lote"
        }
        campos={campos}
        dadosIniciais={loteSelecionado}
        onSalvar={salvar}
      />
    </div>
  )
}