import { Link } from 'react-router-dom';
import { Coffee, ArrowRight, CheckCircle2 } from 'lucide-react';
import PreLoginNavbar from '../components/PreLoginNavbar';
import PreLoginFooter from '../components/PreLoginFooter';

export default function ProgramaCafeComLetras() {
  return (
    <div className="min-h-screen bg-bgPlataforma text-tintaCarvao selection:bg-acentoTerracota/20 selection:text-acentoAzul flex flex-col justify-between">
      <div>
        <PreLoginNavbar />

        <main className="py-20 sm:py-28 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-papelClaro rounded-3xl p-8 sm:p-14 border border-papelKraft/60 shadow-kraft-lg text-center space-y-8 relative overflow-hidden">
            {/* Tag Superior */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-acentoOliva/20 text-acentoAzul text-xs sm:text-sm font-semibold lowercase">
              <Coffee className="w-4 h-4 text-acentoAzul" />
              <span>encontros presenciais & virtuais • partilha</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-editorial text-acentoAzul lowercase">
              café com letras (rodas de escrita)
            </h1>

            <p className="text-tintaCarvao/85 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed font-medium lowercase">
              página de informações e inscrições das rodas do café com letras.
            </p>

            <div className="p-6 bg-bgPlataforma rounded-2xl border border-papelKraft/40 max-w-xl mx-auto text-left space-y-3">
              <p className="text-sm font-bold text-acentoAzul uppercase tracking-wider">
                como funcionam os encontros:
              </p>
              <ul className="space-y-2 text-sm text-tintaCarvao/80 font-medium lowercase">
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-acentoOliva flex-shrink-0" />
                  <span>rodas temáticas presenciais e virtuais</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-acentoOliva flex-shrink-0" />
                  <span>cadernos abertos, café quente e leitura poética</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-acentoOliva flex-shrink-0" />
                  <span>inscrições abertas por edição</span>
                </li>
              </ul>
            </div>

            <div className="pt-4 flex flex-wrap justify-center items-center gap-4">
              <Link
                to="/register"
                className="btn-pill-secondary text-base sm:text-lg px-8 py-3.5 rounded-full border border-papelKraft/70 hover:bg-bgPlataforma transition-all flex items-center gap-2.5"
              >
                <span>ver edições e garanta sua vaga</span>
                <ArrowRight className="w-5 h-5 text-acentoAzul" />
              </Link>
            </div>
          </div>
        </main>
      </div>

      <PreLoginFooter />
    </div>
  );
}
