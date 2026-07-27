import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"

import Tabela from "@/components/Genericos/Tabela"
import ModalForm from "@/components/Genericos/ModalForm"
import ConfirmDialog from "@/components/Genericos/ConfirmDialog"
import { Button } from "@/components/ui/button"

import {
  listarConsumoLoteDiario,
  criarConsumoLoteDiario,
  atualizarConsumoLoteDiario,
  deletarConsumoLoteDiario,
} from "@/api/aviario/consumoLoteDiariaService"
import { listarLoteRacoes } from "@/api/aviario/loteRacaoService"

import { formatarData } from "@/components/utils/DataFormater"
import { formatarQuilos } from "@/components/utils/FormatarQuilos"
import { handleApiError } from "@/utils/handleApiError"

export function ConsumoLote() {
  const { granjaId, loteFrangoId } = useParams()

  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState(null)

  const [consumos, setConsumos] = useState([])
  const [open, setOpen] = useState(false)
  const [consumoSelecionado, setConsumoSelecionado] = useState(null)
  const [openDelete, setOpenDelete] = useState(false)
  const [consumoDelete, setConsumoDelete] = useState(null)
  const [lotesRacao, setLotesRacao] = useState([])

  // Estados de Filtro
  const [filtroDataInicio, setFiltroDataInicio] = useState("")
  const [filtroDataFim, setFiltroDataFim] = useState("")
  const [termoBusca, setTermoBusca] = useState("")
  const [filtrosAtivos, setFiltrosAtivos] = useState({})

  useEffect(() => {
    if (!granjaId) return
    carregarLotesRacao()
  }, [granjaId])

  useEffect(() => {
    if (!granjaId) return
    carregarConsumos()
  }, [granjaId, loteFrangoId, page, filtrosAtivos])

  async function carregarConsumos() {
    try {
      const params = { pagina: page, ...filtrosAtivos }
      if (termoBusca) params.search = termoBusca

      const dados = await listarConsumoLoteDiario(loteFrangoId, granjaId, params)
      setConsumos(dados.dados ?? [])
      setPagination(dados.pagination)
    } catch (error) {
      handleApiError(error)
    }
  }

  function aplicarFiltros(e) {
    e?.preventDefault()
    setPage(1)
    setFiltrosAtivos({
      data_inicio: filtroDataInicio || undefined,
      data_fim: filtroDataFim || undefined,
    })
  }

  function handleSearch(termo) {
    setTermoBusca(termo)
    setPage(1)
  }

  async function carregarLotesRacao() {
    try {
      const dados = await listarLoteRacoes(granjaId)
      setLotesRacao(dados ?? [])
    } catch (error) {
      handleApiError(error)
    }
  }

  function novoConsumo() {
    setConsumoSelecionado(null)
    setOpen(true)
  }

  function editarConsumo(item) {
    setConsumoSelecionado(item)
    setOpen(true)
  }

  function excluirConsumo(item) {
    setConsumoDelete(item)
    setOpenDelete(true)
  }

  async function salvarConsumo(payload) {
    try {
      const body = {
        ...payload,
        lote_frango_id: Number(loteFrangoId),
        lote_racao_id: Number(payload.lote_racao_id),
      }

      if (consumoSelecionado) {
        await atualizarConsumoLoteDiario(
          consumoSelecionado.id,
          loteFrangoId,
          granjaId,
          body
        )
      } else {
        await criarConsumoLoteDiario(loteFrangoId, granjaId, body)
      }

      setOpen(false)
      setConsumoSelecionado(null)
      carregarConsumos()
    } catch (error) {
      handleApiError(error)
    }
  }

  async function confirmarExclusao() {
    if (!consumoDelete) return

    try {
      await deletarConsumoLoteDiario(loteFrangoId, granjaId, consumoDelete.id)
      setOpenDelete(false)
      setConsumoDelete(null)
      carregarConsumos()
    } catch (error) {
      handleApiError(error)
    }
  }

  const colunas = [
    { key: "id", label: "ID", className: "w-16" },
    {
      key: "lote_racao.tipo_racao.nome",
      label: "Lote de Ração",
      render: (item) => {
        return item.lote_racao?.tipo_racao?.nome ?? "-";
      }
    },
    {
      key: "data",
      label: "Data",
      render: (item) => formatarData(item.data)
    },
    { key: "quilos", label: "Quilos", render: (item) => formatarQuilos(item.quilos)},
  ]

  const campos = [
    {
      name: "lote_racao_id",
      label: "Lote de Ração",
      type: "select",
      options: lotesRacao.map((l) => ({
        value: l.id,
        label: l.tipo_racao?.nome ?? `Lote ${l.id}`,
      })),
      required: true,
    },
    {
      name: "data",
      label: "Data",
      type: "date",
      required: true,
    },
    {
      name: "quilos",
      label: "Quilos",
      type: "number",
      required: true,
      min: 0,
    },
  ]

  return (
    <div className="space-y-4">
      <Tabela
        dados={consumos}
        colunas={colunas}
        placeholderBusca="Buscar consumo"
        textoBotao="+ Novo Consumo"
        onNovo={novoConsumo}
        onEditar={editarConsumo}
        onExcluir={excluirConsumo}
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
          if (!value) setConsumoSelecionado(null)
        }}
        titulo={consumoSelecionado ? "Editar Consumo" : "Inserir Consumo"}
        campos={campos}
        dadosIniciais={consumoSelecionado}
        onSalvar={salvarConsumo}
      />

      <ConfirmDialog
        open={openDelete}
        onOpenChange={setOpenDelete}
        onConfirm={confirmarExclusao}
        titulo="Excluir consumo"
        descricao={`Deseja excluir o consumo de ${consumoDelete?.quilos ?? "-"} kg?`}
        textoConfirmar="Excluir"
      />
    </div>
  )
}