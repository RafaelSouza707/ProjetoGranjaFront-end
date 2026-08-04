import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"

import Tabela from "@/components/Genericos/Tabela"
import ModalForm from "@/components/Genericos/ModalForm"
import { ArrowUpCircle, DollarSign, TrendingUp } from "lucide-react"
import ConfirmDialog from "@/components/Genericos/ConfirmDialog"
import { Button } from "@/components/ui/button"

import { formatarMoeda } from "@/utils/formatters"
import { handleApiError } from "@/utils/handleApiError"

import {
  listarReceitas,
  criarReceita,
  atualizarReceita,
  deletarReceita,
  cardReceitaGranja
} from "@/api/financas/receitaService"

import { listarTiposReceitas } from "@/api/financas/tipoReceitaService"
import { listarStatusFinancas } from "@/api/financas/statusFinancasService"
import { listarVendas } from "@/api/venda_Estoque/vendaService"

export default function Receitas() {
  const { granjaId } = useParams()
  
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState(null)

  const [open, setOpen] = useState(false)
  const [openDelete, setOpenDelete] = useState(false)
  const [itemParaDeletar, setItemParaDeletar] = useState(null)

  const [receitas, setReceitas] = useState([])
  const [receitaSelecionada, setReceitaSelecionada] = useState(null)
  const [tipoReceita, setTipoReceita] = useState([])
  const [statusFinancas, setStatusFinancas] = useState([])
  const [vendas, setVenda] = useState(null)

  const [cardsReceitas, setCardsReceitas] = useState(null)

  const [filtroDataInicio, setFiltroDataInicio] = useState("")
  const [filtroDataFim, setFiltroDataFim] = useState("")
  const [filtroTipoReceitaId, setFiltroTipoReceitaId] = useState("")
  const [filtroStatusFinancasId, setFiltroStatusFinancasId] = useState("")
  const [termoBusca, setTermoBusca] = useState("")
  const [filtrosAtivos, setFiltrosAtivos] = useState({})

  function toNumberOrNull(value) {
    if (value === "" || value === null || value === undefined) {
      return null
    }

    const n = Number(value)
    return isNaN(n) ? null : n
  }

  async function carregarDados() {
    await Promise.all([
      carregarCards(),
      carregarTiposReceita(),
      carregarVendas(),
      carregarStatusFinancas(),
    ])
  }

  async function carregarVendas() {
    try {
      const dados = await listarVendas(granjaId)
      setVenda(dados)
    } catch (error) {
      handleApiError(error)
    }
  }

  async function carregarTiposReceita() {
    try {
      const dados = await listarTiposReceitas(granjaId)
      setTipoReceita(dados ?? [])
    } catch (error) {
      handleApiError(error)
    }
  }

  async function carregarStatusFinancas() {
    try {
      const dados = await listarStatusFinancas(granjaId)
      setStatusFinancas(dados ?? [])
    } catch (error) {
      handleApiError(error)
    }
  }

  async function carregarReceitas() {
    try {
      const params = { pagina: page, ...filtrosAtivos }
      if (termoBusca) params.search = termoBusca

      const dados = await listarReceitas(granjaId, params)
      setReceitas(dados.dados ?? [])
      setPagination(dados.pagination)
    } catch (error) {
      handleApiError(error)
    }
  }

  function aplicarFiltros(e) {
    e?.preventDefault()
    setPage(1)
    setFiltrosAtivos({
      ...(filtroDataInicio && { "data__gte": filtroDataInicio }),
      ...(filtroDataFim && { "data__lte": filtroDataFim }),
      ...(filtroTipoReceitaId && { "tipo_receita_id": Number(filtroTipoReceitaId) }),
      ...(filtroStatusFinancasId && { "status_financas_id": Number(filtroStatusFinancasId) }),
    })
  }

  function handleSearch(termo) {
    setTermoBusca(termo)
    setPage(1)
  }

  async function carregarCards() {
    try {
      const dados = await cardReceitaGranja(granjaId)
      setCardsReceitas(dados)
    } catch (error) {
      handleApiError(error)
    }
  }

  function novaReceita() {
    setReceitaSelecionada(null)
    setOpen(true)
  }

  function editarReceita(receita) {
    setReceitaSelecionada(receita)
    setOpen(true)
  }

  function solicitarExclusao(item) {
    setItemParaDeletar(item)
    setOpenDelete(true)
  }

  async function apagarReceita() {
    if (!itemParaDeletar) return
    try {
      await deletarReceita(itemParaDeletar.id, granjaId)

      setOpenDelete(false)
      setItemParaDeletar(null)

      await carregarReceitas()
      await carregarCards()
    } catch (error) {
      handleApiError(error)
    }
  }

  async function salvarReceita(payload) {
    try {
      const dados = {
        ...payload,
        tipo_receita_id: toNumberOrNull(payload.tipo_receita_id),
        status_financas_id: toNumberOrNull(payload.status_financas_id),
        venda_id: toNumberOrNull(payload.venda_id),
        granja_id: Number(granjaId),
      }

      if (receitaSelecionada) {
        await atualizarReceita(
          receitaSelecionada.id,
          granjaId,
          dados
        )
      } else {
        await criarReceita(
          granjaId,
          dados
        )
      }

      setOpen(false)
      setReceitaSelecionada(null)

      await carregarReceitas()
      await carregarCards()
      
    } catch (error) {
      handleApiError(error)
    }
  }

  const campos = [
    {
      name: "tipo_receita_id",
      label: "Tipo de Receita",
      type: "select",
      options: tipoReceita.map(t => ({
        value: t.id,
        label: t.nome.toUpperCase()
      }))
    },
    {
      name: "status_financas_id",
      label: "Status",
      type: "select",
      options: statusFinancas.map(s => ({
        value: s.id,
        label: s.nome.toUpperCase()
      }))
    },
    {
      name: "data",
      label: "Data da Receita",
      type: "date"
    },
    {
      name: "valor",
      label: "Valor",
      type: "number",
    },
    {
      name: "descricao",
      label:"Descrição",
      type: "text",
      maxLength: 256
    }
  ]

  const colunas = [
    {
      key: "id",
      label: "#",
    },
    {
      key: "tipo_receita.nome",
      label: "TIPO DE RECEITA",
      render: (item) => item.tipo_receita?.nome?.toUpperCase() ?? "-"
    },
    {
      key: "status.nome",
      label: "STATUS",
      render: (item) => item.status?.nome?.toUpperCase() ?? "-"
    },
    {
      key: "venda.tipo.nome",
      label: "TIPO DE VENDA",
      render: (item) => item.venda?.tipo?.nome ?? "Receita Direta"
    },
    {
      key: "data",
      label: "DATA",
      render: (item) => item.data ? new Date(item.data).toLocaleDateString('pt-BR', {timeZone: 'UTC'}) : "-"
    },
    {
      key: "valor",
      label: "VALOR",
      render: (item) => formatarMoeda(item.valor),
    },
    {
      key: "descricao",
      label: "DESCRIÇÃO",
      render: (item) => item.descricao ?? "-"
    },
  ]

  useEffect(() => {
    carregarDados()
  }, [granjaId])

  useEffect(() => {
    if (!granjaId) return
    carregarReceitas()
  }, [granjaId, page, filtrosAtivos])
  
  return (
    <div className="p-6">
      <h1 className="text-4xl font-bold mb-6">
        Receitas
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-sm font-medium text-slate-500">Total Arrecadado no Mês</span>
            <p className="text-2xl font-bold text-green-600">
              {formatarMoeda(
                cardsReceitas?.card_receita_valor_total_venda_mes_granja ?? cardsReceitas?.card_receita_valor_total_venda_mes_graja ?? 0
              )}
            </p>
            <span className="text-xs text-slate-400">Entradas gerais do mês atual</span>
          </div>
          <div className="p-3 bg-green-50 rounded-full text-green-600">
            <ArrowUpCircle className="size-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-sm font-medium text-slate-500">Total de Receitas no Mês</span>
            <p className="text-2xl font-bold text-slate-900">
              {cardsReceitas?.card_receita_total_vendas_mes_granja ?? 0}
            </p>
            <span className="text-xs text-slate-400">Quantidade de registros</span>
          </div>
          <div className="p-3 bg-emerald-50 rounded-full text-emerald-600">
            <DollarSign className="size-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-sm font-medium text-slate-500">Maior Receita no Mês</span>
            <p className="text-2xl font-bold text-green-600">
              {formatarMoeda(
                cardsReceitas?.card_receita_maior_receita_mes?.valor ?? 0
              )}
            </p>
            <span className="text-xs text-slate-400">Pico de entrada no período</span>
          </div>
          <div className="p-3 bg-green-50 rounded-full text-green-600">
            <TrendingUp className="size-6" />
          </div>
        </div>
      </div>

      <Tabela
        dados={receitas}
        colunas={colunas}
        placeholderBusca="Buscar receita..."
        textoBotao="+ Nova Receita"
        onNovo={novaReceita}
        onEditar={editarReceita}
        onExcluir={solicitarExclusao}
        onSearch={handleSearch}
        pagination={pagination}
        onPageChange={(novaPagina) => setPage(novaPagina)}
      >
        <input
          type="date"
          value={filtroDataInicio}
          onChange={(e) => setFiltroDataInicio(e.target.value)}
          className="h-10 px-3 rounded-md border border-input bg-background text-sm"
        />
        <input
          type="date"
          value={filtroDataFim}
          onChange={(e) => setFiltroDataFim(e.target.value)}
          className="h-10 px-3 rounded-md border border-input bg-background text-sm"
        />
        <select
          value={filtroTipoReceitaId}
          onChange={(e) => setFiltroTipoReceitaId(e.target.value)}
          className="h-10 px-3 rounded-md border border-input bg-background text-sm"
        >
          <option value="">Todos os Tipos</option>
          {tipoReceita.map((t) => (
            <option key={t.id} value={t.id}>
              {t.nome.toUpperCase()}
            </option>
          ))}
        </select>
        <select
          value={filtroStatusFinancasId}
          onChange={(e) => setFiltroStatusFinancasId(e.target.value)}
          className="h-10 px-3 rounded-md border border-input bg-background text-sm"
        >
          <option value="">Todos os Status</option>
          {statusFinancas.map((s) => (
            <option key={s.id} value={s.id}>
              {s.nome.toUpperCase()}
            </option>
          ))}
        </select>
        <Button type="button" variant="secondary" onClick={aplicarFiltros}>
          Filtrar
        </Button>
      </Tabela>

      <ModalForm
        open={open}
        onOpenChange={setOpen}
        titulo={
          receitaSelecionada
          ? "Editar Receita"
          : "Nova Receita"
        }
        campos={campos}
        dadosIniciais={receitaSelecionada}
        onSalvar={salvarReceita}
      />

      <ConfirmDialog
        open={openDelete}
        onOpenChange={setOpenDelete}
        onConfirm={apagarReceita}
        titulo="Excluir Receita"
        descricao={`Deseja realmente excluir esta receita no valor de ${formatarMoeda(itemParaDeletar?.valor ?? 0)}?`}
        textoConfirmar="Excluir"
      />
    </div>
  )
}