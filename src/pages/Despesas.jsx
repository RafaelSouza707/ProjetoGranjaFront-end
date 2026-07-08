import { useEffect, useState } from "react"

import Tabela from "@/components/Genericos/Tabela"
import FinanceiroCards from "@/components/Financas/FinanceiroCards"
import ModalForm from "@/components/Genericos/ModalForm"
import { useParams } from "react-router-dom"

import { cardsGastosGranja, listarDespesas, criarDespesa, deletarDespesa, atualizarDespesa, despesaElastica } from "@/api/financas/despesaService"
import { listarTiposDespesa } from "@/api/financas/tipoDespesaService"
import { formatarMoeda } from "@/utils/formatters"
import { listarStatusFinancas } from "@/api/financas/statusFinancasService"
import { listarLoteFrangos } from "@/api/aviario/loteFrangoService"
import { renderTextoColuna } from "@/components/utils/renderers"

export default function Despesas() {

  const { granjaId } = useParams()

  async function carregarDados() {
    await Promise.all([
      carregarDespesas(),
      carregarCards(),
      carregarTiposDespesas(),
      carregarStatus(),
      carregarLoteFrangos(),
    ])
  }

  const colunas = [
    {
      key: "id",
      label: "#",
    },
    {
      key: "tipo.nome",
      label: "tipo".toUpperCase(),
    },
    {
      key: "status.nome",
      label: "status".toUpperCase(),
    },
    {
      key: "lote_frango.identificacao",
      label: "lote de frango".toUpperCase(),
      className: "uppercase"
    },
    {
      key: "data",
      label: "data".toUpperCase(),
    },
    {
      key: "data_vencimento",
      label: "vencimento".toUpperCase(),
    },
    {
      key: "valor",
      label: "valor".toUpperCase(),
      render: (item) => formatarMoeda(item.valor)
    },
    {
      key: "descricao",
      label: "descrição".toUpperCase(),
      render: renderTextoColuna("descricao", 10)
    }
  ]

  const [ loteFrango, setLoteFrango ] = useState([])
  async function carregarLoteFrangos() {
    try {
      const dados = await listarLoteFrangos(granjaId);
      setLoteFrango(dados);
    } catch (error) {
      console.error(error)
    }
  }

  const [status, setStatus] = useState([])
  async function carregarStatus() {
    try {
      const dados = await listarStatusFinancas(granjaId);
      setStatus(dados);
    } catch (error) {
      console.error(error)
    }
  }

  const [tipoDespesa, setTipoDespesa] = useState([])
  async function carregarTiposDespesas() {
    try {
      const dados = await listarTiposDespesa(granjaId)
      setTipoDespesa(dados)
    } catch (error) {
      console.error(error)
    }
  }

  const campos = [
    {
      name: "tipo_despesa_id",
      label: "Tipo de Despesa",
      type: "select",
      options: tipoDespesa.map(t => ({
        value: t.id,
        label: t.nome.toUpperCase()
      }))
    },
    {
      name: "status_financas_id",
      label: "Status",
      type: "select",
      options: status.map(s => ({
        value: s.id,
        label: s.nome.toUpperCase()
      }))
    },
    { 
      name: "lote_frango_id",
      label: "Lote de Frango",
      type: "select",
      options: loteFrango.map(l => ({
        value: l.id,
        label: l.identificacao.toUpperCase()
      })),
      required: true
    },
    {
      name: "data",
      label: "Data da Despesa",
      type: "date"
    },
    {
      name: "data_vencimento",
      label: "Data Vencimento",
      type: "date",
      required: false
    },
    {
      name: "valor",
      label: "Valor da Despesa",
      type: "number"
    },
    {
      name: "descricao",
      label:"Descrição",
      type: "text",
      maxLength: 256
    }
  ]

  function toNumberOrNull(value) {
    if (value === "" || value === null || value === undefined) return null
    const n = Number(value)
    return isNaN(n) ? null : n
  }

  const [despesas, setDespesas] = useState([])

  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  const [despesaSelecionada, setDespesaSelecionada] = useState(null)

  const [cardsDespesas, setCardsDespesas] = useState(null);
  async function carregarCards() {
    try {
      const dados = await cardsGastosGranja(granjaId);
      setCardsDespesas(dados);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function apagarDespesa(id) {
    await deletarDespesa(id, granjaId);
    await carregarDespesas()
    await carregarCards()
  }
  
  async function carregarDespesas() {
    const dados = await listarDespesas(granjaId);
    setDespesas(dados)
  }

  async function novaDespesa() {
    setDespesaSelecionada(null)
    setOpen(true)
  }

  function editarDespesa(despesa) {
    setDespesaSelecionada({
      ...despesa,
      lote_frango: undefined,
    })
    setOpen(true)
  }

  async function buscaElasticaDespesa(termo) {
    if (!termo.trim()) {
      await carregarDespesas()
      return
    }

    const resultado = await despesaElastica(termo)
    setDespesas(resultado)
  }

  async function salvarDespesa(payload) {
    try {
      const dados = {
        ...payload,
        tipo_despesa_id: toNumberOrNull(payload.tipo_despesa_id),
        status_financas_id: toNumberOrNull(payload.status_financas_id),
        lote_frango_id: toNumberOrNull(payload.lote_frango_id),
        granja_id: toNumberOrNull(granjaId)
      }

      if (despesaSelecionada) {
        await atualizarDespesa(despesaSelecionada.id, granjaId, dados)
      } else {
        await criarDespesa(dados, granjaId)
      }

      setOpen(false)
      setDespesaSelecionada(null)

      await carregarDespesas()
      await carregarCards()
    } catch (error) {
      console.error("Erro ao salvar despesa:", error)
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
        Despesas
      </h1>
      
      <FinanceiroCards cards={[
        {
          titulo: "Total Gasto no mês",
          valor: formatarMoeda(cardsDespesas?.total_gasto_mes_granja ?? 0),
          cor: "text-red-600",
        },
        {
          titulo: "Maior gasto no mês",
          valor: formatarMoeda(cardsDespesas?.maior_gasto_mes_granja?.valor ?? 0),
          descricao: cardsDespesas?.maior_gasto?.tipo_despesa ?? "",
        },
      ]}/>

      <Tabela
        dados={despesas}
        colunas={colunas}
        placeholderBusca="Buscar despesa..."
        textoBotao="+ Nova Despesa"
        onNovo={novaDespesa}
        onEditar={editarDespesa}
        onExcluir={(item) => apagarDespesa(item.id)}
        onSearch={buscaElasticaDespesa}
      />

      <ModalForm
        open={open}
        onOpenChange={setOpen}
        titulo={
          despesaSelecionada
          ? "Editar Despesa"
          : "Nova Despesa"
        }
        campos={campos}
        dadosIniciais={despesaSelecionada}
        onSalvar={salvarDespesa}
      />
    </div>
  )
}