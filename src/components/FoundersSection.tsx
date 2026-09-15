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
    summary:
      'de uma comuna em israel a uma horta comunitária em florianópolis, bruna riedel é geógrafa e escritora que encontrou na palavra a ferramenta pra construir pertencimento.',
    bio: [
      'aos dezoito anos morou numa comuna em israel, dividindo casa e salário com quinze amigos. antes disso, três meses num kibutz, e depois deu aula de hebraico pra refugiados da etiópia. foi ali que entendeu que pertencer é ser corresponsável pelo coletivo.',
      'formou-se em geografia na udesc, com pesquisa sobre um grupo que transformou um terreno baldio em horta comunitária, com pessoas em situação de rua plantando onde antes só tinha mato.',
      'repetiu esse gesto em instituições diferentes: impact hub, salto inclusão produtiva, tribos lab, e há quatro anos o instituto amuta, aplicando o design de conexões. seu trabalho parte das pesquisas de james pennebaker sobre escrita expressiva e da curva do esquecimento de ebbinghaus, e acredita que todo mundo já sabe escrever, só precisa de um canal guiado pra se escutar.',
      'cofundadora e facilitadora da solta o verbo, ao lado de júlia alvim, onde aplica na palavra o que aprendeu na horta e na comuna: que ninguém pertence sozinho.',
    ],
  },
  {
    id: 'julia',
    name: 'júlia alvim',
    role: 'co-criadora & facilitadora',
    photo: '/jo.png',
    iconSvg: '/brand-assets/icons/icone_62.svg',
    washiTape: '/brand-assets/elements/stickers/fitas-washi-flores-azul.png',
    summary:
      'julia alvim é contadora de histórias. encontrou na escrita a ferramenta da própria travessia e é o que hoje sustenta seu trabalho com outras pessoas.',
    bio: [
      'saiu de um cargo de gerência em multinacional para seguir um caminho autoral mais alinhado com sua verdade e explora todas as possibilidades de comunicação através da arte para contar uma boa história.',
      'atualmente trabalha com comunicação digital, criação de conteúdo de vídeo e produção de eventos, retiros e encontros no brasil e na europa. criou projetos coletivos como o children of the universe e o "segundas intenções", newsletter no substack. é movida pela possibilidade de aprender algo novo.',
      'co-criadora e facilitadora do solta o verbo, desenha jornadas em que a expressão através da escrita se torna um espaço seguro para reorganizar emoções e ressignificar narrativas.',
    ],
  },
];

export default function FoundersSection() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleFounder = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <section id="sobre-nos" className="pt-24 sm:pt-32 pb-0 bg-bgPlataforma relative overflow-hidden">
      {/* Background Texture Overlay */}
      <div
        className="absolute inset-0 opacity-[0.04] bg-cover bg-center pointer-events-none mix-blend-multiply"
        style={{ backgroundImage: "url('/brand-assets/textures/papel-kraft-vintage-1.jpg')" }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header Section (Tag eliminada completamente) */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-editorial text-acentoAzul lowercase mb-4">
            conheça as co-criadoras
          </h2>
          <p className="text-tintaCarvao/80 text-base sm:text-lg font-medium lowercase">
            duas trajetórias que se uniram para desenhar um espaço seguro de escrita, escuta e autoria. as duas mudaram de vida escrevendo e é isso que desejam espalhar ao soltarem o verbo.
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

      {/* Banner de Colagem Final Full Width no Rodapé da Seção com espaçamento top reduzido */}
      <div className="w-full mt-3 sm:mt-6 relative z-10 pointer-events-none select-none">
        {/* Imagem para Desktop */}
        <img
          src="/brand-assets/elements/collages/collage final bk desktp.png"
          alt="colagem poética final desktop"
          className="hidden sm:block w-full h-auto object-cover object-center"
        />
        {/* Imagem para Mobile */}
        <img
          src="/brand-assets/elements/collages/collage final bk mobile.png"
          alt="colagem poética final mobile"
          className="block sm:hidden w-full h-auto object-cover object-center"
        />
      </div>
    </section>
  );
}
