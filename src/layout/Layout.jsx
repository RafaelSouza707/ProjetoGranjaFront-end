import { useNavigate, Outlet } from "react-router-dom"
import { useState } from "react"

import Sidebar from "./Sidebar"
import Topbar from "./Topbar"


import { useAuth } from "@/components/utils/AuthContext"

export default function Layout() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const [visible, setVisible] = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)

  function handleLogout() {
    logout()
    navigate("/tela_login")
  }

  return (
    <div className="d-flex vh-100">
      <Sidebar visible={visible} setVisible={setVisible} isMobile={isMobile} />

      <div className="flex-grow-1 d-flex flex-column">
        <Topbar
          isAuthenticated={!!user}
          userName={user?.nome}
          onLogin={() => navigate("tela_login")}
          onLogout={handleLogout}
          setVisible={setVisible}
          isMobile={isMobile}
        />

        <div className="p-4 flex-grow-1 overflow-auto">
          <Outlet />
        </div>
      </div>
    </div>
  )
}