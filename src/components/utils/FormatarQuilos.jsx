export function formatarQuilos(valor) {
  if (valor == null) return "-"

  return `${Number(valor).toLocaleString("pt-BR", {
    maximumFractionDigits: 3,
  })} kg`
}