import api from "../axios";

export async function listarClientes(granjaId) {
    const res = await api.get("/usuarios/cliente", {
        params: {
            granja_id: granjaId
        }
    })
    return res.data;
}

export async function criarCliente(data, granjaId) {
    const res = await api.post("/usuarios/cliente", 
        data, {
            params: {
                granja_id: granjaId
            }
        }
    )
    return res.data;
}

export async function atualizarCliente(id, data, granjaId) {
    const res = await api.put(`/usuarios/cliente/${id}`, 
        data, {
            params: {
                granja_id: granjaId
            }
        }
    )
    return res.data;
}

export async function deletarCliente(id, granjaId) {
    await api.delete(`/usuarios/cliente/${id}`, {
        params: {
            granja_id: granjaId
        }
    })
}