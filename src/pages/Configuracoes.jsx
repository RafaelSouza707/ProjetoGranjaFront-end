import SecaoConfiguracao from "@/components/Genericos/SecaoConfiguracao"
import CrudSection from "@/components/Genericos/CrudTabela"
import { renderTextoColuna } from "@/components/utils/renderers"

import {
  listarSatus,
  criarStatus,
  atualizarStatus,
  deletarStatus
} from "@/api/financas/statusFinancasService"

import {
  listarTiposDespesas,
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
import { useEffect, useState } from "react"


import {
  listarGranjas
} from "@/api/granja/granjaService"

export default function Configuracoes() {
  
  const [ granjas, setGranjas ] = useState([])

  async function carregarGranjas() {
    try{
      const dados = await listarGranjas(); 
      setGranjas(dados);
    } catch (error){
      console.error(error);
    }
  }

  useEffect(() => {
    carregarGranjas()
  }, []);

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
            listar={listarSatus}
            criar={criarStatus}
            atualizar={atualizarStatus}
            deletar={deletarStatus}
            colunas={[
              { key: "id", label: "#" },
              { key: "nome", label: "Nome" }              
            ]}
            campos={[
              { name: "nome", label: "Nome", type: "text" },
              { name: "granja_id", label: "Granja", type: "select", options: granjas.map(g =>({value: g.id, label: g.identificacao})), required: true}
            ]}
          />

          <CrudSection
            titulo="Tipo Despesa"
            listar={listarTiposDespesas}
            criar={criarTipoDespesa}
            atualizar={atualizarTipoDespesa}
            deletar={deletarTipoDespesa}
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
            listar={listarTiposReceitas}
            criar={criarTipoReceita}
            atualizar={atualizarTipoReceita}
            deletar={deletarTipoReceita}
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
            listar={listarStatusFrango}
            criar={criarStatusLoteFrango}
            atualizar={atualizarStatusLoteFrango}
            deletar={deletarStatusLoteFrango}
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
            listar={listarTipoProduto}
            criar={criarTipoProduto}
            atualizar={atualizarTipoProduto}
            deletar={deletarTipoProduto}
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
            listar={listarTipoRacao}
            criar={criarTipoRacao}
            atualizar={atualizarTipoRacao}
            deletar={deletarTipoRacao}
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
            listar={listarTipoMovimentacao}
            criar={criarTipoMovimentacao}
            atualizar={atualizarTipoMovimentacao}
            deletar={deletarTipoMovimentacao}
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
            listar={listarTipoVenda}
            criar={criarTipoVenda}
            atualizar={atualizarTipoVenda}
            deletar={deletarTipoVenda}
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
            listar={listarTipoUnidadeMedida}
            criar={criarTipoUnidadeMedida}
            atualizar={atualizarTipoUnidadeMedida}
            deletar={deletarTipoUndadeMediada}
            colunas={[
              { key: "id", label: "#" },
              { key: "sigla", label: "Sigla" },
              { key: "descricao", label: "Descrição" }
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