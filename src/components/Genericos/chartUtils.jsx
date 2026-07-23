import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export default function DonutChartCard({ 
  titulo = "Gráfico", 
  descricao, 
  dados = [], 
  sufixo = "",
  textoCentralLabel = "Total"
}) {
  
  const total = dados.reduce((acc, curr) => acc + (curr.value ?? 0), 0)

  return (
    <Card className="w-full max-w-[400px] border border-slate-200/80 shadow-md bg-white">
      <CardHeader className="items-center pb-0">
        <CardTitle className="text-base font-semibold">{titulo}</CardTitle>
        {descricao && <CardDescription>{descricao}</CardDescription>}
      </CardHeader>
      
      <CardContent className="flex flex-col items-center justify-between pb-6">
        <div className="relative h-[200px] w-full">
          {dados.length === 0 ? (
            <div className="absolute inset-0 flex items-center justify-center text-sm text-muted-foreground italic">
              Nenhum dado disponível
            </div>
          ) : (
            <>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={dados}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={60}
                    outerRadius={80}
                    strokeWidth={3}
                    stroke="#fff"
                  >
                    {dados.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color ?? "#3b82f6"} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>

              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-3xl font-bold tracking-tight text-foreground">
                  {total.toLocaleString()}
                </span>
                <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
                  {textoCentralLabel}
                </span>
              </div>
            </>
          )}
        </div>

        {dados.length > 0 && (
          <div className="grid grid-cols-2 gap-x-6 gap-y-2 w-full px-4 text-sm mt-4 border-t border-slate-100 pt-4">
            {dados.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-2 (truncate)">
                  <span 
                    className="size-2 rounded-full shrink-0" 
                    style={{ backgroundColor: item.color ?? "#3b82f6" }}
                  />
                  <span className="text-muted-foreground truncate max-w-[95px]" title={item.name}>
                    {item.name}
                  </span>
                </div>
                <span className="font-semibold text-foreground whitespace-nowrap">
                  {item.value.toLocaleString()} {sufixo}
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}