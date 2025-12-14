import { useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, PenTool, FileText, Menu, X } from 'lucide-react';
import PreLoginFooter from '../components/PreLoginFooter';

export default function TermsOfService() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-paper">
      <nav className="bg-white border-b border-darkNeutral/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link to="/" className="flex items-center space-x-3 group">
              <img
                src="/icone.svg"
                alt="Solta o Verbo"
                className="w-12 h-12 transition-transform duration-700 group-hover:rotate-360"
              />
              <span className="text-2xl font-editorial font-bold text-deepBlue">Solta o Verbo</span>
            </Link>

            <div className="hidden md:flex items-center space-x-8">
              <Link to="/about" className="text-darkNeutral hover:text-actionOrange transition font-medium">
                Sobre Nós
              </Link>
              <Link to="/programs" className="text-darkNeutral hover:text-actionOrange transition font-medium">
                Programas
              </Link>
              <Link to="/contact" className="text-darkNeutral hover:text-actionOrange transition font-medium">
                Contato
              </Link>
              <Link
                to="/login"
                className="px-6 py-2 bg-actionOrange hover:bg-deepBlue text-white rounded-lg transition font-medium"
              >
                Entrar
              </Link>
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-darkNeutral"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-darkNeutral/10">
            <div className="px-4 py-4 space-y-3">
              <Link
                to="/about"
                className="block text-darkNeutral hover:text-actionOrange transition font-medium"
              >
                Sobre Nós
              </Link>
              <Link
                to="/programs"
                className="block text-darkNeutral hover:text-actionOrange transition font-medium"
              >
                Programas
              </Link>
              <Link
                to="/contact"
                className="block text-darkNeutral hover:text-actionOrange transition font-medium"
              >
                Contato
              </Link>
              <Link
                to="/login"
                className="block px-6 py-2 bg-actionOrange hover:bg-deepBlue text-white rounded-lg transition font-medium text-center"
              >
                Entrar
              </Link>
            </div>
          </div>
        )}
      </nav>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-limeGreen/20 rounded-2xl mb-4">
            <FileText className="w-8 h-8 text-deepBlue" />
          </div>
          <h1 className="font-editorial text-4xl md:text-5xl font-bold text-deepBlue mb-4">
            Termos de Serviço
          </h1>
          <p className="text-darkNeutral/70">Última atualização: Dezembro de 2025</p>
        </div>

        <div className="bg-white rounded-3xl border border-darkNeutral/10 p-8 md:p-12 space-y-8">
          <section>
            <h2 className="font-editorial text-2xl font-bold text-deepBlue mb-4">1. Aceitação dos Termos</h2>
            <p className="text-darkNeutral/80 leading-relaxed">
              Ao acessar e usar a plataforma Solta o Verbo, você concorda em estar vinculado a estes Termos
              de Serviço e a todas as leis e regulamentos aplicáveis. Se você não concorda com algum destes
              termos, está proibido de usar ou acessar este site.
            </p>
          </section>

          <section>
            <h2 className="font-editorial text-2xl font-bold text-deepBlue mb-4">2. Descrição do Serviço</h2>
            <p className="text-darkNeutral/80 leading-relaxed">
              O Solta o Verbo é uma plataforma de autodesenvolvimento através da escrita, oferecendo programas,
              exercícios e conteúdos para desenvolvimento pessoal. Reservamos o direito de modificar, suspender
              ou descontinuar qualquer aspecto do serviço a qualquer momento.
            </p>
          </section>

          <section>
            <h2 className="font-editorial text-2xl font-bold text-deepBlue mb-4">3. Registro e Conta</h2>
            <p className="text-darkNeutral/80 leading-relaxed mb-3">
              Para usar certos recursos da plataforma, você precisa criar uma conta. Ao criar uma conta, você concorda em:
            </p>
            <ul className="list-disc list-inside space-y-2 text-darkNeutral/80 ml-4">
              <li>Fornecer informações verdadeiras, precisas e completas</li>
              <li>Manter suas credenciais de login confidenciais</li>
              <li>Notificar-nos imediatamente sobre qualquer uso não autorizado de sua conta</li>
              <li>Ser responsável por todas as atividades que ocorrem em sua conta</li>
              <li>Ter pelo menos 18 anos de idade</li>
            </ul>
          </section>

          <section>
            <h2 className="font-editorial text-2xl font-bold text-deepBlue mb-4">4. Propriedade Intelectual</h2>
            <p className="text-darkNeutral/80 leading-relaxed mb-3">
              Todo o conteúdo disponível na plataforma Solta o Verbo, incluindo textos, gráficos, logos,
              imagens e software, é propriedade do Solta o Verbo ou de seus licenciadores e é protegido
              por leis de direitos autorais.
            </p>
            <p className="text-darkNeutral/80 leading-relaxed">
              Você mantém os direitos autorais sobre o conteúdo que cria na plataforma, mas nos concede
              uma licença para hospedar, armazenar e exibir esse conteúdo conforme necessário para fornecer
              nossos serviços.
            </p>
          </section>

          <section>
            <h2 className="font-editorial text-2xl font-bold text-deepBlue mb-4">5. Conduta do Usuário</h2>
            <p className="text-darkNeutral/80 leading-relaxed mb-3">
              Você concorda em não:
            </p>
            <ul className="list-disc list-inside space-y-2 text-darkNeutral/80 ml-4">
              <li>Usar a plataforma para qualquer propósito ilegal ou não autorizado</li>
              <li>Publicar conteúdo ofensivo, difamatório ou discriminatório</li>
              <li>Assediar, intimidar ou prejudicar outros usuários</li>
              <li>Tentar acessar áreas restritas da plataforma</li>
              <li>Interferir no funcionamento adequado da plataforma</li>
              <li>Coletar dados de outros usuários sem permissão</li>
              <li>Compartilhar suas credenciais de acesso com terceiros</li>
            </ul>
          </section>

          <section>
            <h2 className="font-editorial text-2xl font-bold text-deepBlue mb-4">6. Assinaturas e Pagamentos</h2>
            <p className="text-darkNeutral/80 leading-relaxed mb-3">
              Alguns serviços da plataforma podem requerer pagamento:
            </p>
            <ul className="list-disc list-inside space-y-2 text-darkNeutral/80 ml-4">
              <li>Os preços estão sujeitos a alterações mediante aviso prévio</li>
              <li>As cobranças são processadas através de provedores de pagamento terceirizados seguros</li>
              <li>As assinaturas são renovadas automaticamente, salvo cancelamento</li>
              <li>Reembolsos são concedidos de acordo com nossa política de garantia</li>
              <li>Você é responsável por manter suas informações de pagamento atualizadas</li>
            </ul>
          </section>

          <section>
            <h2 className="font-editorial text-2xl font-bold text-deepBlue mb-4">7. Política de Cancelamento e Reembolso</h2>
            <p className="text-darkNeutral/80 leading-relaxed">
              Oferecemos uma garantia incondicional de 7 dias após o início do programa. Você pode cancelar
              sua assinatura a qualquer momento através das configurações da sua conta. Após o cancelamento,
              você terá acesso ao conteúdo até o final do período já pago.
            </p>
          </section>

          <section>
            <h2 className="font-editorial text-2xl font-bold text-deepBlue mb-4">8. Privacidade e Dados</h2>
            <p className="text-darkNeutral/80 leading-relaxed">
              O uso de suas informações pessoais é regido por nossa{' '}
              <Link to="/privacy-policy" className="text-actionOrange hover:text-deepBlue font-medium">
                Política de Privacidade
              </Link>
              . Ao usar nossos serviços, você concorda com a coleta e uso de informações de acordo com
              essa política.
            </p>
          </section>

          <section>
            <h2 className="font-editorial text-2xl font-bold text-deepBlue mb-4">9. Limitação de Responsabilidade</h2>
            <p className="text-darkNeutral/80 leading-relaxed">
              O Solta o Verbo não será responsável por quaisquer danos indiretos, incidentais, especiais
              ou consequenciais decorrentes do uso ou incapacidade de usar nossos serviços. Fornecemos
              a plataforma "como está" sem garantias de qualquer tipo.
            </p>
          </section>

          <section>
            <h2 className="font-editorial text-2xl font-bold text-deepBlue mb-4">10. Rescisão</h2>
            <p className="text-darkNeutral/80 leading-relaxed">
              Podemos encerrar ou suspender seu acesso à plataforma imediatamente, sem aviso prévio ou
              responsabilidade, por qualquer motivo, incluindo violação destes Termos de Serviço. Você
              também pode encerrar sua conta a qualquer momento através das configurações da plataforma.
            </p>
          </section>

          <section>
            <h2 className="font-editorial text-2xl font-bold text-deepBlue mb-4">11. Modificações dos Termos</h2>
            <p className="text-darkNeutral/80 leading-relaxed">
              Reservamos o direito de modificar estes termos a qualquer momento. Notificaremos você sobre
              mudanças significativas através de e-mail ou aviso na plataforma. O uso continuado após
              as alterações constitui aceitação dos novos termos.
            </p>
          </section>

          <section>
            <h2 className="font-editorial text-2xl font-bold text-deepBlue mb-4">12. Lei Aplicável</h2>
            <p className="text-darkNeutral/80 leading-relaxed">
              Estes termos são regidos pelas leis da República Federativa do Brasil. Quaisquer disputas
              relacionadas a estes termos serão resolvidas nos tribunais competentes do Brasil.
            </p>
          </section>

          <section>
            <h2 className="font-editorial text-2xl font-bold text-deepBlue mb-4">13. Contato</h2>
            <p className="text-darkNeutral/80 leading-relaxed">
              Se você tiver dúvidas sobre estes Termos de Serviço, entre em contato conosco através da nossa{' '}
              <Link to="/contact" className="text-actionOrange hover:text-deepBlue font-medium">
                página de contato
              </Link>
              .
            </p>
          </section>
        </div>
      </section>

      <PreLoginFooter />
    </div>
  );
}
