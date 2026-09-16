import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface SectionContent {
  title?: string;
  subtitle?: string;
  body_text?: string;
  quote_text?: string;
  image_url?: string;
  button_text?: string;
  button_link?: string;
  [key: string]: any;
}

export interface PageContentSchema {
  [sectionKey: string]: SectionContent;
}

export interface SiteCMSData {
  [pageSlug: string]: PageContentSchema;
}

export const DEFAULT_CMS_DATA: SiteCMSData = {
  landing: {
    hero: {
      title: "a narrativa muda a partir do ponto que você a observa.",
      subtitle: "reescreva sua história ao ampliar a perspectiva e abrir espaço para uma escrita (e vida) mais consciente. dê contorno ao que te habita, ao que pede passagem e ao que ainda não encontrou palavras.",
      body_text: "escrever é mais do que juntar palavras: é um jeito de ouvir o que vive dentro, organizar o caos e dar forma ao que ainda é sussurro.",
      button_text: "conhecer os programas",
      button_link: "#produtos",
      image_url: "/brand-assets/gallery/events/13062026-IMG_6581-2.jpg"
    },
    fundamentos: {
      title: "os fundamentos do nosso movimento",
      subtitle: "entre prática, presença e partilha, criamos espaço para aprender, se reconhecer e seguir com mais autoria."
    },
    manifesto: {
      title: "por que soltar o verbo?",
      subtitle: "a escrita consciente como ferramenta de transformação e presença",
      body_text: "acreditamos que a palavra dita e escrita tem o poder de libertar o que estava preso. em um mundo acelerado, soltar o verbo é um ato de coragem e desaceleração.",
      image_url: "/brand-assets/gallery/events/13062026-IMG_5364-2.jpg"
    },
    experiencias: {
      title: "nossas experiências & programas",
      subtitle: "encontros virtuais e presenciais criados para soltar a sua palavra",
      body_text: "escolha o formato que melhor se adapta ao seu momento presente: os 21 dias de escrita, o ciclo de aprofundamento ou os encontros do café com letras.",
      button_text: "ver todos os programas →",
      button_link: "/programs",
      image_url: "/brand-assets/gallery/events/13062026-IMG_6666-2.jpg"
    },
    teoria_pratica: {
      title: "teoria + prática / o que sustenta a nossa escrita",
      highlight: "nosso trabalho nasce de estudo e de vivência.",
      body_text: "não improvisamos. cada encontro que desenhamos parte de referências consistentes, como as pesquisas de james pennebaker sobre escrita expressiva e seus efeitos no bem-estar emocional, e a curva do esquecimento de ebbinghaus, que mostra por que a escrita precisa ser prática recorrente e não um encontro isolado.",
      highlight_final: "é por isso que não entregamos só uma oficina bonita: desenhamos jornadas que continuam depois que a gente vai embora.",
      button_text: "enviar e-mail",
      button_link: "mailto:soltaoverbocoletivo@gmail.com"
    },
    comunidade: {
      title: "nossa fogueira",
      subtitle: "uma comunidade acolhedora para partilhar processos e escritos",
      body_text: "a fogueira é nosso espaço coletivo onde alunas partilham textos, recebem escuta atenta e trocam impressões poéticas sem julgamento.",
      button_text: "entrar na fogueira →",
      button_link: "/login",
      image_url: "/brand-assets/gallery/events/_MG_0015.jpg"
    }
  },
  about: {
    hero: {
      title: "uma comunidade viva",
      subtitle: "auto desenvolvimento em coletivo",
      body_text: "existimos para que ninguém precise atravessar as próprias perguntas sozinha. somos uma comunidade viva que usa a escrita para reconhecer as narrativas herdadas, questioná-las e reescrevê-las com mais verdade, consciência e liberdade. sua história deve ser vivida e contada a partir da sua perspectiva, e ninguém mais. quem escreve, dirige e vive a sua vida?",
      quote_text: "reescreva sua história ao ampliar a perspectiva e abrir espaço para uma escrita (e uma vida) mais consciente.",
      image_url: "/whatsapp_image_2025-12-11_at_3.24.18_pm.jpeg",
      button_text: "ver nossos encontros",
      button_link: "#encontros",
      card_quote: "escrever é encarar com verdade e presença as partes de nós que ainda não tinham nome."
    },
    manifesto_full: {
      title: "o que acreditamos",
      body_1: "acreditamos que somos capazes de transformar a nossa vida quando reconhecemos as narrativas que nos atravessam.",
      body_2: "muitas vezes repetimos histórias que nos foram introjetadas sem perceber que também temos o poder de escolher outras palavras, outros sentidos e outros capítulos para, assim, criar novos começos e melhores finais.",
      body_3: "usamos a escrita como a ferramenta acessível e profundamente transformadora que ela é. por meio dela, trilhamos um caminho de dar contorno ao que nos habita: tornar visíveis as histórias que carregamos para então questioná-las e reescrevê-las com mais verdade, consciência e liberdade.",
      body_4: "solta o verbo é um convite para despertar a própria voz ao escutá-la através da escrita.",
      footer_highlight: "acreditamos na escrita como caminho de aprendizagem, verdade e transformação em coletivo. nossos pilares nascem da escuta de si, da troca com o outro e da coragem de escrever uma vida mais verdadeira."
    },
    origem: {
      title: "história & fundação",
      subtitle: "como nasceu o solta o verbo",
      body_text: "nascemos do desejo de criar um refúgio acolhedor contra o isolamento e a pressa da vida moderna. bruna riedel e júlia alvim uniram suas experiências para gestar uma metodologia viva de escrita afetiva.",
      image_url: "/brand-assets/gallery/events/_MG_9849.jpg"
    },
    pilares: {
      title: "pilares & ritual autoral",
      subtitle: "encontros reais, vínculos, expressão, potência criativa e aprender fazendo",
      body_text: "nossos cinco pilares sustentam cada roda, oficina e partilha: proporcionar encontros sem máscaras, criar redes de apoio, dar vazão ao sentir, libertar a potência criativa e aprender fazendo.",
      button_text: "conhecer as facilitadoras →",
      button_link: "#criadoras",
      image_url: "/brand-assets/gallery/events/_MG_9991.jpg"
    }
  },
  programs: {
    hero: {
      title: "a arte de viver melhor",
      subtitle: "uma comunidade viva de autodesenvolvimento, onde a expressão é caminho para transformar realidades.",
      body_text: "a escrita é nosso eixo central — mas o encontro, a escuta e a criação coletiva sustentam toda a jornada.",
      image_url: "/brand-assets/gallery/events/13062026-IMG_6581-2.jpg"
    },
    chamada: {
      title: "bora escrever tua história!",
      subtitle: "se você sente que tem algo dentro querendo ganhar forma, chega mais.",
      body_text: "conheça nossas três jornadas autorais: os 21 dias de escrita sem cobrança, o ciclo de aprofundamento e o café com letras.",
      button_text: "escolha seu caminho →",
      button_link: "#programs-section",
      image_url: "/brand-assets/gallery/events/13062026-IMG_5364-2.jpg"
    }
  },
  programa_21_dias: {
    hero: {
      title: "escrever até virar hábito",
      subtitle: "uma jornada guiada para desbloquear sua expressão, criar hábitos de escrita leve e reencontrar a sua voz autêntica sem autocrítica.",
      body_text: "21 propostas diárias em texto e áudio para você escrever no seu ritmo e transformar sua relação com a palavra.",
      button_text: "inscrever-se nos 21 dias (r$ 77) →",
      button_link: "#checkout",
      image_url: "/brand-assets/gallery/events/13062026-IMG_6666-2.jpg"
    },
    detalhes: {
      title: "metodologia & prosa dos 21 dias",
      subtitle: "pequenos rituais diários de escrita e presença",
      body_text: "durante 21 dias, você receberá provocações poéticas diárias pensadas para desacelerar a mente, desbloquear a criatividade e nutrir seu repertório autoral.",
      button_text: "garantir minha vaga →",
      button_link: "#checkout",
      image_url: "/brand-assets/gallery/events/_MG_0015.jpg"
    }
  },
  programa_cafe_com_letras: {
    hero: {
      title: "roda semanal de escrita coletiva · 30 minutos · online",
      subtitle: "ritual de escrita semanal",
      body_text: "uma roda de escrita de trinta minutos, toda terça de manhã, para começar o dia pela sua própria voz. café quentinho, caderno aberto e um grupo de pessoas escrevendo junto. sem correção, sem cobrança, sem precisar ler em voz alta. chegue como estiver, e saia mais consciente disso.",
      button_text: "sim, quero minha xícara por R$97/mês",
      button_link: "#inscricao",
      image_url: "/brand-assets/gallery/events/_MG_9849.jpg"
    },
    detalhes: {
      title: "a inspiração tem hora marcada",
      subtitle: "toda terça-feira das 8h às 8h30 no zoom",
      quote_text: "“escrevo quando estou inspirado. e faço questão de estar inspirado às nove horas de cada manhã.” (peter de vries). a nossa hora é às oito.",
      body_text: "inspiração não é sorte, é encontro marcado. toda terça, às 8h, tem gente sentando junto. você não precisa decidir se hoje é o dia, não precisa achar assunto, não precisa estar inspirada antes de começar: a hora já está marcada e o tema, pronto.",
      button_text: "participar da próxima edição →",
      button_link: "#inscricao",
      image_url: "/brand-assets/gallery/events/_MG_9991.jpg"
    }
  },
  programa_ciclo: {
    hero: {
      title: "travessia de 3 meses · turma aberta · vagas limitadas",
      subtitle: "para quem quer ir mais fundo",
      body_text: "três meses de escrita acompanhada para atravessar, em comunidade, um tema que você vem evitando sozinha.",
      intro_paragraph: "tem perguntas que não cabem num fim de semana de curso. elas pedem tempo, companhia e um lugar seguro para serem escritas. o ciclo de aprofundamento é esse lugar: a cada três meses escolhemos um tema de autodesenvolvimento, criatividade e relações humanas, um livro que sustenta a conversa e um convidado especial para atravessar com a gente. no meio do caminho, sua escrita deixa de ser exercício e vira decisão.",
      button_text: "quero atravessar: R$597 no pix",
      button_link: "#planos",
      image_url: "/brand-assets/gallery/events/13062026-IMG_6581-2.jpg"
    },
    detalhes: {
      title: "uma travessia de 3 meses, num movimento contínuo",
      subtitle: "o ciclo funciona em travessias de três meses girando em torno de um único tema",
      body_text: "para sustentar esse tema, três coisas acontecem juntas: um livro que serve de terreno comum; três encontros ao vivo, um por mês, conduzidos por bruna e júlia, com um convidado especial que traz outra camada ao assunto; um ritual semanal de escrita, o café com letras, toda terça-feira, para que a prática não dependa de motivação.",
      button_text: "garantir minha vaga no ciclo →",
      button_link: "#planos",
      image_url: "/brand-assets/gallery/events/13062026-IMG_5364-2.jpg"
    }
  },
  contrate_experiencia: {
    hero: {
      title: "contrate uma experiência: momentos que reconectam um grupo com a própria palavra.",
      subtitle: "experiências sob medida & oficinas b2b",
      body_text: "levamos rituais de escrita consciente, integração humana e expressão autêntica para dentro da sua empresa, do seu evento ou do seu festival.",
      button_text: "falar com a equipe no whatsapp →",
      button_link: "https://wa.me/5531999999999",
      image_url: "/brand-assets/gallery/events/13062026-IMG_6666-2.jpg"
    },
    proposta: {
      title: "experiência de escrita em eventos",
      subtitle: "saúde mental, escuta ativa e coesão através da palavra",
      body_text: "nossos rituais de escrita promovem conexão genuína, redução de estresse e fortalecimento da autoria individual em ambientes corporativos e eventos especiais.",
      button_text: "solicitar proposta personalizada →",
      button_link: "https://wa.me/5531999999999",
      image_url: "/brand-assets/gallery/events/_MG_0015.jpg"
    }
  },
  contacts: {
    info: {
      title: "canais de contato & redes sociais",
      subtitle: "informações globais de contato e links do coletivo",
      whatsapp: "https://wa.link/w67ibp",
      whatsapp_number: "+55 (31) 99999-9999",
      instagram: "https://www.instagram.com/soltaoverbo.coletivo/",
      instagram_handle: "@soltaoverbo.coletivo",
      email: "soltaoverbocoletivo@gmail.com",
      footer_phrase: "autodesenvolvimento em coletivo através da escrita autoral e encontros virtuais."
    }
  },
  tour_modal: {
    header: {
      badge: "modo observador • tour virtual",
      title: "conheça a área de membros por dentro",
      icon: "sparkles",
      button_text: "fazer parte da comunidade",
      button_link: "/register",
      footer_notice: "acesso imediato após a inscrição"
    },
    tab_acervo: {
      label: "acervo de prompts",
      badge: "+120 exercícios",
      title: "biblioteca viva de escrita diária",
      description: "centenas de provocações poéticas, rituais de escrita e temas estruturados para destravar a sua caneta todos os dias.",
      image_url: "/brand-assets/deployments/IMG_8846.PNG",
      items: "prompts de autorreflexão e desaceleração\nexercícios de memória e infância\nlaboratório de escrita intuitiva",
      icon: "book-open"
    },
    tab_encontros: {
      label: "rodas ao vivo",
      badge: "ao vivo semanal",
      title: "café com letras & mentoria ao vivo",
      description: "encontros toda terça-feira das 8h às 8h30 para escrever em coletivo e partilhar a caminhada com facilitação de bruna & júlia.",
      image_url: "/brand-assets/deployments/IMG_2864.jpg",
      items: "terças-feiras 8h-8h30 via zoom\nfogueira voluntária de leitura\ngravações 100% disponíveis no acervo",
      icon: "coffee"
    },
    tab_comunidade: {
      label: "mural da comunidade",
      badge: "rede de apoio",
      title: "espaço seguro de escuta & afeto",
      description: "dois grupos dedicados (\"junto e misturado\" + \"cá entre nós\") para trocar impressões, celebrações e acolhimento sem julgamentos.",
      image_url: "/brand-assets/deployments/IMG_8066.PNG",
      items: "trocas diárias entre escritoras\nfeedback amoroso sem críticas técnicas\ncomunidade ativa e acolhedora",
      icon: "users"
    },
    tab_cadernos: {
      label: "cadernos guiados",
      badge: "impressão & pdf",
      title: "guias em pdf para escrita manual",
      description: "materiais diagramados com carinho para você baixar, imprimir e preencher no seu ritmo, desconectada das telas.",
      image_url: "/brand-assets/deployments/IMG_8151.PNG",
      items: "diagramação afetiva em papel kraft\nguias de rituais e hábitos\ndiários de bordo artesanais",
      icon: "file-text"
    }
  }
};

const STORAGE_BUCKET = 'banners';
const CMS_FILE_NAME = 'cms_site_pages.json';
const LOCAL_STORAGE_KEY = 'soltaoverbo_cms_data_cache';

// In-memory cache & event listeners
let memoryCMSData: SiteCMSData | null = null;
const listeners: Set<() => void> = new Set();

function notifyListeners() {
  listeners.forEach((l) => l());
}

function mergeCMSWithDefaults(remoteData: SiteCMSData): SiteCMSData {
  const merged: SiteCMSData = { ...DEFAULT_CMS_DATA };

  for (const pageSlug in remoteData) {
    if (!merged[pageSlug]) {
      merged[pageSlug] = {};
    }
    for (const secKey in remoteData[pageSlug]) {
      merged[pageSlug][secKey] = {
        ...(merged[pageSlug][secKey] || {}),
        ...remoteData[pageSlug][secKey],
      };
    }
  }

  return merged;
}

export async function fetchCMSDataFromSupabase(): Promise<SiteCMSData> {
  try {
    const { data: publicUrlData } = supabase.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(CMS_FILE_NAME);

    const res = await fetch(`${publicUrlData.publicUrl}?t=${Date.now()}`);
    if (res.ok) {
      const data: SiteCMSData = await res.json();
      const merged = mergeCMSWithDefaults(data);
      memoryCMSData = merged;
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(merged));
      notifyListeners();
      return merged;
    }
  } catch (err) {
    console.warn('não foi possível carregar CMS do supabase, usando cache local:', err);
  }

  const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (cached) {
    try {
      const parsed = JSON.parse(cached);
      const merged = mergeCMSWithDefaults(parsed);
      memoryCMSData = merged;
      return merged;
    } catch (e) {
      console.error(e);
    }
  }

  memoryCMSData = DEFAULT_CMS_DATA;
  return DEFAULT_CMS_DATA;
}

export async function saveCMSDataToSupabase(updatedCMSData: SiteCMSData): Promise<boolean> {
  try {
    memoryCMSData = updatedCMSData;
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedCMSData));
    notifyListeners();

    const blob = new Blob([JSON.stringify(updatedCMSData, null, 2)], { type: 'application/json' });
    const { error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(CMS_FILE_NAME, blob, { upsert: true, contentType: 'application/json' });

    if (error) throw error;
    return true;
  } catch (err) {
    console.error('erro ao salvar CMS no Supabase Storage:', err);
    return false;
  }
}

export function usePageContent(pageSlug: string) {
  const [cmsData, setCmsData] = useState<SiteCMSData>(() => {
    if (memoryCMSData) return memoryCMSData;
    const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (cached) {
      try {
        return mergeCMSWithDefaults(JSON.parse(cached));
      } catch (e) {}
    }
    return DEFAULT_CMS_DATA;
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const handleUpdate = () => {
      if (isMounted && memoryCMSData) {
        setCmsData({ ...memoryCMSData });
      }
    };

    listeners.add(handleUpdate);

    fetchCMSDataFromSupabase().then((data) => {
      if (isMounted) {
        setCmsData(data);
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
      listeners.delete(handleUpdate);
    };
  }, [pageSlug]);

  const pageContent = cmsData[pageSlug] || DEFAULT_CMS_DATA[pageSlug] || {};

  const getSection = (sectionKey: string, defaults?: SectionContent): SectionContent => {
    const defaultSec = (DEFAULT_CMS_DATA[pageSlug] || {})[sectionKey] || {};
    const customSection = pageContent[sectionKey] || {};

    const cleanCustom = Object.fromEntries(
      Object.entries(customSection).filter(([_, v]) => v !== undefined && v !== null && v !== '')
    );
    const cleanDefaults = defaults
      ? Object.fromEntries(Object.entries(defaults).filter(([_, v]) => v !== undefined && v !== null && v !== ''))
      : {};

    return {
      ...defaultSec,
      ...cleanCustom,
      ...cleanDefaults,
    };
  };

  return {
    loading,
    pageContent,
    getSection,
    cmsData,
  };
}
