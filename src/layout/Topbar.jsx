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
import { deslogar } from "@/api/usuario/logout_service"
import { useAuth } from "@/components/utils/AuthContext"

export default function Topbar({
  setVisible,
  isMobile,
  isAuthenticated,
  userName,
  onLogin,
  onLogout,
}) {
  const navigate = useNavigate()

  const { logout } = useAuth()

  async function handleLogout() {
    await deslogar()
    logout()
    navigate("/tela_login")
  }

  function handleGoBack() {
    if (window.history.length > 1) {
      navigate(-1)
    } else {
      navigate("/")
    }
  }

  return (
    <CNavbar colorScheme="light" className="bg-white px-3">
      <CContainer fluid className="d-flex justify-content-between align-items-center">

        <div className="d-flex align-items-center gap-2">
          <CButton color="light" className="d-flex align-items-center gap-1" onClick={handleGoBack}>
            ← Voltar
          </CButton>

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
                <CDropdownItem className="cursor-pointer" onClick={() => navigate("/usuario/perfil")} >Perfil</CDropdownItem>
                <CDropdownItem className="cursor-pointer" onClick={handleLogout}>
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