# Soltar o Verbo - Plataforma de Comunidade de Escrita

Uma plataforma completa para comunidades de escritores brasileiros, com cursos, exercícios de escrita e feed social.

## Funcionalidades Implementadas

### ✅ Sistema de Autenticação
- Login e registro com email/senha
- Recuperação de senha
- Perfis de usuário com três níveis: Gratuito, Premium e Administrador

### ✅ Dashboard de Cursos
- Visualização de cursos gratuitos e premium
- Controle de acesso baseado em nível de assinatura
- Cards visuais com thumbnails e descrições

### ✅ Templates de Cursos

#### Curso Gratuito (ex: "21 Dias de Escrita")
- Organização por dias
- Player de áudio moderno para cada aula
- Seção de downloads para materiais
- Sistema de comentários com respostas

#### Curso Premium (ex: "Roteiro Original")
- Organização por aulas/módulos
- Links para aulas ao vivo no Zoom
- Upload de gravações após as aulas
- Materiais premium para download
- Sistema de comentários com respostas

### ✅ Editor de Exercícios de Escrita
- Editor de texto rico com formatação
- Controles: negrito, itálico, sublinhado, alinhamento
- Personalização de tamanho e cor da fonte
- Salvamento automático
- Biblioteca pessoal de textos
- Download de textos
- Publicação na comunidade

### ✅ Nossa Fogueira (Feed da Comunidade)
- Feed público de textos compartilhados
- Sistema de curtidas
- Comentários e respostas
- Visualização expandida de textos longos
- Links para perfis de autores

### ✅ Perfis de Usuário
- Foto de perfil (avatar com inicial)
- Bio personalizável
- Links sociais: Instagram, LinkedIn, Substack, Email
- Visualização pública de perfis

### ✅ Sistema de Notificações
- Notificações em tempo real
- Tipos: curtidas, comentários, respostas, atualizações, anúncios
- Marcação como lida
- Badge de contagem no menu

### ✅ Painel Administrativo
- Estatísticas de usuários e cursos
- Gerenciamento de papéis de usuários
- Visualização de todos os cursos
- Acesso restrito a administradores

### ✅ Páginas Estáticas
- Landing page atrativa
- Página de contato
- Rodapé com links

## Tecnologias Utilizadas

- **Frontend**: React 18 + TypeScript + Vite
- **Estilização**: Tailwind CSS
- **Roteamento**: React Router DOM v7
- **Ícones**: Lucide React
- **Backend**: Supabase
  - Autenticação
  - Banco de dados PostgreSQL
  - Row Level Security (RLS)
  - Realtime subscriptions

## Estrutura do Banco de Dados

O banco de dados foi configurado com as seguintes tabelas:

- `users_profiles` - Perfis de usuários com roles
- `courses` - Cursos (gratuitos e premium)
- `course_lessons` - Aulas/dias dos cursos
- `course_materials` - Materiais para download
- `writing_exercises` - Textos dos usuários
- `community_posts` - Posts publicados na comunidade
- `post_likes` - Curtidas nos posts
- `comments` - Comentários (posts e aulas) com respostas
- `notifications` - Notificações do sistema
- `user_subscriptions` - Assinaturas de usuários

Todas as tabelas possuem:
- Row Level Security (RLS) habilitado
- Políticas de segurança apropriadas
- Índices para performance

## Como Usar

### 1. Primeiro Acesso

1. Acesse a landing page
2. Clique em "Cadastrar" ou "Começar Grátis"
3. Preencha: nome de exibição, email e senha
4. Você será automaticamente logado como usuário gratuito

### 2. Para Administradores

Para tornar um usuário administrador:

1. Acesse o Supabase Dashboard
2. Vá em Table Editor → users_profiles
3. Encontre o usuário e altere o campo `role` para `'admin'`

### 3. Criando Cursos (Admin)

Para criar cursos, use o Supabase Dashboard:

1. Vá em Table Editor → courses
2. Insira um novo curso:
   - `title`: Título do curso
   - `description`: Descrição
   - `course_type`: 'free' ou 'paid'
   - `stripe_payment_link`: (opcional) link de pagamento
   - `created_by`: ID do admin

3. Crie aulas em course_lessons:
   - `course_id`: ID do curso criado
   - `title`: Título da aula
   - `day_number`: Número do dia (para cursos gratuitos)
   - `description`: Conteúdo/prompt da aula
   - `audio_url`: URL do áudio (cursos gratuitos)
   - `zoom_link`: Link do Zoom (cursos premium)
   - `recording_url`: Link da gravação (cursos premium)
   - `order_index`: Ordem de exibição

4. Adicione materiais em course_materials:
   - `lesson_id`: ID da aula
   - `title`: Nome do material
   - `file_url`: URL do arquivo
   - `file_type`: Tipo do arquivo

### 4. Sistema de Notificações

Notificações são criadas automaticamente para:
- Curtidas em posts
- Comentários em posts
- Respostas a comentários

Admins podem criar notificações manuais:
1. Acesse o Supabase Dashboard
2. Vá em Table Editor → notifications
3. Insira notificação com `type: 'announcement'`

### 5. Upgrade de Usuários

Para tornar um usuário premium:
1. Acesse o painel admin em `/admin`
2. Encontre o usuário na lista
3. Altere o dropdown de "Gratuito" para "Premium"

Ou pelo Supabase Dashboard:
1. Table Editor → users_profiles
2. Altere `role` para `'paid'`

## Configuração de Email (Opcional)

Para enviar emails de notificação:

1. Configure um provedor de email (SendGrid, Resend, etc.)
2. Crie uma Edge Function no Supabase
3. Configure triggers no banco de dados para enviar emails automaticamente

## Design e UX

A plataforma utiliza:
- Esquema de cores quente (âmbar/laranja) inspirador para escritores
- Gradientes suaves e transições elegantes
- Design responsivo para todos os tamanhos de tela
- Microinterações e feedback visual
- Tipografia legível com espaçamento adequado
- Cards com sombras e efeitos hover

## Segurança

- Todas as rotas protegidas requerem autenticação
- RLS implementado em todas as tabelas
- Políticas restritivas por padrão
- Verificação de role para áreas administrativas
- Proteção contra SQL injection via Supabase
- Sanitização de inputs de usuário

## Próximos Passos Recomendados

1. **Integração Stripe**: Implementar webhook para pagamentos automáticos
2. **Upload de Mídia**: Adicionar upload direto para Supabase Storage
3. **Email Notifications**: Configurar envio automático de emails
4. **Busca**: Adicionar busca de cursos e posts
5. **Estatísticas**: Dashboard de analytics para admins
6. **Gamificação**: Sistema de badges e conquistas
7. **Export de Textos**: Adicionar export em PDF/DOCX

## Suporte

Para dúvidas ou problemas:
- Use a página de contato em `/contact`
- Ou acesse o Supabase Dashboard para logs e debugging

---

Desenvolvido com ❤️ para a comunidade de escritores brasileiros
