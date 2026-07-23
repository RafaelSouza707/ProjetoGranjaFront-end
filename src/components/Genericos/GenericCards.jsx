import {
  Card,
  CardContent,
} from "@/components/ui/card"

export default function GenericCards({ cards = [] }) {
  return (
    <div className="flex flex-nowrap gap-4 overflow-x-auto py-2" style={{ marginBottom: `40px`, marginTop: `40px` }}>

      {cards.map((card, index) => (

        <Card
          key={index}
          
          className="w-[280px] h-[220px] border border-slate-200/80 shadow-md hover:shadow-lg transition-shadow duration-200 bg-white"
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