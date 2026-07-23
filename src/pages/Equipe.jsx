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
  LogOut,
  X
} from "lucide-react"

import { fazerAssociacao, removerAssociacaoGranja } from "@/api/granja/AssociarUserGranjaService"
import { listarGranjas } from "@/api/granja/granjaService"
import { handleApiError } from "@/utils/handleApiError"

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
      setGranjas(dados ?? [])
    } catch(error) {
      handleApiError(error)
    }
  }

  async function carregar() {
    try {
      const { papel, dados } = await listarAssociacoes()

      const dadosFormatados = (dados ?? []).map(item => ({
        ...item,
        nome_exibicao:
          papel === "REMETENTE"
            ? item.usuario_destino?.nome
            : item.usuario_origem?.nome,
        email_exibicao:
          papel === "REMETENTE"
            ? item.usuario_destino?.email
            : item.usuario_origem?.email,
      }))

      setUsuarios(dadosFormatados)
      setPapel(papel)
    } catch (error) {
      handleApiError(error)
    }
  }

  useEffect(() => {
    carregar()
    carregarGranjas()
  }, [])

  async function enviar(payload) {
    try {
      await convidarUsuario(payload)
      setOpen(false)
      carregar()
    } catch (error) {
      handleApiError(error)
    }
  }

  async function aceitar(id) {
    try {
      await responderConvite({ id, resposta: "ACEITO" })
      carregar()
    } catch (error) {
      handleApiError(error)
    }
  }

  async function recusar(id) {
    try {
      await responderConvite({ id, resposta: "RECUSADO" })
      carregar()
    } catch (error) {
      handleApiError(error)
    }
  }

  async function cancelar(id) {
    try {
      await responderConvite({ id, resposta: "CANCELADO" })
      carregar()
    } catch (error) {
      handleApiError(error)
    }
  }

  async function deletar(id) {
    try {
      await deletarAssociacao(id)
      carregar()
    } catch (error) {
      handleApiError(error)
    }
  }

  async function associar(payload) {
    try {
      const usuarioAlvoId = papel === "REMETENTE" ? usuarioSelecionado.usuario_destino_id : usuarioSelecionado.usuario_origem_id;

      if (!usuarioAlvoId) {
        throw new Error("Não foi possível localizar o ID do usuário destino.");
      }

      await fazerAssociacao({
        granja_id: payload.granja_id,
        tipo_user: payload.tipo_user,
        user_associado_id: usuarioAlvoId
      }, payload.granja_id)

      setOpenAssociacao(false)
      setUsuarioSelecionado(null)
      setTimeout(async () => {
        await carregar()
      }, 500)

    } catch (error) {
      handleApiError(error)
    }
  }

  async function removerDaGranja(granjaId, usuarioId) {
    try {
      await removerAssociacaoGranja(usuarioId, granjaId)
      carregar()
    } catch (error) {
      handleApiError(error)
    }
  }

  const colunas = [
    {
      key: "nome_exibicao",
      label: papel === "REMETENTE" ? "Convidado" : "Remetente do Convite",
    },
    {
      key: "email_exibicao",
      label: "Email",
    },
    {
      key: "status",
      label: "Status Atual",
      render: (item) => {
        const status = item.status;
        const colorMap = {
          PENDENTE: "bg-yellow-100 text-yellow-800",
          ACEITO: "bg-green-100 text-green-800",
          RECUSADO: "bg-red-100 text-red-800",
          CANCELADO: "bg-gray-100 text-gray-800"
        };
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${colorMap[status] || "bg-gray-100 text-gray-800"}`}>
            {status}
          </span>
        );
      }
    },
    {
      key: "granjas",
      label: "Granja Vinculada / Cargo",
      render: (item) => {
        if (!item.granjas?.length) {
          return <span className="text-gray-400 italic">Sem vínculo</span>
        }

        const usuarioId =
          papel === "REMETENTE"
            ? item.usuario_destino_id
            : item.usuario_origem_id

        return (
          <div className="flex flex-wrap gap-1.5">
            {item.granjas.map((granja, index) => (
              <span
                key={granja.id || index}
                className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-blue-50 text-blue-700 text-xs font-medium border border-blue-200"
              >
                <Building2 className="h-3 w-3 text-blue-500" />

                {granja.identificacao}

                {granja.role && (
                  <span className="ml-1 px-1 bg-blue-200 text-blue-800 rounded text-[10px]">
                    {granja.role}
                  </span>
                )}

                {papel === "REMETENTE" && (
                  <button
                    type="button"
                    className="ml-1 rounded-full hover:bg-red-100 p-0.5 transition-colors"
                    title="Remover da granja"
                    onClick={() => removerDaGranja(granja.id, usuarioId)}
                  >
                    <X className="h-3 w-3 text-red-600" />
                  </button>
                )}
              </span>
            ))}
          </div>
        )
      }
    }
  ]

  const campos = [
    {
      name: "email",
      label: "Email do Usuário",
      type: "email"
    }
  ]

  const camposAssociacao = [
    {
      name: "granja_id",
      label: "Selecione a Granja",
      type: "select",
      options: granjas.map(g => ({
        value: g.id,
        label: g.identificacao
      }))
    },
    {
      name: "tipo_user",
      label: "Cargo / Permissão",
      type: "select",
      options: [
        { value: "OPERADOR", label: "Operador" },
        { value: "ADMINISTRADOR", label: "Administrador" }
      ]
    }
  ]

  return (
    <div className="p-6">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Membros da Equipe</h1>
          <p className="text-sm text-gray-500 mt-1">
            {papel === "REMETENTE" 
              ? "Gerencie os convites enviados e associe funcionários às suas granjas." 
              : "Visualize e responda aos convites recebidos de organizações."}
          </p>
        </div>
      </div>

      <Tabela
        dados={usuarios}
        colunas={colunas}
        placeholderBusca="Buscar por nome ou e-mail..."
        onNovo={podeConvidar ? () => setOpen(true) : undefined}
        textoBotao={podeConvidar ? "+ Convidar Funcionário" : undefined}
        acoes={(item) => {
          const status = item.status
          const associacaoId = item.id

          if (papel === "DESTINATARIO") {
            if (status === "PENDENTE") {
              return [
                {
                  tooltip: "Aceitar Convite",
                  icon: <UserCheck className="h-4 w-4 text-green-600" />,
                  onClick: () => aceitar(associacaoId)
                },
                {
                  tooltip: "Recusar Convite",
                  icon: <UserX className="h-4 w-4 text-red-600" />,
                  onClick: () => recusar(associacaoId)
                }
              ]
            }

            if (status === "ACEITO") {
              return [
                {
                  tooltip: "Sair da Equipe",
                  icon: <LogOut className="h-4 w-4 text-orange-600" />,
                  onClick: () => deletar(associacaoId)
                }
              ]
            }
            return []
          }

          if (status === "PENDENTE") {
            return [
              {
                tooltip: "Cancelar Convite Enviado",
                icon: <Clock3 className="h-4 w-4 text-yellow-500" />,
                onClick: () => cancelar(associacaoId)
              }
            ]
          }

          if (status === "ACEITO") {
            return [
              {
                tooltip: "Atrelar à Granja e Definir Cargo",
                icon: <Building2 className="h-4 w-4 text-blue-600" />,
                onClick: () => {
                  setUsuarioSelecionado(item)
                  setOpenAssociacao(true)
                }
              },
              {
                tooltip: "Expulsar Usuário da Organização",
                icon: <UserMinus className="h-4 w-4 text-red-600" />,
                onClick: () => deletar(associacaoId)
              }
            ]
          }

          return [
            {
              tooltip: "Remover Registro Histórico",
              icon: <Trash2 className="h-4 w-4 text-red-600" />,
              onClick: () => deletar(associacaoId)
            }
          ]
        }}
      />

      <ModalForm
        open={open}
        onOpenChange={setOpen}
        titulo="Convidar Novo Funcionário"
        campos={campos}
        onSalvar={enviar}
      />

      <ModalForm
        open={openAssociacao}
        onOpenChange={setOpenAssociacao}
        titulo="Atrelar Usuário a uma Granja"
        campos={camposAssociacao}
        onSalvar={associar}
      />
    </div>
  )
}