import { useEffect, useState } from "react"

import {
  me,
  atualizarUsuario
} from "@/api/usuario/usuarioService"

import {listarSexo} from "@/api/usuario/usuarioService"

export default function Perfil() {

  const [loading, setLoading] = useState(true)
  const [sexos, setSexos] = useState([])

  const [form, setForm] = useState({
    nome: "",
    email: "",
    cpf: "",
    data_nascimento: "",
    sexo_id: "",
    senha: "",
    confirmarSenha: "",
  })

  async function carregarUsuario() {
    try {
      const dados = await me()

      setForm({
        nome: dados.nome || "",
        email: dados.email || "",
        cpf: dados.cpf || "",
        data_nascimento: dados.data_nascimento || "",
        sexo_id: dados.sexo_id || "",
        senha: "",
        confirmarSenha: "",
      })
    } catch (error) {
      handleApiError(error)
    } finally {
      setLoading(false)
    }
  }

  async function carregarSexo() {
    try {
      const dados = await listarSexo()
      setSexos(dados ?? [])

    } catch (error) {
      handleApiError(error)
    }
  }

  useEffect(() => {
    carregarUsuario()
    carregarSexo()
  }, [])

  function handleChange(e) {
    const { name, value } = e.target

    setForm(prev => ({
      ...prev,
      [name]: value
    }))
  }

  async function salvar(e) {
    e.preventDefault()

    try {
      if (
        form.senha &&
        form.senha !== form.confirmarSenha
      ) {
        alert("As senhas não conferem")
        return
      }

      const dados = {
        nome: form.nome,
        email: form.email,
        data_nascimento: form.data_nascimento || null,
        sexo_id: form.sexo_id || null,
        cpf: form.cpf || null,
      }

      if (form.senha) {
        dados.senha = form.senha
      }

      await atualizarUsuario(dados)

      alert("Dados atualizados com sucesso")

      await carregarUsuario()
    } catch (error) {
      handleApiError(error)
    }
  }

  if (loading) {
    return <p className="p-6">Carregando...</p>
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-6">
        Configurações da Conta
      </h1>

      <form
        onSubmit={salvar}
        className="bg-white border rounded-xl p-6 shadow-sm space-y-6"
      >
        <div>
          <h2 className="text-xl font-semibold mb-4">
            Dados Pessoais
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <div>
              <label className="block mb-1">Nome</label>
              <input
                className="w-full border rounded p-2"
                name="nome"
                value={form.nome}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block mb-1">Email</label>
              <input
                className="w-full border rounded p-2"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block mb-1">CPF</label>
              <input
                className="w-full border rounded p-2 bg-gray-100"
                name="cpf"
                type="number"
                value={form.cpf}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block mb-1">
                Data de Nascimento
              </label>
              <input
                className="w-full border rounded p-2"
                name="data_nascimento"
                type="date"
                value={form.data_nascimento}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block mb-1">Sexo</label>
              <select
                className="w-full border rounded p-2"
                name="sexo_id"
                value={form.sexo_id}
                onChange={handleChange}
              >
                <option value="">Selecione</option>
                <option value="1">Masculino</option>
                <option value="2">Feminino</option>
              </select>
            </div>

          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">
            Alterar Senha
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <div>
              <label className="block mb-1">
                Nova Senha
              </label>
              <input
                className="w-full border rounded p-2"
                type="password"
                name="senha"
                value={form.senha}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block mb-1">
                Confirmar Senha
              </label>
              <input
                className="w-full border rounded p-2"
                type="password"
                name="confirmarSenha"
                value={form.confirmarSenha}
                onChange={handleChange}
              />
            </div>

          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2 rounded bg-blue-600 text-white"
          >
            Salvar Alterações
          </button>
        </div>
      </form>
    </div>
  )
}