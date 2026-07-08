import { useEffect, useState } from "react"
import Tabela from "@/components/Genericos/Tabela"
import ModalForm from "@/components/Genericos/ModalForm"
import ConfirmDialog from "@/components/Genericos/ConfirmDialog"
 
function CrudSection(props) {

  const {
    titulo,
    listar,
    criar,
    atualizar,
    deletar,
    colunas,
    campos,
    granjaId
  } = props

  const [dados, setDados] = useState([])
  const [open, setOpen] = useState(false)
  const [item, setItem] = useState(null)

  const [openDelete, setOpenDelete] = useState(false)
  const [itemDelete, setItemDelete] = useState(null)

  async function carregar() {
    const res = await listar()
    setDados(res)
  }

  useEffect(() => {
    carregar()
  }, [])

  function novo() {
    setItem(null)
    setOpen(true)
  }

  function editar(i) {
    setItem(i)
    setOpen(true)
  }

  async function salvar(payload) {
    if (item) {
      await atualizar(item.id, payload)
    } else {
      await criar(payload)
    }

    setOpen(false)
    await carregar()
  }

  function excluir(i) {
    setItemDelete(i)
    setOpenDelete(true)
  }


  async function confirmarExclusao() {
    await deletar(itemDelete.id)

    setOpenDelete(false)
    setItemDelete(null)

    await carregar()
  }

  return (
    <div className="border rounded-lg p-4 space-y-3">
      <div className="flex justify-between">
        <h3 className="text-lg font-semibold">{titulo}</h3>
        
        <button onClick={novo} className="bg-blue-600 text-white px-3 py-1 rounded">
          Novo
        </button>
      </div>

      <ConfirmDialog
        open={openDelete}
        onOpenChange={setOpenDelete}
        onConfirm={confirmarExclusao}
        titulo={`Excluir ${titulo}`}
        descricao={`Deseja realmente excluir "${itemDelete?.nome ?? itemDelete?.identificacao ?? itemDelete?.id}"?`}
        textoConfirmar="Excluir"
      />

      <Tabela
        dados={dados}
        colunas={colunas}
        placeholderBusca={`Buscar ${titulo.toLowerCase()}...`}
        onEditar={editar}
        onExcluir={excluir}
      />

      <ModalForm
        open={open}
        onOpenChange={setOpen}
        titulo={item ? `Editar ${titulo}` : `Novo ${titulo}`}
        campos={campos}
        dadosIniciais={item}
        onSalvar={salvar}
      />
    </div>
  )
}

export default CrudSection