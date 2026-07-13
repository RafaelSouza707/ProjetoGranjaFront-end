import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"

import Tabela from "@/components/Genericos/Tabela"
import ModalForm from "@/components/Genericos/ModalForm"
import ConfirmDialog from "@/components/Genericos/ConfirmDialog"

import {
  listarVendas,
  criarVenda,
  atualizarVenda,
  deletarVenda,
} from "@/api/venda_Estoque/vendaService"

import { listarClientes } from "@/api/usuario/clientesService"
import { listarTipoVenda } from "@/api/venda_Estoque/tipoVendaService"
import { listarStatusFinancas } from "@/api/financas/statusFinancasService"

import { formatarMoeda } from "@/utils/formatters"

export default function Venda() {

  const { granjaId } = useParams()

  const [vendas, setVendas] = useState([])

  const [clientes, setClientes] = useState([])
  const [tiposVenda, setTiposVenda] = useState([])
  const [statusFinancas, setStatusFinancas] = useState([])

  const [open, setOpen] = useState(false)

  const [vendaSelecionada, setVendaSelecionada] = useState(null)

  const [openDelete, setOpenDelete] = useState(false)
  const [vendaDelete, setVendaDelete] = useState(null)

  useEffect(() => {
    if (!granjaId) return

    carregarVendas()
    carregarClientes()
    carregarTiposVenda()
    carregarStatusFinancas()

  }, [granjaId])

  async function carregarVendas() {
    try {
      const dados = await listarVendas(granjaId)
      setVendas(dados ?? [])
    } catch (error) {
      console.error(error)
      setVendas([])
    }
  }

  async function carregarClientes() {
    try {
      const dados = await listarClientes(granjaId)
      setClientes(dados ?? [])
    } catch (error) {
      console.error(error)
      setClientes([])
    }
  }

  async function carregarTiposVenda() {
    try {
      const dados = await listarTipoVenda(granjaId)
      setTiposVenda(dados ?? [])
    } catch (error) {
      console.error(error)
      setTiposVenda([])
    }
  }

  async function carregarStatusFinancas() {
    try {
      const dados = await listarStatusFinancas(granjaId)
      setStatusFinancas(dados ?? [])
    } catch (error) {
      console.error(error)
      setStatusFinancas([])
    }
  }

  function novaVenda() {
    setVendaSelecionada(null)
    setOpen(true)
  }

  function editarVenda(item) {

    setVendaSelecionada({
      ...item,
      cliente_id: item.cliente_id,
      tipo_venda_id: item.tipo_venda_id,
      status_financas_id: item.status_financas_id,
      valor_total: Number(item.valor_total),
    })

    setOpen(true)
  }

  function excluirVenda(item) {
    setVendaDelete(item)
    setOpenDelete(true)
  }

  async function salvarVenda(payload) {

    const body = {
      ...payload,
      granja_id: Number(granjaId),
      cliente_id: payload.cliente_id
        ? Number(payload.cliente_id)
        : null,
      tipo_venda_id: Number(payload.tipo_venda_id),
      status_financas_id: Number(payload.status_financas_id),
      valor_total: Number(payload.valor_total)
    }

    try {

      if (vendaSelecionada) {

        await atualizarVenda(
          vendaSelecionada.id,
          granjaId,
          body
        )

      } else {

        await criarVenda(
          granjaId,
          body
        )

      }

      setOpen(false)
      setVendaSelecionada(null)

      await carregarVendas()

    } catch (error) {
      console.error(error)
    }
  }

  async function confirmarExclusao() {

    if (!vendaDelete) return

    try {

      await deletarVenda(
        vendaDelete.id,
        granjaId
      )

      setOpenDelete(false)
      setVendaDelete(null)

      await carregarVendas()

    } catch (error) {
      console.error(error)
    }
  }
    const colunas = [
    {
      key: "id",
      label: "#",
    },
    {
      key: "cliente.nome",
      label: "Cliente",
      render: (item) => item.cliente?.nome ?? "-"
    },
    {
      key: "tipo.nome",
      label: "Tipo Venda",
    },
    {
      key: "status.nome",
      label: "Status Financeiro",
    },
    {
      key: "valor_total",
      label: "Valor",
      render: (item) => formatarMoeda(item.valor_total)
    },
    {
      key: "data_venda",
      label: "Data",
      render: (item) =>
        item.data_venda
          ? item.data_venda.split("-").reverse().join("/")
          : "-"
    },
  ]

  const campos = [
    {
      name: "cliente_id",
      label: "Cliente",
      type: "select",
      options: [
        {
          value: "",
          label: "Consumidor Final"
        },
        ...clientes.map(cliente => ({
          value: cliente.id,
          label: cliente.nome
        }))
      ]
    },
    {
      name: "tipo_venda_id",
      label: "Tipo Venda",
      type: "select",
      required: true,
      options: tiposVenda.map(tipo => ({
        value: tipo.id,
        label: tipo.nome
      }))
    },
    {
      name: "status_financas_id",
      label: "Status Financeiro",
      type: "select",
      required: true,
      options: statusFinancas.map(status => ({
        value: status.id,
        label: status.nome
      }))
    },
    {
      name: "valor_total",
      label: "Valor Total",
      type: "number",
      min: 0,
      step: "0.01",
      required: true
    },
    {
      name: "data_venda",
      label: "Data da Venda",
      type: "date",
      required: true
    }
  ]

  return (
    <div className="space-y-4">

      <h1>
        Vendas
      </h1>

      <Tabela
        dados={vendas}
        colunas={colunas}
        placeholderBusca="Buscar venda..."
        textoBotao="+ Inserir Venda"
        onNovo={novaVenda}
        onEditar={editarVenda}
        onExcluir={excluirVenda}
      />

      <ModalForm
        open={open}
        onOpenChange={(value) => {

          setOpen(value)

          if (!value) {
            setVendaSelecionada(null)
          }

        }}
        titulo={
          vendaSelecionada
            ? "Editar Venda"
            : "Inserir Venda"
        }
        campos={campos}
        dadosIniciais={vendaSelecionada}
        onSalvar={salvarVenda}
      />

      <ConfirmDialog
        open={openDelete}
        onOpenChange={setOpenDelete}
        onConfirm={confirmarExclusao}
        titulo="Excluir venda"
        descricao={`Deseja realmente excluir esta venda?`}
        textoConfirmar="Excluir"
      />

    </div>
  )
}