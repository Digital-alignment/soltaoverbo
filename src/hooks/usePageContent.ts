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
      badge_text: "comunidade de autodesenvolvimento através da escrita",
      title: "a narrativa muda a partir do ponto que você a observa.",
      subtitle: "reescreva sua história ao ampliar a perspectiva e abrir espaço para uma escrita (e vida) mais consciente. dê contorno ao que te habita, ao que pede passagem e ao que ainda não encontrou palavras.",
      button_text: "conhecer os programas",
      button_link: "#produtos",
      button_secondary_text: "saiba mais",
      button_secondary_link: "#sobre-nos",
      image_url: ""
    },
    produtos_header: {
      title: "escolha a experiência ideal para o seu momento",
      subtitle: "saiba como você pode fazer parte da nossa comunidade."
    },
    produto_21dias: {
      title: "21 dias de escrita",
      body_text: "uma jornada prática de 21 dias para desbloquear sua voz e criar um hábito vivo de escrita guiada. receba exercícios diários, áudios inspiradores e acesso à área de membros.",
      bullet_1: "21 exercícios práticos de escrita consciente liberados dia a dia",
      bullet_2: "acesso a área de membros, espaço de compartilhamento de textos e conexão",
      bullet_3: "1 café com letras por mês com a comunidade",
      price: "R$ 77,00",
      price_subtext: "(ou 2x R$ 38,50)",
      button_text: "garantir minha vaga",
      image_url: "/brand-assets/elements/collages/png-retro-collages-whit-book-publication-flower-plant.png",
      for_who_title: "para quem é este programa?",
      for_who_text: "ideal para quem deseja destravar a escrita, organizar pensamentos soltos e criar uma rotina constante sem pressão de perfeccionismo."
    },
    produto_ciclo: {
      badge_text: "travessia de 3 meses · turma com vagas limitadas",
      title: "ciclo de aprofundamento",
      body_text: "uma travessia de 3 meses onde mergulhamos fundo num tema que incomoda (e que move). autodesenvolvimento, criatividade e relações humanas com escrita, livro, comunidade e encontros ao vivo.",
      bullet_1: "3 encontros ao vivo (1 por mês) com bruna, júlia e convidada",
      bullet_2: "acesso a todos os cafés com letras - o ritual de terça-feira de escrita coletiva.",
      bullet_3: "comunidade no whatsapp",
      bullet_4: "acesso aos 21 dias de escrita na plataforma",
      bullet_5: "acesso as aulas gravadas na plataforma completa",
      bullet_6: "acesso a todas as facilidades da plataforma: página de escrita, fogueira de partilha, rituais e inspirações de escrita",
      bullet_7: "desconto especial nos encontros presenciais do solta o verbo",
      price: "R$ 597,00",
      price_subtext: "/ trimestre (ou 3x R$ 225,67 sem juros)",
      button_text: "fazer parte do ciclo",
      image_url: "/brand-assets/gallery/events/13062026-IMG_5364-2.jpg",
      journey_badge: "travessia em curso: a coragem de não agradar",
      book_info: "a coragem de não agradar — ichiro kishimi & fumitake koga",
      guest_info: "jout jout",
      synopsis: "três meses para se libertar da opinião dos outros, atravessar seus limites e se tornar quem você quer ser."
    },
    produto_cafe: {
      title: "café com letras (escrita em coletivo)",
      p1: "um encontro semanal para começar a semana de um jeito diferente: mais consciente, mais presente e mais perto da sua própria voz.",
      p2: "às terças-feiras, das 8h às 8h30, no zoom, abrimos um espaço de escrita em coletivo com propostas temáticas que se renovam a cada encontro.",
      p3: "uma prática curta, potente e possível para quem deseja cultivar a escrita como ritual.",
      highlight: "incluído para quem já faz parte do ciclo de aprofundamento.",
      price: "R$ 97,00 / mês",
      button_text: "quero fazer parte",
      button_link: "/programas/cafe-com-letras",
      image_url: "/brand-assets/gallery/events/13062026-IMG_6666-2.jpg",
      card_title: "seu ritual semanal de escrita",
      card_text: "30 minutos para sair do automático e transformar o que está vivo em palavra. ideal para quem quer criar constância na escrita em um formato leve, acessível e transformador.",
      card_info: "terças, 8h às 8h30 · ao vivo no zoom · incluso no ciclo de aprofundamento"
    },
    fundamentos: {
      title: "os fundamentos do nosso movimento",
      subtitle: "entre prática, presença e partilha, criamos espaço para aprender, se reconhecer e seguir com mais autoria.",
      p1_title: "essência humana",
      p1_desc: "escrever é mais do que juntar palavras: é um jeito de ouvir o que vive dentro, organizar o caos e dar forma ao que ainda é sussurro.",
      p2_title: "disciplina criativa",
      p2_desc: "criar hábitos de escrita que não pesem como obrigação, mas que funcionem como pequenos rituais de presença e alívio mental.",
      p3_title: "viver em coletivo",
      p3_desc: "acreditamos que ninguém deveria atravessar transições sozinha. estar em comunidade protege a saúde mental e reduz a solidão.",
      p4_title: "ampliar o olhar",
      p4_desc: "escrever e escutar em grupo exercita empatia, alarga perspectivas e ajuda a encontrar novos significados para velhas cenas.",
      p5_title: "sair do modo passivo",
      p5_desc: "a escrita ajuda a questionar narrativas herdadas, tomar decisões mais conscientes e transformar preocupação em movimento.",
      p6_title: "autonomia e coragem",
      p6_desc: "o propósito é que cada pessoa se torne autora da própria história, com ferramentas internas e clareza de direção."
    },
    depoimentos: {
      badge_text: "vozes da nossa comunidade",
      title: "o que dizem as pessoas que soltam o verbo",
      selected_ids: "t1,t3,t5"
    },
    b2b_section: {
      badge_text: "experiências sob medida",
      title: "crie com a gente",
      subtitle: "leve uma experiência de escrita da solta o verbo para a sua organização e cultive pertencimento a partir da escrita expressiva.",
      card1_badge: "empresas e organizações",
      card1_title: "oficinas corporativas",
      card1_desc: "a escrita como pausa e cuidado dentro da rotina de trabalho: um encontro que aproxima as pessoas e revela novas maneiras de se relacionar.",
      card2_badge: "eventos e experiências",
      card2_title: "experiência com escrita em eventos",
      card2_desc: "a escrita como convite à presença em festivais, retiros e encontros: um momento de pausa que muda a relação com o espaço, consigo e com os outros.",
      card3_badge: "escolas e educação",
      card3_title: "escrita para quem está aprendendo",
      card3_desc: "atividades de escrita criativa para crianças, jovens e educadores, desenvolvendo imaginação, autoria e escuta desde cedo."
    },
    palavras_sob_medida: {
      badge_text: "palavras sob medida",
      title: "textos para momentos especiais",
      body_text: "textos autorais para casamentos, homenagens, celebrações e marcos de empresas: ouvimos a sua história e devolvemos em palavras.",
      button_text: "solicitar um texto sob medida"
    },
    teoria_pratica: {
      badge_text: "teoria + prática / o que sustenta a nossa escrita.",
      title: "“nosso trabalho nasce de estudo e de vivência.”",
      body_text: "não improvisamos. cada encontro que desenhamos parte de referências consistentes, como as pesquisas de james pennebaker sobre escrita expressiva e seus efeitos no bem-estar emocional, e a curva do esquecimento de ebbinghaus, que mostra por que a escrita precisa ser prática recorrente e não um encontro isolado.",
      highlight_final: "é por isso que não entregamos só uma oficina bonita: desenhamos jornadas que continuam depois que a gente vai embora.",
      button_text: "enviar e-mail",
      button_link: "mailto:soltaoverbocoletivo@gmail.com"
    },
    final_cta: {
      title: "vamos desenhar algo especial juntos?",
      subtitle: "fale diretamente conosco pelo whatsapp e receba a proposta detalhada.",
      button_text: "falar no whatsapp"
    },
    faq: {
      badge_text: "dúvidas frequentes",
      title: "perguntas que costumam surgir",
      subtitle: "respostas simples e diretas para você dar o próximo passo com segurança.",
      q1: "preciso ter experiência com escrita para participar?",
      a1: "não. aqui não se trata de técnica acadêmica, gramática impecável ou talento literário. o que a gente pratica é escuta interna, presença e liberdade narrativa.",
      q2: "o solta o verbo é um curso de escrita criativa?",
      a2: "não exatamente. a escrita é a nossa ferramenta, não o nosso produto final. o que buscamos é autodesenvolvimento: dar contorno ao que te habita, reconhecer as narrativas que você repete e reescrevê-las com mais verdade e consciência. quem sai daqui escrevendo melhor, sai também se conhecendo melhor.",
      q3: "isso é terapia?",
      a3: "não. não somos psicólogas e o solta o verbo não substitui acompanhamento terapêutico. é um espaço de escuta, criação e coletividade, com propostas guiadas e cuidado com o que aparece. se você está em processo terapêutico, a escrita costuma caminhar muito bem ao lado dele.",
      q4: "quem conduz os encontros?",
      a4: "nós, bru e ju, co-criadoras e facilitadoras do coletivo. saiba mais na página \"sobre nós\".",
      q5: "como funciona o acesso aos 21 dias de escrita?",
      a5: "ao comprar os 21 dias de escrita, você recebe acesso imediato à plataforma. a cada dia é liberado um novo exercício guiado com áudio de reflexão, além do acesso à área de membros, nosso espaço de partilha com o grupo. você também tem acesso gratuito aos 21 dias de escrita ao fazer parte do ciclo de aprofundamento.",
      q6: "o que é o ciclo de aprofundamento?",
      a6: "é a nossa comunidade paga, organizada em travessias de três meses. cada travessia mergulha em um tema de autodesenvolvimento, criatividade e relações humanas, apoiada por um livro-guia e por um convidado especial. a travessia atual é \"a coragem de não agradar\", com o livro de ichiro kishimi e fumitake koga e a presença da jout jout. para saber mais, acesse \"ciclo de aprofundamento\" na aba de programas.",
      q7: "o que é o café com letras?",
      a7: "uma roda de escrita de trinta minutos, toda terça de manhã, para começar o dia pela sua própria voz. café quentinho, caderno aberto e um grupo de pessoas escrevendo junto. sem correção, sem cobrança, sem precisar ler em voz alta. chegue como estiver, e saia mais consciente disso.",
      q8: "quais são as formas de pagamento disponíveis?",
      a8: "pix à vista com desconto especial, cartão de crédito em até 3x sem juros e boleto bancário.",
      q9: "é necessário instalar algum aplicativo?",
      a9: "não. você pode acessar pelo navegador ou instalar nossa plataforma como web app no seu celular (no navegador do celular, toque no menu de opções / compartilhar e depois em \"adicionar à tela de início\")."
    }
  },
  founders: {
    bruna: {
      name: "bruna riedel",
      role: "co-criadora & facilitadora",
      photo: "/bruna copy copy.png",
      summary: "de uma comuna em israel a uma horta comunitária em florianópolis, bruna riedel é geógrafa e escritora que encontrou na palavra a ferramenta pra construir pertencimento.",
      bio: "aos dezoito anos morou numa comuna em israel, dividindo casa e salário com quinze amigos. antes disso, três meses num kibutz, e depois deu aula de hebraico pra refugiados da etiópia. foi ali que entendeu que pertencer é ser corresponsável pelo coletivo.\n\nformou-se em geografia na udesc, com pesquisa sobre um grupo que transformou um terreno baldio em horta comunitária, com pessoas em situação de rua plantando onde antes só tinha mato.\n\nrepetiu esse gesto em instituições diferentes: impact hub, salto inclusão produtiva, tribos lab, e há quatro anos o instituto amuta, aplicando o design de conexões. seu trabalho parte das pesquisas de james pennebaker sobre escrita expressiva e da curva do esquecimento de ebbinghaus, e acredita que todo mundo já sabe escrever, só precisa de um canal guiado pra se escutar.\n\ncofundadora e facilitadora da solta o verbo, ao lado de júlia alvim, onde aplica na palavra o que aprendeu na horta e na comuna: que ninguém pertence sozinho."
    },
    julia: {
      name: "júlia alvim",
      role: "co-criadora & facilitadora",
      photo: "/jo.png",
      summary: "julia alvim é contadora de histórias. encontrou na escrita a ferramenta da própria travessia e é o que hoje sustenta seu trabalho com outras pessoas.",
      bio: "saiu de um cargo de gerência em multinacional para seguir um caminho autoral mais alinhado com sua verdade e explora todas as possibilidades de comunicação através da arte para contar uma boa história.\n\natualmente trabalha com comunicação digital, criação de conteúdo de vídeo e produção de eventos, retiros e encontros no brasil e na europa. criou projetos coletivos como o children of the universe e o 'segundas intenções', newsletter no substack. é movida pela possibilidade de aprender algo novo.\n\nco-criadora e facilitadora do solta o verbo, desenha jornadas em que a expressão através da escrita se torna um espaço seguro para reorganizar emoções e ressignificar narrativas."
    }
  },
  testimonials_pool: {
    t1: {
      id: "t1",
      author: "bárbara alcântara (babi)",
      role: "café com letras & ciclo de aprofundamento",
      quote: "em 2022 entrei num processo muito profundo de autoconhecimento e passei por várias experiências. em todas elas, o denominador comum era a escrita como uma das principais e mais efetivas ferramentas pra me entender.",
      event_tag: "café com letras & ciclo",
      image_url: ""
    },
    t2: {
      id: "t2",
      author: "bárbara alcântara (babi)",
      role: "café com letras & ciclo de aprofundamento",
      quote: "gostei de aprender sobre a resistência, sobre a importância da troca e, principalmente, sobre o quanto é possível escrever em só 15 minutos! vocês são demais, eu encontrei aleatoriamente o solta o verbo e sou muito grata por isso.",
      event_tag: "café com letras & ciclo",
      image_url: ""
    },
    t3: {
      id: "t3",
      author: "tom vitralli",
      role: "explorador de realidades, andarilho de alma",
      quote: "o simples fato de estar em sangha, ouvindo escritas pessoais diversas e se inspirando nelas, é o néctar da solta o verbo.",
      event_tag: "21 dias & ciclo",
      image_url: ""
    },
    t4: {
      id: "t4",
      author: "tom vitralli",
      role: "explorador de realidades, andarilho de alma",
      quote: "minha escrita começou a pegar no tranco. menos analítica, mais expressiva e autêntica. apesar de já escrever poesias antes, o fluxo da escrita melhorou muito!",
      event_tag: "21 dias & ciclo",
      image_url: ""
    },
    t5: {
      id: "t5",
      author: "jess",
      role: "aluna dos 21 dias de escrita",
      quote: "conhecer o solta o verbo foi um resgate desse instrumento, e ao mesmo tempo uma expansão de como colocar palavras: não como uma técnica engessada, mas inspiracional e fluida. sinto-me cada vez mais presente.",
      event_tag: "21 dias & ciclo",
      image_url: ""
    },
    t6: {
      id: "t6",
      author: "jess",
      role: "aluna dos 21 dias de escrita",
      quote: "essa comunidade é um fio de vida humana, principalmente nessa transição planetária. agradeço e indico para quem busca uma comunidade aberta para avançar.",
      event_tag: "21 dias & ciclo",
      image_url: ""
    }
  },
  about: {
    hero: {
      badge_text: "nossa essência & manifesto",
      title_prefix: "solta o verbo:",
      title: "auto desenvolvimento em coletivo",
      subtitle: "existimos para que ninguém precise atravessar as próprias perguntas sozinha. somos uma comunidade viva que usa a escrita para reconhecer as narrativas herdadas, questioná-las e reescrevê-las com mais verdade, consciência e liberdade. sua história deve ser vivida e contada a partir da sua perspectiva, e ninguém mais. quem escreve, dirige e vive a sua vida?",
      italic_quote: "reescreva sua história ao ampliar a perspectiva e abrir espaço para uma escrita (e uma vida) mais consciente.",
      button_text: "conhecer as facilitadoras",
      button_link: "#criadoras",
      button_secondary_text: "ver nossos encontros",
      button_secondary_link: "#encontros",
      image_url: "/whatsapp_image_2025-12-11_at_3.24.18_pm.jpeg",
      card_quote: "escrever é encarar com verdade e presença as partes de nós que ainda não tinham nome."
    },
    manifesto: {
      badge_text: "manifesto",
      title: "o que acreditamos",
      p1: "acreditamos que somos capazes de transformar a nossa vida quando reconhecemos as narrativas que nos atravessam.",
      p2: "muitas vezes repetimos histórias que nos foram introjetadas sem perceber que também temos o poder de escolher outras palavras, outros sentidos e outros capítulos para, assim, criar novos começos e melhores finais.",
      p3: "usamos a escrita como a ferramenta acessível e profundamente transformadora que ela é. por meio dela, trilhamos um caminho de dar contorno ao que nos habita: tornar visíveis as histórias que carregamos para então questioná-las e reescrevê-las com mais verdade, consciência e liberdade.",
      highlight_quote: "solta o verbo é um convite para despertar a própria voz ao escutá-la através da escrita.",
      box_p1: "acreditamos na escrita como caminho de aprendizagem, verdade e transformação em coletivo. nossos pilares nascem da escuta de si, da troca com o outro e da coragem de escrever uma vida mais verdadeira.",
      box_p2: "aqui, aprender é se escutar, partilhar caminhos e dar linguagem ao que é essencial. cultivamos uma escrita que aproxima da própria verdade e transforma quando encontra o coletivo."
    },
    pilares: {
      title: "o que nos move todos os dias",
      subtitle: "nossos cinco pilares que sustentam cada experiência e cada roda de escrita.",
      pilar_1_title: "encontros reais",
      pilar_1_desc: "onde cada pessoa pode chegar como está. conversas que abrem espaço para o que realmente importa, sem máscaras ou julgamento.",
      pilar_2_title: "vínculos & proteção",
      pilar_2_desc: "rituais que fortalecem a confiança e criam uma rede de apoio genuína contra a solidão e o isolamento dos tempos atuais.",
      pilar_3_title: "expressão & autoria",
      pilar_3_desc: "exercícios guiados que colocam o sentir em movimento, dando forma poética às emoções e organizando o caos interno.",
      pilar_4_title: "potência criativa",
      pilar_4_desc: "transformar padrões limitantes e narrativas herdadas em força de vida e liberdade de escolha.",
      pilar_5_title: "aprender fazendo",
      pilar_5_desc: "acreditamos que o aprendizado está no ato: fazer, testar, errar, tentar de outro jeito. escrever é o nosso ponto de partida, mas o que muda uma vida não é entender uma ideia: é experimentá-la. aqui a gente aprende a caminhar, caminhando."
    },
    galeria: {
      badge_text: "diário visual",
      title: "nossos encontros em imagens",
      subtitle: "registros da nossa participação em feiras, oficinas presenciais e momentos de partilha.",
      photo_1_title: "oficinas presenciais",
      photo_1_subtitle: "vivências de escrita consciente & integração",
      photo_1_image: "/brand-assets/gallery/events/13062026-IMG_6581-2.jpg",
      photo_2_title: "rodas de partilha",
      photo_2_subtitle: "cadernos abertos, diálogos profundos e escuta",
      photo_2_image: "/brand-assets/gallery/events/13062026-IMG_5364-2.jpg",
      photo_3_title: "experiências sob medida",
      photo_3_subtitle: "encontros para retiros, festivais e coletivos",
      photo_3_image: "/brand-assets/gallery/events/13062026-IMG_6666-2.jpg",
      photo_4_title: "curadoria de ambiente",
      photo_4_subtitle: "espaço seguro para acolher histórias humanas",
      photo_4_image: "/brand-assets/gallery/events/_MG_0015.jpg",
      photo_5_title: "conexões autênticas",
      photo_5_subtitle: "transformando a rotina através da poesia",
      photo_5_image: "/brand-assets/gallery/events/_MG_9849.jpg",
      photo_6_title: "rituais de presença",
      photo_6_subtitle: "reescrevendo narrativas em comunidade",
      photo_6_image: "/brand-assets/gallery/events/_MG_9991.jpg"
    },
    eventos_criados: {
      badge_text: "presenciais",
      title: "os eventos que criamos",
      subtitle: "a escrita também sai da tela, e como é bom a gente estar pertinho <3",
      evt1_title: "feira fatto à femme",
      evt1_location: "florianópolis",
      evt1_year: "2026",
      evt1_short: "instalação de escrita e roda de partilha com o público da feira, criando uma pausa poética no meio do evento.",
      evt1_full: "uma vivência poética ocupando o espaço público da feira fatto à femme em florianópolis. criamos um varal de histórias e uma mesa de escrita aberta onde centenas de pessoas pararam entre as alamedas da feira para colocar sentimentos no papel, pendurar suas frases no varal e compartilhar pausas necessárias em meio à movimentação do evento.",
      evt1_image: "/brand-assets/gallery/events/13062026-IMG_6581-2.jpg",
      evt1_hl1: "varal poético comunitário com mais de 100 mensagens penduradas",
      evt1_hl2: "rodas espontâneas de escuta e acolhimento com os visitantes da feira",
      evt1_hl3: "espaço de desaceleração e reconexão autoral no meio do evento",
      evt2_title: "o experienciar",
      evt2_location: "florianópolis",
      evt2_year: "2026",
      evt2_short: "oficina presencial de escrita expressiva e presença para desacelerar e olhar para dentro.",
      evt2_full: "uma imersão presencial intimista focada no autodesenvolvimento e na escrita sem filtro. durante quatro horas, facilitamos rituais de presença, dinâmicas de escuta em dupla, café com prosa e produção autoral guiada em um ambiente integrado com a natureza.",
      evt2_image: "/brand-assets/gallery/events/13062026-IMG_5364-2.jpg",
      evt2_hl1: "práticas de escrita expressiva baseadas nas pesquisas de james pennebaker",
      evt2_hl2: "roda de partilha segura, afetiva e totalmente livre de julgamentos",
      evt2_hl3: "cadernos artesanais e kit de rituais entregues a cada participante",
      next_badge: "em breve",
      next_title: "o próximo, em breve",
      next_text: "estamos preparando os próximos encontros presenciais. quer saber em primeira mão quando abrirmos vagas?",
      next_button_text: "quero saber quando abrir",
      next_button_link: "https://wa.me/5511999999999?text=ol%C3%A1!%20gostaria%20de%20saber%20quando%20abrem%20vagas%20para%20os%20pr%C3%B3ximos%20eventos%20presenciais.",
      footer_text: "quer levar a solta o verbo para o seu evento, retiro ou coletivo? a gente desenha a vivência junto com você.",
      footer_button_text: "falar com a gente",
      footer_button_link: "https://wa.me/5511999999999?text=ol%C3%A1!%20gostaria%20de%20levar%20uma%20experi%C3%AAncia%20da%20solta%20o%20verbo%20para%20nosso%20evento."
    },
    ecossistema_digital: {
      badge_text: "o nosso ecossistema digital",
      title: "um ambiente livre de algoritmos e distrações",
      subtitle: "nossa plataforma foi desenhada para que você possa publicar textos, interagir com leitoras apaixonadas por palavras e manter um diário de bordo digital com privacidade e respeito.",
      bullet_1: "editor limpo e focado no essencial da escrita",
      bullet_2: "acesso à fogueira de partilha comunitária diária",
      bullet_3: "encontros ao vivo e acervo completo gravado",
      button_text: "começar minhas 48 horas grátis",
      button_link: "/register",
      image_url: "/whatsapp_image_2025-12-11_at_4.25.25_pm.jpeg"
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
      ...cleanDefaults,
      ...cleanCustom,
    };
  };

  return {
    loading,
    pageContent,
    getSection,
    cmsData,
  };
}
