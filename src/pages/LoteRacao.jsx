import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { Scale, TrendingDown, Clock, AlertCircle } from "lucide-react"

import Tabela from "@/components/Genericos/Tabela"
import ModalForm from "@/components/Genericos/ModalForm"
import { listarLoteRacoes, criarLoteRacao, atualizarLoteRacao, deletarLoteRacao, listarCardsLoteRacao } from "@/api/aviario/loteRacaoService"
import { listarTipoRacao } from "@/api/aviario/tipoRacaoService"
import { formatarQuilos } from "@/components/utils/FormatarQuilos"
import { handleApiError } from "@/utils/handleApiError"

export default function LoteRacao() {
  const { granjaId } = useParams()

  const [loteRacao, setLoteRacao] = useState([])
  const [tipoRacao, setTipoRacao] = useState([])
  const [cardLoteRacao, setCardLoteRacao] = useState(null)
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [loteRacaoSelecionado, setLoteRacaoSelecionado] = useState(null)

  async function carregarDados() {
    try {
      await Promise.all([
        carregarLoteRacao(),
        carregarCards(),
        carregarTipoRacao(),
      ])
    } finally {
      setLoading(false)
    }
  }

  async function carregarLoteRacao() {
    try {
      const dados = await listarLoteRacoes(granjaId)
      setLoteRacao(dados ?? [])
    } catch (error) {
      handleApiError(error)
    }
  }

  async function carregarTipoRacao() {
    try {
      const dados = await listarTipoRacao(granjaId)
      setTipoRacao(dados ?? [])
    } catch (error) {
      handleApiError(error)
    }
  }

  async function carregarCards() {
    try {
      const dados = await listarCardsLoteRacao(granjaId)
      setCardLoteRacao(dados ?? {})
    } catch (error) {
      handleApiError(error)
    }
  }

  useEffect(() => {
    carregarDados()
  }, [granjaId])

  const colunas = [
    { key: "id", label: "#" },
    { key: "tipo_racao.nome", label: "TIPO DE RAÇÃO", render: (item) => item.tipo_racao?.nome?.toUpperCase() ?? "-" },
    { key: "fornecedor", label: "FORNECEDOR", render: (item) => item.fornecedor?.toUpperCase() ?? "-" },
    { key: "quilos", label: "QUILOS", render: (item) => formatarQuilos(item.quilos) },
  ]

  const campos = [
    {
      name: "tipo_racao_id",
      label: "Tipo de Ração",
      type: "select",
      options: tipoRacao.map(t => ({ value: t.id, label: t.nome.toUpperCase() })),
      required: true
    },
    { name: "fornecedor", label: "Fornecedor", type: "text" },
    { name: "quilos", label: "Quilos", type: "number", min: 0, required: true },
  ]

  function toNumberOrNull(value) {
    if (value === "" || value === null || value === undefined) return null
    const n = Number(value)
    return isNaN(n) ? null : n
  }

  async function apagarLoteRacao(id) {
    try {
      await deletarLoteRacao(id, granjaId)
      await carregarLoteRacao()
      await carregarCards()
    } catch (error) {
      handleApiError(error)
    }
  }

  async function novoLoteRacao() {
    setLoteRacaoSelecionado(null)
    setOpen(true)
  }

  function editarLoteRacao(item) {
    setLoteRacaoSelecionado({
      ...item,
      tipo_racao_id: item.tipo_racao?.id,
    })
    setOpen(true)
  }

  async function salvarLoteRacao(payload) {
    try {
      const dados = {
        ...payload,
        tipo_racao_id: toNumberOrNull(payload.tipo_racao_id),
        quilos: toNumberOrNull(payload.quilos),
        granja_id: toNumberOrNull(granjaId)
      }

      if (loteRacaoSelecionado) {
        await atualizarLoteRacao(loteRacaoSelecionado.id, granjaId, dados)
      } else {
        await criarLoteRacao(granjaId, dados)
      }

      setOpen(false)
      setLoteRacaoSelecionado(null)

      await carregarLoteRacao()
      await carregarCards()
    } catch (error) {
      handleApiError(error)
    }
  }

  if (loading) {
    return <div className="p-4 text-xs text-slate-400">Carregando lotes de ração...</div>
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight">Lotes de Ração</h1>
        <p className="text-sm text-muted-foreground">Controle de estoque, consumo e previsão de suprimentos.</p>
      </div>
      
      {/* CARDS DE MÉTRICAS COMPACTOS E VISUAIS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        
        {/* Estoque */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-xs font-medium text-slate-500">Estoque de Ração</span>
            <p className="text-lg font-bold text-red-600">{formatarQuilos(cardLoteRacao?.quantidade_total_racao_granja ?? 0)}</p>
            <span className="text-[10px] text-slate-400">Distribuídos em {cardLoteRacao?.quantidade_lotes_racao ?? 0} lotes</span>
          </div>
          <div className="p-2.5 bg-red-50 rounded-full text-red-600">
            <Scale className="size-5" />
          </div>
        </div>

        {/* Consumo do Mês */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-xs font-medium text-slate-500">Consumo do Mês</span>
            <p className="text-lg font-bold text-slate-900">{formatarQuilos(cardLoteRacao?.total_consumido_mes?.mes ?? 0)}</p>
            <span className="text-[10px] text-slate-400">Média: {formatarQuilos(cardLoteRacao?.total_consumido_mes?.diaria ?? 0)}/dia</span>
          </div>
          <div className="p-2.5 bg-slate-100 rounded-full text-slate-600">
            <TrendingDown className="size-5" />
          </div>
        </div>

        {/* Menor Lote */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-xs font-medium text-slate-500">Menor Lote em Estoque</span>
            <p className="text-base font-bold text-amber-600 truncate max-w-[140px]" title={cardLoteRacao?.lote_menor_quantiade?.tipo_racao}>
              {cardLoteRacao?.lote_menor_quantiade?.tipo_racao || "N/D"}
            </p>
            <span className="text-[10px] text-slate-400">Restante: {formatarQuilos(cardLoteRacao?.lote_menor_quantiade?.quantidade ?? 0)}</span>
          </div>
          <div className="p-2.5 bg-amber-50 rounded-full text-amber-600">
            <AlertCircle className="size-5" />
          </div>
        </div>

        {/* Previsão */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-xs font-medium text-slate-500">Previsão de Fim do Estoque</span>
            <p className="text-lg font-bold text-blue-600">{cardLoteRacao?.previsao ? `${cardLoteRacao.previsao} dias` : "N/D"}</p>
            <span className="text-[10px] text-slate-400">Estimativa superficial *</span>
          </div>
          <div className="p-2.5 bg-blue-50 rounded-full text-blue-600">
            <Clock className="size-5" />
          </div>
        </div>

      </div>

      <Tabela
        dados={loteRacao}
        colunas={colunas}
        placeholderBusca="Buscar lote de ração..."
        textoBotao="+ Novo Lote de Ração"
        onNovo={novoLoteRacao}
        onEditar={editarLoteRacao}
        onExcluir={(item) => apagarLoteRacao(item.id)}
      />

      <ModalForm
        open={open}
        onOpenChange={setOpen}
        titulo={loteRacaoSelecionado ? "Editar Lote de Ração" : "Novo Lote de Ração"}
        campos={campos}
        dadosIniciais={loteRacaoSelecionado}
        onSalvar={salvarLoteRacao}
      />
    </div>
  )
}