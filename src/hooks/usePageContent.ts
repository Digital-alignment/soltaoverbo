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
      title: "a narrativa muda a partir do ponto que você solta o verbo.",
      subtitle: "reescreva sua história, amplie perspectivas e abra espaço para uma escrita mais consciente. um convite para questionar narrativas impostas e escrever seu próprio caminho.",
      body_text: "escrever é mais do que juntar palavras: é um jeito de ouvir o que vive dentro, organizar o caos e dar forma ao que ainda é sussurro.",
      button_text: "conhecer os programas",
      button_link: "#produtos",
      image_url: "/brand-assets/gallery/events/13062026-IMG_6581-2.jpg"
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
      subtitle: "a escrita é nosso eixo central — mas o encontro, a escuta e a criação coletiva sustentam toda a nossa jornada. um convite para desacelerar, cultivar presença e dar forma ao que vive dentro.",
      body_text: "escrever é um ato de coragem para dizer ao mundo: eu existo e minha história tem valor.",
      image_url: "/whatsapp_image_2025-12-11_at_3.24.18_pm.jpeg"
    },
    origem: {
      title: "história & fundação",
      subtitle: "como nasceu o solta o verbo",
      body_text: "nascemos do desejo de criar um refúgio acolhedor contra o isolamento e a pressa da vida moderna. bruna riedel e júlia alvim uniram suas experiências para gestar uma metodologia viva de escrita afetiva.",
      image_url: "/brand-assets/gallery/events/_MG_9849.jpg"
    },
    pilares: {
      title: "pilares & ritual autoral",
      subtitle: "encontros reais, vínculos, expressão e potência criativa",
      body_text: "nossos quatro pilares sustentam cada roda, oficina e partilha: proporcionar encontros sem máscaras, criar redes de apoio, dar vazão ao sentir e libertar a potência criativa.",
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
      title: "21 dias de escrita autoral & respiro interno",
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
      title: "encontro mensal de escrita & aconchego",
      subtitle: "um ritual de domingo com café quentinho, cadernos abertos e partilhas afetivas.",
      body_text: "encontros ao vivo para escrever em grupo, exercitar a escuta poética e criar conexões verdadeiras.",
      button_text: "garantir ingresso para o próximo café →",
      button_link: "#inscricao",
      image_url: "/brand-assets/gallery/events/_MG_9849.jpg"
    },
    detalhes: {
      title: "como funciona o café com letras",
      subtitle: "duas horas de escrita guiada e roda de leitura opcional",
      body_text: "preparamos o ambiente para você se sentir em casa. a cada edição, um tema inédito inspira nossos rituais de escrita e trocas humanas.",
      button_text: "participar da próxima edição →",
      button_link: "#inscricao",
      image_url: "/brand-assets/gallery/events/_MG_9991.jpg"
    }
  },
  programa_ciclo: {
    hero: {
      title: "o ciclo de aprofundamento",
      subtitle: "uma jornada contínua para quem deseja transformar a escrita em prática diária de presença e autocompaixão.",
      body_text: "encontros quinzenais ao vivo, mentoria coletiva com bruna e júlia, acervo completo de oficinas e comunidade exclusiva.",
      button_text: "fazer parte do ciclo (r$ 597/ano) →",
      button_link: "#planos",
      image_url: "/brand-assets/gallery/events/13062026-IMG_6581-2.jpg"
    },
    detalhes: {
      title: "experiência & rituais do ciclo",
      subtitle: "sustentação em comunidade para o seu processo autoral",
      body_text: "no ciclo, a escrita ganha profundidade. você terá acompanhamento constante, exercícios avançados e um grupo seguro para partilhar suas criações.",
      button_text: "garantir minha vaga no ciclo →",
      button_link: "#planos",
      image_url: "/brand-assets/gallery/events/13062026-IMG_5364-2.jpg"
    }
  },
  contrate_experiencia: {
    hero: {
      title: "experiências de escrita autoral sob medida",
      subtitle: "levamos rituais de escrita consciente, integração humana e expressão autêntica para empresas, festivais e coletivos.",
      body_text: "desenvolvemos vivências presenciais e virtuais customizadas para a cultura da sua equipe ou evento.",
      button_text: "falar com a equipe no whatsapp →",
      button_link: "https://wa.me/5531999999999",
      image_url: "/brand-assets/gallery/events/13062026-IMG_6666-2.jpg"
    },
    proposta: {
      title: "proposta de rituais corporativos",
      subtitle: "saúde mental, escuta ativa e coesão de time através da palavra",
      body_text: "nossos rituais de escrita promovem conexão genuína, redução de estresse e fortalecimento da autoria individual em ambientes corporativos e eventos especiais.",
      button_text: "solicitar proposta personalizada →",
      button_link: "https://wa.me/5531999999999",
      image_url: "/brand-assets/gallery/events/_MG_0015.jpg"
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
    return {
      title: customSection.title ?? defaults?.title ?? defaultSec.title ?? '',
      subtitle: customSection.subtitle ?? defaults?.subtitle ?? defaultSec.subtitle ?? '',
      body_text: customSection.body_text ?? defaults?.body_text ?? defaultSec.body_text ?? '',
      quote_text: customSection.quote_text ?? defaults?.quote_text ?? defaultSec.quote_text ?? '',
      image_url: customSection.image_url ?? defaults?.image_url ?? defaultSec.image_url ?? '',
      button_text: customSection.button_text ?? defaults?.button_text ?? defaultSec.button_text ?? '',
      button_link: customSection.button_link ?? defaults?.button_link ?? defaultSec.button_link ?? '',
      ...defaultSec,
      ...defaults,
      ...customSection,
    };
  };

  return {
    loading,
    pageContent,
    getSection,
    cmsData,
  };
}
