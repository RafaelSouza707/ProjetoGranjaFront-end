import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { useAuth } from "@/components/utils/AuthContext"

import ModalForm from "@/components/Genericos/ModalForm"
import ConfirmDialog from "@/components/Genericos/ConfirmDialog"

import {
  listarGranjas,
  criarGranja,
  atualizarGranja,
  deletarGranja,
} from "@/api/granja/granjaService"

import { Building2, Plus, Settings, Trash2, Edit, ChevronRight, Layers } from "lucide-react"

export default function GranjaPage() {
  const navigate = useNavigate()
  const { selecionarGranja } = useAuth()

  const [granjas, setGranjas] = useState([])
  const [openModal, setOpenModal] = useState(false)
  const [identificacao, setIdentificacao] = useState("")
  const [editId, setEditId] = useState(null)
  const [loading, setLoading] = useState(false)

  const [openDelete, setOpenDelete] = useState(false)
  const [itemDelete, setItemDelete] = useState(null)

  async function carregar() {
    try {
      setLoading(true)
      const data = await listarGranjas()
      setGranjas(data ?? [])
    } catch (error) {
      toast.error("Erro ao carregar granjas.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    carregar()
  }, [])

  async function salvar(form) {
    if (!form.identificacao?.trim()) return

    setLoading(true)
    try {
      if (editId) {
        await atualizarGranja(editId, {
          identificacao: form.identificacao.trim(),
        })
        toast.success("Granja atualizada com sucesso!")
      } else {
        await criarGranja({
          identificacao: form.identificacao.trim(),
        })
        toast.success("Granja criada com sucesso!")
      }

      setOpenModal(false)
      setEditId(null)
      setIdentificacao("")
      await carregar()
    } catch (error) {
      toast.error("Erro ao salvar granja.")
    } finally {
      setLoading(false)
    }
  }

  function editar(item, e) {
    e.stopPropagation()
    setEditId(item.id)
    setIdentificacao(item.identificacao)
    setOpenModal(true)
  }

  function excluir(item, e) {
    e.stopPropagation()
    setItemDelete(item)
    setOpenDelete(true)
  }

  async function confirmarExclusao() {
    try {
      await deletarGranja(itemDelete.id)
      toast.success("Granja excluída com sucesso!")
      setOpenDelete(false)
      setItemDelete(null)
      await carregar()
    } catch (error) {
      toast.error("Erro ao excluir granja.")
    }
  }

  function entrarNaGranja(item) {
    selecionarGranja(
      {
        id: item.id,
        identificacao: item.identificacao,
      },
      item.contexto
    )
    navigate(`/granja/${item.id}/lotes_frangos`)
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Minhas Granjas</h1>
          <p className="text-sm text-slate-500">Selecione uma granja para gerenciar seus lotes, finanças e estoque.</p>
        </div>
        <button
          onClick={() => {
            setEditId(null)
            setIdentificacao("")
            setOpenModal(true)
          }}
          className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-slate-800 transition-colors shadow-sm"
        >
          <Plus className="size-4" />
          Nova Granja
        </button>
      </div>

      {loading && granjas.length === 0 ? (
        <div className="text-sm text-slate-400 py-8 text-center">Carregando granjas...</div>
      ) : granjas.length === 0 ? (
        <div className="bg-slate-50 border border-dashed border-slate-300 rounded-2xl p-12 text-center space-y-3">
          <Building2 className="mx-auto size-10 text-slate-400" />
          <p className="text-slate-600 font-medium">Nenhuma granja cadastrada.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {granjas.map((item) => (
            <div
              key={item.id}
              onClick={() => entrarNaGranja(item)}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer p-5 flex flex-col justify-between group relative overflow-hidden"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-slate-100 rounded-xl text-slate-700 group-hover:bg-red-50 group-hover:text-red-600 transition-colors">
                  <Building2 className="size-6" />
                </div>
                
                <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => editar(item, e)}
                    className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-900 transition-colors"
                    title="Editar Granja"
                  >
                    <Edit className="size-4" />
                  </button>
                  <button
                    onClick={(e) => excluir(item, e)}
                    className="p-1.5 hover:bg-red-50 rounded-lg text-slate-500 hover:text-red-600 transition-colors"
                    title="Excluir Granja"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-1 mb-6">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Granja #{item.id}</span>
                <h3 className="text-lg font-bold text-slate-800 group-hover:text-red-600 transition-colors">
                  {item.identificacao}
                </h3>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-sm text-slate-600 font-medium">
                <span className="flex items-center gap-1.5 text-xs text-slate-500">
                  <Layers className="size-3.5" /> Acessar painel
                </span>
                <div className="flex items-center gap-1 text-red-600 font-semibold group-hover:translate-x-1 transition-transform">
                  <span>Abrir</span>
                  <ChevronRight className="size-4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={openDelete}
        onOpenChange={setOpenDelete}
        onConfirm={confirmarExclusao}
        titulo="Excluir granja"
        descricao={`Deseja realmente excluir a granja "${itemDelete?.identificacao}"?`}
        textoConfirmar="Excluir"
      />

      <ModalForm
        open={openModal}
        onOpenChange={setOpenModal}
        onSalvar={salvar}
        titulo={editId ? "Editar Granja" : "Nova Granja"}
        dadosIniciais={{ identificacao }}
        campos={[
          {
            name: "identificacao",
            label: "Identificação",
            required: true,
          },
        ]}
      />
    </div>
  )
}