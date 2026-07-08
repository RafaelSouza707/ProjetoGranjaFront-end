import api from "../axios";

export async function listarGranjas() {
    const res = await api.get(`/granja/granja`)
    return res.data
}

export async function criarGranja(data) {
    const res = await api.post("/granja/granja", data)
    return res.data
}

export async function atualizarGranja(id, data) {
    const res = await api.put(`/granja/granja/${id}`, data)
    return res.data
}

export async function deletarGranja(id) {
    const res = await api.delete(`/granja/granja/${id}`)
    return res.data
}