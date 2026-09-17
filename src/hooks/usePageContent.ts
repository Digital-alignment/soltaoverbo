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
      author: "voz da nossa comunidade",
      role: "comunidade solta o verbo",
      quote: "a gente escreve, fala com o outro, para poder se ouvir, se ler e tentar entender um pouquinho mais desse universo que somos.",
      event_tag: "landing page",
      image_url: ""
    },
    t2: {
      id: "t2",
      author: "jess",
      role: "aluna da comunidade",
      quote: "essa comunidade é um fio de vida humana, principalmente nessa transição planetária.",
      event_tag: "landing page",
      image_url: ""
    },
    t3: {
      id: "t3",
      author: "voz da nossa comunidade",
      role: "comunidade solta o verbo",
      quote: "foi meu primeiro texto. nunca tinha feito isso.",
      event_tag: "landing page",
      image_url: ""
    },
    t4: {
      id: "t4",
      author: "voz da nossa comunidade",
      role: "aluna dos 21 dias de escrita",
      quote: "no dia 11, o meu número preferido, encontrei inspiração para a minha primeira poesia em português, honrando esta língua tão bonita e essa linguagem universal que é a poesia.",
      event_tag: "21 dias de escrita",
      image_url: ""
    },
    t5: {
      id: "t5",
      author: "voz da nossa comunidade",
      role: "aluna dos 21 dias de escrita",
      quote: "todo ano eu compro um caderno no intuito de que essa escrita vire hábito. esse ano foi o que mais escrevi. esse grupo tem me ajudado, acho que a partir desse exercício venho encontrado a criatividade e colocado ela no dia a dia.",
      event_tag: "21 dias de escrita",
      image_url: ""
    },
    t6: {
      id: "t6",
      author: "tom vitralli",
      role: "aluno dos 21 dias de escrita",
      quote: "minha escrita começou a pegar no tranco. menos analítica e racional, mais expressiva e autêntica. apesar de já escrever poesias antes, o fluxo da escrita melhorou muito!",
      event_tag: "21 dias de escrita",
      image_url: ""
    },
    t7: {
      id: "t7",
      author: "voz da nossa comunidade",
      role: "participante do café com letras",
      quote: "eu amei escrever. obrigada por isso. tô num turbilhão de coisas acontecendo e foi bom demais.",
      event_tag: "café com letras",
      image_url: ""
    },
    t8: {
      id: "t8",
      author: "voz da nossa comunidade",
      role: "participante do café com letras",
      quote: "escrever com foco, além de muito gostoso, faz a mente se divertir. adoro essa oportunidade de praticar todo dia, traz paz, revelações. nossa experiência de escrita está gerando uma onda linda de muita possibilidade futura.",
      event_tag: "café com letras",
      image_url: ""
    },
    t9: {
      id: "t9",
      author: "bárbara alcântara (babi)",
      role: "participante do café com letras",
      quote: "gostei de aprender sobre a resistência, sobre a importância da troca e, principalmente, sobre o quanto é possível escrever em só 15 minutos! vocês são demais.",
      event_tag: "café com letras",
      image_url: ""
    },
    t10: {
      id: "t10",
      author: "bárbara alcântara (babi)",
      role: "integrante do ciclo de aprofundamento",
      quote: "em 2022 entrei num processo muito profundo de autoconhecimento e passei por várias experiências. em todas elas, o denominador comum era a escrita como uma das principais e mais efetivas ferramentas pra me entender.",
      event_tag: "ciclo de aprofundamento",
      image_url: ""
    },
    t11: {
      id: "t11",
      author: "voz da nossa comunidade",
      role: "integrante do ciclo de aprofundamento",
      quote: "tenho refletido bastante sobre as travas em minha criatividade, e como a escrita íntima e os momentos intimistas me conectam mais e mais.",
      event_tag: "ciclo de aprofundamento",
      image_url: ""
    },
    t12: {
      id: "t12",
      author: "voz da nossa comunidade",
      role: "integrante do ciclo de aprofundamento",
      quote: "pra mim foi maravilhoso e veio justamente na hora certa. e o mais louco é escrever manifestando: quando eu leio dias, meses depois, eu estou vivendo exatamente o que escrevi.",
      event_tag: "ciclo de aprofundamento",
      image_url: ""
    },
    t13: {
      id: "t13",
      author: "professora que aplicou o projeto em sala de aula",
      role: "formato escolas e educação",
      quote: "apliquei o projeto de vocês para mais de 400 crianças. e elas amaram. se vulnerabilizaram, reduziram a prática de bullying em aula. foi humanizante. eram os '10 minutos mágicos' do começo de toda aula. uma das alunas que fez parte desse projeto foi eleita vereadora mirim e quer levar essa proposta para outras escolas.",
      event_tag: "contrate uma experiência",
      image_url: ""
    },
    d1: { id: "d1", author: "aluna solta o verbo", role: "print real da comunidade", quote: "partilha e acolhimento", event_tag: "21 dias de escrita", image_url: "/brand-assets/deployments/IMG_2847.PNG" },
    d2: { id: "d2", author: "aluna solta o verbo", role: "print real da comunidade", quote: "desbloqueio criativo", event_tag: "21 dias de escrita", image_url: "/brand-assets/deployments/IMG_2848.PNG" },
    d3: { id: "d3", author: "aluna solta o verbo", role: "print real da comunidade", quote: "relação com o caderno", event_tag: "21 dias de escrita", image_url: "/brand-assets/deployments/IMG_2849.PNG" },
    d4: { id: "d4", author: "aluna solta o verbo", role: "print real da comunidade", quote: "mensagens de alunas", event_tag: "21 dias de escrita", image_url: "/brand-assets/deployments/IMG_2864.jpg" },
    d5: { id: "d5", author: "aluna solta o verbo", role: "print real da comunidade", quote: "depoimento espontâneo", event_tag: "21 dias de escrita", image_url: "/brand-assets/deployments/IMG_2865.jpg" },
    d6: { id: "d6", author: "aluna solta o verbo", role: "print real da comunidade", quote: "transformação diária", event_tag: "21 dias de escrita", image_url: "/brand-assets/deployments/IMG_2867.jpg" },
    d7: { id: "d7", author: "aluna solta o verbo", role: "print real da comunidade", quote: "reflexão comunitária", event_tag: "21 dias de escrita", image_url: "/brand-assets/deployments/IMG_2868.jpg" },
    d8: { id: "d8", author: "aluna solta o verbo", role: "print real da comunidade", quote: "vozes da fogueira", event_tag: "21 dias de escrita", image_url: "/brand-assets/deployments/IMG_2870.jpg" },
    d9: { id: "d9", author: "aluna solta o verbo", role: "print real da comunidade", quote: "carinho e presença", event_tag: "21 dias de escrita", image_url: "/brand-assets/deployments/IMG_2877.jpg" },
    d10: { id: "d10", author: "aluna solta o verbo", role: "print real da comunidade", quote: "impacto da escrita", event_tag: "21 dias de escrita", image_url: "/brand-assets/deployments/IMG_2878.jpg" },
    d11: { id: "d11", author: "aluna solta o verbo", role: "print real da comunidade", quote: "relato de experiência", event_tag: "21 dias de escrita", image_url: "/brand-assets/deployments/IMG_8065.PNG" },
    d12: { id: "d12", author: "aluna solta o verbo", role: "print real da comunidade", quote: "prints do grupo", event_tag: "21 dias de escrita", image_url: "/brand-assets/deployments/IMG_8066.PNG" },
    d13: { id: "d13", author: "aluna solta o verbo", role: "print real da comunidade", quote: "experiência dos 21 dias", event_tag: "21 dias de escrita", image_url: "/brand-assets/deployments/IMG_8067.PNG" },
    d14: { id: "d14", author: "aluna solta o verbo", role: "print real da comunidade", quote: "trocas poéticas", event_tag: "21 dias de escrita", image_url: "/brand-assets/deployments/IMG_8068.PNG" },
    d15: { id: "d15", author: "aluna solta o verbo", role: "print real da comunidade", quote: "ritmo pessoal", event_tag: "21 dias de escrita", image_url: "/brand-assets/deployments/IMG_8069.PNG" },
    d16: { id: "d16", author: "aluna solta o verbo", role: "print real da comunidade", quote: "caderno em movimento", event_tag: "21 dias de escrita", image_url: "/brand-assets/deployments/IMG_8151.PNG" },
    d17: { id: "d17", author: "aluna solta o verbo", role: "print real da comunidade", quote: "comunidade acolhedora", event_tag: "21 dias de escrita", image_url: "/brand-assets/deployments/IMG_8846.PNG" },
    d18: { id: "d18", author: "aluna solta o verbo", role: "print real da comunidade", quote: "gratidão das leitoras", event_tag: "21 dias de escrita", image_url: "/brand-assets/deployments/IMG_8850.PNG" }
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
      badge_text: "escrever até virar hábito",
      title: "escrever até virar hábito",
      subtitle: "uma jornada guiada para desbloquear sua expressão, criar hábitos de escrita leve e reencontrar a sua voz autêntica sem autocrítica.",
      price_text: "R$ 77,00",
      price_subtext: "à vista (ou 2x R$ 38,50)",
      guarantee_badge: "garantia de 7 dias",
      button_text: "garantir minha vaga por R$ 77",
      image_url: "/brand-assets/elements/collages/png-retro-collages-whit-book-publication-flower-plant.png",
      quote: "“em 21 dias, você não aprende apenas a escrever: aprende a se ouvir com compaixão.”",
    },
    entregaveis: {
      badge_text: "tudo o que você recebe",
      title: "uma experiência completa para sua jornada de escrita",
      subtitle: "três pilares desenhados para acolher o seu ritmo e garantir o seu hábito.",
      card1_title: "21 exercícios guiados",
      card1_desc: "liberados dia a dia na plataforma com comandos poéticos e reflexões práticas para aplicar em 15 minutos.",
      card1_tag: "01 // plataforma própria",
      card2_title: "pílulas em áudio",
      card2_desc: "áudios inspiradores conduzidos pelas facilitadoras em formato de podcast interno para ouvir onde e quando quiser.",
      card2_tag: "02 // podcast interno",
      card3_title: "fogueira comunitária",
      card3_desc: "acesso ilimitado ao espaço seguro de partilha durante todo o desafio para ler e trocar com outras leitoras.",
      card3_tag: "03 // comunidade viva",
    },
    trilha: {
      badge_text: "a sua jornada passo a passo",
      title: "como a mágica acontece em 3 semanas",
      subtitle: "três fases evolutivas desenhadas para transformar a sua relação com as palavras.",
      sem1_title: "semana 1: olhar para dentro (dias 1 a 7)",
      sem1_subtitle: "desbloquear a voz e silenciar a crítica interna",
      sem1_desc: "antes de qualquer outra coisa, existe você: as memórias que te formaram, as emoções que passaram por você como rios. esta semana é um convite para parar, respirar e voltar para dentro.",
      sem1_audio: "áudio 01: perdendo o medo da folha em branco (5 min)",
      sem1_img: "/brand-assets/gallery/events/13062026-IMG_6581-2.jpg",
      sem1_m1_days: "dias 1 a 3",
      sem1_m1_label: "quebrando o gelo e escrevendo sem filtro",
      sem1_m2_days: "dias 4 e 5",
      sem1_m2_label: "identificando e silenciando o censor interno",
      sem1_m3_days: "dias 6 e 7",
      sem1_m3_label: "criando o seu primeiro ritual diário de presença",
      sem2_title: "semana 2: olhar para fora (dias 8 a 14)",
      sem2_subtitle: "perceber o mundo e dar forma ao caos emocional",
      sem2_desc: "o mundo ao seu redor está cheio de espelhos: cada pessoa, cada gesto, cada detalhe do ambiente reflete algo em você. esta semana amplia o olhar de dentro para fora.",
      sem2_audio: "áudio 08: a bússola das emoções e memórias (6 min)",
      sem2_img: "/brand-assets/gallery/events/13062026-IMG_5364-2.jpg",
      sem2_m1_days: "dias 8 a 10",
      sem2_m1_label: "escrita afetiva e ressignificação de memórias",
      sem2_m2_days: "dias 11 e 12",
      sem2_m2_label: "organizando o caos mental em frases curtas",
      sem2_m3_days: "dias 13 e 14",
      sem2_m3_label: "transformando preocupação em movimento criativo",
      sem3_title: "semana 3: olhar para o entre (dias 15 a 21)",
      sem3_subtitle: "afirmar sua voz autêntica e cultivar o hábito",
      sem3_desc: "duas semanas de olhar, pra dentro e pra fora. agora é hora de tecer: integrar o que ficou dentro com o que você percebeu fora, e projetar caminhos para o que vem a seguir.",
      sem3_audio: "áudio 15: seu manifesto de autoria e coragem (7 min)",
      sem3_img: "/brand-assets/gallery/events/_MG_9849.jpg",
      sem3_m1_days: "dias 15 a 17",
      sem3_m1_label: "encontrando o seu tom e ritmo autoral único",
      sem3_m2_days: "dias 18 e 19",
      sem3_m2_label: "o poder do manifesto pessoal e metas poéticas",
      sem3_m3_days: "dias 20 e 21",
      sem3_m3_label: "ritual de encerramento e continuidade da prática",
    },
    para_quem_e: {
      title: "este programa é para você?",
      subtitle: "transparência e respeito com o seu tempo e investimento.",
      sim_badge: "este programa É para você se:",
      sim_1: "deseja destravar a escrita e criar um hábito constante sem cobranças",
      sim_2: "busca organizar pensamentos dispersos e aliviar o estresse diário",
      sim_3: "quer um espaço seguro para sentir, refletir e ressignificar histórias",
      sim_4: "prefere aprender no seu próprio ritmo com apenas 15 minutos por dia",
      nao_badge: "NÃO é para você se:",
      nao_1: "procura um curso técnico de gramática acadêmica ou regras rígidas",
      nao_2: "busca fórmulas mágicas de publicação de livros sem dedicação pessoal",
      nao_3: "não está disposta a olhar para dentro com afeto e escuta genuína",
    },
    depoimentos: {
      badge_text: "relatos & impressões reais da comunidade",
      title: "vozes e prints de quem viveu os 21 dias",
      subtitle: "mensagens reais, trocas espontâneas e relatos de transformação compartilhados pelas nossas alunas.",
    },
    final_offer: {
      badge_text: "inscrições abertas com preço promocional",
      title: "pronta para soltar o verbo e escrever sua história?",
      subtitle: "garanta seu acesso imediato aos 21 dias de exercícios, áudios inspiradores e à fogueira de partilha comunitária.",
      box_badge: "investimento único com acesso completo",
      price_text: "R$ 77,00",
      price_subtext: "à vista (ou 2x R$ 38,50)",
      guarantee_text: "garantia incondicional de 7 dias sem riscos",
      button_text: "sim! quero garantir minha vaga agora",
    },
    faq: {
      title: "perguntas frequentes sobre os 21 dias",
      q1: "R$ 77 por um programa digital vale a pena?",
      a1: "sim! por apenas R$ 77 você recebe 21 dias de prática guiada com áudios de escuta, espaço de escrita estruturado na plataforma, acervo e acesso imediato ao grupo de whatsapp \"junto e misturado\" para trocar experiências.",
      q2: "quanto tempo preciso dedicar por dia?",
      a2: "apenas 15 a 20 minutos diários! o programa foi desenhado para se encaixar com leveza na sua rotina, sem pesar como obrigação.",
      q3: "e se eu me atrasar ou perder algum dia?",
      a3: "não se preocupe! o desafio é 100% self-paced. todo o conteúdo fica gravado e acessível na sua área de membros para você fazer no seu próprio ritmo.",
      q4: "preciso mostrar meus textos para outras pessoas?",
      a4: "jamais! a escrita é sua e de mais ninguém. a nossa fogueira de partilha no grupo \"junto e misturado\" é um espaço seguro e totalmente opcional para quem sente o desejo de compartilhar.",
      q5: "como funciona a garantia de 7 dias?",
      a5: "você pode entrar, experimentar os primeiros exercícios e áudios durante 7 dias. se sentir que não é o momento para você, devolvemos 100% do valor investido sem perguntas.",
    },
  },
  programa_cafe_com_letras: {
    hero: {
      badge_text: "roda semanal de escrita coletiva · 30 minutos · online",
      title: "café com letras",
      subtitle_gesto: "ritual de escrita semanal",
      subtitle: "uma roda de escrita de trinta minutos, toda terça de manhã, para começar o dia pela sua própria voz. café quentinho, caderno aberto e um grupo de pessoas escrevendo junto. sem correção, sem cobrança, sem precisar ler em voz alta. chegue como estiver, e saia mais consciente disso.",
      button_text: "sim, quero minha xícara por R$97/mês",
      button_secondary_text: "como funciona o café com letras ↓",
      schedule_badge: "toda terça-feira · 8h às 8h30 (30 min) · zoom",
      price_text: "R$ 97,00",
      price_subtext: "/mês",
      ciclo_badge: "100% incluso para quem está no ciclo de aprofundamento",
      guarantee_text: "garantia incondicional de 7 dias",
      quote: "“escrever junto é descobrir que a sua palavra não estava sozinha.”",
      image_url: "/brand-assets/gallery/events/_MG_9849.jpg"
    },
    inspiracao: {
      quote_text: "“escrevo quando estou inspirado. e faço questão de estar inspirado às nove horas de cada manhã.”",
      quote_author: "(peter de vries)",
      title_terracota: "a nossa hora é às oito.",
      title_azul: "inspiração não é sorte, é encontro marcado.",
      p1: "mas verdade seja dita, às vezes a gente precisa de um empurrãozinho para escrever. e para isso o café com letras existe: para te inspirar a fazer isso em coletivo. toda terça, às 8h, tem gente sentando junto. você não precisa decidir se hoje é o dia, não precisa achar assunto, não precisa estar inspirada antes de começar: a hora já está marcada e o tema, pronto.",
      p2: "o tema muda toda semana. a magia desse encontro você descobre na prática: quando escrevemos sobre um tema, ele passa a ser mais vivo em você. com mais consciência, o que antes teria passado batido vira a oportunidade de enxergar o seu entorno de uma nova maneira."
    },
    pilares: {
      title: "que trinta minutos por semana fazem com você",
      subtitle: "quatro pilares pensados para caber de verdade na sua rotina e ainda assim mexer com ela.",
      p1_step: "01", p1_category: "ritual de terça-feira", p1_title: "começar a semana pela sua voz", p1_desc: "meia hora, das 8h às 8h30, antes das reuniões, das mensagens e das urgências dos outros. você entra na semana tendo escutado a si mesma primeiro. o resto do dia acontece a partir de outro lugar.",
      p2_step: "02", p2_category: "autoconhecimento", p2_title: "escrita sem julgamento", p2_desc: "não tem bonito ou feio, certo ou errado e nem forma certa. você para de escrever para ser lida e começa a escrever para se entender (é aí que a escrita vira ferramenta).",
      p3_step: "03", p3_category: "espaço seguro", p3_title: "vulnerabilidade e conexão", p3_desc: "você descobre que se vulnerabilizar, antes de mais nada, é se permitir enregar a própria história de outra maneira. e aqui você faz isso num ambiente seguro, sem obrigação de performar nem de mostrar.",
      p4_step: "04", p4_category: "comunidade ativa", p4_title: "roda contínua no whatsapp", p4_desc: "o grupo onde os textos da terça seguem circulando e onde o exercício do dia é enviado, para quem não conseguiu estar na roda escrever no seu tempo."
    },
    depoimentos: {
      badge_text: "vozes de quem já toma esse café com a gente",
      title: "vozes de quem já toma esse café com a gente",
      subtitle: "mensagens reais de quem escreve com a gente nas terças.",
      selected_ids: "t1,t2,t3,t4,t5,t6,d1,d2,d3,d4,d5"
    },
    final_cta: {
      title: "sua próxima terça pode começar diferente",
      subtitle: "você não precisa esperar a vontade chegar, nem ter assunto, nem saber escrever. precisa só aparecer numa terça, às 8h.",
      price_text: "97 reais · 100% incluso para quem está no ciclo de aprofundamento",
      button_text: "sim, quero minha xícara por R$97/mês"
    },
    faq: {
      title: "perguntas frequentes sobre o café com letras",
      q1: "quando acontecem os encontros?", a1: "toda terça-feira, das 8h às 8h30 da manhã (horário de brasília), ao vivo no zoom.",
      q2: "o café é semanal ou mensal?", a2: "semanal. toda terça temos nosso encontro marcado.",
      q3: "o encontro fica gravado?", a3: "não. o café é ao vivo. é um ritual de presença.",
      q4: "e se eu não puder participar numa terça?", a4: "você não fica de fora: enviamos o exercício do dia no grupo de whatsapp, para você escrever no seu tempo e partilhar com a gente. não existe falta nem cobrança: você vem nas terças que puder.",
      q5: "sou obrigada a ler meu texto em voz alta?", a5: "nunca. a partilha é sempre voluntária (e isso também é escrever junto).",
      q6: "preciso ter experiência com escrita?", a6: "não. aqui é um espaço sem julgamento onde não se corrige texto, se escuta gente. o único pré-requisito é vontade de escrever e estar junto.",
      q7: "preciso escrever à mão?", a7: "gostamos de papel e caneta, mas escreva como for melhor para você. você também tem acesso à nossa plataforma digital e pode escrever por lá (e compartilhar na nossa área de partilha).",
      q8: "quem está no ciclo de aprofundamento paga?", a8: "não. o café com letras está incluído na travessia do ciclo, sem custo adicional.",
      q9: "posso cancelar quando quiser?", a9: "sim. é um passe mensal, sem fidelidade. e você tem garantia incondicional de 7 dias: se não for para você, devolvemos o valor integral.",
      q10: "preciso levar algum material?", a10: "só caderno, caneta e um café. o resto deixa com a gente."
    }
  },
  programa_ciclo: {
    hero: {
      badge_text: "travessia de 3 meses · turma aberta · vagas limitadas",
      title: "ciclo de aprofundamento",
      subtitle_gesto: "para quem quer ir mais fundo",
      subtitle: "três meses de escrita acompanhada para atravessar, em comunidade, um tema que você vem evitando sozinha.",
      body_intro: "tem perguntas que não cabem num fim de semana de curso. elas pedem tempo, companhia e um lugar seguro para serem escritas. o ciclo de aprofundamento é esse lugar: a cada três meses escolhemos um tema de autodesenvolvimento, criatividade e relações humanas, um livro que sustenta a conversa e um convidado especial para atravessar com a gente. no meio do caminho, sua escrita deixa de ser exercício e vira decisão.",
      button_text: "quero atravessar: R$597 no pix",
      box_badge: "investimento na travessia completa (3 meses)",
      price_text: "R$ 597,00",
      price_subtext: "no pix",
      price_installments: "ou 3x R$ 225,67 sem juros no cartão",
      image_url: "/brand-assets/gallery/events/13062026-IMG_6581-2.jpg"
    },
    como_funciona: {
      badge_text: "como funciona",
      title: "uma travessia de 3 meses, num movimento contínuo",
      p1: "o ciclo funciona em travessias. cada travessia dura três meses e gira em torno de um único tema, escolhido porque incomoda e porque move.",
      p2: "para sustentar esse tema, três coisas acontecem juntas: um livro que serve de terreno comum; três encontros ao vivo, um por mês, conduzidos por bruna e júlia, com um convidado especial que traz outra camada ao assunto; um ritual semanal de escrita, o café com letras, toda terça-feira, para que a prática não dependa de motivação.",
      p3: "quando a travessia termina, uma nova começa: com outro tema, outro livro, outro convidado (e a gente espera sempre ter você dando continuidade com a gente <3)."
    },
    proxima_travessia: {
      badge_text: "inscrições abertas até 1º de outubro",
      title: "a próxima travessia: a coragem de não agradar",
      subtitle_gesto: "três meses para se libertar da opinião dos outros, atravessar suas próprias limitações e se tornar a pessoa que você deseja ser.",
      por_que_box_title: "por que esse tema, agora:",
      por_que_box_desc: "o cargo que você aceitou. a conversa que você não teve. o \"tudo bem\" que saiu da sua boca quando nada estava bem. a gente aprende cedo que ser amada é ser conveniente (e passa anos escrevendo uma história que agrada a todos, menos a quem a escreve). nesta travessia, vamos usar a escrita para encontrar onde exatamente você entregou a caneta para outra pessoa. e para retomá-la. quantas decisões da sua vida foram tomadas para não decepicionar alguém? é essa pergunta que vamos escrever juntas.",
      bloco1_title: "bloco 1: o livro que nos acompanha",
      bloco1_desc1: "\"a coragem de não agradar\", de ichiro kishimi e fumitake koga. um diálogo entre um filósofo e um jovem sobre como a filosofia pode libertar você da opinião dos outros, superar suas limitações e se tornar a pessoa que deseja ser. é um livro que provoca, discorda de você e devolve responsabilidade, exatamente o tipo de leitura que rende escrita.",
      bloco1_desc2: "ele não é lição de casa. é terreno comum: lemos no mesmo ritmo, sublinhamos o que dói e escrevemos a partir dali. cada encontro do mês parte de uma parte específica do livro. a leitura é recomendada, não obrigatória: os encontros são conduzidos para que você acompanhe mesmo sem ter terminado.",
      bloco2_title: "bloco 2: encontros de aprofundamento",
      bloco2_desc: "três encontros ao vivo no zoom, um por mês, sempre numa terça-feira, das 19h às 20h30. cada um fecha um mês de escrita e mergulha em uma das três coragens da travessia.",
      enc1_date: "01 · terça, 27 de outubro · 19h às 20h30",
      enc1_facilitators: "facilitam: bruna riedel e júlia alvim",
      enc1_title: "a coragem de largar a história que me define",
      enc1_desc: "que história sobre mim eu já posso parar de repetir? todo mundo carrega uma versão de si mesma contada tantas vezes que virou identidade. aqui a gente escreve para descobrir onde essa história deixou de ser verdade e passou a ser apenas hábito.",
      enc1_book: "no livro: negar o trauma e sair da comparação.",
      enc2_date: "02 · terça, 24 de novembro · 19h às 20h30",
      enc2_facilitators: "facilitam: bruna riedel e júlia alvim",
      enc2_title: "a coragem de não agradar",
      enc2_desc: "o que é minha responsabilidade e o que não é? o mês em que a travessia aperta. vamos separar, no papel, o que é seu do que você carregou por medo de decepicionar, e escrever as conversas que você nunca teve.",
      enc2_book: "no livro: descartar as tarefas dos outros.",
      enc3_date: "03 · terça, 15 de dezembro · 19h às 20h30",
      enc3_guest: "convidada especial: jout jout",
      enc3_title: "a coragem de pertencer e viver agora",
      enc3_desc: "como posso pertencer sem me diminuir e viver este dia como uma dança? o encontro final recebe jout jout, que fez da própria voz um ofício público, e conhece o preço e a alegria disso. ela chega no fim porque é ponto de chegada, não ponto de partida.",
      enc3_book: "no livro: pertencimento, contribuição e o aqui e agora.",
      bloco3_title: "bloco 3: encontros semanais no café com letras",
      bloco3_desc: "nosso ritual toda terça-feira, das 8h às 8h30. meia hora de escrita coletiva para começar o dia pela sua própria voz, antes de o mundo começar a pedir coisas de você. você vem às que puder: nada é obrigatório, nenhuma é igual à outra.",
      bloco4_title: "bloco 4: troca contínua no grupo de whatsapp",
      bloco4_desc: "todos os dias, no seu ritmo. entre uma terça e outra, a conversa não para. são dois espaços: \"junto e misturado\", a comunidade ampla, e \"cá entre nós\", o grupo exclusivo de quem está na travessia, mais reservado, para uma troca mais próxima."
    },
    pilares: {
      title: "o que faz do ciclo uma jornada transformadora",
      subtitle: "sete apoios desenhados para dar profundidade, constância e companhia ao seu processo de escrita.",
      p1_badge: "01 · ritual semanal", p1_title: "acesso a todos os cafés com letras", p1_desc: "o ritual de terça-feira de escrita coletiva, das 8h às 8h30. toda semana, meia hora só sua antes do dia começar, com gente escrevendo junto.",
      p2_badge: "02 · encontros no zoom", p2_title: "3 encontros ao vivo, um por mês, com bruna, júlia e convidada", p2_desc: "das 19h às 20h30, fechando cada mês: o tema destravado em voz alta, com espaço para a sua história e não só para a teoria.",
      p3_badge: "03 · whatsapp", p3_title: "comunidade no whatsapp", p3_desc: "a troca do dia a dia: o insight que veio no ônibus, o trecho do livro que doeu, o apoio quando trava. dois grupos: \"junto e misturado\" e \"cá entre nós\".",
      p4_badge: "04 · jornada autoguiada", p4_title: "os 21 dias de escrita liberados", p4_desc: "a jornada completa para escrever até virar hábito.",
      p5_badge: "05 · gravações", p5_title: "acervo de materiais gravados", p5_desc: "tudo o que já construímos, disponível no seu tempo.",
      p6_badge: "06 · plataforma", p6_title: "plataforma completa", p6_desc: "diário pessoal, área de partilha, rituais e inspirações de escrita, sempre à mão.",
      p7_badge: "07 · presencial", p7_title: "desconto especial nos encontros presenciais do solta o verbo", p7_desc: "pra quando a gente se encontra fora da tela."
    },
    para_quem_e: {
      title: "o ciclo de aprofundamento é para você?",
      subtitle: "transparência sobre o compromisso com a escrita e a comunidade.",
      sim_badge: "o ciclo é para você se:",
      sim_1: "você já escreve, ou já fez os 21 dias, e sente que precisa de constância, não de mais um curso",
      sim_2: "está num momento de transição e não quer atravessar sozinha",
      sim_3: "quer encarar temas desconfortáveis com apoio e método",
      sim_4: "quer pertencer de verdade, não só consumir conteúdo",
      nao_badge: "o ciclo não é para você se:",
      nao_1: "busca técnica literária, gramática ou preparação para publicar um livro",
      nao_2: "quer conteúdo gravado sem aparecer nem escutar ninguém",
      nao_3: "procura consumo rápido, sem interesse em constância",
      nao_4: "espera que a escrita resolva sem que você escreva"
    },
    depoimentos: {
      badge_text: "partilhas reais",
      title: "partilhas reais",
      subtitle: "relatos e trocas espontâneas vividas na nossa comunidade.",
      selected_ids: "t1,t2,t3,t4,t5,t6,d1,d2,d3,d4,d5,d6,d7,d8"
    },
    objecoes: {
      badge_text: "quebra de objeções",
      title: "respostas para o que te faz hesitar",
      subtitle: "tudo o que você precisa saber para tomar sua decisão com clareza e tranquilidade.",
      o1_q: "não tenho tempo", o1_a: "a roda semanal dura meia hora, das 8h às 8h30, cabe antes do trabalho começar. o único compromisso mais longo é uma noite por mês. quem pode vir toda terça, vem; quem só consegue no fechamento, também atravessa. nada é obrigatório e tudo fica gravado.",
      o2_q: "não sei escrever", o2_a: "aqui ninguém corrige texto. a gente escuta gente. não existe pré-requisito além de vontade.",
      o3_q: "e se eu perder um encontro?", o3_a: "tudo fica gravado no acervo, disponível durante toda a travessia.",
      o4_q: "sou obrigada a ler o que escrevi?", o4_a: "nunca. a partilha é sempre voluntária. tem gente que só escuta nos primeiros encontros, e isso também é atravessar.",
      o5_q: "e se eu não me identificar?", o5_a: "você tem garantia incondicional de 7 dias. entra, participa, sente. se não for para você, devolvemos o valor integral, sem perguntas.",
      o6_q: "e depois dos três meses?", o6_a: "uma nova travessia começa, com outro tema e outro convidado. você escolhe se segue. o ciclo é contínuo, o compromisso é por travessia."
    },
    final_offer: {
      badge_text: "vagas abertas para o novo ciclo",
      title: "pronta para aprofundar sua escrita em comunidade?",
      subtitle: "garanta sua vaga no ciclo de aprofundamento e tenha acesso aos encontros ao vivo, grupos de troca e acervo completo de gravações.",
      box_badge: "investimento no ciclo completo (3 meses)",
      price_text: "R$ 597,00",
      price_subtext: "no PIX (ou 3x R$ 225,67 sem juros)",
      button_text: "sim! quero garantir minha vaga por R$ 597 no PIX"
    },
    faq: {
      title: "perguntas frequentes sobre o ciclo",
      q1: "o que é exatamente o ciclo de aprofundamento?", a1: "é a nossa comunidade paga, organizada em travessias de três meses. cada travessia mergulha em um tema de autodesenvolvimento, criatividade e relações humanas, apoiada por um livro-guia e por um convidado especial. a travessia atual é \"a coragem de não agradar\", com o livro de ichiro kishimi e fumitake koga e a presença da jout jout.",
      q2: "são só três encontros em três meses?", a2: "não. o ciclo é uma rotina semanal: toda terça-feira acontece o café com letras, nossa roda de escrita coletiva, e a conversa segue todos os dias nos grupos de whatsapp. os três encontros ao vivo são os fechamentos de cada mês, onde tudo o que foi escrito se reúne e se aprofunda. ao longo da travessia são cerca de doze terças escrevendo em grupo.",
      q3: "qual é o valor?", a3: "r$597,00 no pix pela travessia completa de 3 meses, ou 3x de r$225,67 sem juros no cartão. inclui todos os cafés com letras, os três encontros ao vivo de fechamento, os dois grupos de whatsapp, os 21 dias de escrita, o acervo completo e acesso a toda plataforma.",
      q4: "quando acontecem os encontros ao vivo?", a4: "os fechamentos de mês são em 27 de outubro, 24 de novembro e 15 de dezembro, sempre numa terça-feira, das 19h às 20h30, no zoom. tudo fica gravado.",
      q5: "e o café com letras, quando é?", a5: "toda terça-feira, das 8h às 8h30. são trinta minutos de escrita coletiva para começar o dia e a semana pela sua própria voz, antes de o mundo começar a pedir coisas.",
      q6: "o ciclo é uma mentoria?", a6: "não. bruna e júlia conduzem as rodas e sustentam o espaço, mas quem escreve a sua história é você. é escrita coletiva, partilha e travessia em comunidade, não aula, não consultoria, não mentoria.",
      q7: "as inscrições fecham em 1º de outubro, mas o primeiro encontro é só em 27. o que acontece nesse intervalo?", a7: "esse tempo é de propósito e ele já é parte da travessia. assim que você entra, recebe acesso imediato à plataforma, aos 21 dias de escrita, ao acervo e aos dois grupos, e participa dos cafés com letras toda terça. é também o período para começar a leitura do livro com calma, para que você chegue no dia 27 já escrevendo, e não começando do zero.",
      q8: "a jout jout participa de todos os encontros?", a8: "a jout jout é a convidada especial do terceiro e último encontro da travessia. os dois primeiros são conduzidos por bruna e júlia, que preparam o terreno para que essa conversa final aconteça com você já tendo escrito bastante sobre o tema.",
      q9: "até quando posso me inscrever?", a9: "as inscrições para esta travessia vão até 1º de outubro. depois dessa data, a turma fecha para preservar a intimidade dos encontros e a próxima oportunidade será na travessia seguinte, em três meses.",
      q10: "preciso ler o livro?", a10: "recomendamos, mas não é obrigatório. os encontros são conduzidos de forma que você acompanhe mesmo sem ter terminado a leitura. o livro aprofunda, não é pré-requisito.",
      q11: "sou obrigada a ler meus textos nos encontros?", a11: "não. a partilha é sempre voluntária e o silêncio também é forma de presença.",
      q12: "como funciona a garantia de 7 dias?", a12: "você tem sete dias a partir da compra para pedir reembolso integral, sem justificativa. basta escrever para soltaoverbocoletivo@gmail.com.",
      q13: "e quando a travessia terminar?", a13: "uma nova começa, com outro tema, livro e convidado. membros ativos têm prioridade de vaga e você decide se continua.",
      q14: "preciso ter experiência com escrita?", a14: "não. o solta o verbo não é sobre técnica acadêmica ou gramática rígida, mas sobre escuta interna, presença e liberdade narrative."
    }
  },
  contrate_experiencia: {
    hero: {
      badge_text: "experiências sob medida & oficinas b2b",
      title: "contrate uma experiência:",
      subtitle_gesto: "momentos que reconectam um grupo com a própria palavra.",
      subtitle: "levamos rituais de escrita consciente, integração humana e expressão autêntica para dentro da sua empresa, do seu evento ou do seu festival.",
      highlight_box_title: "propostas exclusivas sob medida para o seu grupo",
      button_text: "solicitar proposta no whatsapp",
      button_secondary_text: "ver formatos de experiência",
      image_url: "/brand-assets/gallery/events/13062026-IMG_6581-2.jpg",
      quote_text: "“transformar a rotina de uma equipe começa quando abrimos espaço para a escuta genuína.”"
    },
    pra_quem_e: {
      badge_text: "públicos & formatos",
      title: "pra quem é isso",
      subtitle: "se você cuida de pessoas dentro de uma empresa, organiza um evento que quer sair do lugar comum, ou representa uma marca que busca se aproximar do público de um jeito mais humano, a solta o verbo tem uma experiência pensada pra você.",
      c1_title: "empresas & rh",
      c1_desc: "times de rh e people que querem cuidar de verdade da equipe",
      c2_title: "eventos & retiros",
      c2_desc: "produtoras de eventos, retiros e festivais que buscam rituais de presença",
      c3_title: "marcas & ativações",
      c3_desc: "marcas que querem ativações com significado, não só brinde",
      c4_title: "coletivos",
      c4_desc: "coletivos e comunidades que precisam de um espaço pra se escutar"
    },
    por_que_escrita: {
      badge_text: "fundamentação & metodologia",
      title: "por que escrita",
      body_text: "não é só uma dinâmica bonitinha. nosso trabalho parte de referências consistentes, como as pesquisas de james pennebaker sobre escrita expressiva e seus efeitos no bem estar emocional, e a curva do esquecimento de ebbinghaus, que reforça a importância da prática recorrente, não só de um encontro isolado. cada experiência também é desenhada com a metodologia design de conexões, criada pra gerar pertencimento real entre as pessoas de um grupo, não só preencher uma tarde de agenda."
    },
    galeria: {
      badge_text: "galeria de experiências presenciais",
      title: "registros dos nossos encontros e oficinas",
      subtitle: "momentos de partilha, cadernos abertos e rituais de presença em retiros, empresas e festivais pelo brasil.",
      p1_title: "oficinas corporativas & integração",
      p1_sub: "vivências de escrita guiada para desacelerar equipes",
      p1_img: "/brand-assets/gallery/events/13062026-IMG_6581-2.jpg",
      p2_title: "rodas de partilha em retiros",
      p2_sub: "curadoria de ambiente e escuta sem julgamento",
      p2_img: "/brand-assets/gallery/events/13062026-IMG_5364-2.jpg",
      p3_title: "experiências para marcas & eventos",
      p3_sub: "ativações poéticas sob medida com cadernos afetivos",
      p3_img: "/brand-assets/gallery/events/13062026-IMG_6666-2.jpg",
      p4_title: "imersões presenciais & festivais",
      p4_sub: "espaço seguro para acolher histórias humanas",
      p4_img: "/brand-assets/gallery/events/_MG_0015.jpg",
      p5_title: "dinâmicas de escuta ativa",
      p5_sub: "transformando a rotina de trabalho em presença",
      p5_img: "/brand-assets/gallery/events/_MG_9849.jpg",
      p6_title: "rituais de abertura & encerramento",
      p6_sub: "reescrevendo narrativas em comunidade",
      p6_img: "/brand-assets/gallery/events/_MG_9991.jpg"
    },
    fundamentacao_boxes: {
      box1_title: "pra quem é isso?",
      box1_bullet1: "empresas & líderes: que buscam promover saúde mental, humanização, escuta ativa e integração genuína de equipes.",
      box1_bullet2: "retiros & imersões: facilitadores de autoconhecimento que desejam incluir rodas de partilha e rituais poéticos de escrita.",
      box1_bullet3: "festivais & eventos culturais: momentos de desaceleração e presença em meio a programações intensas.",
      box1_bullet4: "marcas & comemorações: ativações poéticas com cadernos afetivos e momentos memoráveis.",
      box2_title: "por que a escrita?",
      box2_bullet1: "desaceleração consciente: uma pausa no piloto automático e nas telas para respirar e sentir.",
      box2_bullet2: "segurança psicológica: criar um ambiente onde todos se sentem acolhidos para se expressar sem julgamento.",
      box2_bullet3: "escuta ativa: ouvir o outro com presença genuína, fortalecendo a empatia do grupo.",
      box2_bullet4: "expressão autêntica: colocar no papel sentimentos que muitas vezes não encontram espaço na fala cotidiana.",
      pennebaker_title: "nosso trabalho nasce de estudo e de vivência",
      pennebaker_desc: "não improvisamos. cada encontro que desenhamos parte de referências consistentes, como as pesquisas de james pennebaker sobre escrita expressiva e seus efeitos no bem-estar emocional, e a curva do esquecimento de ebbinghaus, que mostra por que a escrita precisa ser prática sustentada e não um evento isolado.",
      pennebaker_highlight: "é por isso que não entregamos só uma oficina bonita: desenhamos jornadas que continuam vivas depois que a gente vai embora."
    },
    formatos: {
      badge_text: "formatos sob medida",
      title: "como levamos a experiência até você",
      subtitle: "quatro caminhos autorais adaptados para o formato e objetivo da sua iniciativa.",
      f1_title: "oficinas corporativas & integração",
      f1_desc: "vivências práticas para empresas que buscam fortalecer a empatia, desacelerar a rotina de trabalho e cultivar um clima de confiança através da escrita consciente.",
      f2_title: "retiros, festivais & coletivos",
      f2_desc: "rituais de abertura e encerramento, rodas de partilha e cadernos de bordo, pensados pra festivais, retiros e encontros que já nascem com escuta no centro.",
      f3_title: "ativações de marca & festas",
      f3_desc: "curadoria de ambientes afetivos, escrita poética personalizada ao vivo e brindes gráficos memoráveis para marcas e celebrações especiais.",
      f4_title: "escrita para quem está aprendendo",
      f4_desc: "atividades de escrita criativa para crianças, jovens e educadores, desenvolvendo imaginação, autoria e escuta desde cedo.",
      sob_medida_title: "textos autorais para momentos especiais",
      sob_medida_desc: "escrevemos textos poéticos sob medida para casamentos, homenagens, celebrações de vida e marcos institucionais de empresas: ouvimos a sua história e a devolvemos em palavras inesquecíveis.",
      sob_medida_button: "encomendar um texto"
    },
    passo_a_passo: {
      badge_text: "passo a passo da contratação",
      title: "como construímos a experiência juntos",
      subtitle: "quatro etapas simples para criar uma vivência perfeita para o seu grupo.",
      e1_step: "01", e1_title: "diagnóstico & alinhamento", e1_sub: "escutar para entender sua intenção", e1_desc: "conversamos com você para compreender o propósito do evento, perfil dos participantes e o impacto desejado para a experiência.",
      e2_step: "02", e2_title: "curadoria & roteiro autoral", e2_sub: "experiência 100% sob medida", e2_desc: "desenhamos propostas de escrita exclusivas, seleção de músicas, dinâmicas de acolhimento e cadernos de apoio personalizados.",
      e3_step: "03", e3_title: "facilitação & condução viva", e3_sub: "presença afetuosa de bruna e júlia", e3_desc: "conduzimos a vivência com leveza, sensibilidade e profissionalismo, criando uma atmosfera onde todos se sentem seguros para participar.",
      e4_step: "04", e4_title: "desdobramentos & memórias", e4_sub: "lembrança duradoura para o grupo", e4_desc: "entrega de cadernos poéticos e síntese da experiência para que os aprendizados permaneçam vivos após o encontro."
    },
    depoimentos: {
      badge_text: "relatos & impressões reais",
      title: "vozes e vivências da comunidade",
      subtitle: "depoimentos reais de quem já participou das nossas oficinas e encontros.",
      selected_ids: "t1,t2,t3,t4,t5,t6,d1,d2,d3,d4,d5,d6,d7,d8"
    },
    final_cta: {
      badge_text: "vamos desenhar uma experiência juntos?",
      title: "vamos desenhar uma experiência juntos?",
      subtitle: "fale diretamente conosco pelo whatsapp e receba uma proposta personalizada para a sua empresa, evento ou retiro.",
      button_text: "solicitar proposta no whatsapp"
    },
    faq: {
      title: "perguntas frequentes sobre contratação b2b",
      q1: "as experiências podem ser presenciais ou virtuais?", a1: "sim, os dois formatos. presencial, a gente leva todo o ritual pra dentro do seu espaço. online, adaptamos a vivência sem perder a profundidade do encontro.",
      q2: "qual é o número mínimo ou máximo de participantes?", a2: "não trabalhamos com número fixo. pra formatos mais íntimos, como oficinas corporativas, o grupo costuma ser pequeno. já em festivais e instalações, a experiência é fixa no espaço, e pode receber quantas pessoas quiserem participar. o número ideal depende do formato e do lugar, e isso a gente alinha junto com você.",
      q3: "quanto custa contratar uma experiência?", a3: "o investimento varia de acordo com o formato, a duração e o tamanho do grupo. por isso cada proposta é personalizada, fale com a gente pelo whatsapp e te passamos os valores certinhos pro seu caso.",
      q4: "com quanto tempo de antecedência preciso contratar?", a4: "o ideal é fechar com pelo menos 1 mês de antecedência, pra gente ter tempo de fazer o diagnóstico, desenhar o roteiro autoral e alinhar tudo com calma antes do dia.",
      q5: "quem conduz a experiência?", a5: "bruna e júlia, as criadoras da solta o verbo, conduzem pessoalmente cada experiência. nada é terceirizado, quem desenha o roteiro é quem está com o grupo no dia.",
      q6: "e se o meu time não tem afinidade com escrita? isso funciona mesmo assim?", a6: "funciona, e costuma ser exatamente com esses grupos que a experiência mais surpreende. não pedimos talento, só presença. a escrita aqui é ferramenta, não performance.",
      q7: "como faço para solicitar uma proposta personalizada?", a7: "basta clicar nos botões de whatsapp desta página pra conversar direto com bruna e júlia. respondemos rápido com todas as informações necessárias."
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
