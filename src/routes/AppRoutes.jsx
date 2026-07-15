import { Routes, Route } from 'react-router-dom'
import Layout from '../layout/Layout'

import TelaGraja from '../pages/TelaGranja'
import Financas from '../pages/Financas'
import Equipe from '../pages/Equipe'
import Produto from '../pages/Produto'
import Configuracoes from '@/pages/Configuracoes'
import LotesFrango from '@/pages/LotesFrango'
import TelaLogin from '@/pages/TelaLogin'
import LoteFrangoDetalhes from '@/pages/lote-frango/LoteFrangoDetalhes'
import Receitas from "@/pages/Receitas"
import Despesas from "@/pages/Despesas"
import Perfil from "@/pages/Perfil"
import LoteRacao from "@/pages/LoteRacao"
import Venda from "@/pages/Venda"
import Cliente from "@/pages/Cliente"

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<TelaGraja />} />

        <Route path="tela_login" element={<TelaLogin />} />

        <Route path="equipe" element={<Equipe />} />
        <Route path="configuracoes/:granjaId" element={<Configuracoes />} />
        <Route path="granja/:granjaId/lotes_frangos" element={<LotesFrango />} />
        <Route path="granja/:granjaId/produtos" element={<Produto />} />
        <Route path="granja/:granjaId/lote_racao" element={<LoteRacao />} />
        <Route path='granja/:granjaId/vendas' element={<Venda />} />
        <Route path="granja/:granjaId/lotes_frangos/:loteFrangoId/identificacao/:identificacao" element={<LoteFrangoDetalhes/>}/>
        <Route path="granja/:granjaId/financas" element={<Financas />} />
        <Route path="granja/:granjaId/financas/receita" element={<Receitas/>} />
        <Route path="granja/:granjaId/financas/despesa" element={<Despesas/>} />
        <Route path="usuario/perfil" element={<Perfil/>} />
        <Route path="granja/:granjaId/clientes" element={Cliente} />
      </Route>
    </Routes>
  )
}