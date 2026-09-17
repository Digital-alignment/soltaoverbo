import { useState, useEffect } from 'react';
import {
  Users,
  CheckCircle2,
  XCircle,
  ArrowRight,
  ShieldCheck,
  BookOpen,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  X,
  Calendar,
  Quote,
} from 'lucide-react';
import PreLoginNavbar from '../components/PreLoginNavbar';
import PreLoginFooter from '../components/PreLoginFooter';
import FoundersSection from '../components/FoundersSection';
import PaymentModal from '../components/PaymentModal';
import { usePageContent } from '../hooks/usePageContent';

export default function ProgramaCiclo() {
  const content = usePageContent('programa_ciclo');
  const testimonialsPoolContent = usePageContent('testimonials_pool');

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [selectedScreenshot, setSelectedScreenshot] = useState<string | null>(null);
  const [selectedQuoteModal, setSelectedQuoteModal] = useState<{ quote: string; author: string; role?: string } | null>(null);

  const heroSec = content.hero || {};
  const comoFuncionaSec = content.como_funciona || {};
  const proximaTravessiaSec = content.proxima_travessia || {};
  const pilaresSec = content.pilares || {};
  const paraQuemESec = content.para_quem_e || {};
  const depoimentosSec = content.depoimentos || {};
  const objecoesSec = content.objecoes || {};
  const finalOfferSec = content.final_offer || {};
  const faqSec = content.faq || {};

  // Banco global de depoimentos e prints (Deployments)
  const selectedIds = (depoimentosSec.selected_ids || 't10,t11,t12,d15,d16,d17,d18')
    .split(',')
    .map((s: string) => s.trim())
    .filter(Boolean);

  const activeDeploymentItems = selectedIds.map((id: string) => {
    const poolItem = testimonialsPoolContent[id] || {};
    if (id.startsWith('d')) {
      return {
        id,
        title: poolItem.quote || 'partilha e acolhimento',
        src: poolItem.image_url || `/brand-assets/deployments/IMG_${id === 'd1' ? '2847.PNG' : '2848.PNG'}`,
        tag: poolItem.event_tag || '21 dias de escrita',
        author: poolItem.author || 'aluna solta o verbo',
        role: poolItem.role || 'print real da comunidade',
      };
    }
    return {
      id,
      title: poolItem.author || 'depoimento de participante',
      quote: poolItem.quote || 'experiência incrível de escrita em coletivo.',
      author: poolItem.author || 'aluna solta o verbo',
      role: poolItem.role || 'membro da comunidade',
      tag: poolItem.event_tag || 'ciclo de aprofundamento',
    };
  });

  // Auto-play do carrossel
  useEffect(() => {
    if (isPaused || activeDeploymentItems.length === 0) return;
    const interval = setInterval(() => {
      setCarouselIndex((prev) => (prev + 1) % activeDeploymentItems.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isPaused, activeDeploymentItems.length]);

  const nextSlide = () => {
    setCarouselIndex((prev) => (prev + 1) % activeDeploymentItems.length);
  };

  const prevSlide = () => {
    setCarouselIndex((prev) => (prev - 1 + activeDeploymentItems.length) % activeDeploymentItems.length);
  };

  const handleEnroll = () => {
    setIsPaymentModalOpen(true);
  };

  const defaultPillars = [
    {
      num: 1,
      badge: '01 · ritual semanal',
      title: 'acesso a todos os cafés com letras',
      desc: 'o ritual de terça-feira de escrita coletiva, das 8h às 8h30. toda semana, meia hora só sua antes do dia começar, com gente escrevendo junto.',
    },
    {
      num: 2,
      badge: '02 · encontros no zoom',
      title: '3 encontros ao vivo, um por mês, com bruna, júlia e convidada',
      desc: 'das 19h às 20h30, fechando cada mês: o tema destravado em voz alta, com espaço para a sua história e não só para a teoria.',
    },
    {
      num: 3,
      badge: '03 · whatsapp',
      title: 'comunidade no whatsapp',
      desc: 'a troca do dia a dia: o insight que veio no ônibus, o trecho do livro que doeu, o apoio quando trava. dois grupos: "junto e misturado" e "cá entre nós".',
    },
    {
      num: 4,
      badge: '04 · jornada autoguiada',
      title: 'os 21 dias de escrita liberados',
      desc: 'a jornada completa para escrever até virar hábito.',
    },
    {
      num: 5,
      badge: '05 · gravações',
      title: 'acervo de materiais gravados',
      desc: 'tudo o que já construímos, disponível no seu tempo.',
    },
    {
      num: 6,
      badge: '06 · plataforma',
      title: 'plataforma completa',
      desc: 'diário pessoal, área de partilha, rituais e inspirações de escrita, sempre à mão.',
    },
    {
      num: 7,
      badge: '07 · presencial',
      title: 'desconto especial nos encontros presenciais do solta o verbo',
      desc: 'pra quando a gente se encontra fora da tela.',
    },
  ];

  const defaultObjections = [
    {
      num: 1,
      q: 'não tenho tempo',
      a: 'a roda semanal dura meia hora, das 8h às 8h30, cabe antes do trabalho começar. o único compromisso mais longo é uma noite por mês. quem pode vir toda terça, vem; quem só consegue no fechamento, também atravessa. nada é obrigatório e tudo fica gravado.',
    },
    {
      num: 2,
      q: 'não sei escrever',
      a: 'aqui ninguém corrige texto. a gente escuta gente. não existe pré-requisito além de vontade.',
    },
    {
      num: 3,
      q: 'e se eu perder um encontro?',
      a: 'tudo fica gravado no acervo, disponível durante toda a travessia.',
    },
    {
      num: 4,
      q: 'sou obrigada a ler o que escrevi?',
      a: 'nunca. a partilha é sempre voluntária. tem gente que só escuta nos primeiros encontros, e isso também é atravessar.',
    },
    {
      num: 5,
      q: 'e se eu não me identificar?',
      a: 'você tem garantia incondicional de 7 dias. entra, participa, sente. se não for para você, devolvemos o valor integral, sem perguntas.',
    },
    {
      num: 6,
      q: 'e depois dos três meses?',
      a: 'uma nova travessia começa, com outro tema e outro convidado. você escolhe se segue. o ciclo é contínuo, o compromisso é por travessia.',
    },
  ];

  const defaultFaqList = [
    {
      q: 'o que é exatamente o ciclo de aprofundamento?',
      a: 'é a nossa comunidade paga, organizada em travessias de três meses. cada travessia mergulha em um tema de autodesenvolvimento, criatividade e relações humanas, apoiada por um livro-guia e por um convidado especial. a travessia atual é "a coragem de não agradar", com o livro de ichiro kishimi e fumitake koga e a presença da jout jout.',
    },
    {
      q: 'são só três encontros em três meses?',
      a: 'não. o ciclo é uma rotina semanal: toda terça-feira acontece o café com letras, nossa roda de escrita coletiva, e a conversa segue todos os dias nos grupos de whatsapp. os três encontros ao vivo são os fechamentos de cada mês, onde tudo o que foi escrito se reúne e se aprofunda. ao longo da travessia são cerca de doze terças escrevendo em grupo.',
    },
    {
      q: 'qual é o valor?',
      a: 'r$597,00 no pix pela travessia completa de 3 meses, ou 3x de r$225,67 sem juros no cartão. inclui todos os cafés com letras, os três encontros ao vivo de fechamento, os dois grupos de whatsapp, os 21 dias de escrita, o acervo completo e acesso a toda plataforma.',
    },
    {
      q: 'quando acontecem os encontros ao vivo?',
      a: 'os fechamentos de mês são em 27 de outubro, 24 de novembro e 15 de dezembro, sempre numa terça-feira, das 19h às 20h30, no zoom. tudo fica gravado.',
    },
    {
      q: 'e o café com letras, quando é?',
      a: 'toda terça-feira, das 8h às 8h30. são trinta minutos de escrita coletiva para começar o dia e a semana pela sua própria voz, antes de o mundo começar a pedir coisas.',
    },
    {
      q: 'o ciclo é uma mentoria?',
      a: 'não. bruna e júlia conduzem as rodas e sustentam o espaço, mas quem escreve a sua história é você. é escrita coletiva, partilha e travessia em comunidade, não aula, não consultoria, não mentoria.',
    },
    {
      q: 'as inscrições fecham em 1º de outubro, mas o primeiro encontro é só em 27. o que acontece nesse intervalo?',
      a: 'esse tempo é de propósito e ele já é parte da travessia. assim que você entra, recebe acesso imediato à plataforma, aos 21 dias de escrita, ao acervo e aos dois grupos, e participa dos cafés com letras toda terça. é também o período para começar a leitura do livro com calma, para que você chegue no dia 27 já escrevendo, e não começando do zero.',
    },
    {
      q: 'a jout jout participa de todos os encontros?',
      a: 'a jout jout é a convidada especial do terceiro e último encontro da travessia. os dois primeiros são conduzidos por bruna e júlia, que preparam o terreno para que essa conversa final aconteça com você já tendo escrito bastante sobre o tema.',
    },
    {
      q: 'até quando posso me inscrever?',
      a: 'as inscrições para esta travessia vão até 1º de outubro. depois dessa data, a turma fecha para preservar a intimidade dos encontros e a próxima oportunidade será na travessia seguinte, em três meses.',
    },
    {
      q: 'preciso ler o livro?',
      a: 'recomendamos, mas não é obrigatório. os encontros são conduzidos de forma que você acompanhe mesmo sem ter terminado a leitura. o livro aprofunda, não é pré-requisito.',
    },
    {
      q: 'sou obrigada a ler meus textos nos encontros?',
      a: 'não. a partilha é sempre voluntária e o silêncio também é forma de presença.',
    },
    {
      q: 'como funciona a garantia de 7 dias?',
      a: 'você tem sete dias a partir da compra para pedir reembolso integral, sem justificativa. basta escrever para soltaoverbocoletivo@gmail.com.',
    },
    {
      q: 'e quando a travessia terminar?',
      a: 'uma nova começa, com outro tema, livro e convidado. membros ativos têm prioridade de vaga e você decide se continua.',
    },
    {
      q: 'preciso ter experiência com escrita?',
      a: 'não. o solta o verbo não é sobre técnica acadêmica ou gramática rígida, mas sobre escuta interna, presença e liberdade narrativa.',
    },
  ];

  return (
    <div className="min-h-screen bg-bgPlataforma text-tintaCarvao selection:bg-acentoTerracota/20 selection:text-acentoAzul">
      {/* 1. Header Navbar Sticky */}
      <PreLoginNavbar />

      {/* 2. HERO SECTION */}
      <section className="relative pt-12 pb-16 sm:pt-16 sm:pb-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Coluna Esquerda: Hero Copy */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-papelClaro border border-papelKraft/60 text-acentoAzul text-xs sm:text-sm font-semibold lowercase tracking-wider shadow-sm">
                <Users className="w-4 h-4 text-acentoTerracota" />
                <span>{heroSec.badge_text || 'travessia de 3 meses · turma aberta · vagas limitadas'}</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-editorial text-acentoAzul lowercase leading-[1.1] tracking-tight">
                {heroSec.title || 'ciclo de aprofundamento'} <br />
                <span className="font-gesto text-acentoTerracota font-normal text-4xl sm:text-5xl lg:text-6xl block mt-1">
                  {heroSec.subtitle_gesto || 'para quem quer ir mais fundo'}
                </span>
              </h1>

              <p className="text-tintaCarvao/85 text-lg sm:text-xl leading-relaxed max-w-2xl font-medium lowercase">
                {heroSec.subtitle || 'três meses de escrita acompanhada para atravessar, em comunidade, um tema que você vem evitando sozinha.'}
              </p>

              <p className="text-tintaCarvao/80 text-base sm:text-lg leading-relaxed max-w-2xl font-medium lowercase pt-2 border-t border-papelKraft/40">
                {heroSec.body_intro || 'tem perguntas que não cabem num fim de semana de curso. elas pedem tempo, companhia e um lugar seguro para serem escritas. o ciclo de aprofundamento é esse lugar: a cada três meses escolhemos um tema de autodesenvolvimento, criatividade e relações humanas, um livro que sustenta a conversa e um convidado especial para atravessar com a gente. no meio do caminho, sua escrita deixa de ser exercício e vira decisão.'}
              </p>

              {/* Botão CTA Principal */}
              <div className="pt-4">
                <button
                  onClick={handleEnroll}
                  className="btn-pill-primary text-base sm:text-lg px-8 py-4 rounded-full shadow-md hover:shadow-lg hover:scale-105 transition-all flex items-center gap-3 cursor-pointer lowercase"
                >
                  <span>{heroSec.button_text || 'quero atravessar: R$597 no pix'}</span>
                  <ArrowRight className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>

            {/* Coluna Direita: Box de Oferta e Investimento */}
            <div className="lg:col-span-5 relative">
              <div className="rounded-3xl bg-acentoAzul text-white p-8 sm:p-10 shadow-kraft-lg relative overflow-hidden border border-white/20 space-y-6">
                <div className="space-y-2">
                  <span className="text-xs font-bold text-acentoOliva lowercase tracking-wider block">
                    {heroSec.box_badge || 'investimento na travessia completa (3 meses)'}
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl sm:text-5xl font-bold font-editorial text-papelClaro">
                      {heroSec.price_text || 'R$ 597,00'}
                    </span>
                    <span className="text-xs sm:text-sm text-papelClaro/80 lowercase font-medium">
                      {heroSec.price_subtext || 'no pix'}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-papelClaro/70 lowercase font-medium">
                    {heroSec.price_installments || 'ou 3x R$ 225,67 sem juros no cartão'}
                  </p>
                </div>

                <ul className="space-y-3 pt-4 border-t border-white/20 text-papelClaro/90 text-sm font-medium lowercase">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-acentoOliva flex-shrink-0 mt-0.5" />
                    <span>escrita coletiva toda terça, das 8h às 8h30</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-acentoOliva flex-shrink-0 mt-0.5" />
                    <span>3 encontros ao vivo de fechamento de mês</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-acentoOliva flex-shrink-0 mt-0.5" />
                    <span>21 dias de escrita 100% incluído</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-acentoOliva flex-shrink-0 mt-0.5" />
                    <span>garantia incondicional de 7 dias</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-acentoOliva flex-shrink-0 mt-0.5" />
                    <span>acesso integral à plataforma, aos materiais gravados e área de partilha</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-acentoOliva flex-shrink-0 mt-0.5" />
                    <span>acesso à comunidade no whatsapp</span>
                  </li>
                </ul>

                <button
                  onClick={handleEnroll}
                  className="w-full btn-pill-accent text-base py-3.5 rounded-full shadow-md hover:scale-105 transition-all flex items-center justify-center gap-2 cursor-pointer lowercase"
                >
                  <span>{heroSec.button_text || 'quero atravessar: R$597 no pix'}</span>
                  <ArrowRight className="w-4 h-4 text-tintaCarvao" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. UMA TRAVESSIA DE 3 MESES, NUM MOVIMENTO CONTÍNUO */}
      <section className="py-16 sm:py-24 bg-papelClaro border-t border-b border-papelKraft/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 text-center sm:text-left">
          <span className="text-xs font-bold text-acentoTerracota lowercase tracking-widest block">
            {comoFuncionaSec.badge_text || 'como funciona'}
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold font-editorial text-acentoAzul lowercase">
            {comoFuncionaSec.title || 'uma travessia de 3 meses, num movimento contínuo'}
          </h2>
          <p className="text-tintaCarvao/85 text-base sm:text-lg leading-relaxed font-medium lowercase">
            {comoFuncionaSec.p1 || 'o ciclo funciona em travessias. cada travessia dura três meses e gira em torno de um único tema, escolhido porque incomoda e porque move.'}
          </p>
          <p className="text-tintaCarvao/85 text-base sm:text-lg leading-relaxed font-medium lowercase">
            {comoFuncionaSec.p2 || 'para sustentar esse tema, três coisas acontecem juntas: um livro que serve de terreno comum; três encontros ao vivo, um por mês, conduzidos por bruna e júlia, com um convidado especial que traz outra camada ao assunto; um ritual semanal de escrita, o café com letras, toda terça-feira, para que a prática não dependa de motivação.'}
          </p>
          <p className="text-tintaCarvao/85 text-base sm:text-lg leading-relaxed font-medium lowercase">
            {comoFuncionaSec.p3 || 'quando a travessia termina, uma nova começa: com outro tema, outro livro, outro convidado (e a gente espera sempre ter você dando continuidade com a gente <3).'}
          </p>
        </div>
      </section>

      {/* 4. A PRÓXIMA TRAVESSIA: A CORAGEM DE NÃO AGRADAR */}
      <section className="py-20 sm:py-28 bg-bgPlataforma relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Header da próxima travessia */}
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-acentoOliva/20 text-tintaCarvao text-xs sm:text-sm font-bold lowercase border border-acentoOliva/40">
              <Calendar className="w-4 h-4 text-acentoAzul" />
              <span>{proximaTravessiaSec.badge_text || 'inscrições abertas até 1º de outubro'}</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-bold font-editorial text-acentoAzul lowercase">
              {proximaTravessiaSec.title || 'a próxima travessia: a coragem de não agradar'}
            </h2>
            <p className="text-acentoTerracota text-lg sm:text-xl font-gesto lowercase">
              {proximaTravessiaSec.subtitle_gesto || 'três meses para se libertar da opinião dos outros, atravessar suas próprias limitações e se tornar a pessoa que você deseja ser.'}
            </p>
            <div className="p-6 bg-papelClaro rounded-2xl border border-papelKraft/50 text-tintaCarvao/85 text-base sm:text-lg leading-relaxed font-medium lowercase space-y-3 shadow-xs">
              <span className="font-bold text-acentoAzul block">
                {proximaTravessiaSec.por_que_box_title || 'por que esse tema, agora:'}
              </span>
              <p>
                {proximaTravessiaSec.por_que_box_desc || 'o cargo que você aceitou. a conversa que você não teve. o "tudo bem" que saiu da sua boca quando nada estava bem. a gente aprende cedo que ser amada é ser conveniente (e passa anos escrevendo uma história que agrada a todos, menos a quem a escreve). nesta travessia, vamos usar a escrita para encontrar onde exatamente você entregou a caneta para outra pessoa. e para retomá-la. quantas decisões da sua vida foram tomadas para não decepicionar alguém? é essa pergunta que vamos escrever juntas.'}
              </p>
            </div>
          </div>

          {/* Os 4 blocos da travessia */}
          <div className="space-y-8">
            {/* Bloco 1: O livro */}
            <div className="bg-papelClaro rounded-3xl p-6 sm:p-8 border border-papelKraft/60 shadow-sm space-y-4">
              <div className="flex items-center gap-3">
                <BookOpen className="w-6 h-6 text-acentoAzul" />
                <h3 className="text-xl sm:text-2xl font-bold font-editorial text-acentoAzul lowercase">
                  {proximaTravessiaSec.bloco1_title || 'bloco 1: o livro que nos acompanha'}
                </h3>
              </div>
              <p className="text-tintaCarvao/90 text-base leading-relaxed font-medium lowercase">
                {proximaTravessiaSec.bloco1_desc1 || '"a coragem de não agradar", de ichiro kishimi e fumitake koga. um diálogo entre um filósofo e um jovem sobre como a filosofia pode libertar você da opinião dos outros, superar suas limitações e se tornar a pessoa que deseja ser. é um livro que provoca, discorda de você e devolve responsabilidade, exatamente o tipo de leitura que rende escrita.'}
              </p>
              <p className="text-tintaCarvao/80 text-sm sm:text-base leading-relaxed font-medium lowercase">
                {proximaTravessiaSec.bloco1_desc2 || 'ele não é lição de casa. é terreno comum: lemos no mesmo ritmo, sublinhamos o que dói e escrevemos a partir dali. cada encontro do mês parte de uma parte específica do livro. a leitura é recomendada, não obrigatória: os encontros são conduzidos para que você acompanhe mesmo sem ter terminado.'}
              </p>
            </div>

            {/* Bloco 2: Encontros de Aprofundamento */}
            <div className="bg-papelClaro rounded-3xl p-6 sm:p-8 border border-papelKraft/60 shadow-sm space-y-6">
              <div className="space-y-2">
                <h3 className="text-xl sm:text-2xl font-bold font-editorial text-acentoAzul lowercase">
                  {proximaTravessiaSec.bloco2_title || 'bloco 2: encontros de aprofundamento'}
                </h3>
                <p className="text-tintaCarvao/80 text-sm sm:text-base font-medium lowercase">
                  {proximaTravessiaSec.bloco2_desc || 'três encontros ao vivo no zoom, um por mês, sempre numa terça-feira, das 19h às 20h30. cada um fecha um mês de escrita e mergulha em uma das três coragens da travessia.'}
                </p>
              </div>

              <div className="space-y-4">
                {/* Encontro 1 */}
                <div className="p-5 bg-bgPlataforma rounded-2xl border border-papelKraft/50 space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-bold text-acentoAzul text-base lowercase">
                      {proximaTravessiaSec.enc1_date || '01 · terça, 27 de outubro · 19h às 20h30'}
                    </span>
                    <span className="text-xs bg-papelKraft/40 px-3 py-1 rounded-full text-tintaCarvao font-medium lowercase">
                      {proximaTravessiaSec.enc1_facilitators || 'facilitam: bruna riedel e júlia alvim'}
                    </span>
                  </div>
                  <h4 className="text-lg font-bold font-editorial text-acentoTerracota lowercase">
                    {proximaTravessiaSec.enc1_title || 'a coragem de largar a história que me define'}
                  </h4>
                  <p className="text-tintaCarvao/85 text-sm leading-relaxed font-medium lowercase">
                    {proximaTravessiaSec.enc1_desc || 'que história sobre mim eu já posso parar de repetir? todo mundo carrega uma versão de si mesma contada tantas vezes que virou identidade. aqui a gente escreve para descobrir onde essa história deixou de ser verdade e passou a ser apenas hábito.'}
                  </p>
                  <p className="text-xs text-tintaCarvao/60 font-medium lowercase">
                    {proximaTravessiaSec.enc1_book || 'no livro: negar o trauma e sair da comparação.'}
                  </p>
                </div>

                {/* Encontro 2 */}
                <div className="p-5 bg-bgPlataforma rounded-2xl border border-papelKraft/50 space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-bold text-acentoAzul text-base lowercase">
                      {proximaTravessiaSec.enc2_date || '02 · terça, 24 de novembro · 19h às 20h30'}
                    </span>
                    <span className="text-xs bg-papelKraft/40 px-3 py-1 rounded-full text-tintaCarvao font-medium lowercase">
                      {proximaTravessiaSec.enc2_facilitators || 'facilitam: bruna riedel e júlia alvim'}
                    </span>
                  </div>
                  <h4 className="text-lg font-bold font-editorial text-acentoTerracota lowercase">
                    {proximaTravessiaSec.enc2_title || 'a coragem de não agradar'}
                  </h4>
                  <p className="text-tintaCarvao/85 text-sm leading-relaxed font-medium lowercase">
                    {proximaTravessiaSec.enc2_desc || 'o que é minha responsabilidade e o que não é? o mês em que a travessia aperta. vamos separar, no papel, o que é seu do que você carregou por medo de decepicionar, e escrever as conversas que você nunca teve.'}
                  </p>
                  <p className="text-xs text-tintaCarvao/60 font-medium lowercase">
                    {proximaTravessiaSec.enc2_book || 'no livro: descartar as tarefas dos outros.'}
                  </p>
                </div>

                {/* Encontro 3 */}
                <div className="p-5 bg-acentoAzul/10 rounded-2xl border border-acentoAzul/30 space-y-2 relative overflow-hidden">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-bold text-acentoAzul text-base lowercase">
                      {proximaTravessiaSec.enc3_date || '03 · terça, 15 de dezembro · 19h às 20h30'}
                    </span>
                    <span className="text-xs bg-acentoTerracota text-white px-3 py-1 rounded-full font-bold lowercase">
                      {proximaTravessiaSec.enc3_guest || 'convidada especial: jout jout'}
                    </span>
                  </div>
                  <h4 className="text-lg font-bold font-editorial text-acentoAzul lowercase">
                    {proximaTravessiaSec.enc3_title || 'a coragem de pertencer e viver agora'}
                  </h4>
                  <p className="text-tintaCarvao/85 text-sm leading-relaxed font-medium lowercase">
                    {proximaTravessiaSec.enc3_desc || 'como posso pertencer sem me diminuir e viver este dia como uma dança? o encontro final recebe jout jout, que fez da própria voz um ofício público, e conhece o preço e a alegria disso. ela chega no fim porque é ponto de chegada, não ponto de partida.'}
                  </p>
                  <p className="text-xs text-tintaCarvao/60 font-medium lowercase">
                    {proximaTravessiaSec.enc3_book || 'no livro: pertencimento, contribuição e o aqui e agora.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Bloco 3 & 4 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-papelClaro rounded-3xl p-6 border border-papelKraft/60 shadow-sm space-y-3">
                <h3 className="text-lg font-bold font-editorial text-acentoAzul lowercase">
                  {proximaTravessiaSec.bloco3_title || 'bloco 3: encontros semanais no café com letras'}
                </h3>
                <p className="text-tintaCarvao/85 text-sm leading-relaxed font-medium lowercase">
                  {proximaTravessiaSec.bloco3_desc || 'nosso ritual toda terça-feira, das 8h às 8h30. meia hora de escrita coletiva para começar o dia pela sua própria voz, antes de o mundo começar a pedir coisas de você. você vem às que puder: nada é obrigatório, nenhuma é igual à outra.'}
                </p>
              </div>

              <div className="bg-papelClaro rounded-3xl p-6 border border-papelKraft/60 shadow-sm space-y-3">
                <h3 className="text-lg font-bold font-editorial text-acentoAzul lowercase">
                  {proximaTravessiaSec.bloco4_title || 'bloco 4: troca contínua no grupo de whatsapp'}
                </h3>
                <p className="text-tintaCarvao/85 text-sm leading-relaxed font-medium lowercase">
                  {proximaTravessiaSec.bloco4_desc || 'todos os dias, no seu ritmo. entre uma terça e outra, a conversa não para. são dois espaços: "junto e misturado", a comunidade ampla, e "cá entre nós", o grupo exclusivo de quem está na travessia, mais reservado, para uma troca mais próxima.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. OS 7 PILARES DO CICLO */}
      <section className="py-20 sm:py-28 bg-papelClaro border-t border-b border-papelKraft/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <h2 className="text-3xl sm:text-5xl font-bold font-editorial text-acentoAzul lowercase">
              {pilaresSec.title || 'o que faz do ciclo uma jornada transformadora'}
            </h2>
            <p className="text-tintaCarvao/80 text-base sm:text-lg font-medium lowercase">
              {pilaresSec.subtitle || 'sete apoios desenhados para dar profundidade, constância e companhia ao seu processo de escrita.'}
            </p>
          </div>

          {/* Grid Principal: 2 primeiros blocos em destaque maior */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Bloco 1 Destaque: Café com Letras */}
            <div className="bg-papelClaro rounded-3xl p-6 sm:p-7 border border-acentoAzul/30 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-acentoAzul hover:shadow-md flex flex-col justify-between group relative overflow-hidden">
              <div className="space-y-3">
                <span className="text-xs font-bold text-acentoTerracota tracking-wider block lowercase">
                  {pilaresSec.p1_badge || defaultPillars[0].badge}
                </span>
                <h3 className="text-2xl sm:text-3xl font-bold font-editorial text-acentoAzul lowercase group-hover:text-acentoTerracota transition-colors">
                  {pilaresSec.p1_title || defaultPillars[0].title}
                </h3>
                <p className="text-tintaCarvao/85 text-sm sm:text-base leading-relaxed font-medium lowercase">
                  {pilaresSec.p1_desc || defaultPillars[0].desc}
                </p>
              </div>
            </div>

            {/* Bloco 2 Destaque: Encontros ao Vivo */}
            <div className="bg-papelClaro rounded-3xl p-6 sm:p-7 border border-acentoAzul/30 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-acentoAzul hover:shadow-md flex flex-col justify-between group relative overflow-hidden">
              <div className="space-y-3">
                <span className="text-xs font-bold text-acentoTerracota tracking-wider block lowercase">
                  {pilaresSec.p2_badge || defaultPillars[1].badge}
                </span>
                <h3 className="text-2xl sm:text-3xl font-bold font-editorial text-acentoAzul lowercase group-hover:text-acentoTerracota transition-colors">
                  {pilaresSec.p2_title || defaultPillars[1].title}
                </h3>
                <p className="text-tintaCarvao/85 text-sm sm:text-base leading-relaxed font-medium lowercase">
                  {pilaresSec.p2_desc || defaultPillars[1].desc}
                </p>
              </div>
            </div>
          </div>

          {/* Grade Secundária: 5 pilares compactos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {defaultPillars.slice(2).map((item, idx) => {
              const num = idx + 3;
              const badge = pilaresSec[`p${num}_badge`] || item.badge;
              const title = pilaresSec[`p${num}_title`] || item.title;
              const desc = pilaresSec[`p${num}_desc`] || item.desc;

              return (
                <div
                  key={num}
                  className="bg-papelClaro rounded-2xl p-5 border border-papelKraft/50 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-acentoAzul/60 hover:shadow-md flex flex-col justify-between group"
                >
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-acentoAzul/60 lowercase tracking-wide block">
                      {badge}
                    </span>
                    <h3 className="text-lg font-bold font-editorial text-acentoAzul lowercase group-hover:text-acentoTerracota transition-colors">
                      {title}
                    </h3>
                    <p className="text-tintaCarvao/80 text-sm leading-relaxed font-medium lowercase">
                      {desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. PARA QUEM É X PARA QUEM NÃO É */}
      <section className="py-20 sm:py-28 bg-bgPlataforma border-t border-b border-papelKraft/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-editorial text-acentoAzul lowercase mb-4">
              {paraQuemESec.title || 'o ciclo de aprofundamento é para você?'}
            </h2>
            <p className="text-tintaCarvao/80 text-base sm:text-lg font-medium lowercase">
              {paraQuemESec.subtitle || 'transparência sobre o compromisso com a escrita e a comunidade.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* SIM / PARA QUEM É */}
            <div className="bg-papelClaro rounded-3xl p-6 sm:p-8 border border-acentoOliva/30 shadow-kraft transition-all duration-300 hover:border-acentoOliva/60 space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-acentoOliva/20 text-tintaCarvao text-xs font-bold lowercase tracking-wider">
                <CheckCircle2 className="w-4 h-4 text-acentoOliva" />
                <span>{paraQuemESec.sim_badge || 'o ciclo é para você se:'}</span>
              </div>

              <ul className="space-y-3.5">
                {[
                  paraQuemESec.sim_1 || 'você já escreve, ou já fez os 21 dias, e sente que precisa de constância, não de mais um curso',
                  paraQuemESec.sim_2 || 'está num momento de transição e não quer atravessar sozinha',
                  paraQuemESec.sim_3 || 'quer encarar temas desconfortáveis com apoio e método',
                  paraQuemESec.sim_4 || 'quer pertencer de verdade, não só consumir conteúdo',
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-white/60 border border-papelKraft/30 transition-all hover:bg-white hover:border-acentoOliva/40 hover:shadow-xs">
                    <CheckCircle2 className="w-5 h-5 text-acentoOliva flex-shrink-0 mt-0.5" />
                    <span className="text-tintaCarvao/90 text-sm sm:text-base leading-relaxed font-medium lowercase">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* NÃO / PARA QUEM NÃO É */}
            <div className="bg-papelClaro rounded-3xl p-6 sm:p-8 border border-acentoTerracota/20 shadow-kraft transition-all duration-300 hover:border-acentoTerracota/50 space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-acentoTerracota/10 text-acentoTerracota text-xs font-bold lowercase tracking-wider">
                <XCircle className="w-4 h-4 text-acentoTerracota" />
                <span>{paraQuemESec.nao_badge || 'o ciclo não é para você se:'}</span>
              </div>

              <ul className="space-y-3.5">
                {[
                  paraQuemESec.nao_1 || 'busca técnica literária, gramática ou preparação para publicar um livro',
                  paraQuemESec.nao_2 || 'quer conteúdo gravado sem aparecer nem escutar ninguém',
                  paraQuemESec.nao_3 || 'procura consumo rápido, sem interesse em constância',
                  paraQuemESec.nao_4 || 'espera que a escrita resolva sem que você escreva',
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-white/40 border border-papelKraft/30 transition-all hover:bg-white hover:border-acentoTerracota/30 hover:shadow-xs">
                    <XCircle className="w-5 h-5 text-acentoTerracota/80 flex-shrink-0 mt-0.5" />
                    <span className="text-tintaCarvao/85 text-sm sm:text-base leading-relaxed font-medium lowercase">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 7. FACILITADORAS DO PROGRAMA */}
      <FoundersSection />

      {/* 8. CARROSSEL DE SCREENSHOTS REAIS & PARTILHAS (DEPLOYMENTS) */}
      <section className="py-20 sm:py-28 bg-papelClaro border-t border-b border-papelKraft/40 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-bgPlataforma border border-papelKraft/40 text-acentoAzul text-xs sm:text-sm font-semibold lowercase tracking-wider mb-4 shadow-sm">
              <Quote className="w-4 h-4 text-acentoTerracota" />
              <span>{depoimentosSec.badge_text || 'partilhas reais'}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-editorial text-acentoAzul lowercase mb-4">
              {depoimentosSec.title || 'partilhas reais'}
            </h2>
            <p className="text-tintaCarvao/80 text-base sm:text-lg font-medium lowercase">
              {depoimentosSec.subtitle || 'relatos e trocas espontâneas vividas na nossa comunidade.'}
            </p>
          </div>

          {/* Componente de Carrossel de Screenshots e Depoimentos */}
          <div
            className="relative max-w-5xl mx-auto"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {/* Botões de Navegação Lateral */}
            <button
              onClick={prevSlide}
              aria-label="depoimento anterior"
              className="absolute -left-4 sm:-left-6 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-papelClaro/90 backdrop-blur-sm border border-papelKraft/60 shadow-lg text-acentoAzul hover:bg-acentoAzul hover:text-white transition-all flex items-center justify-center cursor-pointer"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              onClick={nextSlide}
              aria-label="próximo depoimento"
              className="absolute -right-4 sm:-right-6 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-papelClaro/90 backdrop-blur-sm border border-papelKraft/60 shadow-lg text-acentoAzul hover:bg-acentoAzul hover:text-white transition-all flex items-center justify-center cursor-pointer"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Grid de 3 Cards Visíveis em Desktop */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              {[0, 1, 2].map((offset) => {
                const itemIndex = (carouselIndex + offset) % (activeDeploymentItems.length || 1);
                const item = activeDeploymentItems[itemIndex] || {
                  id: 'd1',
                  title: 'partilha e acolhimento',
                  src: '/brand-assets/deployments/IMG_2847.PNG',
                  tag: '21 dias de escrita',
                };
                const washiTapeImage =
                  offset % 2 === 0
                    ? '/brand-assets/elements/stickers/fitas-washi-flores-terracota.png'
                    : '/brand-assets/elements/stickers/fitas-washi-flores-azul.png';

                const hasImage = Boolean(item.src);

                return (
                  <div
                    key={`${item.id}-${offset}`}
                    onClick={() => {
                      if (hasImage) {
                        setSelectedScreenshot(item.src!);
                      } else if (item.quote) {
                        setSelectedQuoteModal({ quote: item.quote, author: item.author, role: item.role });
                      }
                    }}
                    className="relative bg-bgPlataforma rounded-3xl p-4 sm:p-5 border border-papelKraft/40 shadow-kraft transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl cursor-pointer group select-none flex flex-col justify-between"
                  >
                    {/* Sticker Fita Washi */}
                    <div className="absolute -top-3.5 left-6 w-28 h-7 pointer-events-none z-20 opacity-90">
                      <img
                        src={washiTapeImage}
                        alt="fita washi"
                        className="w-full h-full object-contain"
                      />
                    </div>

                    {hasImage ? (
                      /* Frame com Foto 100% Visível em object-contain */
                      <div className="w-full h-[400px] sm:h-[440px] rounded-2xl overflow-hidden border border-papelKraft/30 relative bg-papelClaro p-2 flex items-center justify-center shadow-inner group/img mb-3">
                        <img
                          src={item.src}
                          alt={item.title}
                          className="w-full h-full object-contain object-top transition-transform duration-500 group-hover/img:scale-105"
                        />
                        
                        {/* Hint Overlay para Ampliar */}
                        <div className="absolute inset-0 bg-acentoAzul/20 opacity-0 group-hover/img:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-xs">
                          <div className="bg-papelClaro/95 text-acentoAzul font-bold px-4 py-2.5 rounded-full text-xs flex items-center gap-2 shadow-xl border border-papelKraft/50 lowercase">
                            <ZoomIn className="w-4 h-4 text-acentoTerracota" />
                            <span>ampliar depoimento em tela cheia</span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* Frame para Depoimento em Texto */
                      <div className="w-full h-[400px] sm:h-[440px] rounded-2xl border border-papelKraft/30 relative bg-papelClaro p-6 flex flex-col justify-between shadow-inner group/quote mb-3 overflow-hidden">
                        <div className="space-y-3">
                          <span className="text-4xl font-editorial text-acentoTerracota/50 block font-bold leading-none">“</span>
                          <p className="text-tintaCarvao/90 text-sm sm:text-base leading-relaxed font-medium lowercase line-clamp-8 font-editorial italic">
                            &ldquo;{item.quote}&rdquo;
                          </p>
                        </div>
                        <div className="pt-3 border-t border-papelKraft/30">
                          <p className="font-editorial text-sm font-bold text-acentoAzul lowercase">
                            {item.author}
                          </p>
                          <p className="text-xs text-tintaCarvao/60 font-medium lowercase">
                            {item.role}
                          </p>
                        </div>
                        {/* Hint Overlay */}
                        <div className="absolute inset-0 bg-acentoAzul/20 opacity-0 group-hover/quote:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-xs">
                          <div className="bg-papelClaro/95 text-acentoAzul font-bold px-4 py-2.5 rounded-full text-xs flex items-center gap-2 shadow-xl border border-papelKraft/50 lowercase">
                            <ZoomIn className="w-4 h-4 text-acentoTerracota" />
                            <span>ler depoimento completo</span>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="px-2 text-center pt-1 border-t border-papelKraft/30 flex items-center justify-between">
                      <span className="font-editorial text-sm font-bold text-acentoAzul lowercase truncate max-w-[70%]">
                        {item.title}
                      </span>
                      <span className="text-[11px] font-bold text-acentoTerracota bg-acentoTerracota/10 px-2.5 py-0.5 rounded-full lowercase flex-shrink-0">
                        {item.tag}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pílulas Indicadoras de Slide */}
            <div className="flex justify-center items-center gap-2 mt-8">
              {activeDeploymentItems.slice(0, 8).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCarouselIndex(idx)}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    carouselIndex === idx
                      ? 'w-8 bg-acentoTerracota'
                      : 'w-2.5 bg-papelKraft/50 hover:bg-acentoAzul/50'
                  }`}
                  aria-label={`ir para slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 8.5. QUEBRA DE OBJEÇÕES (Respostas para o que te faz hesitar) */}
      <section className="py-20 sm:py-28 bg-papelClaro border-t border-b border-papelKraft/40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-bgPlataforma border border-papelKraft/40 text-acentoAzul text-xs sm:text-sm font-semibold lowercase tracking-wider shadow-sm">
              <Quote className="w-4 h-4 text-acentoTerracota" />
              <span>{objecoesSec.badge_text || 'quebra de objeções'}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-editorial text-acentoAzul lowercase">
              {objecoesSec.title || 'respostas para o que te faz hesitar'}
            </h2>
            <p className="text-tintaCarvao/80 text-base sm:text-lg font-medium lowercase">
              {objecoesSec.subtitle || 'tudo o que você precisa saber para tomar sua decisão com clareza e tranquilidade.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {defaultObjections.map((item, idx) => {
              const num = idx + 1;
              const q = objecoesSec[`o${num}_q`] || item.q;
              const a = objecoesSec[`o${num}_a`] || item.a;

              return (
                <div
                  key={idx}
                  className="bg-bgPlataforma rounded-3xl p-6 sm:p-7 border border-papelKraft/40 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-acentoAzul/60 hover:shadow-md flex flex-col justify-between group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-acentoTerracota uppercase tracking-wider">
                        0{num} · dúvida comum
                      </span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold font-editorial text-acentoAzul lowercase group-hover:text-acentoTerracota transition-colors">
                      &ldquo;{q}&rdquo;
                    </h3>
                    <p className="text-tintaCarvao/85 text-sm sm:text-base leading-relaxed font-medium lowercase">
                      {a}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 9. BOX FINAL DE OFERTA & CHECKOUT DO CICLO */}
      <section className="py-24 sm:py-32 bg-bgPlataforma relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-acentoAzul text-white rounded-3xl p-8 sm:p-14 border border-white/20 shadow-kraft-lg text-center space-y-8 relative overflow-hidden">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-acentoOliva text-xs sm:text-sm font-semibold lowercase tracking-wider">
              <span>{finalOfferSec.badge_text || 'vagas abertas para o novo ciclo'}</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-editorial text-papelClaro lowercase">
              {finalOfferSec.title || 'pronta para aprofundar sua escrita em comunidade?'}
            </h2>

            <p className="text-papelClaro/85 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed font-medium lowercase">
              {finalOfferSec.subtitle || 'garanta sua vaga no ciclo de aprofundamento e tenha acesso aos encontros ao vivo, grupos de troca e acervo completo de gravações.'}
            </p>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 max-w-lg mx-auto space-y-4">
              <span className="text-xs font-bold text-papelClaro/70 lowercase tracking-wider block">
                {finalOfferSec.box_badge || 'investimento no ciclo completo (3 meses)'}
              </span>

              <div className="flex justify-center items-baseline gap-2">
                <span className="text-4xl sm:text-5xl font-bold font-editorial text-white">
                  {finalOfferSec.price_text || 'R$ 597,00'}
                </span>
                <span className="text-sm text-papelClaro/80 lowercase">
                  {finalOfferSec.price_subtext || 'no PIX (ou 3x R$ 225,67 sem juros)'}
                </span>
              </div>

              <div className="flex items-center justify-center gap-2 text-xs font-bold text-acentoOliva pt-2 border-t border-white/15">
                <ShieldCheck className="w-4 h-4 text-acentoOliva" />
                <span>garantia incondicional de 7 dias sem riscos</span>
              </div>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={handleEnroll}
                className="btn-pill-accent text-lg px-10 py-4 rounded-full shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-3 w-full sm:w-auto lowercase cursor-pointer"
              >
                <span>{finalOfferSec.button_text || 'sim! quero garantir minha vaga por R$ 597 no PIX'}</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 10. FAQ DO CICLO */}
      <section className="py-20 sm:py-28 bg-papelClaro border-t border-b border-papelKraft/40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold font-editorial text-acentoAzul lowercase mb-3">
              {faqSec.title || 'perguntas frequentes sobre o ciclo'}
            </h2>
          </div>

          <div className="space-y-4">
            {defaultFaqList.map((item, index) => {
              const num = index + 1;
              const q = faqSec[`q${num}`] || item.q;
              const a = faqSec[`a${num}`] || item.a;
              const isOpen = openFaqIndex === index;

              return (
                <div
                  key={index}
                  className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                    isOpen
                      ? 'bg-papelClaro border-acentoTerracota/50 shadow-kraft-lg'
                      : 'bg-bgPlataforma/70 border-papelKraft/40 hover:border-acentoAzul/40'
                  }`}
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                    className="w-full p-5 sm:p-6 text-left flex justify-between items-center gap-4 cursor-pointer focus:outline-none select-none"
                  >
                    <span className="font-bold text-lg sm:text-xl font-editorial text-acentoAzul lowercase">
                      {q}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-acentoAzul transition-transform duration-300 ${
                        isOpen ? 'rotate-180 text-acentoTerracota' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-5 sm:px-6 pb-6 pt-2 border-t border-papelKraft/30 text-tintaCarvao/85 text-base leading-relaxed font-medium lowercase">
                      {a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Modal de Zoom de Screenshot de Depoimento */}
      {selectedScreenshot && (
        <div
          onClick={() => setSelectedScreenshot(null)}
          className="fixed inset-0 z-50 bg-tintaCarvao/80 backdrop-blur-md flex items-center justify-center p-4 cursor-zoom-out animate-fadeIn"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl w-full max-h-[90vh] bg-papelClaro rounded-3xl p-3 sm:p-4 shadow-2xl border border-papelKraft/60 overflow-hidden flex flex-col items-center justify-center"
          >
            <button
              onClick={() => setSelectedScreenshot(null)}
              className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-acentoAzul text-white flex items-center justify-center hover:bg-acentoTerracota transition-colors cursor-pointer shadow-md"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="w-full h-full max-h-[82vh] overflow-y-auto rounded-2xl flex items-center justify-center p-1 bg-white">
              <img
                src={selectedScreenshot}
                alt="depoimento em tela cheia"
                className="max-w-full max-h-full object-contain rounded-xl"
              />
            </div>
          </div>
        </div>
      )}

      {/* Modal de Leitura de Depoimento em Texto */}
      {selectedQuoteModal && (
        <div
          onClick={() => setSelectedQuoteModal(null)}
          className="fixed inset-0 z-50 bg-tintaCarvao/80 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer animate-fadeIn"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-2xl w-full bg-papelClaro rounded-3xl p-8 sm:p-10 shadow-2xl border border-papelKraft/60 space-y-6 cursor-default"
          >
            <button
              onClick={() => setSelectedQuoteModal(null)}
              className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-acentoAzul text-white flex items-center justify-center hover:bg-acentoTerracota transition-colors cursor-pointer shadow-md"
            >
              <X className="w-5 h-5" />
            </button>
            <span className="text-5xl font-editorial text-acentoTerracota block font-bold leading-none">“</span>
            <p className="text-tintaCarvao/95 text-lg sm:text-xl leading-relaxed font-editorial italic lowercase">
              &ldquo;{selectedQuoteModal.quote}&rdquo;
            </p>
            <div className="pt-4 border-t border-papelKraft/40">
              <p className="font-editorial text-base font-bold text-acentoAzul lowercase">
                {selectedQuoteModal.author}
              </p>
              {selectedQuoteModal.role && (
                <p className="text-sm text-tintaCarvao/60 font-medium lowercase">
                  {selectedQuoteModal.role}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal de Pagamento Interativo */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        product="ciclo"
      />

      {/* 11. PreLoginFooter Poético com Shader WebGL */}
      <PreLoginFooter />
    </div>
  );
}
