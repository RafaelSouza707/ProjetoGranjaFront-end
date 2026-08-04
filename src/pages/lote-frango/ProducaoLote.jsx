import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"

import Tabela from "@/components/Genericos/Tabela"
import ModalForm from "@/components/Genericos/ModalForm"
import ConfirmDialog from "@/components/Genericos/ConfirmDialog"
import { Button } from "@/components/ui/button"

import {
  listarProducaoLote,
  criarProducaoLote,
  atualizarProducaoLote,
  deletarProducaoLote,
} from "@/api/aviario/producaoLote"
import { listarProdutos } from "@/api/venda_Estoque/produtoService"

import { formatarData } from "@/components/utils/DataFormater"
import { parseQuantidade, formatarQuantidade } from "@/components/utils/converterQuantidade"
import { handleApiError } from "@/utils/handleApiError"

export function ProducaoLote() {
  const { granjaId, loteFrangoId } = useParams()

  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState(null)

  const [producao, setProducao] = useState([])
  const [open, setOpen] = useState(false)
  const [producaoSelecionada, setProducaoSelecionada] = useState(null)
  const [openDelete, setOpenDelete] = useState(false)
  const [producaoDelete, setProducaoDelete] = useState(null)
  const [produtos, setProdutos] = useState([])

  const [filtroDataInicio, setFiltroDataInicio] = useState("")
  const [filtroDataFim, setFiltroDataFim] = useState("")
  const [termoBusca, setTermoBusca] = useState("")
  const [filtrosAtivos, setFiltrosAtivos] = useState({})

  useEffect(() => {
    if (!granjaId) return
    carregarProdutos()
  }, [granjaId])

  useEffect(() => {
    if (!granjaId) return
    carregarProducaoLote()
  }, [granjaId, loteFrangoId, page, filtrosAtivos])

  async function carregarProdutos() {
    try {
      const dados = await listarProdutos(granjaId, { per_page: -1 })
      setProdutos(dados.dados ?? [])
    } catch (error) {
      handleApiError(error)
    }
  }

  async function carregarProducaoLote() {
    try {
      const params = { pagina: page, ...filtrosAtivos }
      if (termoBusca) params.search = termoBusca

      const dados = await listarProducaoLote(loteFrangoId, granjaId, params)
      setProducao(dados.dados ?? [])
      setPagination(dados.pagination)
    } catch (error) {
      handleApiError(error)
    }
  }

  function aplicarFiltros(e) {
    e?.preventDefault()
    setPage(1)
    setFiltrosAtivos({
      data__gte: filtroDataInicio || undefined,
      data__lte: filtroDataFim || undefined,
    })
  }

  function handleSearch(termo) {
    setTermoBusca(termo)
    setPage(1)
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
      handleApiError(error)
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
      handleApiError(error)
    }
  }

  const colunas = [
    { key: "id", label: "ID", className: "w-16" },
    { key: "lote_frango.identificacao", 
      label: "Identificação Lote de Frango",
      render: (item) => item.lote_frango?.identificacao?.toUpperCase() ?? "-"
    },
    { 
      key: "produto.tipo_produto.nome", 
      label: "Produto",
      render: (item) => item.produto?.tipo_produto?.nome ?? "-"
    },
    { 
      key: "produto.tipo_unidade_medida.sigla", 
      label: "Unidade",
      render: (item) => item.produto?.tipo_unidade_medida?.sigla ?? "-"
    },
    {
      key: "quantidade",
      label: "Quantidade",
      render: (item) => formatarQuantidade(item.quantidade)
    },
    {
      key: "data",
      label: "Data",
      render: (item) => formatarData(item.data)
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
      name: "data",
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
        onSearch={handleSearch}
        pagination={pagination}
        onPageChange={(novaPagina) => setPage(novaPagina)}
      >
        <input
          type="date"
          value={filtroDataInicio}
          onChange={(e) => setFiltroDataInicio(e.target.value)}
          className="h-10 px-3 rounded-md border border-input bg-background text-sm"
        />
        <input
          type="date"
          value={filtroDataFim}
          onChange={(e) => setFiltroDataFim(e.target.value)}
          className="h-10 px-3 rounded-md border border-input bg-background text-sm"
        />
        <Button type="button" variant="secondary" onClick={aplicarFiltros}>
          Filtrar
        </Button>
      </Tabela>

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