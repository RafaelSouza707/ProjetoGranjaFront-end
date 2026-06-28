import { useEffect, useState } from "react"
import Tabela from "@/components/Genericos/Tabela"
import ModalForm from "@/components/Genericos/ModalForm"

function CrudSection({
  titulo,
  listar,
  criar,
  atualizar,
  deletar,
  colunas,
  campos
}) {
  const [dados, setDados] = useState([])
  const [open, setOpen] = useState(false)
  const [item, setItem] = useState(null)

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

  async function excluir(i) {
    await deletar(i.id)
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