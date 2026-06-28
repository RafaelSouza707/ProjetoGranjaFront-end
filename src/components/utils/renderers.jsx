export function renderTextoColuna(key, limite = 30) {
  return (item) => {
    const texto = item?.[key] || ""

    return (
      <span title={texto}>
        {texto.length > limite
          ? texto.slice(0, limite) + "..."
          : texto}
      </span>
    )
  }
}