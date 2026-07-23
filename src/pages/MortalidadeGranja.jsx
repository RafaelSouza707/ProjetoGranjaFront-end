import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from "recharts"
import { Skull } from "lucide-react"

import Tabela from "@/components/Genericos/Tabela"
import {
  listarMortalidade,
  listarGraficoMortalidadeGranja,
} from "@/api/aviario/mortalidadeService"
import { formatarData } from "@/components/utils/DataFormater"
import { handleApiError } from "@/utils/handleApiError"

export default function MortalidadeGranja() {
  const { granjaId } = useParams()

  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState(null)
  const [loading, setLoading] = useState(true)

  const [mortalidades, setMortalidades] = useState([])
  const [dadosGrafico, setDadosGrafico] = useState([])

  async function carregarDados() {
    try {
      setLoading(true)
      const [resMortalidade, resGrafico] = await Promise.all([
        listarMortalidade(null, granjaId, page),
        listarGraficoMortalidadeGranja(granjaId)
      ])
      
      setMortalidades(resMortalidade?.dados ?? [])
      setPagination(resMortalidade?.pagination ?? null)
      setDadosGrafico(resGrafico ?? [])
    } catch (error) {
      handleApiError(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!granjaId) return
    carregarDados()
  }, [granjaId, page])

  const totalMortalidadeGeral = dadosGrafico.reduce((acc, curr) => acc + (Number(curr.quantidade) || 0), 0)

  const colunas = [
    { key: "id", label: "ID", className: "w-16" },
    {
      key: "data",
      label: "Data",
      render: (item) => formatarData(item.data),
    },
    { key: "quantidade_mortes", label: "Mortes" },
  ]

  if (loading && mortalidades.length === 0) {
    return <div className="p-4 text-xs text-slate-400">Carregando dados de mortalidade...</div>
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight">Mortalidade da Granja</h1>
        <p className="text-sm text-muted-foreground">Histórico e monitoramento mensal de óbitos na granja.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-xs font-medium text-slate-500">Total Acumulado (Período)</span>
            <p className="text-xl font-bold text-red-600">{totalMortalidadeGeral}</p>
          </div>
          <div className="p-2.5 bg-red-50 rounded-full text-red-600">
            <Skull className="size-5" />
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col">
        <h3 className="text-base font-semibold text-slate-800 mb-2">Evolução da Mortalidade (Últimos 12 Meses)</h3>
        <div className="h-[220px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dadosGrafico} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="mes" stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ fontSize: "12px", borderRadius: "8px" }} />
              <Line 
                type="monotone" 
                dataKey="quantidade" 
                name="Mortes" 
                stroke="#dc2626" 
                strokeWidth={2} 
                dot={{ r: 4, fill: "#dc2626" }} 
                activeDot={{ r: 6 }} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <Tabela
        dados={mortalidades}
        colunas={colunas}
        placeholderBusca="Buscar mortalidade..."
        pagination={pagination}
        onPageChange={setPage}
      />
    </div>
  )
}