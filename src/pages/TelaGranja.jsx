import { useEffect, useState } from "react"

import Tabela from "@/components/Genericos/Tabela"

import ModalForm from "@/components/Genericos/ModalForm"

import {
  listarGranjas,
  criarGranja,
  atualizarGranja,
  deletarGranja,
} from "@/api/granja/granjaService"

import ConfirmDialog  from "@/components/Genericos/ConfirmDialog"
import { useNavigate } from "react-router-dom"

export default function GranjaPage() {
  const navigate = useNavigate()
  
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

  async function excluir(item) {
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
        onEditar={editar}
        onExcluir={excluir}
        onConfigurar={(item) => navigate(`/configuracoes/${item.id}`)}
        onTelaLotesFrangos={(item) => navigate(`granja/${item.id}/lotes_frangos`)}
        onProdutos={(item) => navigate(`granja/${item.id}/produtos`)}
        onFinancas={(item) => navigate(`granja/${item.id}/financas`)}
        onLoteRacao={(item) => navigate(`granja/${item.id}/lote_racao`)}
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