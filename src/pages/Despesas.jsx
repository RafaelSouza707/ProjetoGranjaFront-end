import { useEffect, useState } from "react"

import Tabela from "@/components/Genericos/Tabela"
import ModalForm from "@/components/Genericos/ModalForm"
import ConfirmDialog from "@/components/Genericos/ConfirmDialog"
import { useParams, useSearchParams } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { ArrowDownCircle, Wallet } from "lucide-react"

import { cardsGastosGranja, listarDespesas, criarDespesa, deletarDespesa, atualizarDespesa } from "@/api/financas/despesaService"
import { listarTiposDespesa } from "@/api/financas/tipoDespesaService"
import { formatarMoeda } from "@/utils/formatters"
import { listarStatusFinancas } from "@/api/financas/statusFinancasService"
import { listarLoteFrangos } from "@/api/aviario/loteFrangoService"
import { renderTextoColuna } from "@/components/utils/renderers"
import { handleApiError } from "@/utils/handleApiError"

export default function Despesas() {

  const { granjaId } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()

  const [pagination, setPagination] = useState(null)
  const [despesas, setDespesas] = useState([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [openDelete, setOpenDelete] = useState(false)
  const [itemParaDeletar, setItemParaDeletar] = useState(null)
  const [despesaSelecionada, setDespesaSelecionada] = useState(null)
  const [cardsDespesas, setCardsDespesas] = useState(null);

  const [loteFrango, setLoteFrango] = useState([])
  const [status, setStatus] = useState([])
  const [tipoDespesa, setTipoDespesa] = useState([])

  const [filtroTipo, setFiltroTipo] = useState(searchParams.get("tipo_despesa_id") || "todos")
  const [filtroStatus, setFiltroStatus] = useState(searchParams.get("status_financas_id") || "todos")
  const [filtroDataInicio, setFiltroDataInicio] = useState(searchParams.get("data__gte") || "")
  const [filtroDataFim, setFiltroDataFim] = useState(searchParams.get("data__lte") || "")

  async function carregarDados() {
    await Promise.all([
      carregarCards(),
      carregarTiposDespesas(),
      carregarStatus(),
      carregarLoteFrangos(),
    ])  
  }

  async function carregarDespesas() {
    try {
      const paginaAtual = searchParams.get("pagina") || searchParams.get("page") || "1"
      const paramsObj = Object.fromEntries(searchParams.entries())
      
      const dados = await listarDespesas(granjaId, { pagina: paginaAtual, ...paramsObj });
      setDespesas(dados.dados ?? [])
      setPagination(dados.pagination)
    } catch (error) {
      handleApiError(error)
    }
  }

  async function carregarCards() {
    try {
      const dados = await cardsGastosGranja(granjaId);
      setCardsDespesas(dados ?? []);
    } catch (error) {
      handleApiError(error)
    } finally {
      setLoading(false);
    }
  }

  async function carregarLoteFrangos() {
    try {
      const dados = await listarLoteFrangos(granjaId);
      setLoteFrango(dados ?? []);
    } catch (error) {
      handleApiError(error)
    }
  }

  async function carregarStatus() {
    try {
      const dados = await listarStatusFinancas(granjaId);
      setStatus(dados ?? []);
    } catch (error) {
      handleApiError(error)
    }
  }

  async function carregarTiposDespesas() {
    try {
      const dados = await listarTiposDespesa(granjaId)
      setTipoDespesa(dados ?? [])
    } catch (error) {
      handleApiError(error)
    }
  }

  const colunas = [
    { key: "id", label: "#" },
    { key: "tipo.nome", label: "TIPO" },
    { key: "status.nome", label: "STATUS" },
    { key: "lote_frango.identificacao", label: "LOTE DE FRANGO", className: "uppercase" },
    { key: "data", label: "DATA", render: (item) => item.data ? new Date(item.data).toLocaleDateString('pt-BR', {timeZone: 'UTC'}) : "-" },
    { key: "data_vencimento", label: "VENCIMENTO", render: (item) => item.data_vencimento ? new Date(item.data_vencimento).toLocaleDateString('pt-BR', {timeZone: 'UTC'}) : "-" },
    { key: "valor", label: "VALOR", render: (item) => formatarMoeda(item.valor) },
    { key: "descricao", label: "DESCRIÇÃO", render: renderTextoColuna("descricao", 10) }
  ]

  const campos = [
    {
      name: "tipo_despesa_id",
      label: "Tipo de Despesa",
      type: "select",
      options: tipoDespesa.map(t => ({ value: t.id, label: t.nome.toUpperCase() }))
    },
    {
      name: "status_financas_id",
      label: "Status",
      type: "select",
      options: status.map(s => ({ value: s.id, label: s.nome.toUpperCase() }))
    },
    { 
      name: "lote_frango_id",
      label: "Lote de Frango",  
      type: "select",
      options: loteFrango.map(l => ({ value: l.id, label: l.identificacao.toUpperCase() })),
    },
    { name: "data", label: "Data da Despesa", type: "date" },
    { name: "data_vencimento", label: "Data Vencimento", type: "date", required: false },
    { name: "valor", label: "Valor da Despesa", type: "number" },
    { name: "descricao", label: "Descrição", type: "text", maxLength: 256 }
  ]

  function toNumberOrNull(value) {
    if (value === "" || value === null || value === undefined) return null
    const n = Number(value)
    return isNaN(n) ? null : n
  }

  function solicitarExclusao(item) {
    setItemParaDeletar(item)
    setOpenDelete(true)
  }

  async function apagarDespesa() {
    if (!itemParaDeletar) return
    try {
      await deletarDespesa(itemParaDeletar.id, granjaId);
      setOpenDelete(false)
      setItemParaDeletar(null)
      await carregarDespesas()
      await carregarCards()
    } catch (error) {
      handleApiError(error)
    }
  }

  function novaDespesa() {
    setDespesaSelecionada(null)
    setOpen(true)
  }

  function editarDespesa(despesa) {
    setDespesaSelecionada({
      ...despesa,
      lote_frango: undefined,
    })
    setOpen(true)
  }

  function handleSearch(termo) {
    const newParams = new URLSearchParams(searchParams)
    if (!termo || !termo.trim()) {
      newParams.delete("search")
    } else {
      newParams.set("search", termo.trim())
    }
    newParams.set("pagina", "1")
    setSearchParams(newParams)
  }

  function aplicarFiltros(e) {
    e.preventDefault()
    const newParams = new URLSearchParams(searchParams)

    if (filtroTipo !== "todos") {
      newParams.set("tipo_despesa_id", filtroTipo)
    } else {
      newParams.delete("tipo_despesa_id")
    }

    if (filtroStatus !== "todos") {
      newParams.set("status_financas_id", filtroStatus)
    } else {
      newParams.delete("status_financas_id")
    }

    if (filtroDataInicio) {
      newParams.set("data__gte", filtroDataInicio)
    } else {
      newParams.delete("data__gte")
    }

    if (filtroDataFim) {
      newParams.set("data__lte", filtroDataFim)
    } else {
      newParams.delete("data__lte")
    }

    newParams.set("pagina", "1")
    setSearchParams(newParams)
  }

  function handlePageChange(novaPagina) {
    const newParams = new URLSearchParams(searchParams)
    newParams.set("pagina", novaPagina)
    setSearchParams(newParams)
  }

  async function salvarDespesa(payload) {
    if (payload.data_vencimento == "") {
      payload.data_vencimento = null
    }
    try {
      const dados = {
        ...payload,
        tipo_despesa_id: toNumberOrNull(payload.tipo_despesa_id),
        status_financas_id: toNumberOrNull(payload.status_financas_id),
        lote_frango_id: toNumberOrNull(payload.lote_frango_id),
        granja_id: toNumberOrNull(granjaId)
      }

      if (despesaSelecionada) {
        await atualizarDespesa(despesaSelecionada.id, granjaId, dados)
      } else {
        await criarDespesa(dados, granjaId)
      }

      setOpen(false)
      setDespesaSelecionada(null)
      await carregarDespesas()
      await carregarCards()
    } catch (error) {
      handleApiError(error)
    }
  }

  useEffect(() => {
    carregarDados()
  }, [])

  useEffect(() => {
    carregarDespesas()
  }, [searchParams]);

  if (loading) {
    return <p>Carregando...</p>
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-4xl font-bold">Despesas</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-sm font-medium text-slate-500">Total Gasto no Mês</span>
            <p className="text-2xl font-bold text-red-600">
              {formatarMoeda(cardsDespesas?.total_gasto_mes_granja ?? 0)}
            </p>
            <span className="text-xs text-slate-400">Custos operacionais no mês atual</span>
          </div>
          <div className="p-3 bg-red-50 rounded-full text-red-600">
            <ArrowDownCircle className="size-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-sm font-medium text-slate-500">Maior Gasto no Mês</span>
            <p className="text-2xl font-bold text-red-600">
              {formatarMoeda(cardsDespesas?.maior_gasto_mes_granja?.valor ?? 0)}
            </p>
            <span className="text-xs text-slate-400">
              {cardsDespesas?.maior_gasto?.tipo_despesa ? `Tipo: ${cardsDespesas.maior_gasto.tipo_despesa}` : "Maior saída registrada"}
            </span>
          </div>
          <div className="p-3 bg-red-50 rounded-full text-red-600">
            <Wallet className="size-6" />
          </div>
        </div>
      </div>

      <Tabela
        dados={despesas}
        colunas={colunas}
        placeholderBusca="Buscar despesa..."
        textoBotao="+ Nova Despesa"
        onNovo={novaDespesa}
        onEditar={editarDespesa}
        onExcluir={solicitarExclusao}
        onSearch={handleSearch}
        pagination={pagination}
        onPageChange={handlePageChange}
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
          className="h-10 px-3 rounded-md border border-input bg-background text-sm"
          value={filtroTipo}
          onChange={(e) => setFiltroTipo(e.target.value)}
        >
          <option value="todos">Todos os Tipos</option>
          {tipoDespesa.map(t => (
            <option key={t.id} value={t.id}>{t.nome.toUpperCase()}</option>
          ))}
        </select>

        <select
          className="h-10 px-3 rounded-md border border-input bg-background text-sm"
          value={filtroStatus}
          onChange={(e) => setFiltroStatus(e.target.value)}
        >
          <option value="todos">Todos os Status</option>
          {status.map(s => (
            <option key={s.id} value={s.id}>{s.nome.toUpperCase()}</option>
          ))}
        </select>

        <Button type="button" variant="secondary" onClick={aplicarFiltros}>
          Filtrar
        </Button>
      </Tabela>

      <ModalForm  
        open={open}
        onOpenChange={setOpen}
        titulo={despesaSelecionada ? "Editar Despesa" : "Nova Despesa"}
        campos={campos}
        dadosIniciais={despesaSelecionada}
        onSalvar={salvarDespesa}
      />

      <ConfirmDialog
        open={openDelete}
        onOpenChange={setOpenDelete}
        onConfirm={apagarDespesa}
        titulo="Excluir Despesa"
        descricao={`Deseja realmente excluir esta despesa no valor de ${formatarMoeda(itemParaDeletar?.valor ?? 0)}?`}
        textoConfirmar="Excluir"
      />
    </div>
  )
}