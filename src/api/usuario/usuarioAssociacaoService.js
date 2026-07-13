import api from "../axios";

export async function listarAssociacoes() {
    const res = await api.get("/usuarios/relacao")
    return res.data;
}

export async function convidarUsuario(data) {
    const res = await api.post("/usuarios/relacao", data)
    return res.data;
}

export async function responderConvite(data) {
    const res = await api.put("/usuarios/relacao", data)
    return res.data;
}

export async function deletarAssociacao(id) {
    const res = await api.delete(`/usuarios/relacao/${id}`)
    return res.data;
}