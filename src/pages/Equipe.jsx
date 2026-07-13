import { useEffect, useState } from "react"

import Tabela from "@/components/Genericos/Tabela"
import ModalForm from "@/components/Genericos/ModalForm"

import {
  listarAssociacoes,
  convidarUsuario,
  responderConvite,
  deletarAssociacao
} from "@/api/usuario/usuarioAssociacaoService"

import {
  UserCheck,
  UserX,
  Clock3,
  Building2,
  UserMinus,
  Trash2,
  LogOut
} from "lucide-react"

import { fazerAssociacao } from "@/api/granja/AssociarUserGranjaService"
import { listarGranjas } from "@/api/granja/granjaService"

export default function Equipe() {

  const [usuarios, setUsuarios] = useState([])
  const [papel, setPapel] = useState(null)

  const [open, setOpen] = useState(false)
  const [openAssociacao, setOpenAssociacao] = useState(false)

  const [usuarioSelecionado, setUsuarioSelecionado] = useState(null)

  const [granjas, setGranjas] = useState([])

  const podeConvidar = papel === "REMETENTE" || papel === null

  async function carregarGranjas() {
    try {
      const dados = await listarGranjas()
      setGranjas(dados)
    } catch {
      setGranjas([])
    }
  }

  async function carregar() {
    const dados = await listarAssociacoes()
    console.log("Resposta:", dados)
    setUsuarios(dados.dados)
    setPapel(dados.papel)
  }

  useEffect(() => {
    carregar()
    carregarGranjas()
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

  async function deletar(id) {
    console.log("Antes do delete")

    await deletarAssociacao(id)

    console.log("Depois do delete")

    await carregar()

    console.log("Depois do carregar")
  }

  async function associar(payload) {
    await fazerAssociacao({
      ...payload,
      user_asssociar_id:
        papel === "REMETENTE"
          ? usuarioSelecionado.usuario_destino_id
          : usuarioSelecionado.usuario_origem_id
    })

    setOpenAssociacao(false)
    setUsuarioSelecionado(null)

    carregar()
  }

  const colunas = [
    {
      key:
        papel === "REMETENTE"
          ? "usuario_destino.nome"
          : "usuario_origem.nome",
      label: "Usuário",
    },
    {
      key:
        papel === "REMETENTE"
          ? "usuario_destino.email"
          : "usuario_origem.email",
      label: "Email",
    },
    {
      key: "status",
      label: "Status",
    },
  ]

  const campos = [
    {
      name: "email",
      label: "Email",
      type: "email"
    }
  ]

  const camposAssociacao = [
    {
      name: "granja_id",
      label: "Granja",
      type: "select",
      options: granjas.map(g => ({
        value: g.id,
        label: g.identificacao
      }))
    },
    {
      name: "tipo_user",
      label: "Cargo",
      type: "select",
      options: [
        {
          value: "OPERADOR",
          label: "Operador"
        },
        {
          value: "ADMINISTRADOR",
          label: "Administrador"
        }
      ]
    }
  ]

  return (
    <div className="p-6">

      <h1 className="text-4xl font-bold mb-6">
        Associação
      </h1>

      <Tabela
        dados={usuarios}
        colunas={colunas}
        placeholderBusca="Buscar usuário..."
        onNovo={podeConvidar ? () => setOpen(true) : undefined}
        textoBotao={podeConvidar ? "+ Convidar Funcionário" : undefined}
        acoes={(item) => {
          if (papel === "DESTINATARIO") {

            if (item.status === "PENDENTE") {
              return [
                {
                  tooltip: "Aceitar convite",
                  icon: <UserCheck className="h-4 w-4 text-green-600" />,
                  onClick: () => aceitar(item.id)
                },
                {
                  tooltip: "Recusar convite",
                  icon: <UserX className="h-4 w-4 text-red-600" />,
                  onClick: () => recusar(item.id)
                }
              ]
            }

            if (item.status === "ACEITO") {
              return [
                {
                  tooltip: "Sair da equipe",
                  icon: <LogOut className="h-4 w-4 text-orange-600" />,
                  onClick: () => deletar(item.id)
                }
              ]
            }

            return []
          }

          if (item.status === "PENDENTE") {
            return [
              {
                tooltip: "Cancelar convite",
                icon: <Clock3 className="h-4 w-4 text-yellow-500" />,
                onClick: () => cancelar(item.id)
              }
            ]
          }

          if (item.status === "ACEITO") {
            return [
              {
                tooltip: "Associar à granja",
                icon: <Building2 className="h-4 w-4 text-blue-600" />,
                onClick: () => {
                  setUsuarioSelecionado(item)
                  setOpenAssociacao(true)
                }
              },
              {
                tooltip: "Expulsar usuário",
                icon: <UserMinus className="h-4 w-4 text-red-600" />,
                onClick: () => deletar(item.id)
              }
            ]
          }

          return [
            {
              tooltip: "Excluir registro",
              icon: <Trash2 className="h-4 w-4 text-red-600" />,
              onClick: () => deletar(item.id)
            }
          ]
        }}
      />

      <ModalForm
        open={open}
        onOpenChange={setOpen}
        titulo="Convidar Funcionário"
        campos={campos}
        onSalvar={enviar}
      />

      <ModalForm
        open={openAssociacao}
        onOpenChange={setOpenAssociacao}
        titulo="Associar à Granja"
        campos={camposAssociacao}
        onSalvar={associar}
      />

    </div>
  )
}