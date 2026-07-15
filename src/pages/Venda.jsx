import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"

import Tabela from "@/components/Genericos/Tabela"
import ModalForm from "@/components/Genericos/ModalForm"
import ConfirmDialog from "@/components/Genericos/ConfirmDialog"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import {
  listarVendas,
  criarVenda,
  atualizarVenda,
  deletarVenda,
} from "@/api/venda_Estoque/vendaService"

import {
  listarClientes,
  criarCliente,
  atualizarCliente,
  deletarCliente,
} from "@/api/usuario/clientesService"

import { listarTipoVenda } from "@/api/venda_Estoque/tipoVendaService"
import { listarStatusFinancas } from "@/api/financas/statusFinancasService"

import { formatarMoeda } from "@/utils/formatters"

export default function Venda() {
  const { granjaId } = useParams()

  const [vendas, setVendas] = useState([])
  const [tiposVenda, setTiposVenda] = useState([])
  const [statusFinancas, setStatusFinancas] = useState([])
  const [openVendaModal, setOpenVendaModal] = useState(false)
  const [vendaSelecionada, setVendaSelecionada] = useState(null)
  const [openVendaDelete, setOpenVendaDelete] = useState(false)
  const [vendaDelete, setVendaDelete] = useState(null)

  const [clientes, setClientes] = useState([])
  const [openClienteModal, setOpenClienteModal] = useState(false)
  const [clienteSelecionado, setClienteSelecionado] = useState(null)
  const [openClienteDelete, setOpenClienteDelete] = useState(false)
  const [clienteDelete, setClienteDelete] = useState(null)

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
    setOpenVendaModal(true)
  }

  function editarVenda(item) {
    setVendaSelecionada({
      ...item,
      cliente_id: item.cliente_id,
      tipo_venda_id: item.tipo_venda_id,
      status_financas_id: item.status_financas_id,
      valor_total: Number(item.valor_total),
    })
    setOpenVendaModal(true)
  }

  function excluirVenda(item) {
    setVendaDelete(item)
    setOpenVendaDelete(true)
  }

  async function salvarVenda(payload) {
    const body = {
      ...payload,
      granja_id: Number(granjaId),
      cliente_id: payload.cliente_id ? Number(payload.cliente_id) : null,
      tipo_venda_id: Number(payload.tipo_venda_id),
      status_financas_id: Number(payload.status_financas_id),
      valor_total: Number(payload.valor_total)
    }

    try {
      if (vendaSelecionada) {
        await atualizarVenda(vendaSelecionada.id, granjaId, body)
      } else {
        await criarVenda(granjaId, body)
      }
      setOpenVendaModal(false)
      setVendaSelecionada(null)
      await carregarVendas()
    } catch (error) {
      console.error(error)
    }
  }

  async function confirmarExclusaoVenda() {
    if (!vendaDelete) return
    try {
      await deletarVenda(vendaDelete.id, granjaId)
      setOpenVendaDelete(false)
      setVendaDelete(null)
      await carregarVendas()
    } catch (error) {
      console.error(error)
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

  function novoCliente() {
    setClienteSelecionado(null)
    setOpenClienteModal(true)
  }

  function editarCliente(cliente) {
    setClienteSelecionado(cliente)
    setOpenClienteModal(true)
  }

  function excluirCliente(cliente) {
    setClienteDelete(cliente)
    setOpenClienteDelete(true)
  }

  async function salvarCliente(payload) {
    const body = {
      ...payload,
      granja_id: Number(granjaId)
    }

    try {
      if (clienteSelecionado) {
        await atualizarCliente(clienteSelecionado.id, body)
      } else {
        await criarCliente(body)
      }
      setOpenClienteModal(false)
      setClienteSelecionado(null)
      await carregarClientes()
    } catch (error) {
      console.error(error)
    }
  }

  async function confirmarExclusaoCliente() {
    if (!clienteDelete) return
    try {
      await deletarCliente(clienteDelete.id, granjaId)
      setOpenClienteDelete(false)
      setVendaDelete(null)
      await carregarClientes()
    } catch (error) {
      console.error(error)
    }
  }

  const colunasVenda = [
    { key: "id", label: "#" },
    {
      key: "cliente.nome",
      label: "Cliente",
      render: (item) => item.cliente?.nome ?? "-"
    },
    { key: "tipo.nome", label: "Tipo Venda" },
    { key: "status.nome", label: "Status Financeiro" },
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

  const camposVenda = [
    {
      name: "cliente_id",
      label: "Cliente",
      type: "select",
      options: [
        { value: "", label: "Consumidor Final" },
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

  const colunasCliente = [
    { key: "id", label: "#" },
    { key: "nome", label: "Nome" },
    { key: "documento", label: "CPF/CNPJ", render: (item) => item.documento ?? "-" },
    { key: "telefone", label: "Telefone", render: (item) => item.telefone ?? "-" },
    { key: "email", label: "Email", render: (item) => item.email ?? "-" }
  ]

  const camposCliente = [
    { name: "nome", label: "Nome", type: "text", required: true, maxLength: 128 },
    { name: "documento", label: "CPF/CNPJ", type: "text" },
    { name: "telefone", label: "Telefone", type: "text", maxLength: 32 },
    { name: "email", label: "Email", type: "email", maxLength: 128 }
  ]

  return (
    <div className="space-y-6">
      
      <Tabs defaultValue="vendas" className="w-full">
        <div className="flex items-center justify-between border-b pb-2">
          <h1 className="text-2xl font-bold tracking-tight">Gestão Comercial</h1>
          <TabsList>
            <TabsTrigger value="vendas">Vendas</TabsTrigger>
            <TabsTrigger value="clientes">Clientes</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="vendas" className="mt-4 space-y-4">
          <Tabela
            dados={vendas}
            colunas={colunasVenda}
            placeholderBusca="Buscar venda..."
            textoBotao="+ Inserir Venda"
            onNovo={novaVenda}
            onEditar={editarVenda}
            onExcluir={excluirVenda}
          />
        </TabsContent>

        <TabsContent value="clientes" className="mt-4 space-y-4">
          <Tabela
            dados={clientes}
            colunas={colunasCliente}
            placeholderBusca="Buscar cliente..."
            textoBotao="+ Novo Cliente"
            onNovo={novoCliente}
            onEditar={editarCliente}
            onExcluir={excluirCliente}
          />
        </TabsContent>
      </Tabs>

      <ModalForm
        open={openVendaModal}
        onOpenChange={(value) => {
          setOpenVendaModal(value)
          if (!value) setVendaSelecionada(null)
        }}
        titulo={vendaSelecionada ? "Editar Venda" : "Inserir Venda"}
        campos={camposVenda}
        dadosIniciais={vendaSelecionada}
        onSalvar={salvarVenda}
      />

      <ConfirmDialog
        open={openVendaDelete}
        onOpenChange={setOpenVendaDelete}
        onConfirm={confirmarExclusaoVenda}
        titulo="Excluir venda"
        descricao="Deseja realmente excluir esta venda?"
        textoConfirmar="Excluir"
      />

      <ModalForm
        open={openClienteModal}
        onOpenChange={(value) => {
          setOpenClienteModal(value)
          if (!value) setClienteSelecionado(null)
        }}
        titulo={clienteSelecionado ? "Editar Cliente" : "Novo Cliente"}
        campos={camposCliente}
        dadosIniciais={clienteSelecionado}
        onSalvar={salvarCliente}
      />

      <ConfirmDialog
        open={openClienteDelete}
        onOpenChange={setOpenClienteDelete}
        onConfirm={confirmarExclusaoCliente}
        titulo="Excluir Cliente"
        descricao={`Deseja realmente excluir o cliente "${clienteDelete?.nome}"?`}
        textoConfirmar="Excluir"
      />

    </div>
  )
}