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
  cilSettings,
  cilViewQuilt,
  cilFactory,
  cilWallet,
  cilStorage,
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
            Granjas
          </NavLink>
        </CNavItem>

        <CNavItem>
          <NavLink to="/equipe" className={navLinkClass}>
            <CIcon customClassName="nav-icon" icon={cilPeople} />
            Associados
          </NavLink>
        </CNavItem>
        
      </CSidebarNav>
    </CSidebar>
  )
}