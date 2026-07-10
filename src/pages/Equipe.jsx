import { useEffect, useState } from "react"

import Tabela from "@/components/Genericos/Tabela"
import ModalForm from "@/components/Genericos/ModalForm"

import {
  listarAssociacoes,
  convidarUsuario,
  responderConvite
} from "@/api/usuario/usuarioAssociacaoService"

export default function Equipe() {

  const [usuarios, setUsuarios] = useState([])

  const [open, setOpen] = useState(false)

  async function carregar() {
    const dados = await listarAssociacoes()
    console.log(dados)
    console.log(Array.isArray(dados));
    setUsuarios(dados)
  }

  useEffect(() => {
    carregar()
  }, [])

  async function enviar(payload) {
    await convidarUsuario(payload)

    setOpen(false)

    carregar()
  }

  async function aceitar(id) {
    await responderConvite({
      id,
      resposta: "ACEITO"
    })

    carregar()
  }

  async function recusar(id) {
    await responderConvite({
      id,
      resposta: "RECUSADO"
    })

    carregar()
  }

  async function cancelar(id) {
    await responderConvite({
      id,
      resposta: "CANCELADO"
    })

    carregar()
  }

  const colunas = [
    {
      key: "usuario_destino.nome",
      label: "Usuário"
    },
    {
      key: "usuario_destino.email",
      label: "Email"
    },
    {
      key: "status",
      label: "Status"
    }
  ]

  const campos = [
    {
      name: "email",
      label: "Email",
      type: "email"
    }
  ]

  return (
    <div className="p-6">

      <h1 className="text-4xl font-bold mb-6">
        Equipe
      </h1>

      <Tabela
        dados={usuarios}
        colunas={colunas}
        textoBotao="+ Convidar Funcionário"
        placeholderBusca="Buscar usuário..."
        onNovo={() => setOpen(true)}
        onEditar={(item) => {
          switch (item.status) {

            case "PENDENTE":
              cancelar(item.id)
              break

            case "RECEBIDO":
              aceitar(item.id)
              break
          }
        }}
      />

      <ModalForm
        open={open}
        onOpenChange={setOpen}
        titulo="Convidar Funcionário"
        campos={campos}
        onSalvar={enviar}
      />

    </div>
  )
}