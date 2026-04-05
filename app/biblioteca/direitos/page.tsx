export default function Direitos() {
  return (
    <div className="min-h-screen bg-white pt-20">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <a href="/biblioteca" className="text-proud-pink hover:underline mb-6 inline-block">
          ← Voltar para Biblioteca
        </a>

        <h1 className="font-heading text-3xl font-bold text-proud-dark mb-3">Seus Direitos</h1>

        <p className="text-lg text-proud-gray mb-12">Você tem direitos. Aqui está como acessá-los.</p>

        <div className="prose max-w-none space-y-8 text-proud-gray text-sm">
          <p>
            Você tem direitos. E, mesmo no meio de tanta coisa acontecendo, vale a pena conhecê-los — porque eles existem para te apoiar nesse momento. Aqui vai um guia direto, sem complicação, pra você entender o que pode acessar e como começar.
          </p>

          <div className="space-y-6">
            <div className="bg-white border-l-4 border-proud-pink p-6 rounded-r-lg">
              <h3 className="font-heading text-lg font-semibold mb-2">Auxílio-doença (INSS)</h3>
              <p className="mb-2">
                <strong>O que é:</strong> Valor mensal pago pelo INSS quando você precisa se afastar do trabalho.
              </p>
              <p className="mb-2">
                <strong>Como conseguir:</strong> Laudo médico → App/site Meu INSS → Solicitar benefício → Perícia
              </p>
              <p>
                <strong>Onde:</strong>{' '}
                <a href="https://meu.inss.gov.br" target="_blank" rel="noopener" className="text-proud-pink hover:underline">
                  meu.inss.gov.br
                </a>{' '}
                ou ligue 135
              </p>
            </div>

            <div className="bg-white border-l-4 border-proud-blue p-6 rounded-r-lg">
              <h3 className="font-heading text-lg font-semibold mb-2">BPC (Benefício de Prestação Continuada)</h3>
              <p className="mb-2">
                <strong>O que é:</strong> Um salário mínimo mensal para quem não pode trabalhar e tem baixa renda.
              </p>
              <p className="mb-2">
                <strong>Como conseguir:</strong> Inscrição no CadÚnico (CRAS) → Solicitar pelo Meu INSS → Avaliação
              </p>
              <p>
                <strong>Onde:</strong> CRAS da sua cidade +{' '}
                <a href="https://meu.inss.gov.br" target="_blank" rel="noopener" className="text-proud-blue hover:underline">
                  meu.inss.gov.br
                </a>
              </p>
            </div>

            <div className="bg-white border-l-4 border-proud-pink p-6 rounded-r-lg">
              <h3 className="font-heading text-lg font-semibold mb-2">Transporte gratuito (TFD)</h3>
              <p className="mb-2">
                <strong>O que é:</strong> Ajuda com transporte quando você precisa fazer tratamento em outra cidade.
              </p>
              <p className="mb-2">
                <strong>Como conseguir:</strong> Procure a Secretaria de Saúde com encaminhamento médico
              </p>
              <p>
                <strong>Onde:</strong> Secretaria de Saúde do seu município
              </p>
            </div>

            <div className="bg-white border-l-4 border-proud-blue p-6 rounded-r-lg">
              <h3 className="font-heading text-lg font-semibold mb-2">Prioridade em filas</h3>
              <p className="mb-2">
                <strong>O que é:</strong> Atendimento preferencial em serviços públicos e privados.
              </p>
              <p>
                <strong>Como usar:</strong> Com laudo médico ou carteirinha de prioridade
              </p>
            </div>

            <div className="bg-white border-l-4 border-proud-pink p-6 rounded-r-lg">
              <h3 className="font-heading text-lg font-semibold mb-2">Isenção de Imposto de Renda</h3>
              <p className="mb-2">
                <strong>O que é:</strong> Isenção de IR em aposentadoria, pensão ou reforma.
              </p>
              <p className="mb-2">
                <strong>Como conseguir:</strong> Laudo médico oficial → Solicitar no órgão pagador
              </p>
              <p>
                <strong>Onde:</strong> Receita Federal ou Meu INSS
              </p>
            </div>

            <div className="bg-white border-l-4 border-proud-blue p-6 rounded-r-lg">
              <h3 className="font-heading text-lg font-semibold mb-2">Saque do FGTS</h3>
              <p className="mb-2">
                <strong>O que é:</strong> Possibilidade de sacar o saldo do FGTS durante o tratamento.
              </p>
              <p className="mb-2">
                <strong>Como conseguir:</strong> App FGTS ou agência da Caixa com laudo médico
              </p>
              <p>
                <strong>Onde:</strong>{' '}
                <a href="https://www.caixa.gov.br" target="_blank" rel="noopener" className="text-proud-blue hover:underline">
                  caixa.gov.br
                </a>
              </p>
            </div>

            <div className="bg-white border-l-4 border-proud-pink p-6 rounded-r-lg">
              <h3 className="font-heading text-lg font-semibold mb-2">Isenção de IPVA</h3>
              <p className="mb-2">
                <strong>O que é:</strong> Isenção de impostos (varia por estado/cidade).
              </p>
              <p>
                <strong>Como conseguir:</strong> Consultar Secretaria da Fazenda do seu estado
              </p>
            </div>
          </div>

          <div className="bg-proud-pink-light/20 rounded-xl p-6 mt-12">
            <h3 className="font-heading text-lg font-semibold mb-4 text-proud-dark">Documentos que você vai precisar</h3>
            <ul className="space-y-2 list-disc list-inside">
              <li>Laudo médico com diagnóstico (CID)</li>
              <li>Relatórios médicos atualizados</li>
              <li>RG e CPF</li>
              <li>Comprovante de residência</li>
              <li>Carteira de trabalho</li>
              <li>Exames e receitas</li>
            </ul>
          </div>

          <div className="bg-proud-blue-light/20 rounded-xl p-6 mt-8">
            <h3 className="font-heading text-lg font-semibold mb-4 text-proud-dark">Onde buscar ajuda</h3>
            <ul className="space-y-2">
              <li>• Assistente social do hospital</li>
              <li>• CRAS (Centro de Referência de Assistência Social)</li>
              <li>
                • INSS: 135 ou{' '}
                <a href="https://meu.inss.gov.br" target="_blank" className="text-proud-blue hover:underline">
                  meu.inss.gov.br
                </a>
              </li>
              <li>• Defensoria Pública</li>
              <li>• Secretaria de Saúde do seu município</li>
            </ul>
          </div>

          <p className="text-center italic mt-12">
            Você não precisa resolver tudo de uma vez. Escolhe um direito por vez e vai. Já é um passo enorme.
          </p>
        </div>
      </div>
    </div>
  )
}
