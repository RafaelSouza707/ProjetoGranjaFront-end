import api from "../axios";

export async function listarFuncionario() {
    const response = await api.get("/funcionario");
    return response.data;
}

export async function buscarFuncionario(id) {
    const response = await api.get(`/escolaridade/${id}`)
    return response.data;
}

export async function criarFuncionario(data) {
    const response = await api.post("/escolaridade", data)
    return response.data;
}

export async function atualizarFuncionario(id, data) {
    const response = await api.put(`/escolaridade/${id}`, data)
    return response.data;
}

export async function deletarFuncionario(id) {
    const response = await api.delete(`/escolaridade/${id}`)
    return response;
}