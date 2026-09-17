export interface Lesson21Dias {
  day: number;
  title: string;
  opening: string;
  exercise: string;
  week: 1 | 2 | 3;
}

export interface Week21DiasInfo {
  weekNumber: 1 | 2 | 3;
  title: string;
  description: string;
  daysRange: string;
}

export const WEEKS_21_DIAS: Week21DiasInfo[] = [
  {
    weekNumber: 1,
    title: 'semana 1: olhar para dentro (dias 1 a 7)',
    description: 'antes de qualquer outra coisa, existe você. esta semana é um convite para parar, respirar e voltar para dentro.',
    daysRange: 'dias 1 a 7',
  },
  {
    weekNumber: 2,
    title: 'semana 2: olhar para fora (dias 8 a 14)',
    description: 'o mundo ao nosso redor está cheio de espelhos. esta semana amplia o olhar: de dentro para fora.',
    daysRange: 'dias 8 a 14',
  },
  {
    weekNumber: 3,
    title: 'semana 3: olhar para o entre (dias 15 a 21)',
    description: 'duas semanas de olhar, pra dentro e pra fora. agora é hora de tecer: integrar o que ficou dentro com o que você percebeu fora.',
    daysRange: 'dias 15 a 21',
  },
];

export const LESSONS_21_DIAS_DATA: Lesson21Dias[] = [
  {
    day: 1,
    week: 1,
    title: 'o começo de tudo.',
    opening: 'começar algo novo pede coragem. hoje é o primeiro dia desta jornada de escrita, e antes de qualquer coisa, queremos te convidar a marcar este momento: declarar o que você está trazendo para esses 21 dias e o que deseja encontrar ao final. escreva como se estivesse enviando uma mensagem para o seu "eu" do futuro.',
    exercise: 'escreva uma carta para a pessoa que você será ao terminar este caderninho. fale sobre onde você está agora, como está se sentindo, o que está pesando, o que está florescendo dentro de você. declare seus desejos e intenções para essa jornada.',
  },
  {
    day: 2,
    week: 1,
    title: 'o rio das palavras.',
    opening: 'existem coisas dentro de nós que só encontram forma quando colocamos a caneta no papel e simplesmente deixamos, sem a necessidade de fazer sentido. a escrita livre é uma das práticas mais antigas e libertadoras que existem.',
    exercise: 'escreva livremente por pelo menos 10 minutos. não pare para corrigir e não releia enquanto escreve. se travar, escreva "não sei o que escrever" até outra coisa aparecer, e ela vai aparecer.',
  },
  {
    day: 3,
    week: 1,
    title: 'quando alguém te viu.',
    opening: 'há momentos que ficam gravados na nossa memória principalmente pela forma como nos fizeram sentir. momentos em que alguém olhou para nós, de verdade, e nos sentimos vistos.',
    exercise: 'feche os olhos, respire fundo. pense: quando foi a última vez, ou uma vez marcante, em que você se sentiu verdadeiramente visto? onde estava, quem estava com você, o que aconteceu. abra os olhos e escreva trazendo todos os sentidos.',
  },
  {
    day: 4,
    week: 1,
    title: 'as marcas que ficaram.',
    opening: 'o nosso corpo é um arquivo vivo. cada marca que ele carrega tem uma história.',
    exercise: 'escolha uma marca física do seu corpo, uma cicatriz, uma pinta, um traço. toque esse lugar e observe. escreva: de onde vem essa marca? qual é a história que ela guarda? se ela pudesse falar, o que diria?',
  },
  {
    day: 5,
    week: 1,
    title: 'a arte de soltar.',
    opening: 'algumas coisas já cumpriram seu ciclo na nossa vida: hábitos, crenças, relações, versões de nós mesmos. mesmo sabendo, existe uma parte nossa que insiste em segurar.',
    exercise: 'o que você quer liberar? escreva como quem escreve uma carta de despedida: reconheça o que aquilo te trouxe, agradeça pelo que foi, e ao final, dê sua permissão para ir.',
  },
  {
    day: 6,
    week: 1,
    title: 'a carta que você merece receber.',
    opening: 'somos muito mais duros conosco do que seríamos com qualquer pessoa que amamos. mas o perdão começa em nós.',
    exercise: 'escolha algo que você ainda não conseguiu se perdoar. escreva uma carta de perdão para você mesmo, reconhecendo o que aconteceu e oferecendo a si a chance de começar de novo, com a mesma compaixão que teria por uma pessoa amada.',
  },
  {
    day: 7,
    week: 1,
    title: 'a criança que ainda mora em você.',
    opening: 'dentro de cada um de nós existe uma criança que ainda está lá, guardando os primeiros sonhos, medos e alegrias.',
    exercise: 'imagine a criança que você foi. escreva para ela perguntando como está, o que sente, o que precisa. depois troque a caneta para a mão que você não usa normalmente e deixe a criança responder, sem corrigir e sem julgar.',
  },
  {
    day: 8,
    week: 2,
    title: 'o universo do estranho.',
    opening: 'cada pessoa nesse mundo tem uma vida inteira dentro de si. existe uma palavra pra esse sentimento: "sonder", a sensação de perceber que cada pessoa tem uma vida tão complexa quanto a nossa.',
    exercise: 'vá a um lugar público (praça, café, ponto de ônibus, ou olhe pela janela). observe uma pessoa desconhecida em detalhes. depois escreva o universo interno dela: o que pensa agora, o que sente, qual foi o maior amor da vida dela.',
  },
  {
    day: 9,
    week: 2,
    title: 'o peso leve de um gesto.',
    opening: 'às vezes um gesto pequeno tem o poder de mudar o dia inteiro de uma pessoa.',
    exercise: 'pense num gesto simples que te impactou recentemente, seja algo que fizeram por você, que você viu acontecer, ou que você fez por alguém. descreva o gesto em detalhes e como você se sentiu.',
  },
  {
    day: 10,
    week: 2,
    title: 'o ambiente que te habita.',
    opening: 'os ambientes onde vivemos não são neutros: guardam memórias, refletem escolhas e fases da vida.',
    exercise: 'observe o ambiente onde você está agora como se fosse a primeira vez. descreva em detalhes: mesa, luz, sons, cheiro, cores. depois pergunte: como esse ambiente espelha o que você sente agora?',
  },
  {
    day: 11,
    week: 2,
    title: 'poesia do banal.',
    opening: '"as coisas não querem ser vistas por pessoas razoáveis: elas desejam ser olhadas de azul, que nem uma criança que você olha de ave." (manoel de barros). a poesia mora no vapor do café, na luz que muda de cor às seis da tarde.',
    exercise: 'escolha um momento banal do seu dia (acordar, lavar o rosto, esperar o elevador) e escreva sobre ele como se fosse o mais importante do seu dia, porque talvez seja mesmo.',
  },
  {
    day: 12,
    week: 2,
    title: 'quando o cotidiano vira ritual.',
    opening: 'existe uma grande diferença entre fazer algo de forma automática e fazer algo com presença.',
    exercise: 'escolha uma ação do seu cotidiano que você faz quase sem pensar. antes de realizá-la hoje, pause, respire, defina uma intenção. faça com total presença e depois escreva: o que mudou quando você trouxe atenção?',
  },
  {
    day: 13,
    week: 2,
    title: 'que mar habita em você.',
    opening: 'o mar é uma metáfora que nunca envelhece: contém calmaria e tempestade, superfície e profundeza. assim como nós.',
    exercise: 'escreva sobre o mar que reflete suas emoções de hoje. é calmo? de ondas altas? de tempestade se aproximando? descreva com riqueza de detalhes e, se quiser ir mais fundo, mergulhe: o que há nas profundezas desse mar que ainda não chegou à superfície?',
  },
  {
    day: 14,
    week: 2,
    title: 'ver pela primeira vez.',
    opening: 'existe algo mágico em olhar pra o que sempre esteve ali e, de repente, realmente enxergar.',
    exercise: 'escolha um detalhe pequeno da sua rotina (cheiro, cor, luz, som, textura) e olhe para ele como se fosse a primeira vez. descreva com toda a atenção: o que você percebe? o que há de bonito ou surpreendente nele?',
  },
  {
    day: 15,
    week: 3,
    title: 'o sonho que não morreu.',
    opening: 'todo mundo tem um sonho guardado num cantinho secreto da alma, silenciado quando a vida adulta chegou ou o medo falou mais alto.',
    exercise: 'feche os olhos e vá em busca desse sonho antigo. escreva: qual é esse sonho? de onde veio? o que aconteceu com ele ao longo do tempo? o que seria necessário pra que voltasse a brilhar?',
  },
  {
    day: 16,
    week: 3,
    title: 'o farol que você carrega.',
    opening: 'existem memórias que têm o poder de nos devolver a nós mesmos quando estamos perdidos. essas memórias são faróis.',
    exercise: 'pense numa memória que te fortalece, um momento em que você se sentiu completamente você. descreva com riqueza de detalhes: o que aconteceu, como se sentiu, o que ela diz sobre o que importa pra você.',
  },
  {
    day: 17,
    week: 3,
    title: 'a palavra que você quer cultivar.',
    opening: 'uma única palavra pode conter um mundo. às vezes o que precisamos pra orientar um ciclo não é uma lista de metas, mas uma palavra viva cheia de significado pessoal.',
    exercise: 'escolha uma palavra que você quer cultivar nos próximos meses. escreva sobre ela: o que significa pra você? em que momento da vida ela chega? o que você deseja semear com ela?',
  },
  {
    day: 18,
    week: 3,
    title: 'a força que se esconde no medo.',
    opening: '"se quisermos estar livres do perfeccionismo, precisamos fazer a longa travessia do \'o que as pessoas vão pensar\' para o \'eu sou o bastante\'." (brené brown, a coragem de ser imperfeito). a vulnerabilidade nos assusta porque toca no que há de mais real em nós.',
    exercise: 'escreva sobre a vulnerabilidade. qual é o medo por trás dela? quais histórias ou mensagens ao longo da vida ajudaram a construir esse medo? como seria se você se permitisse ser o mais autêntico possível?',
  },
  {
    day: 19,
    week: 3,
    title: 'o próximo capítulo.',
    opening: 'cada fase da vida é uma oportunidade de escrever um novo capítulo. o próximo capítulo da sua história ainda não foi escrito, e você tem a caneta na mão.',
    exercise: 'se a sua vida fosse um livro, como se chamaria o capítulo em que você está agora? escreva o primeiro parágrafo desse próximo capítulo, com permissão para sonhar grande.',
  },
  {
    day: 20,
    week: 3,
    title: 'um brinde aos recomeços!',
    opening: 'recomeços têm sabor próprio: uma pitada de medo do desconhecido e uma xícara de excitação de algo novo. dentro de cada recomeço nasce um novo "eu", mais corajoso e inteiro.',
    exercise: 'pense num recomeço marcante da sua vida, um momento em que tudo mudou e você precisou se reinventar. reflita sobre o que nasceu ali. depois traga atenção pro presente: há um novo "eu" pedindo espaço pra nascer? escreva para te encorajar.',
  },
  {
    day: 21,
    week: 3,
    title: 'a bagagem.',
    opening: 'chegamos no último dia. foi intenso, né? no meio do caminho você soltou bastante coisa, e soltar abre espaço. agora é hora de escolher o que você quer levar daqui pra frente.',
    exercise: 'olhe pros 21 dias que você acabou de viver e escolha o que quer levar com você: uma descoberta, uma frase que você mesma escreveu, uma sensação marcante, uma intenção, uma promessa. faça uma lista ou escreva um texto, do seu jeito, e termine respondendo para onde essa bagagem está te levando.',
  },
];

export const CARTA_DE_ENCERRAMENTO = {
  title: 'carta de encerramento',
  subtitle: 'você chegou!',
  paragraphs: [
    'você chegou!',
    'não sabemos quantos dias você levou para chegar aqui, se foram 21 dias seguidos, se foram dois meses, se você pulou algumas páginas e voltou. isso não importa. o que importa é que você está aqui, com um caderninho cheio de você, depois de um longo mergulho.',
    'na solta o verbo, nós acreditamos na escrita como ferramenta para o autoconhecimento, e se você se sente mais conectado com você depois desses exercícios, já cumprimos com o nosso objetivo. e esse pode ser só o começo, se você quiser.',
    'a escrita pode continuar sendo o seu lugar. não precisa ser todos os dias, e muito menos precisa parecer bonita para alguém. só precisa ser. e tem uma coisa que a gente precisa confessar: ela pode ser altamente viciante!',
    'sempre que precisar, volte aos exercícios e leia o que escreveu. sua escrita é uma bússola que pode te guiar para o encontro mais bonito que existe: o encontro com você mesmo.',
    'este caderninho foi feito com amor e com muita verdade. obrigada por soltar o verbo.',
    'com muito amor, bru e ju.',
  ],
};
