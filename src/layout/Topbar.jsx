import {
  CNavbar,
  CContainer,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
  CDropdownDivider,
  CAvatar,
  CButton
} from "@coreui/react"

import CIcon from "@coreui/icons-react"
import { cilUser, cilMenu, cilSwapHorizontal, cilBuilding, cilViewQuilt } from "@coreui/icons"
import { useNavigate, useParams } from "react-router-dom"
import { deslogar } from "@/api/usuario/logout_service"
import { useAuth } from "@/components/utils/AuthContext"
import { useEffect, useState } from "react"
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

  const activeGranjaId = granjaId || granjaSelecionada?.id

  useEffect(() => {
    async function carregarGranjasTopbar() {
      try {
        const resposta = await listarGranjas()
        // Garante suporte tanto para array direto quanto para dados paginados ({ dados: [...] })
        const granjas = Array.isArray(resposta) ? resposta : (resposta?.dados ?? [])
        setListaGranjas(granjas)
      } catch (error) {
        console.error("Erro ao carregar granjas no Topbar:", error)
      }
    }
    if (isAuthenticated) {
      carregarGranjasTopbar()
    }
  }, [isAuthenticated])

  // Busca o objeto completo da granja atual
  const granjaAtual = listaGranjas.find(g => String(g.id) === String(activeGranjaId)) || granjaSelecionada

  // Define o texto a ser exibido no topo (prioriza identificacao, depois nome, depois fallback)
  const rotuloGranjaAtual = activeGranjaId
    ? (granjaAtual?.identificacao || granjaAtual?.nome || `Granja #${activeGranjaId}`)
    : 'Todas as Granjas'

  function trocarGranja(granja) {
    if (!granja) {
      if (limparGranjaSelecionada) limparGranjaSelecionada()
      navigate('/')
    } else {
      selecionarGranja(
        { id: granja.id, identificacao: granja.identificacao || granja.nome },
        granja.contexto
      )
      navigate(`/granja/${granja.id}/lotes_frangos`)
    }
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

          {/* NAVEGAÇÃO DE GRANJAS VIA CDROPDOWN DO COREUI */}
          {isAuthenticated && (
            <CDropdown variant="btn-group">
              <CDropdownToggle
                color="light"
                className="border bg-white d-flex align-items-center gap-2 py-1.5 px-3 rounded-pill shadow-sm text-start"
                style={{ fontSize: '13px', minWidth: '180px', maxWidth: '260px' }}
              >
                <CIcon icon={cilBuilding} className="text-secondary flex-shrink-0" size="sm" />
                <span className="text-dark fw-semibold text-truncate flex-grow-1">
                  {rotuloGranjaAtual}
                </span>
                <CIcon icon={cilSwapHorizontal} className="text-muted flex-shrink-0 ms-1" size="sm" style={{ width: '12px', height: '12px' }} />
              </CDropdownToggle>

              <CDropdownMenu className="shadow-lg rounded-xl py-1" style={{ minWidth: '220px' }}>
                <CDropdownItem
                  as="button"
                  onClick={() => trocarGranja(null)}
                  className={`d-flex align-items-center gap-2 py-2 ${!activeGranjaId ? 'fw-bold bg-light' : ''}`}
                  style={{ fontSize: '12px' }}
                >
                  <CIcon icon={cilViewQuilt} size="sm" />
                  <span>Todas as Granjas</span>
                </CDropdownItem>

                {listaGranjas.length > 0 && <CDropdownDivider />}

                <div className="overflow-auto" style={{ maxHeight: '200px' }}>
                  {listaGranjas.map((g) => {
                    const isSelected = String(activeGranjaId) === String(g.id)
                    const nomeExibicao = g.identificacao || g.nome || `Granja #${g.id}`

                    return (
                      <CDropdownItem
                        key={g.id}
                        as="button"
                        onClick={() => trocarGranja(g)}
                        className={`d-flex align-items-center gap-2 py-2 text-truncate ${isSelected ? 'fw-bold bg-light text-primary' : ''}`}
                        style={{ fontSize: '12px' }}
                      >
                        <CIcon icon={cilBuilding} size="sm" className="flex-shrink-0" />
                        <span className="text-truncate">{nomeExibicao}</span>
                      </CDropdownItem>
                    )
                  })}
                </div>
              </CDropdownMenu>
            </CDropdown>
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