import { Routes, Route } from 'react-router-dom'
import Layout from '../layout/Layout'

import TelaGraja from '../pages/TelaGranja'
import BalacoGeral from '../pages/BalancoGeral'
import Despesas from '../pages/Despesas'
import Equipe from '../pages/Equipe'
import Producao from '../pages/Producao'
import Receitas from '../pages/Receitas'
import Estoque from '../pages/Estoque'
import Configuracoes from '@/pages/Configuracoes'
import LotesFrango from '@/pages/LotesFrango'
import TelaLogin from '@/pages/TelaLogin'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<TelaGraja />} />

        <Route path="tela_login" element={<TelaLogin />} />

        <Route path="balancoGeral" element={<BalacoGeral />} />
        <Route path="despesas" element={<Despesas />} />
        <Route path="equipe" element={<Equipe />} />
        <Route path="producao" element={<Producao />} />
        <Route path="lotes_frangos" element={<LotesFrango />} />
        <Route path="receitas" element={<Receitas />} />
        <Route path="estoque" element={<Estoque />} />
        <Route path="configuracoes" element={<Configuracoes />} />
      </Route>
    </Routes>
  )
}