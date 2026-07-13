import { useEffect, useState } from "react"

import Tabela from "@/components/Genericos/Tabela"
import ModalForm from "@/components/Genericos/ModalForm"
import ConfirmDialog from "@/components/Genericos/ConfirmDialog"

import {
  listarGranjas,
  criarGranja,
  atualizarGranja,
  deletarGranja,
} from "@/api/granja/granjaService"

import { toast } from "sonner"

import { useNavigate } from "react-router-dom"
import { useAuth } from "@/components/utils/AuthContext"

export default function GranjaPage() {

  function abrirTela(item, rota, permissao) {
    if (!item.contexto.permissoes.includes(permissao)) {
      toast.error("Você não possui permissão para acessar este módulo.")
      return
    }

    selecionarGranja(
      {
        id: item.id,
        identificacao: item.identificacao,
      },
      item.contexto
    )

    navigate(rota)
  }

  function executarAcao(item, permissao, callback) {

    if (!item.contexto.permissoes.includes(permissao)) {
      toast.error("Você não possui permissão para realizar esta ação.")
      return
    }

    callback(item)
  }

  const navigate = useNavigate()

  const { selecionarGranja } = useAuth()

  const [granjas, setGranjas] = useState([])

  const [openModal, setOpenModal] = useState(false)

  const [identificacao, setIdentificacao] = useState("")
  const [editId, setEditId] = useState(null)

  const [loading, setLoading] = useState(false)

  const [openDelete, setOpenDelete] = useState(false)
  const [itemDelete, setItemDelete] = useState(null)

  async function carregar() {
    const data = await listarGranjas()
    setGranjas(data)
  }

  useEffect(() => {
    carregar()
  }, [])

  async function salvar(form) {
    if (!form.identificacao?.trim()) return

    setLoading(true)

    try {
      if (editId) {
        await atualizarGranja(editId, {
          identificacao: form.identificacao.trim(),
        })
      } else {
        await criarGranja({
          identificacao: form.identificacao.trim(),
        })
      }

      setOpenModal(false)
      setEditId(null)
      setIdentificacao("")

      await carregar()
    } finally {
      setLoading(false)
    }
  }

  function editar(item) {
    setEditId(item.id)
    setIdentificacao(item.identificacao)
    setOpenModal(true)
  }

  function excluir(item) {
    setItemDelete(item)
    setOpenDelete(true)
  }

  async function confirmarExclusao() {
    await deletarGranja(itemDelete.id)

    setOpenDelete(false)
    setItemDelete(null)

    await carregar()
  }

  const colunas = [
    {
      key: "id",
      label: "ID",
    },
    {
      key: "identificacao",
      label: "Identificação",
    },
  ]

  return (
    <div className="p-4 space-y-4">

      <Tabela
        dados={granjas}
        colunas={colunas}
        placeholderBusca="Buscar granja..."
        textoBotao="Nova Granja"
        onNovo={() => {
          setEditId(null)
          setIdentificacao("")
          setOpenModal(true)
        }}

        onTelaLotesFrangos={(item) =>
          abrirTela(item, `granja/${item.id}/lotes_frangos`, "AVIARIO")
        }

        onProdutos={(item) =>
          abrirTela(item, `granja/${item.id}/produtos`, "ESTOQUE")
        }

        onVendas={(item) => 
          abrirTela(item, `granja/${item.id}/vendas`, "VENDA")
        }

        onFinancas={(item) =>
          abrirTela(item, `granja/${item.id}/financas`, "FINANCAS")
        }

        onConfigurar={(item) =>
          abrirTela(item, `/configuracoes/${item.id}`, "GRANJA")
        }

        onLoteRacao={(item) => 
          abrirTela(item, `/granja/${item.id}/lote_racao`,"ESTOQUE")
        }

        onEditar={(item) =>
          executarAcao(item, "GRANJA", editar)
        }

        onExcluir={(item) =>
          executarAcao(item, "GRANJA", excluir)
        }
      />

      <ConfirmDialog
        open={openDelete}
        onOpenChange={setOpenDelete}
        onConfirm={confirmarExclusao}
        titulo="Excluir granja"
        descricao={`Deseja realmente excluir a granja "${itemDelete?.identificacao}"?`}
        textoConfirmar="Excluir"
      />

      <ModalForm
        open={openModal}
        onOpenChange={setOpenModal}
        onSalvar={salvar}
        titulo={editId ? "Editar Granja" : "Nova Granja"}
        dadosIniciais={{
          identificacao,
        }}
        campos={[
          {
            name: "identificacao",
            label: "Identificação",
          },
        ]}
      />

    </div>
  )
}