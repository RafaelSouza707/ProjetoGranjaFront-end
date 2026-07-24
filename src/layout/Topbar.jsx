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
import { cilUser, cilMenu, cilSwapHorizontal, cilBuilding, cilViewQuilt } from "@coreui/icons"
import { useNavigate, useParams } from "react-router-dom"
import { deslogar } from "@/api/usuario/logout_service"
import { useAuth } from "@/components/utils/AuthContext"
import { useEffect, useState, useRef } from "react"
import { listarGranjas } from "@/api/granja/granjaService"

export default function Topbar({
  setVisible,
  isMobile,
  isAuthenticated,
  userName,
  onLogin,
}) {
  const navigate = useNavigate()
  const { logout, granjaSelecionada, selecionarGranja, limparGranjaSelecionada } = useAuth()
  const { granjaId } = useParams()

  const [listaGranjas, setListaGranjas] = useState([])
  const [dropdownGranjaAberto, setDropdownGranjaAberto] = useState(false)
  const dropdownRef = useRef(null)

  const activeGranjaId = granjaId || granjaSelecionada?.id

  useEffect(() => {
    async function carregarGranjasTopbar() {
      try {
        const dados = await listarGranjas()
        setListaGranjas(dados ?? [])
      } catch (error) {}
    }
    if (isAuthenticated) {
      carregarGranjasTopbar()
    }
  }, [isAuthenticated])

  // Fecha o menu flutuante se clicar fora dele
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownGranjaAberto(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const granjaAtualObj = listaGranjas.find(g => String(g.id) === String(activeGranjaId)) || granjaSelecionada

  function trocarGranja(granja) {
    if (!granja) {
      if (limparGranjaSelecionada) limparGranjaSelecionada()
      navigate('/')
    } else {
      selecionarGranja(
        { id: granja.id, identificacao: granja.identificacao },
        granja.contexto
      )
      navigate(`/granja/${granja.id}/lotes_frangos`)
    }
    setDropdownGranjaAberto(false)
  }

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
    <CNavbar colorScheme="light" className="bg-white px-3 border-bottom">
      <CContainer fluid className="d-flex justify-content-between align-items-center">

        <div className="d-flex align-items-center gap-2">
          {isMobile && (
            <CButton
              color="light"
              variant="ghost"
              className="me-1"
              onClick={() => setVisible(v => !v)}
            >
              <CIcon icon={cilMenu} size="lg" />
            </CButton>
          )}

          <CButton color="light" className="d-flex align-items-center gap-1 text-sm" onClick={handleGoBack}>
            ← Voltar
          </CButton>

          {/* MENU FLUTUANTE DE GRANJAS NO TOPO (TOPBAR) */}
          {isAuthenticated && (
            <div className="position-relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownGranjaAberto(!dropdownGranjaAberto)}
                className="btn btn-light border bg-white d-flex align-items-center gap-2 py-1.5 px-3 rounded-pill shadow-sm text-start"
                type="button"
                style={{ fontSize: '13px', minWidth: '180px', maxWidth: '240px' }}
              >
                <CIcon icon={cilBuilding} className="text-secondary flex-shrink-0" size="sm" />
                <span className="text-dark fw-semibold text-truncate flex-grow-1">
                  {activeGranjaId ? (granjaAtualObj?.identificacao || `Granja #${activeGranjaId}`) : 'Todas as Granjas'}
                </span>
                <CIcon icon={cilSwapHorizontal} className="text-muted flex-shrink-0" size="sm" style={{ width: '12px', height: '12px' }} />
              </button>

              {dropdownGranjaAberto && (
                <div className="position-absolute top-100 start-0 mt-2 bg-white border shadow-lg rounded-xl z-3 py-1 overflow-hidden" style={{ minWidth: '220px' }}>
                  <button
                    onClick={() => trocarGranja(null)}
                    className={`w-100 text-start px-3 py-2 text-dark border-0 bg-transparent d-flex align-items-center gap-2 text-decoration-none ${!activeGranjaId ? 'fw-bold bg-light' : ''}`}
                    style={{ fontSize: '12px' }}
                  >
                    <CIcon icon={cilViewQuilt} size="sm" />
                    <span>Todas as Granjas</span>
                  </button>

                  {listaGranjas.length > 0 && <div className="dropdown-divider my-1"></div>}

                  <div className="overflow-auto" style={{ maxHeight: '180px' }}>
                    {listaGranjas.map((g) => (
                      <button
                        key={g.id}
                        onClick={() => trocarGranja(g)}
                        className={`w-100 text-start px-3 py-2 text-dark border-0 bg-transparent d-flex align-items-center gap-2 text-truncate ${String(activeGranjaId) === String(g.id) ? 'fw-bold bg-light text-danger' : ''}`}
                        style={{ fontSize: '12px' }}
                      >
                        <CIcon icon={cilBuilding} size="sm" className="flex-shrink-0" />
                        <span className="text-truncate">{g.identificacao}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div>
          {isAuthenticated ? (
            <CDropdown alignment="end">
              <CDropdownToggle
                color="light"
                className="d-flex align-items-center gap-2 rounded-pill px-3 py-1.5"
              >
                <CAvatar color="primary" textColor="white" size="sm">
                  <CIcon icon={cilUser} />
                </CAvatar>

                <span className="fw-medium text-sm">{userName}</span>
              </CDropdownToggle>

              <CDropdownMenu>
                <CDropdownItem className="cursor-pointer" onClick={() => navigate("/usuario/perfil")}>Perfil</CDropdownItem>
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