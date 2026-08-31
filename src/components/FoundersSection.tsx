import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface Founder {
  id: string;
  name: string;
  role: string;
  photo: string;
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
    photo: '/bruna copy copy.png',
    iconSvg: '/brand-assets/icons/icone_60.svg',
    washiTape: '/brand-assets/elements/stickers/fitas-washi-flores-terracota.png',
    summary: 'mineira que escolheu viver perto do mar, bruna riedel é geógrafa licenciada, escritora, community manager e designer de conexões e experiências.',
    bio: [
      'mineira que escolheu viver perto do mar, bruna riedel é geógrafa licenciada, escritora, community manager e designer de conexões e experiências.',
      'há dez anos em florianópolis, trabalha criando ambientes onde pessoas possam aprender, se relacionar, trocar e se transformarem juntas.',
      'ao longo de sua trajetória, co-criou um comitê de sustentabilidade dentro de uma organização de impacto socioambiental e liderou movimentos de agroecologia.',
      'co-criadora e facilitadora da solta o verbo, bruna desenha experiências em que a escrita se torna uma ferramenta poderosa para gerar consciência, liberdade e autoria.',
    ],
  },
  {
    id: 'julia',
    name: 'júlia alvim',
    role: 'co-criadora & facilitadora',
    photo: '/jo.png',
    iconSvg: '/brand-assets/icons/icone_62.svg',
    washiTape: '/brand-assets/elements/stickers/fitas-washi-flores-azul.png',
    summary: 'de gerente em multinacional para um caminho autoral, julia alvim é contadora de histórias que encontrou na escrita a ferramenta de transição de vida.',
    bio: [
      'de gerente em multinacional para um caminho autoral, julia alvim é contadora de histórias que encontrou na escrita a ferramenta que guiou sua própria transição de vida para um destino mais alinhado com sua verdade.',
      'dedica-se em aprofundar seus estudos sobre relações humanas, criatividade e autoconhecimento. produziu eventos, retiros e encontros no brasil e na europa.',
      'criou projetos coletivos como o children of the universe e o \'segundas intenções\' no substack, uma newsletter para inspirar pessoas a acreditarem que a mudança acontece de dentro para fora.',
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
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-papelClaro border border-papelKraft/40 text-acentoAzul text-xs sm:text-sm font-semibold lowercase tracking-wider mb-4 shadow-sm">
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

        {/* Grid de Cards Bento Artísticos com Fotos Reais */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10 items-start">
          {founders.map((founder) => {
            const isExpanded = expandedId === founder.id;
            return (
              <div
                key={founder.id}
                className="bg-papelClaro rounded-3xl p-6 sm:p-8 border border-papelKraft/40 shadow-kraft-lg relative overflow-hidden transition-all duration-500 hover:shadow-2xl group flex flex-col justify-between"
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

                <div className="relative z-10 space-y-6">
                  {/* Foto Real da Criadora & Cabeçalho */}
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
                    {/* Retrato da Criadora */}
                    <div className="sm:col-span-5 relative group/photo">
                      <div className="w-full h-64 sm:h-52 rounded-2xl overflow-hidden border border-papelKraft/40 shadow-md relative bg-bgPlataforma">
                        <img
                          src={founder.photo}
                          alt={founder.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover/photo:scale-105 filter grayscale hover:grayscale-0"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/whatsapp_image_2025-12-11_at_3.24.18_pm.jpeg';
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-acentoAzul/60 via-transparent to-transparent opacity-0 group-hover/photo:opacity-100 transition-opacity" />
                      </div>

                      {/* Selo com Ícone no Canto da Foto */}
                      <div className="absolute -bottom-2 -right-2 w-9 h-9 rounded-xl bg-acentoTerracota text-white flex items-center justify-center p-2 shadow-md">
                        <img
                          src={founder.iconSvg}
                          alt="icon"
                          className="w-full h-full object-contain filter invert"
                        />
                      </div>
                    </div>

                    {/* Nome & Cargo */}
                    <div className="sm:col-span-7 space-y-2">
                      <span className="font-gesto text-acentoTerracota text-2xl sm:text-3xl font-normal block">
                        {founder.role}
                      </span>
                      <h3 className="text-3xl sm:text-4xl font-bold font-editorial text-acentoAzul lowercase">
                        {founder.name}
                      </h3>
                    </div>
                  </div>

                  <p className="text-tintaCarvao/85 text-base sm:text-lg leading-relaxed font-medium lowercase pt-2">
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

                  {/* Botão de Expansão / Ver Trajetória */}
                  <button
                    onClick={() => toggleFounder(founder.id)}
                    className="w-full mt-4 py-3 px-5 rounded-full bg-acentoAzul hover:bg-acentoAzul/90 text-white font-medium text-sm flex items-center justify-center gap-2 transition-all shadow-md lowercase cursor-pointer"
                  >
                    <span>{isExpanded ? 'recolher biografia' : 'conhecer trajetória completa'}</span>
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
