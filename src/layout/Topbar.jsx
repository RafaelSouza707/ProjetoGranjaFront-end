import { CNavbar, CContainer, CDropdown, CDropdownToggle, CDropdownMenu, CDropdownItem, CAvatar, CButton } from '@coreui/react';
import CIcon from '@coreui/icons-react'
import { cilUser } from '@coreui/icons'

export default function Topbar({ setVisible, isMobile }) {
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
            <CDropdown alignment="end">
            <CDropdownToggle color="light" className="d-flex align-items-center gap-2">

                <CAvatar color="primary" textColor="white">
                <button className="btn btn-light rounded-circle d-flex align-items-center justify-content-center"
                        style={{ width: '40px', height: '40px' }}>
                <CIcon icon={cilUser} />
                </button>
                </CAvatar>

                <span>Usuário</span>
            </CDropdownToggle>

            <CDropdownMenu>
                <CDropdownItem>Perfil</CDropdownItem>
                <CDropdownItem>Sair</CDropdownItem>
            </CDropdownMenu>
            </CDropdown>
        </div>

      </CContainer>
    </CNavbar>
  );
}