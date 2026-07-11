import { createContext, useContext, useState } from "react"

const AuthContext = createContext()

export function AuthProvider({ children }) {

  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user")
    return stored ? JSON.parse(stored) : null
  })

  const [granja, setGranja] = useState(() => {
    const stored = localStorage.getItem("granja")
    return stored ? JSON.parse(stored) : null
  })

  const [contexto, setContexto] = useState(() => {
    const stored = localStorage.getItem("contexto")
    return stored ? JSON.parse(stored) : null
  })

  function login(userData) {
    setUser(userData)
    localStorage.setItem("user", JSON.stringify(userData))
  }

  function logout() {
    setUser(null)
    setGranja(null)
    setContexto(null)

    localStorage.removeItem("user")
    localStorage.removeItem("granja")
    localStorage.removeItem("contexto")
  }

  function selecionarGranja(granjaData, contextoData) {
    setGranja(granjaData)
    setContexto(contextoData)

    localStorage.setItem("granja", JSON.stringify(granjaData))
    localStorage.setItem("contexto", JSON.stringify(contextoData))
  }

  function atualizarContexto(contextoData) {
    setContexto(contextoData)
    localStorage.setItem("contexto", JSON.stringify(contextoData))
  }

  function temPermissao(permissao) {
    return contexto?.permissoes?.includes(permissao)
  }

  function possuiRole(role) {
    return contexto?.role === role
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        granja,
        contexto,
        login,
        logout,
        selecionarGranja,
        atualizarContexto,
        temPermissao,
        possuiRole
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}