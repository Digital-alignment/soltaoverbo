import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qtdruienammtqodgfqty.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF0ZHJ1aWVuYW1tdHFvZGdmcXR5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Mzc1MjYzNSwiZXhwIjoyMDc5MzI4NjM1fQ.dhRdq0jJLwq5pBl9K-Fkgh3WmEQwPwPSo_6Zzayl_8M';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const COURSE_ID = 'e9b442b1-2043-4985-80ae-6265ddeb047b';
const YOUTUBE_URL = 'https://www.youtube.com/watch?v=VCxVxCtLhKk&list=RD7bzB64ADgbA&index=12';
const AUDIO_SAMPLE = 'https://actions.google.com/sounds/v1/ambiences/rain_heavy.ogg';

const lessonsData = [
  {
    order_index: 0,
    title: 'dia 00: sintonizar a intenção',
    tags: ['ground zero', 'introdução', 'sintonizar'],
    audio_url: AUDIO_SAMPLE,
    recording_url: YOUTUBE_URL,
    description: `
      <div class="space-y-4">
        <img src="/brand-assets/elements/collages/writes-torn-out-sheets-paper-trendy-vintage-style-mixed-media-art.png" alt="dia 00" class="w-full h-56 sm:h-72 object-cover rounded-2xl border border-papelKraft/40 shadow-sm mb-4" />
        <p class="font-bold text-acentoAzul">bem-vinda ao ground zero dos 21 dias de escrita!</p>
        <p>por que 21 dias? 21 dias é o tempo mínimo para sintonizar a mente, transformar a intenção em gesto e criar um novo hábito sem cobrança. este espaço foi criado para desatar os nós do perfeccionismo e soltar a escrita como escuta interna e externa.</p>
        <div class="bg-white/80 p-4 rounded-2xl border border-papelKraft/35 space-y-2 text-sm">
          <p class="font-bold text-acentoTerracota">as 8 regras de ouro do desafio:</p>
          <ul class="list-disc list-inside space-y-1 text-tintaCarvao/80 font-corpo">
            <li>escreva à mão, com lápis ou caneta em um caderno exclusivo.</li>
            <li>sintonize-se com a meditação e o áudio do dia antes de escrever.</li>
            <li>reserve pelo menos 10 minutos diários de presença.</li>
            <li>sem julgamento ou busca pela frase perfeita — o objetivo é descarregar o barulho mental.</li>
          </ul>
        </div>
        <p class="italic text-acentoAzul font-editorial text-lg text-center pt-2">"a partir de hoje, constantemente atraio abundância e presença com meus pensamentos."</p>
      </div>
    `,
    material_title: 'guia_de_boas_vindas_21_dias.pdf',
    audio_title: 'áudio zero — por que 21 dias & intenção (júlia alvim)'
  },
  {
    order_index: 1,
    title: 'dia 01: carta para o futuro',
    tags: ['semana 1', 'passado', 'futuro'],
    audio_url: AUDIO_SAMPLE,
    recording_url: YOUTUBE_URL,
    description: `
      <div class="space-y-4">
        <img src="/brand-assets/elements/collages/png-person-reading-book-flower-sitting-person.png" alt="dia 01" class="w-full h-56 sm:h-72 object-cover rounded-2xl border border-papelKraft/40 shadow-sm mb-4" />
        <p class="font-bold text-acentoAzul">semana 1 — olhar para dentro (escrita como espelho - passado)</p>
        <p>hoje olhamos para dentro. escrever não é buscar a palavra perfeita, mas ouvir. cada exercício desta semana convida você a desacelerar e escutar sua verdade através do sentir.</p>
        <p><strong>convite do dia:</strong> escreva uma carta para quem você será daqui a 21 dias, declarando seus desejos e intenções para este ciclo.</p>
        <div class="bg-white/80 p-4 rounded-2xl border border-papelKraft/35 space-y-1">
          <p class="text-sm text-acentoTerracota font-bold">áudio de apoio:</p>
          <p class="text-xs text-tintaCarvao/80">"imagine o poder de definir seu próprio norte. que energia você quer cultivar nesse ciclo?"</p>
          <p class="mt-2 text-xs text-acentoAzul font-medium">ferramenta sugerida: <a href="https://www.futureme.org/letters/new" target="_blank" rel="noopener noreferrer" class="underline">FutureMe — Write a Letter to the Future</a></p>
        </div>
      </div>
    `,
    material_title: 'template_carta_para_o_futuro.pdf',
    audio_title: 'áudio 01 — o norte das intenções'
  },
  {
    order_index: 2,
    title: 'dia 02: escrita livre',
    tags: ['semana 1', 'espontâneo', 'descarte'],
    audio_url: AUDIO_SAMPLE,
    recording_url: YOUTUBE_URL,
    description: `
      <div class="space-y-4">
        <img src="/brand-assets/elements/collages/trendy-hand-holding-pencil-abstract-cutout-hand-halftone-collage-element-design-montage.png" alt="dia 02" class="w-full h-56 sm:h-72 object-cover rounded-2xl border border-papelKraft/40 shadow-sm mb-4" />
        <p class="font-bold text-acentoAzul">deixe as palavras escorrerem sem filtro</p>
        <p>ajuste o cronômetro para 10 minutos. coloque a caneta no papel e não a levante até o alarme tocar. se faltar assunto, escreva "não sei o que escrever" até que a próxima frase venha.</p>
        <div class="bg-white/80 p-4 rounded-2xl border border-papelKraft/35">
          <p class="text-sm text-acentoTerracota font-bold">áudio de apoio:</p>
          <p class="text-xs text-tintaCarvao/80">"abrir espaço para o espontâneo é confiar no mistério do processo — só escreva."</p>
        </div>
      </div>
    `,
    material_title: 'guia_escrita_livre_10min.pdf',
    audio_title: 'áudio 02 — a confiança no espontâneo'
  },
  {
    order_index: 3,
    title: 'dia 03: a lembrança de ser vista',
    tags: ['semana 1', 'afetos', 'reconhecimento'],
    audio_url: AUDIO_SAMPLE,
    recording_url: YOUTUBE_URL,
    description: `
      <div class="space-y-4">
        <img src="/brand-assets/elements/collages/butterfly-collage-woman-art.png" alt="dia 03" class="w-full h-56 sm:h-72 object-cover rounded-2xl border border-papelKraft/40 shadow-sm mb-4" />
        <p class="font-bold text-acentoAzul">reviva um momento em que foi verdadeiramente vista</p>
        <p>lembre-se de alguém que olhou para você sem julgamento e enxergou sua essência. o que essa pessoa disse? como seu corpo se sentiu acolhido?</p>
        <div class="bg-white/80 p-4 rounded-2xl border border-papelKraft/35">
          <p class="text-sm text-acentoTerracota font-bold">áudio de apoio:</p>
          <p class="text-xs text-tintaCarvao/80">"reconhecimento traz sentido à existência. busque nos seus afetos essa lembrança primordial."</p>
        </div>
      </div>
    `,
    material_title: 'exercicio_afetos_e_memoria.pdf',
    audio_title: 'áudio 03 — o olhar que acolhe'
  },
  {
    order_index: 4,
    title: 'dia 04: corpo memória',
    tags: ['semana 1', 'corpo', 'cicatriz'],
    audio_url: AUDIO_SAMPLE,
    recording_url: YOUTUBE_URL,
    description: `
      <div class="space-y-4">
        <img src="/brand-assets/deployments/IMG_8065.PNG" alt="dia 04" class="w-full h-56 sm:h-72 object-cover rounded-2xl border border-papelKraft/40 shadow-sm mb-4" />
        <p class="font-bold text-acentoAzul">narre a história de uma marca física sua</p>
        <p>uma cicatriz no joelho, uma marca de nascença, uma linha na palma da mão. o corpo é um arquivo vivo de histórias e encontros.</p>
        <div class="bg-white/80 p-4 rounded-2xl border border-papelKraft/35">
          <p class="text-sm text-acentoTerracota font-bold">áudio de apoio:</p>
          <p class="text-xs text-tintaCarvao/80">"seu corpo guarda rastros da sua jornada. que história essa marca revela sobre você?"</p>
        </div>
      </div>
    `,
    material_title: 'mapa_corporal_de_memorias.pdf',
    audio_title: 'áudio 04 — a sabedoria do corpo'
  },
  {
    order_index: 5,
    title: 'dia 05: soltar o que pesa',
    tags: ['semana 1', 'desapego', 'libertação'],
    audio_url: AUDIO_SAMPLE,
    recording_url: YOUTUBE_URL,
    description: `
      <div class="space-y-4">
        <img src="/brand-assets/elements/collages/creative-vintage-collage-design.png" alt="dia 05" class="w-full h-56 sm:h-72 object-cover rounded-2xl border border-papelKraft/40 shadow-sm mb-4" />
        <p class="font-bold text-acentoAzul">o que quer liberar e deixar partir?</p>
        <p>identifique uma cobrança antiga, uma expectativa alheia ou um hábito que já não serve ao seu presente. coloque no papel e declare sua soltura.</p>
        <div class="bg-white/80 p-4 rounded-2xl border border-papelKraft/35">
          <p class="text-sm text-acentoTerracota font-bold">áudio de apoio:</p>
          <p class="text-xs text-tintaCarvao/80">"abrir mão do que pesa é um ato de coragem. qual espaço você cria ao se permitir soltar?"</p>
        </div>
      </div>
    `,
    material_title: 'ritual_de_desapego_escrito.pdf',
    audio_title: 'áudio 05 — o ato de desapegar'
  },
  {
    order_index: 6,
    title: 'dia 06: o perdão próprio',
    tags: ['semana 1', 'autocompaixão', 'perdão'],
    audio_url: AUDIO_SAMPLE,
    recording_url: YOUTUBE_URL,
    description: `
      <div class="space-y-4">
        <img src="/brand-assets/elements/collages/dictatorship-concept-with-keyhole.png" alt="dia 06" class="w-full h-56 sm:h-72 object-cover rounded-2xl border border-papelKraft/40 shadow-sm mb-4" />
        <p class="font-bold text-acentoAzul">ofereça a si mesma o perdão que ainda não veio</p>
        <p>escreva uma declaração de reconciliação com os erros do passado. acolha a versão de você que fez o melhor que podia com a consciência da época.</p>
        <div class="bg-white/80 p-4 rounded-2xl border border-papelKraft/35">
          <p class="text-sm text-acentoTerracota font-bold">áudio de apoio:</p>
          <p class="text-xs text-tintaCarvao/80">"o perdão próprio é liberdade pura. sinta o alívio de se conceder essa dádiva."</p>
        </div>
      </div>
    `,
    material_title: 'pratica_de_autocompaixao.pdf',
    audio_title: 'áudio 06 — a reconciliação íntima'
  },
  {
    order_index: 7,
    title: 'dia 07: a criança interna',
    tags: ['semana 1', 'infância', 'diálogo'],
    audio_url: AUDIO_SAMPLE,
    recording_url: YOUTUBE_URL,
    description: `
      <div class="space-y-4">
        <img src="/brand-assets/elements/collages/collage-retro-dreamy-book-astronomy-publication-reading.png" alt="dia 07" class="w-full h-56 sm:h-72 object-cover rounded-2xl border border-papelKraft/40 shadow-sm mb-4" />
        <p class="font-bold text-acentoAzul">carta diálogo com a mão não dominante</p>
        <p>com a mão dominante, faça uma pergunta sincera à criança que vive em você. em seguida, pegue a caneta com a outra mão (mão não dominante) e deixe a resposta surgir livremente.</p>
        <div class="bg-white/80 p-4 rounded-2xl border border-papelKraft/35">
          <p class="text-sm text-acentoTerracota font-bold">áudio de apoio:</p>
          <p class="text-xs text-tintaCarvao/80">"brincar é fazer contato profundo com sua essência. que respostas surgem nesse gesto curioso?"</p>
        </div>
      </div>
    `,
    material_title: 'dialogo_mao_nao_dominante.pdf',
    audio_title: 'áudio 07 — o resgate do brincar'
  },
  {
    order_index: 8,
    title: 'dia 08: o olhar curioso',
    tags: ['semana 2', 'presente', 'observação'],
    audio_url: AUDIO_SAMPLE,
    recording_url: YOUTUBE_URL,
    description: `
      <div class="space-y-4">
        <img src="/brand-assets/deployments/IMG_8067.PNG" alt="dia 08" class="w-full h-56 sm:h-72 object-cover rounded-2xl border border-papelKraft/40 shadow-sm mb-4" />
        <p class="font-bold text-acentoAzul">semana 2 — olhar para fora (escrita como janela - presente)</p>
        <p>agora expandimos o olhar. observar é meditar. escrevendo, aprendemos que o mundo externo espelha nosso interior.</p>
        <p><strong>convite do dia:</strong> observe alguém desconhecido na rua, no café ou no transporte, e invente poeticamente o seu universo interno.</p>
        <div class="bg-white/80 p-4 rounded-2xl border border-papelKraft/35">
          <p class="text-sm text-acentoTerracota font-bold">áudio de apoio:</p>
          <p class="text-xs text-tintaCarvao/80">"cada pessoa é um mundo vasto. que vida pulsa nos passos de quem cruza seu caminho?"</p>
        </div>
      </div>
    `,
    material_title: 'exercicio_observacao_criativa.pdf',
    audio_title: 'áudio 08 — a janela da alteridade'
  },
  {
    order_index: 9,
    title: 'dia 09: o pequeno gesto',
    tags: ['semana 2', 'gesto', 'potência'],
    audio_url: AUDIO_SAMPLE,
    recording_url: YOUTUBE_URL,
    description: `
      <div class="space-y-4">
        <img src="/brand-assets/deployments/IMG_8068.PNG" alt="dia 09" class="w-full h-56 sm:h-72 object-cover rounded-2xl border border-papelKraft/40 shadow-sm mb-4" />
        <p class="font-bold text-acentoAzul">reconte um gesto simples de impacto</p>
        <p>um olhar gentil, uma porta segurada, uma palavra dita no momento certo. descreva como um gesto sutil mudou a cor do seu dia.</p>
        <div class="bg-white/80 p-4 rounded-2xl border border-papelKraft/35">
          <p class="text-sm text-acentoTerracota font-bold">áudio de apoio:</p>
          <p class="text-xs text-tintaCarvao/80">"pequenas ações podem transformar o outro e a si mesma. reconheça sua potência cotidiana."</p>
        </div>
      </div>
    `,
    material_title: 'diario_de_micro_gestos.pdf',
    audio_title: 'áudio 09 — a poesia do sutil'
  },
  {
    order_index: 10,
    title: 'dia 10: o ambiente espelho',
    tags: ['semana 2', 'ambiente', 'espelho'],
    audio_url: AUDIO_SAMPLE,
    recording_url: YOUTUBE_URL,
    description: `
      <div class="space-y-4">
        <img src="/brand-assets/deployments/IMG_8151.PNG" alt="dia 10" class="w-full h-56 sm:h-72 object-cover rounded-2xl border border-papelKraft/40 shadow-sm mb-4" />
        <p class="font-bold text-acentoAzul">seu ambiente como espelho do sentir</p>
        <p>olhe ao redor do cômodo onde você está agora. como a disposição dos objetos, a luz e a organização refletem seu estado mental hoje?</p>
        <div class="bg-white/80 p-4 rounded-2xl border border-papelKraft/35">
          <p class="text-sm text-acentoTerracota font-bold">áudio de apoio:</p>
          <p class="text-xs text-tintaCarvao/80">"seu entorno reflete seu modo de sentir e ser. o que está ao seu redor diz sobre você?"</p>
        </div>
      </div>
    `,
    material_title: 'espelho_do_espaco_fisico.pdf',
    audio_title: 'áudio 10 — arquitetura interna e externa'
  },
  {
    order_index: 11,
    title: 'dia 11: o banal poético',
    tags: ['semana 2', 'poesia', 'ordinário'],
    audio_url: AUDIO_SAMPLE,
    recording_url: YOUTUBE_URL,
    description: `
      <div class="space-y-4">
        <img src="/brand-assets/deployments/IMG_8846.PNG" alt="dia 11" class="w-full h-56 sm:h-72 object-cover rounded-2xl border border-papelKraft/40 shadow-sm mb-4" />
        <p class="font-bold text-acentoAzul">transforme um momento banal em poesia</p>
        <p>o café passando na fita, o som da chuva na janela, o vapor do banho. desacelere e descreva esse instante com riqueza sensorial.</p>
        <div class="bg-white/80 p-4 rounded-2xl border border-papelKraft/35">
          <p class="text-sm text-acentoTerracota font-bold">áudio de apoio:</p>
          <p class="text-xs text-tintaCarvao/80">"o ordinário torna-se extraordinário quando olhado com atenção poética e presença."</p>
        </div>
      </div>
    `,
    material_title: 'guia_transformar_ordinario.pdf',
    audio_title: 'áudio 11 — o olhar poético'
  },
  {
    order_index: 12,
    title: 'dia 12: ritual cotidiano',
    tags: ['semana 2', 'ritual', 'presença'],
    audio_url: AUDIO_SAMPLE,
    recording_url: YOUTUBE_URL,
    description: `
      <div class="space-y-4">
        <img src="/brand-assets/elements/collages/png-retro-collages-whit-book-publication-flower-plant.png" alt="dia 12" class="w-full h-56 sm:h-72 object-cover rounded-2xl border border-papelKraft/40 shadow-sm mb-4" />
        <p class="font-bold text-acentoAzul">descreva um ritual cotidiano que você pratica</p>
        <p>uma ação, hábito ou rotina que repete todos os dias. onde e como ocorre? que sensações, memórias ou pensamentos surgem? em que momentos ele te traz de volta ao presente?</p>
        <div class="bg-white/80 p-4 rounded-2xl border border-papelKraft/35">
          <p class="text-sm text-acentoTerracota font-bold">áudio de apoio: o que é ritualizar</p>
          <p class="text-xs text-tintaCarvao/80">"ritualizar é conferir intenção e sacralidade aos gestos simples do dia a dia."</p>
        </div>
      </div>
    `,
    material_title: 'arquitetura_de_rituais.pdf',
    audio_title: 'áudio 12 — a sacralidade dos gestos'
  },
  {
    order_index: 13,
    title: 'dia 13: o mar das emoções',
    tags: ['semana 2', 'emoções', 'mar'],
    audio_url: AUDIO_SAMPLE,
    recording_url: YOUTUBE_URL,
    description: `
      <div class="space-y-4">
        <img src="/brand-assets/elements/collages/natural-animal-collage.png" alt="dia 13" class="w-full h-56 sm:h-72 object-cover rounded-2xl border border-papelKraft/40 shadow-sm mb-4" />
        <p class="font-bold text-acentoAzul">o mar das suas emoções de hoje</p>
        <p>escreva como seria o mar se ele refletisse seu estado interno hoje: águas calmas, mar agitado, maresia densa ou maré cheia?</p>
        <div class="bg-white/80 p-4 rounded-2xl border border-papelKraft/35">
          <p class="text-sm text-acentoTerracota font-bold">áudio de apoio:</p>
          <p class="text-xs text-tintaCarvao/80">"as águas internas ondulam e marcam o ritmo dos seus dias. navegue por esse mar íntimo."</p>
        </div>
      </div>
    `,
    material_title: 'metaphoras_emocionais.pdf',
    audio_title: 'áudio 13 — maremoto e bonança'
  },
  {
    order_index: 14,
    title: 'dia 14: aprendiz do cotidiano',
    tags: ['semana 2', 'curiosidade', 'rotina'],
    audio_url: AUDIO_SAMPLE,
    recording_url: YOUTUBE_URL,
    description: `
      <div class="space-y-4">
        <img src="/brand-assets/deployments/IMG_2847.PNG" alt="dia 14" class="w-full h-56 sm:h-72 object-cover rounded-2xl border border-papelKraft/40 shadow-sm mb-4" />
        <p class="font-bold text-acentoAzul">olhar como se visse pela primeira vez</p>
        <p>escolha um detalhe novo na sua rotina e descreva-o como se fosse uma visitante de outro planeta descobrindo a terra.</p>
        <div class="bg-white/80 p-4 rounded-2xl border border-papelKraft/35">
          <p class="text-sm text-acentoTerracota font-bold">áudio de apoio:</p>
          <p class="text-xs text-tintaCarvao/80">"o olhar curioso revela beleza naquilo que parece trivial. experimente ser aprendiz do cotidiano."</p>
        </div>
      </div>
    `,
    material_title: 'olhar_de_estrangeiro.pdf',
    audio_title: 'áudio 14 — o estado de aprendiz'
  },
  {
    order_index: 15,
    title: 'dia 15: o sonho antigo',
    tags: ['semana 3', 'futuro', 'sonhos'],
    audio_url: AUDIO_SAMPLE,
    recording_url: YOUTUBE_URL,
    description: `
      <div class="space-y-4">
        <img src="/brand-assets/deployments/IMG_2848.PNG" alt="dia 15" class="w-full h-56 sm:h-72 object-cover rounded-2xl border border-papelKraft/40 shadow-sm mb-4" />
        <p class="font-bold text-acentoAzul">semana 3 — olhar para o entre (escrita como ponte - futuro)</p>
        <p>voltamos ao espaço entre mundos internos e externos. a escrita se torna ponte: o que sentimos vira o que vivemos.</p>
        <p><strong>convite do dia:</strong> você tem um sonho antigo esquecido — que ainda está vivo aí dentro?</p>
        <div class="bg-white/80 p-4 rounded-2xl border border-papelKraft/35">
          <p class="text-sm text-acentoTerracota font-bold">áudio de apoio:</p>
          <p class="text-xs text-tintaCarvao/80">"sonhos adormecem mas não morrem. reacenda a chama da sua intenção."</p>
        </div>
      </div>
    `,
    material_title: 'resgate_de_sonhos_antigos.pdf',
    audio_title: 'áudio 15 — o fogo dos sonhos'
  },
  {
    order_index: 16,
    title: 'dia 16: o que move o coração',
    tags: ['semana 3', 'propósito', 'entusiasmo'],
    audio_url: AUDIO_SAMPLE,
    recording_url: YOUTUBE_URL,
    description: `
      <div class="space-y-4">
        <img src="/brand-assets/deployments/IMG_2849.PNG" alt="dia 16" class="w-full h-56 sm:h-72 object-cover rounded-2xl border border-papelKraft/40 shadow-sm mb-4" />
        <p class="font-bold text-acentoAzul">o que faz seu coração vibrar?</p>
        <p>escreva sobre o que te move nos momentos de dificuldade. resgate uma memória marcante que possa servir como âncora de coragem sempre que precisar.</p>
        <div class="bg-white/80 p-4 rounded-2xl border border-papelKraft/35">
          <p class="text-sm text-acentoTerracota font-bold">áudio de apoio: âncoras de luz</p>
          <p class="text-xs text-tintaCarvao/80">"ter clareza do que aquece o peito é a bússola para atravessar tempestades."</p>
        </div>
      </div>
    `,
    material_title: 'ancoras_de_entusiasmo.pdf',
    audio_title: 'áudio 16 — o motor da alma'
  },
  {
    order_index: 17,
    title: 'dia 17: estado de presença',
    tags: ['semana 3', 'presença', 'ancoragem'],
    audio_url: AUDIO_SAMPLE,
    recording_url: YOUTUBE_URL,
    description: `
      <div class="space-y-4">
        <img src="/brand-assets/deployments/IMG_2864.jpg" alt="dia 17" class="w-full h-56 sm:h-72 object-cover rounded-2xl border border-papelKraft/40 shadow-sm mb-4" />
        <p class="font-bold text-acentoAzul">como cultivar presença no dia a dia?</p>
        <p>há algum tipo de prática ou pausa que costuma te trazer de volta ao aqui e agora? escreva como pode trazer mais presença intencional na sua rotina diária.</p>
        <div class="bg-white/80 p-4 rounded-2xl border border-papelKraft/35">
          <p class="text-sm text-acentoTerracota font-bold">áudio de apoio: o que é o estado de presença</p>
          <p class="text-xs text-tintaCarvao/80">"presença não é esforço, é pouso. aprenda a pousar em si mesma."</p>
        </div>
      </div>
    `,
    material_title: 'praticas_de_ancoragem.pdf',
    audio_title: 'áudio 17 — a arte de pousar'
  },
  {
    order_index: 18,
    title: 'dia 18: a vulnerabilidade',
    tags: ['semana 3', 'vulnerabilidade', 'coragem'],
    audio_url: AUDIO_SAMPLE,
    recording_url: YOUTUBE_URL,
    description: `
      <div class="space-y-4">
        <img src="/brand-assets/deployments/IMG_2865.jpg" alt="dia 18" class="w-full h-56 sm:h-72 object-cover rounded-2xl border border-papelKraft/40 shadow-sm mb-4" />
        <p class="font-bold text-acentoAzul">vulnerabilidade é incerteza e coragem</p>
        <p>completar a frase: "vulnerabilidade para mim é...". a partir de qual experiência pessoal este conceito nasceu na sua vida? como você gostaria de se relacionar de forma autêntica nas suas relações?</p>
        <div class="bg-white/80 p-4 rounded-2xl border border-papelKraft/35">
          <p class="text-sm text-acentoTerracota font-bold">áudio de apoio: o risco de se expor</p>
          <p class="text-xs text-tintaCarvao/80">"vulnerabilidade é incerteza, risco e exposição emocional — e o único caminho para a conexão real."</p>
        </div>
      </div>
    `,
    material_title: 'mapa_da_vulnerabilidade.pdf',
    audio_title: 'áudio 18 — a coragem de se mostrar'
  },
  {
    order_index: 19,
    title: 'dia 19: autoria e narrativas',
    tags: ['semana 3', 'autoria', 'livro'],
    audio_url: AUDIO_SAMPLE,
    recording_url: YOUTUBE_URL,
    description: `
      <div class="space-y-4">
        <img src="/brand-assets/deployments/IMG_2867.jpg" alt="dia 19" class="w-full h-56 sm:h-72 object-cover rounded-2xl border border-papelKraft/40 shadow-sm mb-4" />
        <p class="font-bold text-acentoAzul">escreva o próximo capítulo da sua história</p>
        <p>se a sua vida fosse um livro publicado hoje, escreva o primeiro parágrafo do próximo capítulo que você quer começar a contar a partir de agora.</p>
        <div class="bg-white/80 p-4 rounded-2xl border border-papelKraft/35">
          <p class="text-sm text-acentoTerracota font-bold">áudio de apoio: falar sobre narrativa</p>
          <p class="text-xs text-tintaCarvao/80">"quem segura a caneta da sua vida é você. assuma a autoria da própria curva narrativa."</p>
        </div>
      </div>
    `,
    material_title: 'escrever_proximo_capitulo.pdf',
    audio_title: 'áudio 19 — a caneta da vida'
  },
  {
    order_index: 20,
    title: 'dia 20: o medo de recomeçar',
    tags: ['semana 3', 'recomeço', 'renovação'],
    audio_url: AUDIO_SAMPLE,
    recording_url: YOUTUBE_URL,
    description: `
      <div class="space-y-4">
        <img src="/brand-assets/deployments/IMG_2868.jpg" alt="dia 20" class="w-full h-56 sm:h-72 object-cover rounded-2xl border border-papelKraft/40 shadow-sm mb-4" />
        <p class="font-bold text-acentoAzul">o que significa recomeçar para você?</p>
        <p>qual é o seu medo ao encarar uma nova página em branco? o que te impede de dar o primeiro passo novamente?</p>
        <div class="bg-white/80 p-4 rounded-2xl border border-papelKraft/35">
          <p class="text-sm text-acentoTerracota font-bold">áudio de apoio: qual é o seu medo de recomeçar?</p>
          <p class="text-xs text-tintaCarvao/80">"recomeçar não é apagar o passado, é carregar o aprendizado com mais leveza."</p>
        </div>
      </div>
    `,
    material_title: 'guia_do_recomeco_consciente.pdf',
    audio_title: 'áudio 20 — o poder da renovação'
  },
  {
    order_index: 21,
    title: 'dia 21: cerimônia de fechamento',
    tags: ['semana 3', 'fechamento', 'celebração'],
    audio_url: AUDIO_SAMPLE,
    recording_url: YOUTUBE_URL,
    description: `
      <div class="space-y-4">
        <img src="/brand-assets/elements/collages/butterfly-collage-woman-art.png" alt="dia 21" class="w-full h-56 sm:h-72 object-cover rounded-2xl border border-papelKraft/40 shadow-sm mb-4" />
        <p class="font-bold text-acentoAzul">cerimônia de fechamento — 21 dias de escrita</p>
        <p>reveja a carta escrita no dia 01 e escreva agora uma nova carta para ler daqui a 1 ano. celebre a sua constância, a sua escuta e a coragem de ter habitado estas páginas.</p>
        <div class="bg-white/80 p-4 rounded-2xl border border-papelKraft/35 space-y-2">
          <p class="text-sm text-acentoTerracota font-bold">manifesto de encerramento:</p>
          <p class="text-xs text-tintaCarvao/85 italic font-editorial text-base">
            "escrever foi o caminho. as palavras foram o espelho, a janela e a ponte. que você siga, agora, com o verbo solto e o coração desperto para continuar escrevendo — dentro e fora das páginas."
          </p>
        </div>
      </div>
    `,
    material_title: 'certificado_de_conclusao_21dias.pdf',
    audio_title: 'áudio 21 — o verbo solto (cerimônia final)'
  }
];

async function seed() {
  console.log('Iniciando atualização completa do curso 21 dias de escrita...');

  // 1. Limpar lições antigas deste curso
  const { error: delError } = await supabase
    .from('course_lessons')
    .delete()
    .eq('course_id', COURSE_ID);

  if (delError) {
    console.error('Erro ao deletar lições antigas:', delError);
  } else {
    console.log('Lições antigas removidas com sucesso.');
  }

  // 2. Inserir todas as 22 lições
  for (const item of lessonsData) {
    const { data: lesson, error: lessonError } = await supabase
      .from('course_lessons')
      .insert({
        course_id: COURSE_ID,
        title: item.title,
        description: item.description,
        audio_url: item.audio_url,
        recording_url: item.recording_url,
        order_index: item.order_index,
        tags: item.tags
      })
      .select()
      .single();

    if (lessonError) {
      console.error(`Erro ao inserir lição index ${item.order_index}:`, lessonError);
      continue;
    }

    console.log(`✓ Criada lição [index ${item.order_index}]: ${lesson.title}`);

    // Inserir material de apoio associado
    if (item.material_title) {
      const { error: matError } = await supabase.from('course_materials').insert({
        lesson_id: lesson.id,
        title: item.material_title,
        file_url: 'https://raw.githubusercontent.com/Digital-alignment/soltaoverbo/main/public/brand-assets/deployments/IMG_8067.PNG',
        file_type: 'pdf',
        file_size: 1258291,
        mime_type: 'application/pdf',
        original_filename: item.material_title,
        is_uploaded: true
      });
      if (matError) console.error(`Erro ao inserir material para ${lesson.id}:`, matError);
    }

    // Inserir arquivo de áudio associado
    if (item.audio_title) {
      const { error: audError } = await supabase.from('lesson_audio_files').insert({
        lesson_id: lesson.id,
        title: item.audio_title,
        audio_file_url: item.audio_url,
        duration_seconds: 600,
        file_size_bytes: 5242880,
        original_filename: `${item.title}.mp3`,
        mime_type: 'audio/mpeg',
        order_index: 0
      });
      if (audError) console.error(`Erro ao inserir áudio para ${lesson.id}:`, audError);
    }
  }

  console.log('Seeding concluído com sucesso!');
}

seed();
