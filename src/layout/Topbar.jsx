import {
  CNavbar,
  CContainer,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
  CAvatar,
  CButton
} from "@coreui/react"

import CIcon from "@coreui/icons-react"
import { cilUser } from "@coreui/icons"
import { useNavigate } from "react-router-dom"

export default function Topbar({
  setVisible,
  isMobile,
  isAuthenticated,
  userName,
  onLogin,
  onLogout,
}) {
  const navigate = useNavigate()

  return (
    <CNavbar colorScheme="light" className="bg-white px-3">
      <CContainer fluid className="d-flex justify-content-between align-items-center">

        <div>
          {isMobile && (
            <CButton color="light" onClick={() => setVisible(true)}>
              ☰
            </CButton>
          )}
        </div>

        <div>
          {isAuthenticated ? (
            <CDropdown alignment="end">
              <CDropdownToggle
                color="light"
                className="d-flex align-items-center gap-2"
              >
                <CAvatar color="primary" textColor="white">
                  <CIcon icon={cilUser} />
                </CAvatar>

                <span>{userName}</span>
              </CDropdownToggle>

              <CDropdownMenu>
                <CDropdownItem>Perfil</CDropdownItem>
                <CDropdownItem onClick={onLogout}>
                  Sair
                </CDropdownItem>
              </CDropdownMenu>
            </CDropdown>
          ) : (
            <CButton color="primary" onClick={onLogin}>
              Login
            </CButton>
          )}
        </div>

      </CContainer>
    </CNavbar>
  )
}