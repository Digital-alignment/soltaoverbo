# soltar o verbo

uma plataforma completa para comunidades de escritores brasileiros, com cursos, exercícios de escrita, feed social e pagamentos integrados.

---

## 🎨 design e identidade visual

### filosofia de design
**importante**: toda a plataforma foi projetada sem o uso de letras maiúsculas. esta é uma escolha estética intencional que reflete a voz autêntica e acessível da comunidade de escritores. mantenha este padrão em todo o conteúdo, interface e comunicações.

### paleta de cores

a identidade visual é construída sobre uma paleta que evoca criatividade, calor e comunidade:

| cor | hex | uso |
|-----|-----|-----|
| **paper** (papel creme) | `#EDE6D4` | fundo principal, superfície base |
| **deep blue** (azul profundo) | `#140D82` | títulos, elementos de destaque, navegação |
| **lime green** (verde limão) | `#BEC540` | acentos, decorações wavy, ícones especiais |
| **action orange** (laranja vibrante) | `#FD5E32` | botões primários, call-to-actions, elementos interativos |
| **dark neutral** (cinza quase preto) | `#1D1D1B` | texto corpo, bordas, elementos neutros |
| **footer purple** (roxo escuro) | `#190087` | rodapé, áreas de contraste |
| **popup cream** (creme claro) | `#FFF9E4` | popups, modais, cards destacados |
| **popup text** (roxo médio) | `#2000AD` | texto em popups |
| **icon green** (verde ícone) | `#BAC706` | ícones de ação, elementos decorativos |

### tipografia

- **heading**: playfair display (700) - títulos e manchetes
- **body**: helvetica neue / helvetica / arial - textos corridos
- **accent**: patrick hand - elementos manuscritos, destaques especiais

---

## ✨ funcionalidades implementadas

### 🔐 sistema de autenticação
- login e registro com email/senha via supabase auth
- recuperação de senha com reset por email
- perfis de usuário com três níveis de acesso:
  - **free** (gratuito): acesso a cursos gratuitos e comunidade
  - **paid** (premium): acesso total a todos os cursos e recursos
  - **admin** (administrador): acesso completo + painel administrativo

### 📚 dashboard de cursos
- visualização intuitiva de cursos gratuitos e premium
- controle de acesso baseado em role do usuário
- cards visuais com thumbnails, descrições e tags
- sistema de tags para organização (ex: "21 dias", "roteiro original")

### 🎓 templates de cursos

#### curso gratuito (ex: "21 dias de escrita")
- organização sequencial por dias
- player de áudio moderno e responsivo
- controles de reprodução (play, pause, avanço/retrocesso)
- seção de downloads para materiais complementares
- sistema de comentários com threads e respostas

#### curso premium (ex: "roteiro original")
- organização por módulos e aulas
- integração com zoom para aulas ao vivo
- upload e hospedagem de gravações das aulas
- biblioteca de materiais premium para download
- sistema avançado de comentários e discussões

### ✍️ editor de exercícios de escrita
- editor wysiwyg (what you see is what you get)
- toolbar completa: negrito, itálico, sublinhado, listas, alinhamento
- personalização de fonte (tamanho e cor)
- salvamento automático em tempo real
- biblioteca pessoal de textos organizados por data
- download de textos em formato plain text
- publicação direta na comunidade "nossa fogueira"
- contador de palavras e caracteres

### 🔥 nossa fogueira (feed da comunidade)
- feed social público de textos compartilhados
- sistema de curtidas com animação de coração
- comentários aninhados com respostas
- visualização "ler mais/menos" para textos longos
- links diretos para perfis públicos dos autores
- moderação de conteúdo (admin)
- filtros e busca (em desenvolvimento)

### 👤 perfis de usuário
- foto de perfil personalizável via upload + crop
- avatar automático com inicial do nome
- bio com editor rich text
- links sociais: instagram, linkedin, substack, email
- visualização pública do perfil
- galeria de textos publicados
- estatísticas de engajamento

### 🔔 sistema de notificações
- notificações em tempo real via supabase realtime
- tipos de notificação:
  - **like**: quando alguém curte seu post
  - **comment**: quando comentam no seu post
  - **reply**: quando respondem seu comentário
  - **update**: atualizações de cursos
  - **announcement**: anúncios administrativos
- marcação individual como lida
- badge de contagem não lidas
- central de notificações dedicada

### 💳 sistema de pagamentos (stripe)
- integração completa com stripe checkout
- múltiplas opções de parcelamento:
  - pagamento único (à vista com desconto)
  - 2x sem juros
  - 3x sem juros
  - 4x sem juros
  - 5x sem juros
- webhooks para atualização automática de status
- analytics de checkout com conversão
- tracking de instalments e pagamentos

### 🛡️ painel administrativo

o painel admin (`/admin`) oferece controle completo da plataforma através de 7 abas principais:

#### 1️⃣ gerenciamento de usuários
**funcionalidades:**
- listagem completa de todos os usuários cadastrados
- busca por nome ou email
- filtros avançados:
  - por role (free, paid, admin)
  - por data de cadastro (7, 30, 90 dias ou todos)
- estatísticas em tempo real:
  - total de usuários
  - usuários gratuitos
  - usuários premium
- alteração de role diretamente pela interface
- visualização de perfis sociais (instagram, linkedin, substack)
- exportação de dados

#### 2️⃣ gerenciamento de cursos
**funcionalidades:**
- criação de novos cursos via modal intuitivo
- edição de cursos existentes
- configuração completa:
  - título e descrição
  - tipo (gratuito ou pago)
  - thumbnail (upload com crop)
  - tags para organização
  - link de pagamento stripe (para cursos pagos)
- gerenciamento de aulas/lições:
  - criação e edição de aulas
  - upload de áudios (cursos gratuitos)
  - links de zoom e gravações (cursos premium)
  - ordenação customizada
- gerenciamento de materiais:
  - upload de PDFs, documentos, imagens
  - organização por aula
  - descrições e metadados
- visualização de estatísticas de engajamento

#### 3️⃣ mensagens de contato
**funcionalidades:**
- visualização de todas as mensagens do formulário de contato
- informações completas: nome, email, telefone, mensagem
- timestamp de recebimento
- sistema de marcação como respondida (em desenvolvimento)
- filtros e busca
- exportação de mensagens

#### 4️⃣ gerenciamento de banners
**funcionalidades:**
- criação de banners para o slider da landing page
- upload de imagens com preview
- configuração de:
  - título e descrição
  - link de destino (CTA)
  - targeting por role (mostrar para free, paid ou todos)
  - ordem de exibição
- ativação/desativação de banners
- preview em tempo real
- remoção de banners antigos

#### 5️⃣ transmissões (broadcasts)
**funcionalidades:**
- envio de notificações em massa para usuários
- tipos de transmissão:
  - anúncios gerais
  - atualizações de cursos
  - avisos importantes
- targeting avançado:
  - todos os usuários
  - apenas usuários gratuitos
  - apenas usuários premium
- editor rico de conteúdo
- preview antes de enviar
- histórico de transmissões enviadas
- estatísticas de visualização (em desenvolvimento)

#### 6️⃣ moderação de comentários
**funcionalidades:**
- visualização de todos os comentários da plataforma
- contexto completo:
  - autor do comentário
  - post ou aula comentada
  - texto completo
  - timestamp
- ações de moderação:
  - aprovação/reprovação
  - remoção de comentários impróprios
  - bloqueio temporário/permanente de usuários
- filtros por:
  - status (pendente, aprovado, removido)
  - autor
  - tipo (post ou aula)
- busca por palavras-chave
- proteção da comunidade contra spam e abuso

#### 7️⃣ analytics de checkout
**funcionalidades:**
- dashboard visual de conversões stripe
- métricas em tempo real:
  - total de checkouts iniciados
  - checkouts concluídos com sucesso
  - taxa de conversão (%)
  - receita total gerada
- listagem detalhada de transações:
  - usuário
  - plano escolhido (à vista ou parcelado)
  - status (sucesso/pendente/falha)
  - valor e número de parcelas
  - data e hora
- gráficos de evolução temporal
- exportação de relatórios
- integração em tempo real com webhooks stripe

### 📱 páginas públicas
- **landing page** com hero slider, seções de benefícios e CTAs
- **página sobre nós** com história e equipe
- **página de contato** com formulário e informações
- **termos de serviço** e **política de privacidade**
- **rodapé** com links, redes sociais e informações legais

### 📲 pwa (progressive web app)
- instalável em dispositivos móveis e desktop
- popup de instalação inteligente
- ícones otimizados para todas as plataformas
- funcionalidade offline (em desenvolvimento)
- notificações push (em desenvolvimento)

---

## 🛠️ tecnologias utilizadas

### frontend
- **react 18.3** com hooks modernos
- **typescript 5.5** para type safety
- **vite 5.4** para build otimizado
- **tailwind css 3.4** para estilização
- **react router dom 7** para roteamento
- **lucide react** para ícones
- **react-easy-crop** para crop de imagens

### backend
- **supabase** (plataforma completa):
  - autenticação com email/senha
  - postgresql database com RLS
  - storage para arquivos
  - realtime subscriptions
  - edge functions (serverless)
- **stripe** para processamento de pagamentos

### build e deploy
- **vercel** para hospedagem e CI/CD
- vite plugin pwa para progressive web app
- eslint para code quality

---

## 📊 estrutura do banco de dados

### tabelas principais

| tabela | descrição | campos principais |
|--------|-----------|-------------------|
| `users_profiles` | perfis de usuários | id, display_name, role, bio, avatar_url, social_links |
| `courses` | cursos (free/paid) | id, title, description, course_type, thumbnail_url, tags |
| `course_lessons` | aulas dos cursos | id, course_id, title, description, audio_url, zoom_link, recording_url |
| `course_materials` | materiais de download | id, lesson_id, title, file_url, file_type, metadata |
| `writing_exercises` | textos dos usuários | id, user_id, title, content, word_count, created_at |
| `community_posts` | posts publicados | id, exercise_id, user_id, likes_count, is_approved |
| `post_likes` | curtidas nos posts | id, post_id, user_id, created_at |
| `comments` | comentários aninhados | id, post_id, lesson_id, user_id, content, parent_comment_id |
| `notifications` | notificações do sistema | id, user_id, type, content, is_read, created_at |
| `user_subscriptions` | assinaturas ativas | id, user_id, stripe_customer_id, status, current_period_end |
| `banner_slider` | banners da landing | id, title, description, image_url, link_url, target_role, order_index |
| `admin_broadcasts` | transmissões enviadas | id, title, message, target_audience, sent_by, created_at |
| `contact_messages` | mensagens de contato | id, name, email, phone, message, created_at |
| `checkout_events` | eventos stripe | id, session_id, user_id, status, amount, installments |

### recursos de segurança

**todas as tabelas possuem:**
- ✅ row level security (RLS) habilitado
- ✅ políticas restritivas por padrão
- ✅ verificação de autenticação em todas as operações
- ✅ índices para performance em queries frequentes
- ✅ foreign keys e constraints para integridade

**exemplos de políticas RLS:**
- usuários só podem editar seus próprios dados
- apenas admins podem gerenciar cursos
- posts precisam ser aprovados para aparecer publicamente
- notificações são visíveis apenas para o destinatário

---

## 🚀 como usar

### 1️⃣ primeiro acesso (usuário comum)

1. acesse a landing page
2. clique em "começar grátis" ou "criar conta"
3. preencha:
   - nome de exibição
   - email válido
   - senha (mínimo 6 caracteres)
4. você será automaticamente logado como **usuário gratuito**
5. complete seu perfil em "perfil"
6. explore cursos gratuitos e a comunidade "nossa fogueira"

### 2️⃣ configurando administradores

**método 1: via supabase dashboard (recomendado)**
1. acesse seu projeto no supabase.com
2. vá em: `table editor` → `users_profiles`
3. encontre o usuário desejado
4. edite o campo `role` para `'admin'`
5. salve as alterações
6. o usuário agora tem acesso ao painel admin em `/admin`

**método 2: via SQL editor**
```sql
update users_profiles
set role = 'admin'
where email = 'email@dominio.com';
```

### 3️⃣ criando cursos (admin)

**via painel administrativo (interface visual):**
1. faça login como admin
2. acesse `/admin`
3. clique na aba "gerenciar cursos"
4. clique em "+ novo curso"
5. preencha o modal:
   - título do curso
   - descrição detalhada
   - tipo: gratuito ou pago
   - upload de thumbnail (será cropado automaticamente)
   - tags para organização
   - link de pagamento stripe (se pago)
6. clique em "criar curso"

**adicionando aulas:**
1. no mesmo painel, clique no curso criado
2. clique em "+ nova aula"
3. configure:
   - título da aula
   - descrição/prompt
   - ordem de exibição
   - *para cursos gratuitos*: upload de áudio
   - *para cursos pagos*: link zoom + link de gravação
4. clique em "salvar aula"

**adicionando materiais:**
1. clique na aula desejada
2. clique em "+ novo material"
3. faça upload do arquivo (PDF, DOCX, imagens)
4. adicione título e descrição
5. clique em "adicionar material"

### 4️⃣ gerenciando usuários (admin)

**alterando role de usuários:**
1. acesse `/admin` → aba "usuários"
2. use a busca ou filtros para encontrar o usuário
3. no dropdown ao lado do nome, selecione o novo role:
   - **free**: acesso básico
   - **paid**: acesso premium (todos os cursos)
   - **admin**: acesso administrativo total
4. a alteração é aplicada imediatamente

**estatísticas disponíveis:**
- total de usuários cadastrados
- distribuição por tipo (free/paid/admin)
- cadastros recentes (7/30/90 dias)
- links para perfis sociais

### 5️⃣ enviando transmissões (admin)

1. acesse `/admin` → aba "transmissões"
2. clique em "+ nova transmissão"
3. preencha:
   - título chamativo
   - mensagem (suporta formatação rica)
   - público-alvo:
     - todos os usuários
     - apenas usuários gratuitos
     - apenas usuários premium
4. preview da notificação
5. clique em "enviar transmissão"
6. todos os usuários do público-alvo receberão a notificação

### 6️⃣ moderando conteúdo (admin)

**moderando comentários:**
1. acesse `/admin` → aba "moderação"
2. visualize todos os comentários recentes
3. para cada comentário, você pode:
   - visualizar contexto completo
   - ver perfil do autor
   - aprovar ou remover
   - acessar o post/aula original
4. use filtros para encontrar conteúdo específico

**moderando posts da fogueira:**
- posts são automaticamente aprovados
- admins podem remover posts impróprios
- usuários bloqueados não podem mais comentar

### 7️⃣ configurando pagamentos (stripe)

**variáveis de ambiente necessárias:**
```env
VITE_STRIPE_PRICE_ONE_TIME=price_xxxxx
VITE_STRIPE_PRICE_2X=price_xxxxx
VITE_STRIPE_PRICE_3X=price_xxxxx
VITE_STRIPE_PRICE_4X=price_xxxxx
VITE_STRIPE_PRICE_5X=price_xxxxx
```

**configuração do webhook:**
1. no stripe dashboard, vá em: `developers` → `webhooks`
2. adicione endpoint: `https://seu-projeto.supabase.co/functions/v1/stripe-webhook`
3. eventos a escutar:
   - `checkout.session.completed`
   - `checkout.session.expired`
   - `customer.subscription.created`
   - `customer.subscription.deleted`
4. copie o signing secret
5. adicione como variável de ambiente no supabase

**testando pagamentos:**
- use cartões de teste do stripe
- verifique webhooks no dashboard
- confirme atualização automática de role

---

## 🔒 segurança e boas práticas

### autenticação
- senhas com hash bcrypt via supabase
- tokens JWT para sessões
- renovação automática de tokens
- proteção contra CSRF

### autorização
- verificação de role em todas as rotas protegidas
- RLS garante acesso apenas a dados permitidos
- políticas granulares por tabela e operação

### dados sensíveis
- API keys apenas em variáveis de ambiente
- nunca expostas no código frontend
- edge functions para chamadas externas

### uploads
- validação de tipo de arquivo
- limite de tamanho configurado
- armazenamento seguro no supabase storage
- URLs assinadas quando necessário

### SQL injection
- todas as queries via supabase client
- prepared statements automáticos
- sanitização de inputs

---

## 📈 próximos passos recomendados

### curto prazo
- [ ] busca avançada de cursos e posts
- [ ] filtros na nossa fogueira
- [ ] export de textos em PDF/DOCX
- [ ] notificações push (PWA)
- [ ] modo offline básico

### médio prazo
- [ ] sistema de badges e gamificação
- [ ] desafios semanais de escrita
- [ ] rankings e leaderboards
- [ ] grupos privados de escrita
- [ ] sessões de escrita ao vivo

### longo prazo
- [ ] marketplace de cursos externos
- [ ] sistema de mentoria 1-on-1
- [ ] eventos e workshops presenciais
- [ ] publicação de antologias comunitárias
- [ ] integração com plataformas de publicação

---

## 🐛 troubleshooting

### problema: usuário não consegue fazer login
**soluções:**
- verifique se o email foi confirmado (se confirmação estiver ativa)
- confirme que o usuário está cadastrado no supabase
- verifique as variáveis de ambiente VITE_SUPABASE_*
- veja logs de erro no console do navegador

### problema: upload de imagem falha
**soluções:**
- confirme que o bucket existe no supabase storage
- verifique as políticas de RLS do bucket
- confirme o tamanho máximo permitido
- veja logs do supabase dashboard

### problema: notificações não aparecem
**soluções:**
- verifique se o realtime está ativo no supabase
- confirme que as políticas RLS permitem leitura
- recarregue a página para reconectar ao realtime
- veja logs de websocket no dev tools

### problema: pagamento não atualiza role
**soluções:**
- confirme que o webhook stripe está configurado
- verifique eventos recebidos no stripe dashboard
- veja logs da edge function `stripe-webhook`
- confirme que o STRIPE_WEBHOOK_SECRET está correto

---

## 📞 suporte

**para usuários finais:**
- use a página de contato em `/contact`
- siga nas redes sociais para atualizações
- participe da comunidade "nossa fogueira"

**para desenvolvedores:**
- consulte a documentação do supabase
- verifique logs no supabase dashboard
- use o console do navegador para debug
- revise as migrações SQL em `supabase/migrations/`

---

## 📝 notas de desenvolvimento

### convenções de código
- use apenas lowercase em textos de interface
- componentes em PascalCase
- funções e variáveis em camelCase
- arquivos de componente com .tsx
- espaçamento de 2 espaços
- sempre use typescript types

### estrutura de pastas
```
src/
├── components/     # componentes reutilizáveis
├── contexts/       # react contexts (auth, etc)
├── hooks/          # custom hooks
├── lib/            # configurações e utilities
├── pages/          # páginas da aplicação
├── utils/          # funções auxiliares
└── config/         # constantes e configuração
```

### git workflow
- commits são criados automaticamente
- nunca commite secrets ou keys
- use mensagens descritivas em lowercase
- não force push para main

---

**versão atual**: 1.8.8
**última atualização**: janeiro 2026
desenvolvido com dedicação para a comunidade de escritores brasileiros 🇧🇷
