import {
  Card,
  CardContent,
} from "@/components/ui/card"

export default function FinanceiroCards({ cards = [] }) {
  return (
    <div className="flex flex-wrap gap-4" style={{marginBottom:`40px`, marginTop:`40px`}}>

      {cards.map((card, index) => (

        <Card
          key={index}
          className="w-[280px] h-[220px]"
        >
          <CardContent className="p-6">

            <p className="text-sm text-muted-foreground">
              {card.titulo}
            </p>

            <h2
              className={`text-3xl font-bold mt-2 ${
                card.cor ?? ""
              }`}
            >
              {card.valor}
            </h2>

            {card.descricao && (
              <p className="text-sm text-muted-foreground mt-2">
                {card.descricao}
              </p>
            )}

          </CardContent>
        </Card>

      ))}

    </div>
  )
}