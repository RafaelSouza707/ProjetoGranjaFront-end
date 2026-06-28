import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/components/utils/AuthContext"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

import { loginUsuario, criarUsuario } from "@/api/usuario/usuario_service"

export default function Login() {
  const [modo, setModo] = useState("login")
  const { login } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    nome: "",
    email: "",
    senha: "",
    confirmarSenha: ""
  })

  const [mostrarSenha, setMostrarSenha] = useState(false)

  const { nome, email, senha, confirmarSenha } = form

  function handleChange(campo, valor) {
    setForm({ ...form, [campo]: valor })
  }

  async function entrar(e) {
    e.preventDefault()

    try {
      if (modo === "login") {
        const res = await loginUsuario({ email, senha })

        login(res.usuario)
        localStorage.setItem("user", JSON.stringify(res.usuario))

        navigate("/")
      } else {
        if (senha !== confirmarSenha) return

        await criarUsuario({ nome, email, senha })

        setModo("login")
      }
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-center text-2xl">
            {modo === "login" ? "Login" : "Cadastro"}
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={entrar} className="space-y-4">

            {modo === "cadastro" && (
              <Input
                placeholder="Nome"
                value={nome}
                onChange={(e) => handleChange("nome", e.target.value)}
                className="mb-4"
              />
            )}

            <Input
              type="email"
              placeholder="E-mail"
              value={email}
              onChange={(e) => handleChange("email", e.target.value)}
              className="mb-4"
            />

            <Input
              type={mostrarSenha ? "text" : "password"}
              placeholder="Senha"
              value={senha}
              onChange={(e) => handleChange("senha", e.target.value)}
              className="mb-4"
            />

            {modo === "cadastro" && (
              <Input
                type={mostrarSenha ? "text" : "password"}
                placeholder="Confirmar senha"
                value={confirmarSenha}
                onChange={(e) => handleChange("confirmarSenha", e.target.value)}
                className="mb-4"
              />
            )}

            <div className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={mostrarSenha}
                onChange={() => setMostrarSenha(!mostrarSenha)}
              />
              <span>Mostrar senha</span>
            </div>

            <Button className="w-full" type="submit">
              {modo === "login" ? "Entrar" : "Cadastrar"}
            </Button>
          </form>

          <div className="text-center mt-4 text-sm">
            <button
              className="text-blue-600"
              onClick={() =>
                setModo(modo === "login" ? "cadastro" : "login")
              }
              type="button"
            >
              {modo === "login"
                ? "Criar conta"
                : "Já tenho conta"}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}