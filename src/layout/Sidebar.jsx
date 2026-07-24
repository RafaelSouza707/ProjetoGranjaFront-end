import '@coreui/coreui/dist/css/coreui.min.css'
import {
  CSidebar,
  CSidebarHeader,
  CSidebarNav,
  CNavItem,
  CNavTitle,
} from '@coreui/react'

import { NavLink, Link, useParams } from 'react-router-dom'
import CIcon from '@coreui/icons-react'
import {
  cilPeople,
  cilViewQuilt,
  cilLayers,
  cilFastfood,
  cilCart,
  cilDollar,
  cilSettings,
} from '@coreui/icons'
import { useAuth } from '@/components/utils/AuthContext'

export default function Sidebar({ visible, setVisible, isMobile }) {
  const { granjaSelecionada } = useAuth()
  const { granjaId } = useParams()

  const activeGranjaId = granjaId || granjaSelecionada?.id

  const navLinkClass = ({ isActive }) =>
    'nav-link d-flex align-items-center gap-2 ' + (isActive ? 'active' : '')

  return (
    <CSidebar
      visible={isMobile ? visible : true}
      onVisibleChange={setVisible}
      position={isMobile ? "fixed" : "relative"}
      className="border-end sidebar-custom"
    >
      <CSidebarHeader className="border-bottom">
        <div className="px-2 w-100">
          <div className="fw-bold fs-5">
            <Link to="/" className="text-decoration-none text-dark">
              SSG
            </Link>
          </div>
          <div className="text-muted" style={{ fontSize: '11px' }}>
            Sistema Gerenciador de Granja
          </div>
        </div>
      </CSidebarHeader>

      <CSidebarNav>
        {/* 1. ITENS GERAIS SEMPRE VISÍVEIS NO TOPO */}
        <CNavTitle>Geral</CNavTitle>
        <CNavItem>
          <NavLink to="/" className={navLinkClass} end>
            <CIcon customClassName="nav-icon" icon={cilViewQuilt} />
            Granjas
          </NavLink>
        </CNavItem>
        <CNavItem>
          <NavLink to="/equipe" className={navLinkClass}>
            <CIcon customClassName="nav-icon" icon={cilPeople} />
            Associados
          </NavLink>
        </CNavItem>

        {/* 2. MÓDULOS ESPECÍFICOS DA GRANJA ATIVA */}
        {activeGranjaId && (
          <>
            <CNavTitle className="mt-2">Módulos da Granja</CNavTitle>
            <CNavItem>
              <NavLink to={`/granja/${activeGranjaId}/lotes_frangos`} className={navLinkClass}>
                <CIcon customClassName="nav-icon" icon={cilLayers} />
                Lotes de Frangos
              </NavLink>
            </CNavItem>
            <CNavItem>
              <NavLink to={`/granja/${activeGranjaId}/produtos`} className={navLinkClass}>
                <CIcon customClassName="nav-icon" icon={cilFastfood} />
                Produtos & Estoque
              </NavLink>
            </CNavItem>
            <CNavItem>
              <NavLink to={`/granja/${activeGranjaId}/lote_racao`} className={navLinkClass}>
                <CIcon customClassName="nav-icon" icon={cilFastfood} />
                Lote de Ração
              </NavLink>
            </CNavItem>
            <CNavItem>
              <NavLink to={`/granja/${activeGranjaId}/vendas`} className={navLinkClass}>
                <CIcon customClassName="nav-icon" icon={cilCart} />
                Vendas
              </NavLink>
            </CNavItem>
            <CNavItem>
              <NavLink to={`/granja/${activeGranjaId}/financas`} className={navLinkClass}>
                <CIcon customClassName="nav-icon" icon={cilDollar} />
                Finanças
              </NavLink>
            </CNavItem>
            <CNavItem>
              <NavLink to={`/configuracoes/${activeGranjaId}`} className={navLinkClass}>
                <CIcon customClassName="nav-icon" icon={cilSettings} />
                Configurações
              </NavLink>
            </CNavItem>
          </>
        )}
      </CSidebarNav>
    </CSidebar>
  )
}