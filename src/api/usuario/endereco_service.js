import api from "../axios";

export async function listarEndereco() {
    const response = await api.get("/endereco");
    return response.data;
}
