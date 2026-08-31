import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, CheckCircle2, Sparkles, Pencil } from 'lucide-react';
import PreLoginNavbar from '../components/PreLoginNavbar';
import PreLoginFooter from '../components/PreLoginFooter';

export default function Programa21Dias() {
  return (
    <div className="min-h-screen bg-bgPlataforma text-tintaCarvao selection:bg-acentoTerracota/20 selection:text-acentoAzul flex flex-col justify-between">
      <div>
        <PreLoginNavbar />

        <main className="py-20 sm:py-28 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-papelClaro rounded-3xl p-8 sm:p-14 border border-papelKraft/60 shadow-kraft-lg text-center space-y-8 relative overflow-hidden">
            {/* Tag Superior */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-acentoAzul/10 text-acentoAzul text-xs sm:text-sm font-semibold lowercase">
              <BookOpen className="w-4 h-4" />
              <span>programa self-paced • 21 dias</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-editorial text-acentoAzul lowercase">
              21 dias de escrita (sua história tem valor)
            </h1>

            <p className="text-tintaCarvao/85 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed font-medium lowercase">
              página oficial de vendas e informações do programa 21 dias de escrita.
            </p>

            <div className="p-6 bg-bgPlataforma rounded-2xl border border-papelKraft/40 max-w-xl mx-auto text-left space-y-3">
              <p className="text-sm font-bold text-acentoAzul uppercase tracking-wider">
                detalhes do programa:
              </p>
              <ul className="space-y-2 text-sm text-tintaCarvao/80 font-medium lowercase">
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-acentoOliva flex-shrink-0" />
                  <span>21 exercícios diários liberados passo a passo</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-acentoOliva flex-shrink-0" />
                  <span>áudios de inspiração e formato podcast</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-acentoOliva flex-shrink-0" />
                  <span>acesso total à fogueira comunitária</span>
                </li>
              </ul>
            </div>

            <div className="pt-4 flex flex-wrap justify-center items-center gap-4">
              <Link
                to="/register?product=21dias"
                className="btn-pill-primary text-base sm:text-lg px-8 py-3.5 rounded-full shadow-md hover:scale-105 transition-all flex items-center gap-2.5"
              >
                <span>garantir minha vaga — R$ 77,00</span>
                <Pencil className="w-5 h-5 text-white" />
              </Link>
            </div>
          </div>
        </main>
      </div>

      <PreLoginFooter />
    </div>
  );
}
