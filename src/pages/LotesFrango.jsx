import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import CardsGrid from "@/components/Genericos/CardsGrid"
import ModalForm from "@/components/Genericos/ModalForm"
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid,
  PieChart,
  Pie,
  Cell
} from "recharts"
import { AlertTriangle, Skull, Users } from "lucide-react"

import ConfirmDialog from "@/components/Genericos/ConfirmDialog"

import {
  listarLoteFrangos,
  criarLoteFrango,
  atualizarLoteFrango,
  deletarLoteFrango,
} from "@/api/aviario/loteFrangoService"

import { cardsGranja } from "@/api/granja/granjaService"
import { handleApiError } from "@/utils/handleApiError"
import { listarStatusFrango } from "@/api/aviario/statusLoteFrangoService"

export default function LotesFrango() {
  const navigate = useNavigate()
  const { granjaId } = useParams()

  const [openDelete, setOpenDelete] = useState(false)
  const [loteDelete, setLoteDelete] = useState(null)

  const [status, setStatus] = useState([])
  const [lotesFrango, setLotesFrango] = useState([])
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [loteSelecionado, setLoteSelecionado] = useState(null)
  const [cardsLoteFrangos, setCardsLoteFrangos] = useState(null)

  async function carregarStatus() {
    const dados = await listarStatusFrango(granjaId)
    setStatus(dados)
  }
  
  async function carregarLotes() {
    try {
      const dados = await listarLoteFrangos(granjaId)
      setLotesFrango(dados ?? [])
    } catch (error) {
      handleApiError(error)
    }
  }

  async function carregarCards() {
    const dados = await cardsGranja(granjaId)
    setCardsLoteFrangos(dados ?? {})
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
    { name: "status_lote_frango_id", label: "Status", type: "select", options: status.map((s) => ({ value: s.id, label: s.nome.toUpperCase() })), required: true },
    { name: "identificacao", label: "Identificação", type: "text", required: true },
    { name: "quantidade_inicial", label: "Qtd Inicial", type: "number", min: 0, required: true },
    { name: "data_alojamento", label: "Data Alojamento", type: "date", required: true },
    { name: "fornecedor", label: "Fornecedor", type: "text" },
    { name: "quantidade_atual", label: "Qtd Atual", type: "number", min: 0, required: true },
    { name: "observacao", label: "Observação", type: "text" }
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
      await atualizarLoteFrango(loteSelecionado.id, data, granjaId)
    } else {
      await criarLoteFrango(data, granjaId)
    }

    setOpen(false)
    setLoteSelecionado(null)

    await Promise.all([carregarLotes(), carregarCards()])
  }

  function excluir(item) {
    setLoteDelete(item)
    setOpenDelete(true)
  }

  async function confirmarExclusao() {
    if (!loteDelete) return

    try {
      await deletarLoteFrango(loteDelete.id, granjaId)

      setOpenDelete(false)
      setLoteDelete(null)

      await Promise.all([
        carregarLotes(),
        carregarCards()
      ])
    } catch (error) {
      handleApiError(error)
    }
  }

  function novo() {
    setLoteSelecionado(null)
    setOpen(true)
  }

  function editar(item) {
    setLoteSelecionado({ ...item, status_lote_frango_id: item.status?.id, identificacao: item.identificacao.toUpperCase()})
    setOpen(true)
  }

  const dadosGraficoPopulacao = lotesFrango.map(lote => ({
    identificacao: lote.identificacao ? lote.identificacao.toUpperCase() : "Lote",
    inicial: Number(lote.quantidade_inicial) || 0,
    atual: Number(lote.quantidade_atual) || 0,
  }))

  const statusContagem = lotesFrango.reduce((acc, lote) => {
    const nomeStatus = lote.status?.nome || "Indefinido"
    acc[nomeStatus] = (acc[nomeStatus] || 0) + 1
    return acc
  }, {})

  const dadosGraficoStatus = Object.keys(statusContagem).map(nome => ({
    name: nome,
    value: statusContagem[nome]
  }))
  const CORES_STATUS = ["#2563eb", "#16a34a", "#d97706", "#dc2626", "#7c3aed"]

  if (loading) {
    return <div className="p-4 text-slate-500">Carregando dados dos lotes...</div>
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight">Lotes de Frango</h1>
        <p className="text-sm text-muted-foreground">Gerenciamento de alojamentos, populações e monitoramento.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-xs font-medium text-slate-500">Total de Aves Ativas</span>
            <p className="text-xl font-bold text-blue-600">{cardsLoteFrangos?.total_aves_granja ?? 0}</p>
          </div>
          <div className="p-2.5 bg-blue-50 rounded-full text-blue-600">
            <Users className="size-5" />
          </div>
        </div>


        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-xs font-medium text-slate-500">Lotes c/ Baixa Qtd</span>
            <p className="text-xl font-bold text-amber-600">{cardsLoteFrangos?.baixa_quantidade_aves_lote_frango ?? 0}</p>
          </div>
          <div className="p-2.5 bg-amber-50 rounded-full text-amber-600">
            <AlertTriangle className="size-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-xs font-medium text-slate-500">Mortalidade do Mês</span>
            <p className="text-xl font-bold text-red-600">{cardsLoteFrangos?.mortalidade_granja_mes ?? 0}</p>
          </div>
          <div className="p-2.5 bg-red-50 rounded-full text-red-600 group-hover:bg-red-100 transition-colors">
            <Skull className="size-5" />
          </div>
        </div>

        <div 
          onClick={() => navigate(`/granja/${granjaId}/mortalidade-granja`)}
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between cursor-pointer hover:border-red-300 hover:bg-red-50/20 transition-all group"
        >
          <div className="space-y-0.5"> {/* Ajustar */}
            <span className="text-xs font-medium text-slate-500 group-hover:text-red-600 transition-colors">Histórico de Mortalidade</span>
            <p className="text-xl font-bold text-red-600">{cardsLoteFrangos?.historico_mortalidade_granja ?? 0}</p>
          </div>
          <div className="p-2.5 bg-red-50 rounded-full text-red-600 group-hover:bg-red-100 transition-colors">
            <Skull className="size-5" />
          </div>
        </div>

      </div>

      {lotesFrango.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm lg:col-span-2 flex flex-col">
            <h3 className="text-base font-semibold text-slate-800 mb-2">Evolução de População</h3>
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dadosGraficoPopulacao} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="identificacao" stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ fontSize: "12px", borderRadius: "8px" }} />
                  <Bar dataKey="inicial" name="Qtd Inicial" fill="#cbd5e1" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="atual" name="Qtd Atual" fill="#2563eb" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col">
            <h3 className="text-base font-semibold text-slate-800 mb-2">Lotes por Status</h3>
            <div className="h-[180px] w-full flex items-center justify-center mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={dadosGraficoStatus}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={65}
                    paddingAngle={4}
                    dataKey="value"
                    labelLine={false}
                  >
                    {dadosGraficoStatus.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={CORES_STATUS[index % CORES_STATUS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ fontSize: "12px", borderRadius: "8px" }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap justify-center gap-2 mt-2">
              {dadosGraficoStatus.map((entry, index) => (
                <div key={index} className="flex items-center gap-1 text-[10px] text-slate-600">
                  <span className="size-2 rounded-full" style={{ backgroundColor: CORES_STATUS[index % CORES_STATUS.length] }}></span>
                  {entry.name}
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      <CardsGrid
        dados={lotesFrango}
        placeholderBusca="Buscar lote..."
        onNovo={novo}
        onEditar={editar}
        onExcluir={excluir}
        onClickCard={(item) =>
          navigate(`/granja/${granjaId}/lotes_frangos/${item.id}/identificacao/${item.identificacao}`)
        }
        campos={[
          { key: "identificacao", label: "Identificação", render: (item) => item.identificacao.toUpperCase() },
          { key: "status.nome", label: "Status" },
          { key: "quantidade_inicial", label: "Qtd Inicial" },
          { key: "quantidade_atual", label: "Qtd Atual" },
          { key: "data_alojamento", label: "Alojamento" },
          { key: "fornecedor", label: "Fornecedor" }
        ]}
      />

      <ConfirmDialog
        open={openDelete}
        onOpenChange={setOpenDelete}
        onConfirm={confirmarExclusao}
        titulo="Excluir lote"
        descricao={`Deseja realmente excluir o lote "${loteDelete?.identificacao ?? ""}"?`}
        textoConfirmar="Excluir"
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