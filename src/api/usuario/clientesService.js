import api from "../axios";

export async function listarClientes(granjaId) {
    const res = await api.get("/usuarios/cliente", {
        params: {
            granja_id: granjaId
        }
    })
    return res.data;
}

export async function criarCliente(data) {
    const res = await api.post("/usuarios/cliente", data)
    return res.data;
}

export async function atualziarCliente(id, data) {
    const res = await api.put(`/usuarios/cliente/${id}`, data)
    return res.data;
}

export async function deletarCliente(id, granjaId) {
    await api.delete(`/usuarios/cliente/${id}`, {
        params: {
            granja_id: granjaId
        }
    })
}