import { useEffect, useState } from "react"

import Tabela from "@/components/Genericos/Tabela"
import FinanceiroCards from "@/components/Financas/FinanceiroCards"
import ModalForm from "@/components/Genericos/ModalForm"
import { useParams } from "react-router-dom"

import { listarLoteRacoes, criarLoteRacao, atualizarLoteRacao, deletarLoteRacao, listarCardsLoteRacao } from "@/api/aviario/loteRacaoService"
import { listarTipoRacao } from "@/api/aviario/tipoRacaoService"
import { formatarQuilos } from "@/components/utils/FormatarQuilos"

export default function LoteRacao() {

  const { granjaId } = useParams()

  async function carregarDados() {
    await Promise.all([
      carregarLoteRacao(),
      carregarCards(),
      carregarTipoRacao(),
    ])
  }

  const colunas = [
    {
      key: "id",
      label: "#",
    },
    {
      key: "tipo_racao.nome",
      label: "Tipo de Ração".toUpperCase(),
    },
    {
      key: "fornecedor",
      label: "Fornecedor".toUpperCase(),
    },
    {
      key: "quilos",
      label: "Quilo".toUpperCase(),
      render: (item) => formatarQuilos(item.quilos)
    },
  ]

  const [ loteRacao, setLoteRacao ] = useState([])
  async function carregarLoteRacao() {
    try {
      const dados = await listarLoteRacoes(granjaId);
      setLoteRacao(dados);
    } catch (error) {
      console.error(error)
    }
  }

  const [tipoRacao, setTipoRacao] = useState([])
  async function carregarTipoRacao() {
    try {
      const dados = await listarTipoRacao(granjaId);
      setTipoRacao(dados);
    } catch (error) {
      console.error("Erro ao carregar tipos de racao",error)
      setTipoRacao([])
    }
  }

  const campos = [
    {
      name: "tipo_racao_id",
      label: "Tipo de Ração",
      type: "select",
      options: tipoRacao.map(t => ({
        value: t.id,
        label: t.nome.toUpperCase()
      }))
    },
    {
      name: "fornecedor",
      label: "Fornecedor",
      type: "text"
    },
    {
      name: "quilos",
      label: "Quilos",
      type: "number"
    },
  ]

  function toNumberOrNull(value) {
    if (value === "" || value === null || value === undefined) return null
    const n = Number(value)
    return isNaN(n) ? null : n
  }

  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  const [loteRacaoSelecionado, setLoteRacaoSelecionado] = useState(null)

  const [cardLoteRacao, setCardLoteRacao] = useState(null);
  async function carregarCards() {
    try {
      const dados = await listarCardsLoteRacao(granjaId);
      setCardLoteRacao(dados);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function apagarLoteRacao(id) {
    await deletarLoteRacao(id, granjaId);
    await carregarLoteRacao()
    await carregarCards()
  }

  async function novoLoteRacao() {
    setLoteRacaoSelecionado(null)
    setOpen(true)
  }

  function editarLoteRacao(loteRacao) {
    setLoteRacaoSelecionado({
      ...loteRacao,
      tipo_racao_id: loteRacao.tipo_racao.id,
    })
    setOpen(true)
  }

  async function salvarLoteRacao(payload) {
    try {
      const dados = {
        ...payload,
        tipo_racao_id: toNumberOrNull(payload.tipo_racao_id),
        granja_id: toNumberOrNull(granjaId)
      }

      if (loteRacaoSelecionado) {
        await atualizarLoteRacao(loteRacaoSelecionado.id, granjaId, dados)
      } else {
        await criarLoteRacao(granjaId, dados)
      }

      setOpen(false)
      setLoteRacaoSelecionado(null)

      await carregarLoteRacao()
      await carregarCards()
    } catch (error) {
      console.error("Erro ao salvar lote ração:", error)
    }
  }

  useEffect(() => {
    carregarDados()
  }, []);

  if (loading) {
    return <p>Carregando...</p>
  }

  return (
    <div className="p-6">
      <h1 className="text-4xl font-bold mb-6">
        Lotes de Ração
      </h1>
      
      <FinanceiroCards cards={[
        {
          titulo: "Estoque de Ração",
          valor: formatarQuilos(cardLoteRacao?.quantidade_total_racao_granja ?? 0),
          cor: "text-red-600",
          descricao: "Distribuídos em " + cardLoteRacao?.quantidade_lotes_racao + " lotes" ?? 0,
        },
        {
          titulo: "Consumo do mês",
          valor: formatarQuilos(cardLoteRacao?.total_consumido_mes?.mes ?? 0),
          descricao: "Média diária: " + cardLoteRacao?.total_consumido_mes?.diaria ?? "",
        },
        {
          titulo: "Próximo lote de ração a acabar",
          valor: cardLoteRacao?.lote_menor_quantiade?.tipo_racao ?? 0,
          descricao: "Restante: " + formatarQuilos(cardLoteRacao?.lote_menor_quantiade?.quantidade ?? ""),
        },
        {
          titulo: "Previsão para fim do estoque em dias",
          valor: cardLoteRacao?.previsao?.data ?? "N/D",
          descricao: "É uma previsão superficial *",
        },
      ]}/>

      <Tabela
        dados={loteRacao}
        colunas={colunas}
        placeholderBusca="Buscar lote de ração..."
        textoBotao="+ Novo Lote de Ração"
        onNovo={novoLoteRacao}
        onEditar={editarLoteRacao}
        onExcluir={(item) => apagarLoteRacao(item.id)}
      />

      <ModalForm
        open={open}
        onOpenChange={setOpen}
        titulo={
          loteRacaoSelecionado
          ? "Editar Lote de Ração"
          : "Novo Lote de Ração"
        }
        campos={campos}
        dadosIniciais={loteRacaoSelecionado}
        onSalvar={salvarLoteRacao}
      />
    </div>
  )
}