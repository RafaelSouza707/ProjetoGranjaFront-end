import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { Card, CardContent } from "@/components/ui/card"

import FinanceiroCards from "@/components/Financas/FinanceiroCards"
import { cardsLoteFrango } from "@/api/aviario/loteFrangoService"
import { formatarQuilos } from "@/components/utils/FormatarQuilos"

export function ResumoLote() {
  const { granjaId, loteFrangoId } = useParams()
  const [cards, setCards] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!granjaId) return
    carregarCards()
  }, [granjaId, loteFrangoId])

  async function carregarCards() {
    setLoading(true)
    try {
      const dados = await cardsLoteFrango(granjaId, loteFrangoId)
      setCards(dados)
    } finally {
      setLoading(false)
    }
  }

  const quantidadeAtualLoteFrango = cards?.total_aves_lote_frango ?? 0
  const mortalidadeLoteMes = cards?.mortalidade_lote_frango_mes ?? 0
  const consumoTotalLoteFrango = formatarQuilos(cards?.consumo_total_lote_frango ?? 0)

  return (
    <div className="overflow-x-auto py-4">

      <FinanceiroCards cards={[
        {
          titulo: "Quantidade Atual de Frangos",
          valor: quantidadeAtualLoteFrango,
        },
        {
          titulo: "Mortalidade Total no mes",
          valor: mortalidadeLoteMes,
        },
        {
          titulo: "Consumo Total no mes",
          valor: consumoTotalLoteFrango,
        },
      ]}/>
    </div>
  )
}