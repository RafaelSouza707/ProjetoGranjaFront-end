import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"

import Tabela from "@/components/Genericos/Tabela"
import ModalForm from "@/components/Genericos/ModalForm"
import ConfirmDialog from "@/components/Genericos/ConfirmDialog"

import {
  listarProdutos,
  criarProduto,
  atualizarProduto,
  deletarProduto,
} from "@/api/venda_Estoque/produtoService"

import { listarTipoProduto } from "@/api/aviario/tipoProdutoService"
import { listarTipoUnidadeMedida } from "@/api/venda_Estoque/tipoUnidadeMedidaService"


import { parseQuantidade, formatarQuantidade } from "@/components/utils/converterQuantidade"

export default function Produto() {
const { granjaId } = useParams()

  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState(null)

  const [produtos, setProdutos] = useState([])
  const [tipoProduto, setTipoProduto] = useState([])
  const [tipoUnidadeMedida, setTipoUnidadeMedida] = useState([])

  const [open, setOpen] = useState(false)
  const [produtoSelecionado, setProdutoSelecionado] = useState(null)

  const [openDelete, setOpenDelete] = useState(false)
  const [produtoDelete, setProdutoDelete] = useState(null)

  useEffect(() => {
    if (!granjaId) return
    carregarTipoProduto()
    carregarUnidadeMedida()

  }, [])

  useEffect(() => {
    carregarProdutos()
  }, [page])

  async function carregarProdutos() {
    try {
      const dados = await listarProdutos(granjaId, page)
      setProdutos(dados.dados ?? [])
      setPagination(dados.pagination)
    } catch (error) {
      handleApiError(error)
    }
  }

  async function carregarTipoProduto() {
    try {
      const dados = await listarTipoProduto(granjaId)
      setTipoProduto(dados ?? [])
    } catch (error) {
      handleApiError(error)
    }
  }

  async function carregarUnidadeMedida() {
    try {
    const dados = await listarTipoUnidadeMedida(granjaId)
    setTipoUnidadeMedida(dados ?? [])
  } catch (error) {
    handleApiError(error)
  }
  }

  function novoProduto() {
    setProdutoSelecionado(null)
    setOpen(true)
  }

  function editarProduto(item) {
      setProdutoSelecionado({
      ...item,
      tipo_produto_id: item.tipo_produto_id,
      tipo_unidade_medida_id: item.tipo_unidade_medida_id,
      quantidade_estoque: formatarQuantidade(item.quantidade_estoque),
    })

    setOpen(true)
  }

  function excluirProduto(item) {
    setProdutoDelete(item)
    setOpenDelete(true)
  }

  async function salvarProduto(payload) {
    try {
      const body = {
      ...payload,
      granja_id: Number(granjaId),
      tipo_produto_id: Number(payload.tipo_produto_id),
      tipo_unidade_medida_id: Number(payload.tipo_unidade_medida_id),
      quantidade_estoque: parseQuantidade(payload.quantidade_estoque),
    }

    if (produtoSelecionado) {
      await atualizarProduto(
        produtoSelecionado.id,
        granjaId,
        body
      )
    } else {
      await criarProduto(granjaId, body)
    }

      setOpen(false)
      setProdutoSelecionado(null)

      await carregarProdutos()
    } catch (error) {
      handleApiError(error)
    }
  }

  async function confirmarExclusao() {
    if (!produtoDelete) return
      try {
        await deletarProduto(
          produtoDelete.id,
          granjaId
        )

        setOpenDelete(false)
        setProdutoDelete(null)

        await carregarProdutos()
      } catch (error) {
        handleApiError(error)
      }
  }

  const colunas = [
    {
      key: "id",
      label: "#",
    },
    {
      key: "tipo_produto.nome",
      label: "Produto",
    },
    {
      key: "descricao",
      label: "Descrição",
    },
    {
      key: "tipo_unidade_medida.sigla",
      label: "Unidade",
    },
    {
      key: "quantidade_estoque",
      label: "Quantidade",
      render: (item) => formatarQuantidade(item.quantidade_estoque)
    },
    {
      key: "ativo",
      label: "Ativo",
      render: (item) => (item.ativo ? "Sim" : "Não"),
    },
  ]

  const campos = [
    {
      name: "tipo_produto_id",
      label: "Tipo Produto",
      type: "select",
      options: tipoProduto.map((tipo) => ({
      value: tipo.id,
      label: tipo.nome,
      })),
      required: true
    },
    {
      name: "tipo_unidade_medida_id",
      label: "Unidade de Medida",
      type: "select",
      options: tipoUnidadeMedida.map((unidade) => ({
      value: unidade.id,
      label: unidade.sigla,
      })),
      required: true
    },
    {
      name: "descricao",
      label: "Descrição",
      type: "text",
    },
    {
      name: "quantidade_estoque",
      label: "Quantidade",
      type: "number",
      min: 0,
      required: true
    },
    {
      name: "data_cadastro",
      label: "Data Cadastro",
      type: "date",
      required: true
    },
  ]

  return ( 
    <div className="space-y-4"> 
      <h1>
        Produtos / Estoque
      </h1>
      <Tabela
        dados={produtos}
        colunas={colunas}
        placeholderBusca="Buscar produtos..."
        textoBotao="+ Inserir Produto"
        onNovo={novoProduto}
        onEditar={editarProduto}
        onExcluir={excluirProduto}
        pagination={pagination}
        onPageChange={setPage}
        />

      <ModalForm
        open={open}
        onOpenChange={(value) => {
          setOpen(value)
          
          if (!value) {
            setProdutoSelecionado(null)
          }
        }}
        titulo={
          produtoSelecionado
            ? "Editar Produto"
            : "Inserir Produto"
          }
        campos={campos}
        dadosIniciais={produtoSelecionado}
        onSalvar={salvarProduto}
        />

      <ConfirmDialog
        open={openDelete}
        onOpenChange={setOpenDelete}
        onConfirm={confirmarExclusao}
        titulo="Excluir produto"
        descricao={`Deseja realmente excluir o produto "${produtoDelete?.descricao ?? ""}"?`}
        textoConfirmar="Excluir"
      />
    </div>

    )
}
