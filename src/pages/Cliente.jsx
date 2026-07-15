import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"

import Tabela from "@/components/Genericos/Tabela"
import ModalForm from "@/components/Genericos/ModalForm"
import ConfirmDialog from "@/components/Genericos/ConfirmDialog"

import {
  listarClientes,
  criarCliente,
  atualizarCliente,
  deletarCliente,
} from "@/api/usuario/clientesService"

export default function Cliente() {

  const { granjaId } = useParams()

  const [clientes, setClientes] = useState([])

  const [open, setOpen] = useState(false)
  const [clienteSelecionado, setClienteSelecionado] = useState(null)

  const [openDelete, setOpenDelete] = useState(false)
  const [clienteDelete, setClienteDelete] = useState(null)

  useEffect(() => {
    if (!granjaId) return

    carregarClientes()
  }, [granjaId])

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
    setOpen(true)
  }

  function editarCliente(cliente) {
    setClienteSelecionado(cliente)
    setOpen(true)
  }

  function excluirCliente(cliente) {
    setClienteDelete(cliente)
    setOpenDelete(true)
  }

  async function salvarCliente(payload) {

    const body = {
      ...payload,
      granja_id: Number(granjaId)
    }

    try {

      if (clienteSelecionado) {
        await atualizarCliente(
          clienteSelecionado.id,
          body
        )
      } else {
        await criarCliente(body)
      }

      setOpen(false)
      setClienteSelecionado(null)

      await carregarClientes()

    } catch (error) {
      console.error(error)
    }
  }

  async function confirmarExclusao() {

    if (!clienteDelete) return

    try {

      await deletarCliente(
        clienteDelete.id,
        granjaId
      )

      setOpenDelete(false)
      setClienteDelete(null)

      await carregarClientes()

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
      key: "nome",
      label: "NOME",
    },
    {
      key: "cpf_cnpj",
      label: "CPF/CNPJ",
      render: (item) => item.cpf_cnpj ?? "-"
    },
    {
      key: "telefone",
      label: "TELEFONE",
      render: (item) => item.telefone ?? "-"
    },
    {
      key: "email",
      label: "EMAIL",
      render: (item) => item.email ?? "-"
    }
  ]

  const campos = [
    {
      name: "nome",
      label: "Nome",
      type: "text",
      required: true,
      maxLength: 120
    },
    {
      name: "cpf_cnpj",
      label: "CPF/CNPJ",
      type: "text",
      maxLength: 18
    },
    {
      name: "telefone",
      label: "Telefone",
      type: "text",
      maxLength: 20
    },
    {
      name: "email",
      label: "Email",
      type: "email"
    }
  ]

  return (
    <div className="space-y-4">

      <h1>
        Clientes
      </h1>

      <Tabela
        dados={clientes}
        colunas={colunas}
        placeholderBusca="Buscar cliente..."
        textoBotao="+ Novo Cliente"
        onNovo={novoCliente}
        onEditar={editarCliente}
        onExcluir={excluirCliente}
      />

      <ModalForm
        open={open}
        onOpenChange={(value) => {

          setOpen(value)

          if (!value) {
            setClienteSelecionado(null)
          }

        }}
        titulo={
          clienteSelecionado
            ? "Editar Cliente"
            : "Novo Cliente"
        }
        campos={campos}
        dadosIniciais={clienteSelecionado}
        onSalvar={salvarCliente}
      />
            <ConfirmDialog
        open={openDelete}
        onOpenChange={setOpenDelete}
        onConfirm={confirmarExclusao}
        titulo="Excluir Cliente"
        descricao={`Deseja realmente excluir o cliente "${clienteDelete?.nome}"?`}
        textoConfirmar="Excluir"
      />

    </div>
  )
}