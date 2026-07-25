import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { ArrowDownCircle, ArrowUpCircle, TrendingUp, DollarSign, Wallet } from "lucide-react"
import { listarCardsFinancas } from "@/api/financas/financasService"
import { formatarMoeda } from "@/utils/formatters"
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

export default function Financas() {
  const { granjaId } = useParams()
  const navigate = useNavigate()

  const [cardsFinancas, setCardsFinancas] = useState({})

  async function carregarCards() {
    try {
      const dados = await listarCardsFinancas(granjaId)
      setCardsFinancas(dados ?? {})
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    carregarCards()
  }, [granjaId])

  const receitaMes = Number(cardsFinancas.card_receita_total_receitas_mes_granja) || 0
  const despesaMes = Number(cardsFinancas.total_gasto_mes_granja) || 0
  const lucroMes = Number(cardsFinancas.lucro_granja_mes) || 0

  const dadosBarra = [
    { nome: "Receitas", valor: receitaMes, cor: "#16a34a" },
    { nome: "Despesas", valor: despesaMes, cor: "#dc2626" },
    { nome: "Lucro Líquido", valor: lucroMes, cor: "#2563eb" },
  ]

  const dadosPizza = [
    { name: "Receitas", value: receitaMes },
    { name: "Despesas", value: despesaMes },
  ]
  const CORES_PIZZA = ["#16a34a", "#dc2626"]

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight">Finanças da Granja</h1>
        <p className="text-muted-foreground">Visão geral do desempenho financeiro, receitas e despesas do mês atual.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-sm font-medium text-slate-500">Lucro no Mês</span>
            <p className={`text-2xl font-bold ${lucroMes >= 0 ? "text-green-600" : "text-red-600"}`}>
              {formatarMoeda(lucroMes)}
            </p>
            <span className="text-xs text-slate-400">Contando a partir do 1º dia do mês</span>
          </div>
          <div className="p-3 bg-green-50 rounded-full text-green-600">
            <TrendingUp className="size-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-sm font-medium text-slate-500">Total em Receitas</span>
            <p className="text-2xl font-bold text-slate-900">{formatarMoeda(receitaMes)}</p>
            <span className="text-xs text-slate-400">Entradas registradas no mês</span>
          </div>
          <div className="p-3 bg-emerald-50 rounded-full text-emerald-600">
            <DollarSign className="size-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-sm font-medium text-slate-500">Total em Despesas</span>
            <p className="text-2xl font-bold text-red-600">{formatarMoeda(despesaMes)}</p>
            <span className="text-xs text-slate-400">Custos operacionais no mês</span>
          </div>
          <div className="p-3 bg-red-50 rounded-full text-red-600">
            <Wallet className="size-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-sm font-medium text-slate-500">Lucro Registrado</span>
            <p className={`text-2xl font-bold ${lucroMes >= 0 ? "text-green-600" : "text-red-600"}`}>
              {formatarMoeda(lucroMes)}
            </p>
            <span className="text-xs text-slate-400">Histórico financeiro</span>
          </div>
          <div className="p-3 bg-green-50 rounded-full text-green-600">
            <TrendingUp className="size-6" />
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm lg:col-span-2 flex flex-col justify-between">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-slate-800">Balanço Financeiro do Mês</h3>
            <p className="text-xs text-slate-500">Comparativo direto entre entradas, saídas e resultado líquido.</p>
          </div>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dadosBarra}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="nome" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis 
                  stroke="#888888" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                  tickFormatter={(val) => `R$ ${val}`} 
                />
                <Tooltip 
                  formatter={(value) => [formatarMoeda(value), "Valor"]}
                  contentStyle={{ backgroundColor: "#fff", borderRadius: "8px", border: "1px solid #e2e8f0" }}
                />
                <Bar dataKey="valor" radius={[6, 6, 0, 0]}>
                  {dadosBarra.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.cor} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="mb-2">
            <h3 className="text-lg font-semibold text-slate-800">Proporção Fluxo</h3>
            <p className="text-xs text-slate-500">Entradas vs. Saídas operacionais.</p>
          </div>
          <div className="h-[220px] w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dadosPizza}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {dadosPizza.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CORES_PIZZA[index % CORES_PIZZA.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatarMoeda(value)} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 text-xs text-slate-500 mt-2">
            <span className="flex items-center gap-1.5"><span className="size-3 rounded-full bg-green-500"></span> Receitas</span>
            <span className="flex items-center gap-1.5"><span className="size-3 rounded-full bg-red-500"></span> Despesas</span>
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        <button
          onClick={() => navigate(`/granja/${granjaId}/financas/receita`)}
          className="group rounded-xl border bg-green-50 hover:bg-green-100 transition-all p-6 text-left shadow-sm hover:shadow-md flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <ArrowUpCircle className="h-12 w-12 text-green-600" />
            <div>
              <h2 className="text-2xl font-semibold text-green-700">Receitas</h2>
              <p className="text-muted-foreground text-sm">Visualizar receitas, vendas e entradas financeiras.</p>
            </div>
          </div>
        </button>

        <button
          onClick={() => navigate(`/granja/${granjaId}/financas/despesa`)}
          className="group rounded-xl border bg-red-50 hover:bg-red-100 transition-all p-6 text-left shadow-sm hover:shadow-md flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <ArrowDownCircle className="h-12 w-12 text-red-600" />
            <div>
              <h2 className="text-2xl font-semibold text-red-700">Despesas</h2>
              <p className="text-muted-foreground text-sm">Gerenciar gastos, custos operacionais e saídas.</p>
            </div>
          </div>
        </button>
      </div>

    </div>
  )
}