import { Link } from 'react-router-dom';
import { Sparkles, Users, CheckCircle2 } from 'lucide-react';
import PreLoginNavbar from '../components/PreLoginNavbar';
import PreLoginFooter from '../components/PreLoginFooter';

export default function ProgramaCiclo() {
  return (
    <div className="min-h-screen bg-bgPlataforma text-tintaCarvao selection:bg-acentoTerracota/20 selection:text-acentoAzul flex flex-col justify-between">
      <div>
        <PreLoginNavbar />

        <main className="py-20 sm:py-28 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-acentoAzul text-white rounded-3xl p-8 sm:p-14 border-2 border-acentoTerracota shadow-kraft-lg text-center space-y-8 relative overflow-hidden">
            {/* Tag Superior */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-papelClaro text-xs sm:text-sm font-semibold lowercase">
              <Users className="w-4 h-4" />
              <span>assinatura anual / trimestral • mentoria ao vivo</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-editorial text-papelClaro lowercase">
              ciclo de aprofundamento (comunidade paga)
            </h1>

            <p className="text-papelClaro/90 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed font-medium lowercase">
              página oficial de vendas e mentoria do ciclo de aprofundamento.
            </p>

            <div className="p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 max-w-xl mx-auto text-left space-y-3">
              <p className="text-sm font-bold text-acentoOliva uppercase tracking-wider">
                o que inclui a assinatura:
              </p>
              <ul className="space-y-2 text-sm text-papelClaro/90 font-medium lowercase">
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-acentoOliva flex-shrink-0" />
                  <span>encontros quinzenais ao vivo no zoom com mentoria</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-acentoOliva flex-shrink-0" />
                  <span>fogueira ilimitada 365 dias por ano</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-acentoOliva flex-shrink-0" />
                  <span>acervo completo de aulas e gravações</span>
                </li>
              </ul>
            </div>

            <div className="pt-4 flex flex-wrap justify-center items-center gap-4">
              <Link
                to="/register?product=ciclo"
                className="btn-pill-accent text-base sm:text-lg px-8 py-3.5 rounded-full shadow-lg hover:scale-105 transition-all flex items-center gap-2.5"
              >
                <span>fazer parte do ciclo — R$ 597,00/ano</span>
                <Sparkles className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </main>
      </div>

      <PreLoginFooter />
    </div>
  );
}
