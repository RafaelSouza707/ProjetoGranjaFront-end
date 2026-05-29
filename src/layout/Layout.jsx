import { useState, useEffect } from 'react'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import { Outlet } from 'react-router-dom'

export default function Layout() {
  const [visible, setVisible] = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div className="d-flex vh-100">
      <Sidebar visible={visible} setVisible={setVisible} isMobile={isMobile} />

      <div className="flex-grow-1 d-flex flex-column">
        <Topbar setVisible={setVisible} isMobile={isMobile} />

        <div className="p-4 flex-grow-1 overflow-auto">
          <Outlet />
        </div>
      </div>
    </div>
  )
}