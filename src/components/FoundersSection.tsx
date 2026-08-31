import { useState } from 'react';
import { ChevronDown, Sparkles } from 'lucide-react';

interface Founder {
  id: string;
  name: string;
  role: string;
  initial: string;
  iconSvg: string;
  washiTape: string;
  summary: string;
  bio: string[];
}

const founders: Founder[] = [
  {
    id: 'bruna',
    name: 'bruna riedel',
    role: 'co-criadora & facilitadora',
    initial: 'b',
    iconSvg: '/brand-assets/icons/icone_60.svg',
    washiTape: '/brand-assets/elements/stickers/fitas-washi-flores-terracota.png',
    summary: 'mineira que escolheu viver perto do mar, bruna riedel é geógrafa licenciada, escritora, community manager e designer de conexões e experiências.',
    bio: [
      'mineira que escolheu viver perto do mar, bruna riedel é geógrafa licenciada, escritora, community manager e designer de conexões e experiências.',
      'há dez anos em florianópolis, trabalha criando ambientes onde pessoas possam aprender, se relacionar, trocar e se transformarem juntas.',
      'co-criadora e facilitadora da solta o verbo, bruna desenha experiências em que a escrita se torna uma ferramenta poderosa para gerar consciência, liberdade e autoria.',
    ],
  },
  {
    id: 'julia',
    name: 'júlia alvim',
    role: 'co-criadora & facilitadora',
    initial: 'j',
    iconSvg: '/brand-assets/icons/icone_62.svg',
    washiTape: '/brand-assets/elements/stickers/fitas-washi-flores-azul.png',
    summary: 'de gerente em multinacional para um caminho autoral, julia alvim é contadora de histórias que encontrou na escrita a ferramenta de transição de vida.',
    bio: [
      'de gerente em multinacional para um caminho autoral, julia alvim é contadora de histórias que encontrou na escrita a ferramenta que guiou sua própria transição de vida para um destino mais alinhado com sua verdade.',
      'dedica-se em aprofundar seus estudos sobre relações humanas, criatividade e autoconhecimento. produziu eventos, retiros e encontros no brasil e na europa.',
      'co-criadora e facilitadora do solta o verbo, julia desenha jornadas em que a expressão através da escrita se torna um espaço seguro para reorganizar emoções e ressignificar narrativas.',
    ],
  },
];

export default function FoundersSection() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleFounder = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <section id="sobre-nos" className="py-24 sm:py-32 bg-bgPlataforma relative overflow-hidden">
      {/* Background Texture Overlay */}
      <div
        className="absolute inset-0 opacity-[0.04] bg-cover bg-center pointer-events-none mix-blend-multiply"
        style={{ backgroundImage: "url('/brand-assets/textures/papel-kraft-vintage-1.jpg')" }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-papelClaro border border-papelKraft/60 text-acentoAzul text-xs sm:text-sm font-semibold uppercase tracking-wider mb-4 shadow-sm">
            <img
              src="/brand-assets/icons/icone_63.svg"
              alt="chama viva"
              className="w-5 h-5 object-contain"
            />
            <span>quem conduz a fogueira</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-editorial text-acentoAzul lowercase mb-4">
            conheça as co-criadoras
          </h2>
          <p className="text-tintaCarvao/80 text-base sm:text-lg font-medium lowercase">
            duas trajetórias que se uniram para desenhar um espaço seguro de escrita, escuta e autoria.
          </p>
        </div>

        {/* Grid de Cards Bento Artísticos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10 items-start">
          {founders.map((founder) => {
            const isExpanded = expandedId === founder.id;
            return (
              <div
                key={founder.id}
                className="bg-papelClaro rounded-3xl p-8 sm:p-10 border border-papelKraft/60 shadow-kraft-lg relative overflow-hidden transition-all duration-500 hover:shadow-2xl hover:border-papelKraft group flex flex-col justify-between"
              >
                {/* Sticker Fita Washi no Topo */}
                <div className="absolute -top-1 left-8 w-28 h-7 pointer-events-none z-20 opacity-85 transition-transform duration-500 group-hover:scale-105">
                  <img
                    src={founder.washiTape}
                    alt="fita washi"
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* Ícone Marca d'Água de Fundo */}
                <div className="absolute -bottom-8 -right-8 opacity-[0.06] pointer-events-none select-none transition-transform duration-700 group-hover:scale-110">
                  <img
                    src={founder.iconSvg}
                    alt="watermark"
                    className="w-64 h-64 object-contain"
                  />
                </div>

                <div className="relative z-10">
                  {/* Topo do Card: Avatar & Cargo */}
                  <div className="flex items-center justify-between gap-4 mb-6 pt-2">
                    <div className="relative">
                      <div className="w-14 h-14 rounded-2xl bg-acentoAzul/10 border border-papelKraft/40 flex items-center justify-center font-editorial font-bold text-2xl text-acentoAzul shadow-sm">
                        {founder.initial}
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-acentoTerracota text-white flex items-center justify-center p-1 shadow-sm">
                        <img
                          src={founder.iconSvg}
                          alt="icon"
                          className="w-full h-full object-contain filter invert"
                        />
                      </div>
                    </div>

                    <span className="font-gesto text-acentoTerracota text-2xl sm:text-3xl font-normal">
                      {founder.role}
                    </span>
                  </div>

                  <h3 className="text-3xl sm:text-4xl font-bold font-editorial text-acentoAzul lowercase mb-3">
                    {founder.name}
                  </h3>

                  <p className="text-tintaCarvao/85 text-base sm:text-lg leading-relaxed font-medium lowercase mb-6">
                    {founder.summary}
                  </p>

                  {/* Dropdown de Biografia Completa com Animação Fluida */}
                  <div
                    className={`transition-all duration-500 overflow-hidden ${
                      isExpanded ? 'max-h-[600px] opacity-100 pt-6 border-t border-papelKraft/40' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <div className="space-y-4 text-tintaCarvao/90 text-base sm:text-lg leading-relaxed font-medium lowercase">
                      {founder.bio.map((paragraph, pIdx) => (
                        <div key={pIdx} className="flex items-start gap-3">
                          <span className="w-2 h-2 rounded-full bg-acentoTerracota mt-2.5 flex-shrink-0" />
                          <p>{paragraph}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Botão Interativo Pílula de Alta Visibilidade */}
                <div className="pt-6 mt-6 border-t border-papelKraft/30 flex justify-end relative z-10">
                  <button
                    onClick={() => toggleFounder(founder.id)}
                    className="bg-acentoAzul text-white hover:bg-acentoAzul/90 hover:scale-105 px-6 py-3 rounded-full text-sm sm:text-base font-medium transition-all shadow-md flex items-center gap-2.5 cursor-pointer lowercase"
                  >
                    <span>{isExpanded ? 'recolher trajetória' : 'conhecer trajetória'}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-white transition-transform duration-300 ${
                        isExpanded ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
