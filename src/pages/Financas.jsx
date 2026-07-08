import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"

import FinanceiroCards from "@/components/Financas/FinanceiroCards"
import { ArrowDownCircle, ArrowUpCircle } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { listarCardsFinancas } from "@/api/financas/financasService"
import { formatarMoeda } from "@/utils/formatters"

export default function Financas() {
  const { granjaId } = useParams()
  const navigate = useNavigate()

  const [cardsFinancas, setCardsFinancas] = useState([])

  async function carregarCards() {
    try {
      const dados = await listarCardsFinancas(granjaId)
      setCardsFinancas(dados)
    } catch (error) {
      console.error("Erro ao carregar cards financas:", error)
      setCardsFinancas([])
    }
  }

  useEffect( () => {
    carregarCards()
  }, [])

  const cards = [
    {
      titulo: "Lucro no Mês",
      valor: formatarMoeda(cardsFinancas.lucro_granja_mes),
      descricao: "Lucro liquido contando a partir primeiro dia desse mês.",
      cor: "text-green-600",
    },
    {
      titulo: "Total em Receitas no mês",
      valor: formatarMoeda(cardsFinancas.card_receita_total_receitas_mes_granja),
    },  
    {
      titulo: "Total em Despesas no mês",
      valor: formatarMoeda(cardsFinancas.total_gasto_mes_granja),
    },
  ]

  return (
    <div className="p-6">
      <h1 className="text-4xl font-bold mb-6">
        Finanças da Granja
      </h1>
      
      <div className="space-y-6">

      <FinanceiroCards cards={cards} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <button
          onClick={() => navigate(`/granja/${granjaId}/financas/receita`)}
          className="
            group
            rounded-xl
            border
            bg-green-50
            hover:bg-green-100
            transition-all
            p-6
            text-left
            shadow-sm
            hover:shadow-md
          "
        >
          <div className="flex items-center gap-4">
            <ArrowUpCircle className="h-12 w-12 text-green-600" />

            <div>
              <h2 className="text-2xl font-semibold text-green-700">
                Receitas
              </h2>

              <p className="text-muted-foreground">
                Visualizar receitas, vendas e entradas financeiras.
              </p>
            </div>
          </div>
        </button>

        <button
          onClick={() => navigate(`/granja/${granjaId}/financas/despesa`)}
          className="
            group
            rounded-xl
            border
            bg-red-50
            hover:bg-red-100
            transition-all
            p-6
            text-left
            shadow-sm
            hover:shadow-md
          "
        >
          <div className="flex items-center gap-4">
            <ArrowDownCircle className="h-12 w-12 text-red-600" />

            <div>
              <h2 className="text-2xl font-semibold text-red-700">
                Despesas
              </h2>

              <p className="text-muted-foreground">
                Gerenciar gastos, custos operacionais e saídas financeiras.
              </p>
            </div>
          </div>
        </button>

      </div>

    </div>

    </div>
  )
}