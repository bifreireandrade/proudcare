type Props = {
  proximaSessaoTexto?: string
}

export default function ResumoDoDia({ proximaSessaoTexto }: Props) {
  const mensagemPrincipal = proximaSessaoTexto
    ? `Hoje é um bom dia para ir com calma. ${proximaSessaoTexto}`
    : 'Hoje é um bom dia para ir com calma, no seu ritmo.'

  return (
    <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
      <p className="text-sm text-proud-gray mb-2">Hoje</p>

      <h2 className="font-heading text-xl font-semibold text-proud-dark leading-snug mb-3">
        {mensagemPrincipal}
      </h2>

      <p className="text-sm text-proud-gray leading-relaxed">
        Se quiser, você pode registrar como está se sentindo, isso ajuda a acompanhar sua jornada com mais clareza.
      </p>
    </section>
  )
}
