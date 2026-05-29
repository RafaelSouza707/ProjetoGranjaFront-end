import '@coreui/coreui/dist/css/coreui.min.css'
import {
  CSidebar,
  CSidebarHeader,
  CSidebarNav,
  CNavGroup,
  CNavItem,
  CNavTitle,
} from '@coreui/react'

import { NavLink, Link } from 'react-router-dom'

import CIcon from '@coreui/icons-react'
import {
  cilPeople,
  cilLayers,
  cilViewQuilt,
  cilFactory,
  cilWallet,
} from '@coreui/icons'

export default function Sidebar({ visible, setVisible, isMobile }) {
  const navLinkClass = ({ isActive }) =>
    'nav-link d-flex align-items-center gap-2 ' + (isActive ? 'active' : '')

  return (
    <CSidebar
      visible={isMobile ? visible : true}
      onVisibleChange={setVisible}
      position={isMobile ? 'fixed' : 'relative'}
      className="border-end sidebar-custom"
    >
      <CSidebarHeader className="border-bottom">
        <div className="px-2">
          <div className="fw-bold fs-5 ">
            <Link to='/' className='text-decoration-none text-dark'>
              SSG
            </Link>
          </div>
          <div className="text-muted" style={{ fontSize: '12px' }}>
            Sistema Gerenciador de Granja
          </div>
        </div>
      </CSidebarHeader>

      <CSidebarNav>
        <CNavTitle>Navegação</CNavTitle>

        <CNavItem>
          <NavLink to="/" className={navLinkClass} end>
            <CIcon customClassName="nav-icon" icon={cilViewQuilt} />
            Visão Geral
          </NavLink>
        </CNavItem>

        <CNavItem>
          <NavLink to="/producao" className={navLinkClass}>
            <CIcon customClassName="nav-icon" icon={cilFactory} />
            Produção
          </NavLink>
        </CNavItem>

        <CNavGroup
          toggler={
            <>
              <CIcon customClassName="nav-icon" icon={cilWallet} />
              Finanças da Granja
            </>
          }
        >
          <CNavItem>
            <NavLink to="/balancogeral" className={navLinkClass}>
              Balanço Geral
            </NavLink>
          </CNavItem>

          <CNavItem>
            <NavLink to="/despesas" className={navLinkClass}>
              Despesas
            </NavLink>
          </CNavItem>

          <CNavItem>
            <NavLink to="/receitas" className={navLinkClass}>
              Receitas
            </NavLink>
          </CNavItem>
        </CNavGroup>

        <CNavItem>
          <NavLink to="/equipe" className={navLinkClass}>
            <CIcon customClassName="nav-icon" icon={cilPeople} />
            Equipe
          </NavLink>
        </CNavItem>

        <CNavItem>
          <NavLink to="/relatoriosvacinas" className={navLinkClass}>
            <CIcon customClassName="nav-icon" icon={cilLayers} />
            Relatório Vacinas
          </NavLink>
        </CNavItem>
      </CSidebarNav>
    </CSidebar>
  )
}