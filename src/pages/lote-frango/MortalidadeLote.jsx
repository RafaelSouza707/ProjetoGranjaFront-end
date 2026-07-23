import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"

import Tabela from "@/components/Genericos/Tabela"
import ModalForm from "@/components/Genericos/ModalForm"
import ConfirmDialog from "@/components/Genericos/ConfirmDialog"
import {
  listarMortalidade,
  criarMortalidade,
  atualizarMortalidade,
  deletarMortalidade,
} from "@/api/aviario/mortalidadeService"

import { formatarData } from "@/components/utils/DataFormater"

export function MortalidadeLote() {
  const { granjaId, loteFrangoId } = useParams()

  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState(null)

  const [mortalidades, setMortalidades] = useState([])
  const [open, setOpen] = useState(false)
  const [mortalidadeSelecionada, setMortalidadeSelecionada] = useState(null)
  const [openDelete, setOpenDelete] = useState(false)
  const [mortalidadeDelete, setMortalidadeDelete] = useState(null)

  useEffect(() => {
    if (!granjaId) return
    carregarMortalidade()
  }, [granjaId, loteFrangoId])

  useEffect(() => {
    carregarMortalidade()
  }, [page])

  async function carregarMortalidade() {
    try {
      const dados = await listarMortalidade(loteFrangoId, granjaId, page)
      setMortalidades(dados.dados ?? [])
      setPagination(dados.pagination)
    } catch (error) {
        handleApiError(error)
    }
  }

  function novaMortalidade() {
    setMortalidadeSelecionada(null)
    setOpen(true)
  }

  function editarMortalidade(item) {
    setMortalidadeSelecionada(item)
    setOpen(true)
  }

  async function salvarMortalidade(payload) {
    try {
      const body = {
        ...payload,
        lote_frango_id: Number(loteFrangoId),
        quantidade_mortes: Number(payload.quantidade_mortes),
      }

      if (mortalidadeSelecionada) {
        await atualizarMortalidade(
          mortalidadeSelecionada.id,
          loteFrangoId,
          granjaId,
          body
        )
      } else {
        await criarMortalidade(loteFrangoId, granjaId, body)
      }

      setOpen(false)
      setMortalidadeSelecionada(null)
      carregarMortalidade()
    } catch (error) {
      handleApiError(error)
    }
  }

  function excluirMortalidade(item) {
    setMortalidadeDelete(item)
    setOpenDelete(true)
  }

  async function confirmarExclusao() {
    if (!mortalidadeDelete) return

    try {
      await deletarMortalidade(granjaId, mortalidadeDelete.id)
      setOpenDelete(false)
      setMortalidadeDelete(null)
      carregarMortalidade()
    } catch (error) {
      handleApiError(error)
    }
  }

  const colunas = [
    { key: "id", label: "ID", className: "w-16" },
    {
      key: "data",
      label: "Data",
      render: (item) => formatarData(item.data),
    },
    { key: "quantidade_mortes", label: "Mortes" },
  ]

  const campos = [
    { name: "data", label: "Data", type: "date" },
    { name: "quantidade_mortes", label: "Quantidade de Mortes", type: "number" },
  ]

  return (
    <div className="space-y-4">
      <Tabela
        dados={mortalidades}
        colunas={colunas}
        placeholderBusca="Buscar mortalidade"
        textoBotao="+ Nova Mortalidade"
        onNovo={novaMortalidade}
        onEditar={editarMortalidade}
        onExcluir={excluirMortalidade}
        pagination={pagination}
        onPageChange={setPage}
      />

      <ModalForm
        open={open}
        onOpenChange={(value) => {
          setOpen(value)
          if (!value) setMortalidadeSelecionada(null)
        }}
        titulo={
          mortalidadeSelecionada ? "Editar mortalidade" : "Inserir mortalidade"
        }
        campos={campos}
        dadosIniciais={mortalidadeSelecionada}
        onSalvar={salvarMortalidade}
      />

      <ConfirmDialog
        open={openDelete}
        onOpenChange={setOpenDelete}
        onConfirm={confirmarExclusao}
        titulo="Excluir mortalidade"
        descricao={`Deseja excluir a mortalidade de ${mortalidadeDelete?.quantidade_mortes ?? "-"} registro(s)?`}
        textoConfirmar="Excluir"
      />
    </div>
  )
}
