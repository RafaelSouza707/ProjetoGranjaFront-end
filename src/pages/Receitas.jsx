import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"

import Tabela from "@/components/Genericos/Tabela"
import GenericCards from "@/components/Genericos/GenericCards"
import ModalForm from "@/components/Genericos/ModalForm"
import ConfirmDialog from "@/components/Genericos/ConfirmDialog"

import { formatarMoeda } from "@/utils/formatters"

import {
  listarReceitas,
  criarReceita,
  atualizarReceita,
  deletarReceita,
  cardReceitaGranja
} from "@/api/financas/receitaService"

import { listarTiposReceitas } from "@/api/financas/tipoReceitaService"
import { listarStatusFinancas } from "@/api/financas/statusFinancasService"
import { listarVendas } from "@/api/venda_Estoque/vendaService"

export default function Receitas() {

  async function carregarDados() {
    await Promise.all([
      carregarCards(),
      carregarTiposReceita(),
      carregarVendas(),
      carregarStatusFinancas(),
    ])
  }

  const { granjaId } = useParams()
  
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState(null)

  const [open, setOpen] = useState(false)
  const [openDelete, setOpenDelete] = useState(false)
  const [itemParaDeletar, setItemParaDeletar] = useState(null)

  const [receitas, setReceitas] = useState([])
  const [receitaSelecionada, setReceitaSelecionada] = useState(null)
  const [tipoReceita, setTipoReceita] = useState([])
  const [statusFinancas, setStatusFinancas] = useState([])
  const [vendas, setVenda] = useState(null)

  const [cardsReceitas, setCardsReceitas] = useState(null)

  function toNumberOrNull(value) {
    if (value === "" || value === null || value === undefined) {
      return null
    }

    const n = Number(value)
    return isNaN(n) ? null : n
  }

  async function carregarVendas() {
    try {
      const dados = await listarVendas(granjaId)
      setVenda(dados)
    } catch (error) {
      handleApiError(error)
    }
  }

  async function carregarTiposReceita() {
    try {
      const dados = await listarTiposReceitas(granjaId)
      setTipoReceita(dados)
    } catch (error) {
      handleApiError(error)
    }
  }

  async function carregarStatusFinancas() {
    try {
      const dados = await listarStatusFinancas(granjaId)
      setStatusFinancas(dados)
    } catch (error) {
      handleApiError(error)
    }
  }

  async function carregarReceitas() {
    try {
      const dados = await listarReceitas(granjaId, page)

      setReceitas(dados.dados)
      setPagination(dados.pagination)
    } catch (error) {
      handleApiError(error)
    }
  }

  async function carregarCards() {
    try {
      const dados = await cardReceitaGranja(granjaId)
      console.log(dados)
      setCardsReceitas(dados)
    } catch (error) {
      handleApiError(error)
    }
  }

  function novaReceita() {
    setReceitaSelecionada(null)
    setOpen(true)
  }

  function editarReceita(receita) {
    setReceitaSelecionada(receita)
    setOpen(true)
  }

  function solicitarExclusao(item) {
    setItemParaDeletar(item)
    setOpenDelete(true)
  }

  async function apagarReceita() {
    if (!itemParaDeletar) return
    try {
      await deletarReceita(itemParaDeletar.id, granjaId)

      setOpenDelete(false)
      setItemParaDeletar(null)

      await carregarReceitas()
      await carregarCards()
    } catch (error) {
      handleApiError(error)
    }
  }

  async function salvarReceita(payload) {
    try {
      const dados = {
        ...payload,
        tipo_receita_id: toNumberOrNull(payload.tipo_receita_id),
        status_financas_id: toNumberOrNull(payload.status_financas_id),
        venda_id: toNumberOrNull(payload.venda_id),
        granja_id: Number(granjaId),
      }

      if (receitaSelecionada) {
        await atualizarReceita(
          receitaSelecionada.id,
          granjaId,
          dados
        )
      } else {
        await criarReceita(
          granjaId,
          dados
        )
      }

      setOpen(false)
      setReceitaSelecionada(null)

      await carregarReceitas()
      await carregarCards()
      
    } catch (error) {
      handleApiError(error)
    }
  }

  const campos = [
    {
      name: "tipo_receita_id",
      label: "Tipo de Receita",
      type: "select",
      options: tipoReceita.map(t => ({
        value: t.id,
        label: t.nome.toUpperCase()
      }))
    },
    {
      name: "status_financas_id",
      label: "Status",
      type: "select",
      options: statusFinancas.map(s => ({
        value: s.id,
        label: s.nome.toUpperCase()
      }))
    },
    {
      name: "data",
      label: "Data da Receita",
      type: "date"
    },
    {
      name: "valor",
      label: "Valor",
      type: "number",
    },
    {
      name: "descricao",
      label:"Descrição",
      type: "text",
      maxLength: 256
    }
  ]

  const colunas = [
    {
      key: "id",
      label: "#",
    },
    {
      key: "tipo_receita.nome",
      label: "TIPO DE RECEITA",
      render: (item) => item.tipo_receita?.nome?.toUpperCase() ?? "-"
    },
    {
      key: "status.nome",
      label: "STATUS",
      render: (item) => item.status?.nome?.toUpperCase() ?? "-"
    },
    {
      key: "venda.tipo.nome",
      label: "TIPO DE VENDA",
      render: (item) => item.venda?.tipo?.nome ?? "Receita Direta"
    },
    {
      key: "data",
      label: "DATA",
      render: (item) => item.data ? new Date(item.data).toLocaleDateString('pt-BR', {timeZone: 'UTC'}) : "-"
    },
    {
      key: "valor",
      label: "VALOR",
      render: (item) => formatarMoeda(item.valor),
    },
    {
      key: "descricao",
      label: "DESCRIÇÃO",
      render: (item) => item.descricao ?? "-"
    },
  ]

  useEffect(() => {
    carregarDados()
  }, [])

  useEffect(() => {
    carregarReceitas()
  }, [page])
  
  return (
    <div className="p-6">
      <h1 className="text-4xl font-bold mb-6">
        Receitas
      </h1>

      <GenericCards
        cards={[
          {
            titulo: "Total arrecadado no mês",
            valor: formatarMoeda(
              cardsReceitas?.card_receita_valor_total_venda_mes_graja ?? 0
            ),
            cor: "text-green-600",
          },
          {
            titulo: "Total de receita no mês",
            valor:
              cardsReceitas?.card_receita_total_vendas_mes_granja ?? 0,
          },
          {
            titulo: "Maior receita no mês",
            valor: formatarMoeda(
              cardsReceitas?.card_receita_maior_receita_mes?.valor ?? 0
            ),
          },
        ]}
      />

      <Tabela
        dados={receitas}
        colunas={colunas}
        placeholderBusca="Buscar receita..."
        textoBotao="+ Nova Receita"
        onNovo={novaReceita}
        onEditar={editarReceita}
        onExcluir={solicitarExclusao}
        pagination={pagination}
        onPageChange={setPage}
      />

      <ModalForm
        open={open}
        onOpenChange={setOpen}
        titulo={
          receitaSelecionada
          ? "Editar Receita"
          : "Nova Receita"
        }
        campos={campos}
        dadosIniciais={receitaSelecionada}
        onSalvar={salvarReceita}
      />

      <ConfirmDialog
        open={openDelete}
        onOpenChange={setOpenDelete}
        onConfirm={apagarReceita}
        titulo="Excluir Receita"
        descricao={`Deseja realmente excluir esta receita no valor de ${formatarMoeda(itemParaDeletar?.valor ?? 0)}?`}
        textoConfirmar="Excluir"
      />
    </div>
  )
}