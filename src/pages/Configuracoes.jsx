import SecaoConfiguracao from "@/components/Genericos/SecaoConfiguracao"
import CrudSection from "@/components/Genericos/CrudTabela"
import { useParams } from "react-router-dom"

import {
  listarStatusFinancas,
  criarStatusFinancas,
  atualizarStatusFinancas,
  deletarStatusFinancas
} from "@/api/financas/statusFinancasService"

import {
  listarTiposDespesa,
  criarTipoDespesa,
  atualizarTipoDespesa,
  deletarTipoDespesa
} from "@/api/financas/tipoDespesaService"

import {
  listarTiposReceitas,
  criarTipoReceita,
  atualizarTipoReceita,
  deletarTipoReceita
} from "@/api/financas/tipoReceitaService"

import {
  listarStatusFrango,
  criarStatusLoteFrango,
  atualizarStatusLoteFrango,
  deletarStatusLoteFrango
} from "@/api/aviario/statusLoteFrangoService"

import {
  listarTipoProduto,
  criarTipoProduto,
  atualizarTipoProduto,
  deletarTipoProduto
} from "@/api/aviario/tipoProdutoService"

import {
  listarTipoRacao,
  criarTipoRacao,
  atualizarTipoRacao,
  deletarTipoRacao
} from "@/api/aviario/tipoRacaoService"

import {
  listarTipoMovimentacao,
  criarTipoMovimentacao,
  atualizarTipoMovimentacao,
  deletarTipoMovimentacao
} from "@/api/venda_Estoque/tipoMovimentacaoService"

import {
  listarTipoVenda,
  criarTipoVenda,
  atualizarTipoVenda,
  deletarTipoVenda
} from "@/api/venda_Estoque/tipoVendaService"

import {
  listarTipoUnidadeMedida,
  criarTipoUnidadeMedida,
  atualizarTipoUnidadeMedida,
  deletarTipoUndadeMediada
} from "@/api/venda_Estoque/tipoUnidadeMedidaService"


export default function Configuracoes() {

  const { granjaId } = useParams()

  return (
    <div className="flex justify-center p-6">
      <div className="w-full max-w-5xl space-y-8">
        <h1 className="text-4xl font-bold text-center">
          Configurações da Granja
        </h1>

          {/* FINANCAS */}
        <SecaoConfiguracao titulo="Financas">
          <CrudSection
            titulo="Status Financeiro"
            granjaId={granjaId}
            listar={() => listarStatusFinancas(granjaId)}
            criar={(data) => criarStatusFinancas({...data, granja_id: Number(granjaId)})}
            atualizar={(id, data) => atualizarStatusFinancas(id, {...data, granja_id: Number(granjaId)})}
            deletar={(id) => deletarStatusFinancas(id, {granja_id: Number(granjaId)})}
            colunas={[
              { key: "id", label: "#" },
              { key: "nome", label: "Nome" }              
            ]}
            campos={[
              { name: "nome", label: "Nome", type: "text" }
            ]}
          />

          <CrudSection
            titulo="Tipo Despesa"
            granjaId={granjaId}
            listar={() => listarTiposDespesa(granjaId)}
            criar={(data) => criarTipoDespesa({...data, granja_id: Number(granjaId)})}
            atualizar={(id, data) => atualizarTipoDespesa(id, {...data, granja_id: Number(granjaId)})}
            deletar={(id) => deletarTipoDespesa(id, {granja_id: Number(granjaId)})}
            colunas={[
              { key: "id", label: "#" },
              { key: "nome", label: "Nome" }
            ]}
            campos={[
              { name: "nome", label: "Nome", type: "text" }
            ]}
          />

          <CrudSection
            titulo="Tipo Receita"
            granjaId={granjaId}
            listar={() => listarTiposReceitas(granjaId)}
            criar={(data) => criarTipoReceita({...data, granja_id: Number(granjaId)})}
            atualizar={(id, data) => atualizarTipoReceita(id, {...data, granja_id: Number(granjaId)})}
            deletar={(id) => deletarTipoReceita(id, {granja_id: Number(granjaId)})}
            colunas={[
              { key: "id", label: "#" },
              { key: "nome", label: "Nome" }
            ]}
            campos={[
              { name: "nome", label: "Nome", type: "text" }
            ]}
          />
        </SecaoConfiguracao>
        
        {/* GRANJA */}
        <SecaoConfiguracao titulo="Granja">
          <CrudSection
            titulo="Status Lote de Frangos"
            granjaId={granjaId}
            listar={() => listarStatusFrango(granjaId)}
            criar={(data) => criarStatusLoteFrango({...data, granja_id: Number(granjaId)})}
            atualizar={(id, data) => atualizarStatusLoteFrango(id, {...data, granja_id: Number(granjaId)})}
            deletar={(id) => deletarStatusLoteFrango(id, {granja_id: Number(granjaId)})}
            colunas={[
              { key: "id", label: "#" },
              { key: "nome", label: "Nome" }
            ]}
            campos={[
              { name: "nome", label: "Nome", type: "text" }
            ]}
          />

          <CrudSection
            titulo="Tipo Produto"
            listar={() => listarTipoProduto(granjaId)}
            criar={(data) => criarTipoProduto({...data, granja_id: Number(granjaId)})}
            atualizar={(id, data) => atualizarTipoProduto(id, {...data, granja_id: Number(granjaId)})}
            deletar={(id) => deletarTipoProduto(id, {granja_id: Number(granjaId)})}
            colunas={[
              { key: "id", label: "#" },
              { key: "nome", label: "Nome" }
            ]}
            campos={[
              { name: "nome", label: "Nome", type: "text" }
            ]}
          />

          <CrudSection
            titulo="Tipo Ração"
            listar={() => listarTipoRacao(granjaId)}
            criar={(data) => criarTipoRacao({...data, granja_id: Number(granjaId)})}
            atualizar={(id, data) => atualizarTipoRacao(id, {...data, granja_id: Number(granjaId)})}
            deletar={(id) => deletarTipoRacao(id, {granja_id: Number(granjaId)})}
            colunas={[
              { key: "id", label: "#" },
              { key: "nome", label: "Nome" },
              { key: "descricao", label: "Descrição"}
            ]}
            campos={[
              { name: "nome", label: "Nome", type: "text" },
              { name: "descricao", label: "Descrição", type: "text" }
            ]}
          />
        </SecaoConfiguracao>
        

        {/* VENDA E ESTOQUE */}
        <SecaoConfiguracao titulo="Venda e Estoque">
          <CrudSection
            titulo="Tipo Movimentação"
            listar={() => listarTipoMovimentacao(granjaId)}
            criar={(data) => criarTipoMovimentacao({...data, granja_id: Number(granjaId)})}
            atualizar={(id, data) => atualizarTipoMovimentacao(id, {...data, granja_id: Number(granjaId)})}
            deletar={(id) => deletarTipoMovimentacao(id, {granja_id: Number(granjaId)})}
            colunas={[
              { key: "id", label: "#" },
              { key: "nome", label: "Nome" }
            ]}
            campos={[
              { name: "nome", label: "Nome", type: "text" }
            ]}
          />

          <CrudSection
            titulo="Tipo Venda"
            listar={() => listarTipoVenda(granjaId)}
            criar={(data) => criarTipoVenda({...data, granja_id: Number(granjaId)})}
            atualizar={(id, data) => atualizarTipoVenda(id, {...data, granja_id: Number(granjaId)})}
            deletar={(id) => deletarTipoVenda(id, {granja_id: Number(granjaId)})}
            colunas={[
              { key: "id", label: "#" },
              { key: "nome", label: "Nome" }
            ]}
            campos={[
              { name: "nome", label: "Nome", type: "text" }
            ]}
          />

          <CrudSection
            titulo="Tipo Unidade Medida"
            listar={() => listarTipoUnidadeMedida(granjaId)}
            criar={(data) => criarTipoUnidadeMedida({...data, granja_id: Number(granjaId)})}
            atualizar={(id, data) => atualizarTipoUnidadeMedida(id, {...data, granja_id: Number(granjaId)})}
            deletar={(id) => deletarTipoUndadeMediada(id, {granja_id: Number(granjaId)})}
            colunas={[
              { key: "id", label: "#" },
              { key: "sigla", label: "Sigla"},
              { key: "descricao", label: "Descrição"}
            ]}
            campos={[
              { name: "sigla", label: "Sigla", type: "text" },
              { name: "descricao", label: "Descrição", type: "text" }
            ]}
          />
        </SecaoConfiguracao>
        
      </div>
    </div>
  )
}