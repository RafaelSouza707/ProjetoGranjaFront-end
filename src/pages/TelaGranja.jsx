import { useEffect, useState } from "react"

import Tabela from "@/components/Genericos/Tabela"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

import ModalForm from "@/components/Genericos/ModalForm"

import {
  listarGranjas,
  criarGranja,
  atualizarGranja,
  deletarGranja,
} from "@/api/granja/granjaService"

export default function GranjaPage() {
  const [granjas, setGranjas] = useState([])

  const [openModal, setOpenModal] = useState(false)

  const [identificacao, setIdentificacao] = useState("")
  const [editId, setEditId] = useState(null)

  const [loading, setLoading] = useState(false)

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
    const ok = window.confirm(
      "Tem certeza que deseja deletar esta granja?"
    )
    if (!ok) return

    await deletarGranja(item.id)
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