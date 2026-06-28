import api from "../axios";

export async function listarRolePermissoa() {
    const response = await api.get("/role_permissao");
    return response.data;
}

export async function buscarRolePermissoa(id) {
    const response = await api.get(`/role_permissao/${id}`)
    return response.data;
}

export async function criarRolePermissoa(data) {
    const response = await api.post("/role_permissao", data)
    return response.data;
}

export async function atualizarRolePermissoa(id, data) {
    const response = await api.put(`/role_permissao/${id}`, data)
    return response.data;
}

export async function deletarRolePermissoa(id) {
    const response = await api.delete(`/role_permissao/${id}`)
    return response;
}