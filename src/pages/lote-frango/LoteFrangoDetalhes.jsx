import { useParams } from "react-router-dom"

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

import { ConsumoLote} from "@/pages/lote-frango/ConsumoLote"
import { MortalidadeLote } from "@/pages/lote-frango/MortalidadeLote"
import { ProducaoLote } from "@/pages/lote-frango/ProducaoLote"
import { ResumoLote } from "@/pages/lote-frango/ResumoLote"

import { buscarLoteFrango } from "@/api/aviario/loteFrangoService"
import { useEffect, useState } from "react"

export default function LoteFrangoDetalhes() {
  const { granjaId, loteFrangoId, identificacao } = useParams()

  return (
    <div className="p-6 space-y-6">

      <div>
        <h1 className="text-3xl font-bold">
          <b>Lote: </b>{identificacao.toUpperCase()}
        </h1>

        <p className="text-muted-foreground">
          Granja {granjaId}
        </p>
      </div>

      <Tabs defaultValue="resumo">

        <TabsList>
          <TabsTrigger value="resumo">
            Resumo
          </TabsTrigger>

          <TabsTrigger value="mortalidade">
            Mortalidade
          </TabsTrigger>

          <TabsTrigger value="consumo">
            Consumo
          </TabsTrigger>

          <TabsTrigger value="producao">
            Produção
          </TabsTrigger>
        </TabsList>

        <TabsContent value="resumo">
          <ResumoLote />
        </TabsContent>

        <TabsContent value="mortalidade">
          <MortalidadeLote />
        </TabsContent>

        <TabsContent value="consumo">
          <ConsumoLote />
        </TabsContent>

        <TabsContent value="producao">
          <ProducaoLote />
        </TabsContent>

      </Tabs>

    </div>
  )
}