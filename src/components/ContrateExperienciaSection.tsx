import { MessageCircle, Sparkles, Building2, Users2, Compass } from 'lucide-react';
import { BRAND_ASSETS } from '../config/brandAssets';

export default function ContrateExperienciaSection() {
  const whatsappUrl = `https://wa.me/5511999999999?text=${encodeURIComponent(
    'olá! gostaria de saber mais sobre como contratar uma experiência ou oficina do solta o verbo para nossa empresa/evento.'
  )}`;

  const highlights = [
    {
      icon: Building2,
      title: 'oficinas corporativas',
      description: 'workshops de escrita consciente para aliviar o estresse, integrar equipes e estimular a comunicação autêntica no trabalho.',
    },
    {
      icon: Users2,
      title: 'rodas de escrita para coletivos',
      description: 'encontros presenciais ou virtuais sob medida para festivais, comunidades, retiros e grupos de reflexão.',
    },
    {
      icon: Compass,
      title: 'curadoria narrativa personalizada',
      description: 'criação de cadernos artesanais, temas exclusivos e dinâmicas guiadas pensadas para o propósito da sua marca.',
    },
  ];

  return (
    <section id="contrate-experiencia" className="py-24 sm:py-32 bg-bgPlataforma relative overflow-hidden">
      {/* Elemento de Marca de Agua de Fondo */}
      <div className="absolute -right-20 -bottom-20 opacity-5 pointer-events-none select-none">
        <img
          src={BRAND_ASSETS.logos.icon}
          alt="watermark"
          className="w-96 h-96 object-contain"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="bg-papelClaro rounded-3xl p-8 sm:p-12 lg:p-16 border border-papelKraft/60 shadow-kraft-lg">
          <div className="max-w-3xl mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-bgPlataforma border border-papelKraft/60 text-acentoAzul text-xs font-semibold uppercase tracking-wider mb-4 shadow-sm">
              <Sparkles className="w-4 h-4 text-acentoTerracota" />
              <span>para marcas, empresas e eventos</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-editorial text-acentoAzul lowercase leading-tight mb-6">
              contrate uma experiência solta o verbo
            </h2>

            <p className="text-tintaCarvao/85 text-lg sm:text-xl leading-relaxed font-medium lowercase">
              levamos nossas vivências, rodas de escrita consciente e oficinas narrativas sob medida para a sua equipe, retiro ou evento presencial.
            </p>
          </div>

          {/* Highlights Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {highlights.map(({ icon: Icon, title, description }, idx) => (
              <div
                key={idx}
                className="bg-bgPlataforma/60 rounded-2xl p-6 border border-papelKraft/50 shadow-sm transition-all hover:-translate-y-1 hover:border-papelKraft"
              >
                <div className="w-12 h-12 rounded-2xl bg-acentoAzul/10 text-acentoAzul flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold font-editorial text-acentoAzul lowercase mb-2">
                  {title}
                </h3>
                <p className="text-tintaCarvao/75 text-sm sm:text-base leading-relaxed lowercase font-medium">
                  {description}
                </p>
              </div>
            ))}
          </div>

          {/* CTA Box */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 p-6 rounded-2xl bg-acentoAzul text-white shadow-kraft">
            <div>
              <h4 className="text-xl sm:text-2xl font-editorial font-bold lowercase mb-1 text-papelClaro">
                vamos desenhar algo especial juntos?
              </h4>
              <p className="text-papelClaro/80 text-sm sm:text-base lowercase">
                fale diretamente conosco pelo whatsapp e receba a proposta detalhada.
              </p>
            </div>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-pill-accent px-8 py-3.5 rounded-full text-base sm:text-lg font-semibold flex items-center gap-3 transition-all hover:scale-105 shadow-md flex-shrink-0"
            >
              <MessageCircle className="w-5 h-5" />
              <span>falar no whatsapp</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
