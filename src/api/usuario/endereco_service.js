import api from "../axios";

export async function listarEndereco() {
    const response = await api.get("/endereco");
    return response.data;
}

export async function buscarEndereco(id) {
    const response = await api.get(`/cargo/${id}`)
    return response.data;
}

export async function criarCargo(data) {
    const response = await api.post("/cargo", data)
    return response.data;
}

export async function atualizarCargo(id, data) {
    const response = await api.put(`/cargo/${id}`, data)
    return response.data;
}

export async function deletarCargo(id) {
    const response = await api.delete(`/cargo/${id}`)
    return response;
}