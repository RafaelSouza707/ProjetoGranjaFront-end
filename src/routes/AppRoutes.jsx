import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from '../layout/Layout';

import VisaoGeral from '../pages/VisaoGeral';
import BalacoGeral from '../pages/BalancoGeral';
import Despesas from '../pages/Despesas';
import Equipe from '../pages/Equipe';
import Producao from '../pages/Producao';
import Receitas from '../pages/Receitas';
import Estoque from '../pages/Estoque';

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Layout com Sidebar */}
        <Route path="/" element={<Layout />}>
          <Route index element={<VisaoGeral/>} />
          <Route path='balancoGeral' element={<BalacoGeral/>} />
          <Route path='despesas' element={<Despesas/>} />
          <Route path='equipe' element={<Equipe/> } />
          <Route path='producao' element={<Producao/>} />
          <Route path='receitas' element={<Receitas/>} />
          <Route path='estoque' element={<Estoque/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}