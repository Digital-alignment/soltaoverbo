import { useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, PenTool, Shield, Menu, X } from 'lucide-react';
import PreLoginFooter from '../components/PreLoginFooter';

export default function PrivacyPolicy() {
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
            <Shield className="w-8 h-8 text-deepBlue" />
          </div>
          <h1 className="font-editorial text-4xl md:text-5xl font-bold text-deepBlue mb-4">
            Política de Privacidade
          </h1>
          <p className="text-darkNeutral/70">Última atualização: Dezembro de 2025</p>
        </div>

        <div className="bg-white rounded-3xl border border-darkNeutral/10 p-8 md:p-12 space-y-8">
          <section>
            <h2 className="font-editorial text-2xl font-bold text-deepBlue mb-4">1. Introdução</h2>
            <p className="text-darkNeutral/80 leading-relaxed">
              O Solta o Verbo respeita a sua privacidade e está comprometido em proteger seus dados pessoais.
              Esta política de privacidade explica como coletamos, usamos e protegemos suas informações quando
              você utiliza nossa plataforma.
            </p>
          </section>

          <section>
            <h2 className="font-editorial text-2xl font-bold text-deepBlue mb-4">2. Informações que Coletamos</h2>
            <p className="text-darkNeutral/80 leading-relaxed mb-3">
              Coletamos as seguintes informações:
            </p>
            <ul className="list-disc list-inside space-y-2 text-darkNeutral/80 ml-4">
              <li>Nome de exibição e endereço de e-mail fornecidos no cadastro</li>
              <li>Informações de perfil opcionais, como biografia</li>
              <li>Conteúdo que você cria na plataforma (exercícios de escrita, comentários)</li>
              <li>Dados de uso e navegação para melhorar nossos serviços</li>
              <li>Informações de autenticação quando você usa login com Google</li>
            </ul>
          </section>

          <section>
            <h2 className="font-editorial text-2xl font-bold text-deepBlue mb-4">3. Como Usamos suas Informações</h2>
            <p className="text-darkNeutral/80 leading-relaxed mb-3">
              Utilizamos suas informações para:
            </p>
            <ul className="list-disc list-inside space-y-2 text-darkNeutral/80 ml-4">
              <li>Criar e gerenciar sua conta</li>
              <li>Fornecer acesso aos nossos programas e conteúdos</li>
              <li>Comunicar atualizações, novidades e informações relevantes</li>
              <li>Melhorar nossos serviços e experiência do usuário</li>
              <li>Garantir a segurança e integridade da plataforma</li>
            </ul>
          </section>

          <section>
            <h2 className="font-editorial text-2xl font-bold text-deepBlue mb-4">4. Compartilhamento de Dados</h2>
            <p className="text-darkNeutral/80 leading-relaxed">
              Não vendemos, alugamos ou compartilhamos suas informações pessoais com terceiros para fins de
              marketing. Podemos compartilhar dados apenas quando necessário para fornecer nossos serviços
              (como provedores de hospedagem) ou quando exigido por lei.
            </p>
          </section>

          <section>
            <h2 className="font-editorial text-2xl font-bold text-deepBlue mb-4">5. Segurança dos Dados</h2>
            <p className="text-darkNeutral/80 leading-relaxed">
              Implementamos medidas de segurança técnicas e organizacionais para proteger seus dados contra
              acesso não autorizado, alteração, divulgação ou destruição. Utilizamos criptografia e
              armazenamento seguro para todas as informações sensíveis.
            </p>
          </section>

          <section>
            <h2 className="font-editorial text-2xl font-bold text-deepBlue mb-4">6. Seus Direitos</h2>
            <p className="text-darkNeutral/80 leading-relaxed mb-3">
              Você tem o direito de:
            </p>
            <ul className="list-disc list-inside space-y-2 text-darkNeutral/80 ml-4">
              <li>Acessar seus dados pessoais</li>
              <li>Corrigir informações incorretas</li>
              <li>Solicitar a exclusão de sua conta e dados</li>
              <li>Optar por não receber comunicações de marketing</li>
              <li>Exportar seus dados em formato legível</li>
            </ul>
          </section>

          <section>
            <h2 className="font-editorial text-2xl font-bold text-deepBlue mb-4">7. Cookies e Tecnologias Similares</h2>
            <p className="text-darkNeutral/80 leading-relaxed">
              Utilizamos cookies e tecnologias similares para melhorar sua experiência, manter sua sessão
              ativa e entender como você interage com nossa plataforma. Você pode gerenciar suas preferências
              de cookies através das configurações do seu navegador.
            </p>
          </section>

          <section>
            <h2 className="font-editorial text-2xl font-bold text-deepBlue mb-4">8. Menores de Idade</h2>
            <p className="text-darkNeutral/80 leading-relaxed">
              Nossa plataforma é destinada a maiores de 18 anos. Não coletamos intencionalmente informações
              de menores de idade. Se você acredita que coletamos dados de um menor, entre em contato conosco
              imediatamente.
            </p>
          </section>

          <section>
            <h2 className="font-editorial text-2xl font-bold text-deepBlue mb-4">9. Alterações nesta Política</h2>
            <p className="text-darkNeutral/80 leading-relaxed">
              Podemos atualizar esta política de privacidade periodicamente. Notificaremos você sobre
              mudanças significativas através de e-mail ou aviso em nossa plataforma. A data da última
              atualização será sempre indicada no topo desta página.
            </p>
          </section>

          <section>
            <h2 className="font-editorial text-2xl font-bold text-deepBlue mb-4">10. Contato</h2>
            <p className="text-darkNeutral/80 leading-relaxed">
              Se você tiver dúvidas sobre esta política de privacidade ou sobre como tratamos seus dados,
              entre em contato conosco através da nossa{' '}
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
