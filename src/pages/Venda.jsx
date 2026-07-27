import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"

import Tabela from "@/components/Genericos/Tabela"
import ModalForm from "@/components/Genericos/ModalForm"
import ConfirmDialog from "@/components/Genericos/ConfirmDialog"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trash2, Plus, X } from "lucide-react"

import {
  listarVendas,
  criarVenda,
  atualizarVenda,
  deletarVenda,
} from "@/api/venda_Estoque/vendaService"

import { listarClientes, criarCliente, atualizarCliente, deletarCliente } from "@/api/usuario/clientesService"
import { listarTipoVenda } from "@/api/venda_Estoque/tipoVendaService"
import { listarStatusFinancas } from "@/api/financas/statusFinancasService"
import { listarProdutos } from "@/api/venda_Estoque/produtoService"

import { formatarMoeda } from "@/utils/formatters"

export default function Venda() {
  const { granjaId } = useParams()

  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState(null)

  const [vendas, setVendas] = useState([])
  const [tiposVenda, setTiposVenda] = useState([])
  const [statusFinancas, setStatusFinancas] = useState([])
  const [produtos, setProdutos] = useState([])
  
  const [openVendaModal, setOpenVendaModal] = useState(false)

  const [vendaSelecionada, setVendaSelecionada] = useState(null)
  const [formVenda, setFormVenda] = useState({
    cliente_id: "",
    tipo_venda_id: "",
    status_financas_id: "",
    data_venda: new Date().toISOString().split("T")[0],
  })
  const [itensVenda, setItensVenda] = useState([])

  const [openVendaDelete, setOpenVendaDelete] = useState(false)
  const [vendaDelete, setVendaDelete] = useState(null)

  const [clientes, setClientes] = useState([])
  const [openClienteModal, setOpenClienteModal] = useState(false)
  const [clienteSelecionado, setClienteSelecionado] = useState(null)
  const [openClienteDelete, setOpenClienteDelete] = useState(false)
  const [clienteDelete, setClienteDelete] = useState(null)

  const [filtroDataInicio, setFiltroDataInicio] = useState("")
  const [filtroDataFim, setFiltroDataFim] = useState("")
  const [termoBusca, setTermoBusca] = useState("")
  const [filtrosAtivos, setFiltrosAtivos] = useState({})

  useEffect(() => {
    if (!granjaId) return
    carregarClientes()
    carregarTiposVenda()
    carregarStatusFinancas()
    carregarProdutosGranja()
  }, [granjaId])

  useEffect(() => {
    if (!granjaId) return
    carregarVendas()
  }, [granjaId, page, filtrosAtivos])

  async function carregarVendas() {
    try {
      const params = { pagina: page, ...filtrosAtivos }
      if (termoBusca) params.search = termoBusca

      const resposta = await listarVendas(granjaId, params)

      const payload = resposta?.data ?? resposta

      const listaVendas = Array.isArray(payload?.dados) ? payload.dados : (Array.isArray(payload) ? payload : [])
      const paginacao = payload?.pagination ?? null

      setVendas(listaVendas)
      setPagination(paginacao)
    } catch (error) {
      console.error(error)
      setVendas([])
    }
  }

  function aplicarFiltros(e) {
    e?.preventDefault()
    setPage(1)
    
    setFiltrosAtivos({
      ...(filtroDataInicio && { "data_venda__gte": filtroDataInicio }),
      ...(filtroDataFim && { "data_venda__lte": filtroDataFim }),
    })
  }

  function handleSearch(termo) {
    setTermoBusca(termo)
    setPage(1)
  }

  async function carregarProdutosGranja() {
    try {
      const dados = await listarProdutos(granjaId, -1)
      setProdutos(dados.dados ?? [])
    } catch (error) {
      console.error(error)
    }
  }

  async function carregarTiposVenda() {
    try {
      const dados = await listarTipoVenda(granjaId)
      setTiposVenda(dados ?? [])
    } catch (error) {
      console.error(error)
    }
  }

  async function carregarStatusFinancas() {
    try {
      const dados = await listarStatusFinancas(granjaId)
      setStatusFinancas(dados ?? [])
    } catch (error) {
      console.error(error)
    }
  }

  function novaVenda() {
    setVendaSelecionada(null)
    setFormVenda({
      cliente_id: "consumidor_final",
      tipo_venda_id: "",
      status_financas_id: "",
      data_venda: new Date().toISOString().split("T")[0],
    })
    setItensVenda([{ produto_id: "", quantidade: "1", subtotal: "", valor_total: "" }])
    setOpenVendaModal(true)
  }

  function editarVenda(item) {
    setVendaSelecionada(item)
    
    setFormVenda({
      cliente_id: item.cliente_id !== null && item.cliente_id !== undefined ? String(item.cliente_id) : "consumidor_final",
      tipo_venda_id: item.tipo_venda_id !== null && item.tipo_venda_id !== undefined ? String(item.tipo_venda_id) : "",
      status_financas_id: item.status_financas_id !== null && item.status_financas_id !== undefined ? String(item.status_financas_id) : "",
      data_venda: item.data_venda || new Date().toISOString().split("T")[0],
    })
    
    const itensMapeados = item.itens?.map(i => {
      const qtd = Number(i.quantidade ?? 1)
      const subTot = Number(i.subtotal ?? i.valor ?? 0)
      const valTotal = qtd > 0 ? (qtd * subTot).toFixed(2) : "0"

      return { 
        produto_id: i.produto_id !== null && i.produto_id !== undefined ? String(i.produto_id) : "", 
        quantidade: String(qtd),
        subtotal: String(subTot),
        valor_total: String(valTotal)
      }
    }) ?? [{ produto_id: "", quantidade: "1", subtotal: "", valor_total: "" }]

    setItensVenda(itensMapeados)
    setOpenVendaModal(true)
  }

  const adicionarItem = () => {
    setItensVenda([...itensVenda, { produto_id: "", quantidade: "1", subtotal: "", valor_total: "" }])
  }

  const removerItem = (index) => {
    const novosItens = itensVenda.filter((_, i) => i !== index)
    setItensVenda(novosItens.length === 0 ? [{ produto_id: "", quantidade: "1", subtotal: "", valor_total: "" }] : novosItens)
  }

  const alterarItem = (index, campo, valor) => {
    const novosItens = [...itensVenda]
    novosItens[index][campo] = valor

    const qtd = Number(novosItens[index].quantidade) || 0
    const sub = Number(novosItens[index].subtotal) || 0

    if (campo === "quantidade" || campo === "subtotal") {
      novosItens[index].valor_total = (qtd * sub).toFixed(2)
    }

    setItensVenda(novosItens)
  }

  function excluirVenda(item) {
    setVendaDelete(item)
    setOpenVendaDelete(true)
  }

  async function salvarVenda(e) {
    e.preventDefault()

    const itensValidos = itensVenda.filter(item => item.produto_id && Number(item.quantidade) > 0)
    if (itensValidos.length === 0) {
      alert("Por favor, adicione pelo menos um produto válido com quantidade.")
      return
    }

    const valorTotalVenda = itensValidos.reduce((acc, item) => acc + (Number(item.valor_total) || 0), 0)

    const payload = {
      granja_id: Number(granjaId),
      cliente_id: formVenda.cliente_id === "consumidor_final" ? null : Number(formVenda.cliente_id),
      tipo_venda_id: formVenda.tipo_venda_id ? Number(formVenda.tipo_venda_id) : null,
      status_financas_id: formVenda.status_financas_id ? Number(formVenda.status_financas_id) : null,
      data_venda: formVenda.data_venda,
      valor_total: valorTotalVenda,
      itens: itensValidos.map(item => ({
        produto_id: Number(item.produto_id),
        quantidade: Number(item.quantidade),
        subtotal: Number(item.subtotal) || 0
      }))
    }
    
    try {
      if (vendaSelecionada && vendaSelecionada.id) {
        await atualizarVenda(vendaSelecionada.id, granjaId, payload)
      } else {
        await criarVenda(granjaId, payload)
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
    }
  }

  async function salvarCliente(payload) {
    const body = { ...payload, granja_id: Number(granjaId) }
    try {
      if (clienteSelecionado) {
        await atualizarCliente(clienteSelecionado.id, body, granjaId)
      } else {
        await criarCliente(body, granjaId)
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
      render: (item) => item.cliente?.nome ?? "Consumidor Final"
    },
    { key: "tipo.nome", label: "Tipo Venda" },
    { key: "status.nome", label: "Status Financeiro" },
    {
      key: "valor_total",
      label: "Valor Total",
      render: (item) => formatarMoeda(item.valor_total)
    },
    {
      key: "data_venda",
      label: "Data",
      render: (item) => item.data_venda ? item.data_venda.split("-").reverse().join("/") : "-"
    },
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

  useEffect(() => {
    if (openVendaModal && vendaSelecionada) {
      const itensMapeados = vendaSelecionada.itens?.map(i => {
        const qtd = Number(i.quantidade ?? 1)
        const subTot = Number(i.subtotal ?? 0)
        const valTotal = qtd > 0 ? (qtd * subTot).toFixed(2) : "0"

        return { 
          produto_id: i.produto_id !== null && i.produto_id !== undefined ? String(i.produto_id) : "", 
          quantidade: String(qtd),
          subtotal: String(subTot),
          valor_total: String(valTotal)
        }
      }) ?? [{ produto_id: "", quantidade: "1", subtotal: "", valor_total: "" }]

      setItensVenda(itensMapeados)
    } else if (openVendaModal && !vendaSelecionada) {
      setItensVenda([{ produto_id: "", quantidade: "1", subtotal: "", valor_total: "" }])
    }
  }, [openVendaModal, vendaSelecionada])

  return (
    <div className="space-y-6">
      <Tabs defaultValue="vendas" className="w-full">
        <div className="flex items-center justify-between border-b pb-2">
          <h1 className="text-2xl font-bold tracking-tight">Vendas</h1>
        </div>
        
        <TabsList>
          <TabsTrigger value="vendas">Vendas</TabsTrigger>
          <TabsTrigger value="clientes">Clientes</TabsTrigger>
        </TabsList>

        <TabsContent value="vendas" className="mt-4 space-y-4">
          <Tabela
            dados={vendas}
            colunas={colunasVenda}
            placeholderBusca="Buscar venda..."
            textoBotao="+ Inserir Venda"
            onNovo={novaVenda}
            onEditar={editarVenda}
            onExcluir={excluirVenda}
            onSearch={handleSearch}
            pagination={pagination}
            onPageChange={setPage}
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
        </TabsContent>

        <TabsContent value="clientes" className="mt-4 space-y-4">
          <Tabela
            dados={clientes}
            colunas={colunasCliente}
            placeholderBusca="Buscar cliente..."
            textoBotao="+ Novo Cliente"
            onNovo={() => { setClienteSelecionado(null); setOpenClienteModal(true); }}
            onEditar={(item) => { setClienteSelecionado(item); setOpenClienteModal(true); }}
            onExcluir={(item) => { setClienteDelete(item); setOpenClienteDelete(true); }}
          />
        </TabsContent>
      </Tabs>

      {openVendaModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in duration-200"
          onClick={() => setOpenVendaModal(false)}
        >
          <div 
            className="bg-white rounded-xl border border-slate-200 shadow-2xl flex flex-col max-h-[90vh] w-full zoom-in-95 animate-in duration-200"
            style={{ maxWidth: '950px' }}
            onClick={(e) => e.stopPropagation()} 
          >
            <div className="flex items-center justify-between p-6 pb-3 border-b border-slate-100">
              <h2 className="text-xl font-semibold tracking-tight text-slate-900">
                {vendaSelecionada ? "Editar Venda" : "Inserir Venda"}
              </h2>
              <Button 
                type="button"
                variant="ghost" 
                size="icon" 
                className="size-8 rounded-full text-slate-400 hover:text-slate-600"
                onClick={() => setOpenVendaModal(false)}
              >
                <X className="size-4" />
              </Button>
            </div>
            
            <form onSubmit={salvarVenda} className="flex-1 overflow-y-auto p-6 py-4 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Cliente</Label>
                  <Select 
                    value={formVenda.cliente_id ? String(formVenda.cliente_id) : "consumidor_final"} 
                    onValueChange={(val) => setFormVenda({...formVenda, cliente_id: val === "consumidor_final" ? "consumidor_final" : Number(val)})}
                  >
                    <SelectTrigger className="w-full bg-white">
                      <SelectValue placeholder="Selecione um cliente">
                        {formVenda.cliente_id === "consumidor_final" 
                          ? "Consumidor Final" 
                          : (clientes.find(c => String(c.id) === String(formVenda.cliente_id))?.nome || "Selecione um cliente")}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="consumidor_final">Consumidor Final</SelectItem>
                      {clientes.map(c => <SelectItem key={c.id} value={String(c.id)}>{c.nome}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Data da Venda</Label>
                  <Input type="date" required value={formVenda.data_venda} onChange={(e) => setFormVenda({...formVenda, data_venda: e.target.value})} />
                </div>

                <div className="space-y-2">
                  <Label>Tipo Venda</Label>
                  <Select 
                    value={formVenda.tipo_venda_id ? String(formVenda.tipo_venda_id) : ""} 
                    onValueChange={(val) => setFormVenda({...formVenda, tipo_venda_id: Number(val)})}
                  >
                    <SelectTrigger className="w-full bg-white">
                      <SelectValue placeholder="Selecione um tipo">
                        {tiposVenda.find(t => String(t.id) === String(formVenda.tipo_venda_id))?.nome || "Selecione um tipo"}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {tiposVenda.map(t => <SelectItem key={t.id} value={String(t.id)}>{t.nome}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Status Financeiro</Label>
                  <Select 
                    value={formVenda.status_financas_id ? String(formVenda.status_financas_id) : ""} 
                    onValueChange={(val) => setFormVenda({...formVenda, status_financas_id: Number(val)})}
                  >
                    <SelectTrigger className="w-full bg-white">
                      <SelectValue placeholder="Selecione um status">
                        {statusFinancas.find(s => String(s.id) === String(formVenda.status_financas_id))?.nome || "Selecione um status"}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {statusFinancas.map(s => <SelectItem key={s.id} value={String(s.id)}>{s.nome}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <hr className="border-slate-100" />

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-slate-700">Produtos da Venda</h3>
                  <Button type="button" variant="outline" size="sm" onClick={adicionarItem} className="gap-1">
                    <Plus className="size-4" /> Add Produto
                  </Button>
                </div>

                <div className="space-y-3 max-h-[250px] overflow-y-auto pr-1">
                  {itensVenda.map((item, index) => (
                    <div key={index} className="flex items-end gap-3 bg-slate-50 p-3 rounded-lg border border-slate-100">
                      
                      <div className="flex-1 space-y-1.5">
                        <Label className="text-xs">Produto</Label>
                        <Select
                          value={item.produto_id ? String(item.produto_id) : ""}
                          onValueChange={(val) => alterarItem(index, "produto_id", val)}
                        >
                          <SelectTrigger className="bg-white">
                            <SelectValue placeholder="Escolha um produto">
                              {item.produto_id 
                                ? (() => {
                                    const p = produtos.find(prod => String(prod.id) === String(item.produto_id));
                                    return p ? `${p.tipo_produto?.nome} (${p.tipo_unidade_medida?.sigla})` : "Carregando...";
                                  })()
                                : "Escolha um produto"}
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            {produtos.map(p => (
                              <SelectItem key={p.id} value={String(p.id)}>
                                {p.tipo_produto?.nome} ({p.tipo_unidade_medida?.sigla})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="w-[95px] space-y-1.5">
                        <Label className="text-xs">Quantidade</Label>
                        <Input
                          type="number"
                          min="0.001"
                          step="any"
                          required
                          className="bg-white"
                          value={item.quantidade}
                          onChange={(e) => alterarItem(index, "quantidade", e.target.value)}
                        />
                      </div>

                      <div className="w-[110px] space-y-1.5">
                        <Label className="text-xs">Preço Unit. (R$)</Label>
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          required
                          className="bg-white"
                          placeholder="0,00"
                          value={item.subtotal}
                          onChange={(e) => alterarItem(index, "subtotal", e.target.value)}
                        />
                      </div>

                      <div className="w-[110px] space-y-1.5">
                        <Label className="text-xs">Subtotal (R$)</Label>
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          className="bg-slate-100 font-semibold"
                          readOnly
                          value={item.valor_total}
                        />
                      </div>

                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:bg-destructive/10"
                        onClick={() => removerItem(index)}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end items-center gap-2 pt-2 pr-1">
                  <span className="text-sm font-medium text-slate-600">Valor Total da Venda:</span>
                  <span className="text-lg font-bold text-slate-900">
                    {formatarMoeda(
                      itensVenda.reduce((acc, item) => acc + (Number(item.valor_total) || 0), 0)
                    )}
                  </span>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100 mt-2">
                <Button type="button" variant="outline" onClick={() => setOpenVendaModal(false)}>
                  Cancelar
                </Button>
                <Button type="submit">Salvar Venda</Button>
              </div>
            </form>
          </div>
        </div>
      )}

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
        onOpenChange={(value) => { setOpenClienteModal(value); if (!value) setClienteSelecionado(null); }}
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