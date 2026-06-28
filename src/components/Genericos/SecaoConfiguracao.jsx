function SecaoConfiguracao({ titulo, children }) {
  return (
    <div className="bg-white shadow rounded-lg p-6 space-y-4">
      <h2 className="text-2xl font-semibold border-b pb-2">
        {titulo}
      </h2>

      <div className="space-y-6">
        {children}
      </div>
    </div>
  )
}

export default SecaoConfiguracao