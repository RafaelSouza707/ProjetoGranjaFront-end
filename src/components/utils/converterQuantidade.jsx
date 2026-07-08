

export function parseQuantidade(valor) {
  if (!valor) return null

  return Number(
    valor
      .replace(/\./g, "")
      .replace(",", ".")
  )
}


export function formatarQuantidade(valor) {

  if (valor == null || valor === "") {
    return "-"
  }

  return Number(valor).toLocaleString("pt-BR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 3,
  })
}