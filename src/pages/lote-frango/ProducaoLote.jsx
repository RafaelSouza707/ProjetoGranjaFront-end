import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"

import Tabela from "@/components/Genericos/Tabela"
import ModalForm from "@/components/Genericos/ModalForm"
import ConfirmDialog from "@/components/Genericos/ConfirmDialog"

import {
  listarProducaoLote,
  criarProducaoLote,
  atualizarProducaoLote,
  deletarProducaoLote,
} from "@/api/aviario/producaoLote"
import { listarProdutos } from "@/api/venda_Estoque/produtoService"

import { formatarData } from "@/components/utils/DataFormater"

import { parseQuantidade, formatarQuantidade } from "@/components/utils/converterQuantidade"

export function ProducaoLote() {
  const { granjaId, loteFrangoId } = useParams()

  const [producao, setProducao] = useState([])
  const [open, setOpen] = useState(false)
  const [producaoSelecionada, setProducaoSelecionada] = useState(null)
  const [openDelete, setOpenDelete] = useState(false)
  const [producaoDelete, setProducaoDelete] = useState(null)
  const [produtos, setProdutos] = useState([])

  useEffect(() => {
    if (!granjaId) return
    carregarProducaoLote()
    carregarProdutos()
  }, [granjaId, loteFrangoId])

  async function carregarProdutos() {
    try {
      const dados = await listarProdutos(granjaId)
      setProdutos(dados ?? [])
    } catch (error) {
      console.error("Erro ao carregar produtos:", error)
      setProdutos([])
    }
  }

  async function carregarProducaoLote() {
    try {
      const dados = await listarProducaoLote(loteFrangoId, granjaId)
      setProducao(dados ?? [])
    } catch (error) {
      console.error("Erro ao carregar as produções do lote:", error)
      setProducao([])
    }
  }

  function novaProducaoLote() {
    setProducaoSelecionada(null)
    setOpen(true)
  }

  function editarProducaoLote(item) {
    setProducaoSelecionada({
        ...item,
        quantidade: formatarQuantidade(item.quantidade)
    })
    setOpen(true)
  }

  function excluirProducaoLote(item) {
    setProducaoDelete(item)
    setOpenDelete(true)
  }

  async function salvarProducaoLote(payload) {
    try {
      const body = {
        ...payload,
        lote_frango_id: Number(loteFrangoId),
        produto_id: Number(payload.produto_id),
        quantidade: parseQuantidade(payload.quantidade)
      }

      if (producaoSelecionada) {
        await atualizarProducaoLote(
          producaoSelecionada.id,
          loteFrangoId,
          granjaId,
          body
        )
      } else {
        await criarProducaoLote(loteFrangoId, granjaId, body)
      }

      setOpen(false)
      setProducaoSelecionada(null)
      carregarProducaoLote()
    } catch (error) {
      console.error("Erro ao salvar produção:", error)
    }
  }

  async function confirmarExclusao() {
    if (!producaoDelete) return

    try {
      await deletarProducaoLote(producaoDelete.id, loteFrangoId, granjaId)
      setOpenDelete(false)
      setProducaoDelete(null)
      carregarProducaoLote()
    } catch (error) {
      console.error("Erro ao excluir produção:", error)
    }
  }

  const colunas = [
    { key: "id", label: "ID", className: "w-16" },
    { key: "lote_frango.identificacao", 
      label: "Identificação Lote de Frango",
      render: (item) => item.lote_frango?.identificacao?.toUpperCase() ?? "-"
    },
    { key: "produto.tipo_produto.nome", label: "Produto" },
    { key: "produto.tipo_unidade_medida.sigla", label: "Unidade" },
    {
      key: "quantidade",
      label: "Quantidade",
      render: (item) => formatarQuantidade(item.quantidade)
    },
    {
      key: "data_producao",
      label: "Data",
      render: (item) => formatarData(item.data_producao)
    },
    { key: "observacao", label: "Observação" },
  ]

  const campos = [
    {
      name: "produto_id",
      label: "Produto",
      type: "select",
      options: produtos.map((produto) => ({
        value: produto.id,
        label: `${produto.tipo_produto?.nome ?? "Produto"} (${produto.tipo_unidade_medida?.sigla ?? ""})`,
      })),
      required: true,
    },
    {
      name: "quantidade",
      label: "Quantidade",
      type: "text",
    },
    {
      name: "data_producao",
      label: "Data de Produção",
      type: "date",
      required: true,
    },
    {
      name: "observacao",
      label: "Observação",
      type: "text",
      maxLength: 256,
    },
  ]

  return (
    <div className="space-y-4">
      <Tabela
        dados={producao}
        colunas={colunas}
        placeholderBusca="Buscar produção"
        textoBotao="+ Nova produção"
        onNovo={novaProducaoLote}
        onEditar={editarProducaoLote}
        onExcluir={excluirProducaoLote}
      />

      <ModalForm
        open={open}
        onOpenChange={(value) => {
          setOpen(value)
          if (!value) setProducaoSelecionada(null)
        }}
        titulo={producaoSelecionada ? "Editar Produção" : "Inserir Produção"}
        campos={campos}
        dadosIniciais={producaoSelecionada}
        onSalvar={salvarProducaoLote}
      />

      <ConfirmDialog
        open={openDelete}
        onOpenChange={setOpenDelete}
        onConfirm={confirmarExclusao}
        titulo="Excluir produção"
        descricao={`Deseja excluir a produção de ${producaoDelete?.quantidade ?? "-"}?`}
        textoConfirmar="Excluir"
      />
    </div>
  )
}
