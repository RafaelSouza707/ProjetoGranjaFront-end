import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { Users, Skull, Scale } from "lucide-react"

import { cardsLoteFrango } from "@/api/aviario/loteFrangoService"
import { formatarQuilos } from "@/components/utils/FormatarQuilos"

export function ResumoLote() {
  const { granjaId, loteFrangoId } = useParams()
  const [cards, setCards] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!granjaId || !loteFrangoId) return
    carregarCards()
  }, [granjaId, loteFrangoId])

  async function carregarCards() {
    setLoading(true)
    try {
      const dados = await cardsLoteFrango(granjaId, loteFrangoId)
      setCards(dados ?? {})
    } finally {
      setLoading(false)
    }
  }

  const quantidadeAtualLoteFrango = cards?.total_aves_lote_frango ?? 0
  const mortalidadeLoteMes = cards?.mortalidade_lote_frango_mes ?? 0
  const consumoTotalLoteFrango = formatarQuilos(cards?.consumo_total_lote_frango ?? 0)

  if (loading) {
    return <div className="py-4 text-xs text-slate-400">Carregando resumo do lote...</div>
  }

  return (
    <div className="py-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Card Quantidade Atual */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-xs font-medium text-slate-500">Qtd Atual de Frangos</span>
            <p className="text-xl font-bold text-blue-600">{quantidadeAtualLoteFrango}</p>
          </div>
          <div className="p-2.5 bg-blue-50 rounded-full text-blue-600">
            <Users className="size-5" />
          </div>
        </div>

        {/* Card Mortalidade */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-xs font-medium text-slate-500">Mortalidade no Mês</span>
            <p className="text-xl font-bold text-red-600">{mortalidadeLoteMes}</p>
          </div>
          <div className="p-2.5 bg-red-50 rounded-full text-red-600">
            <Skull className="size-5" />
          </div>
        </div>

        {/* Card Consumo */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-xs font-medium text-slate-500">Consumo Total no Mês</span>
            <p className="text-xl font-bold text-emerald-600">{consumoTotalLoteFrango}</p>
          </div>
          <div className="p-2.5 bg-emerald-50 rounded-full text-emerald-600">
            <Scale className="size-5" />
          </div>
        </div>

      </div>
    </div>
  )
}