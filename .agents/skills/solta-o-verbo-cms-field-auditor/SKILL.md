---
name: solta-o-verbo-cms-field-auditor
description: Audit every page component in Solta o Verbo to identify all visual elements (titles, subtitles, body copy, badges, tags, buttons, links, images, quotes, lists), map their field types, and confirm that the Admin CMS (DEFAULT_CMS_DATA, usePageContent, PageContentManagement.tsx) exposes controls to edit 100% of those fields.
---

# 🔍 Solta o Verbo - CMS Field & Section Auditor Skill

Esta skill atua como **Auditor de Conteúdo Dinâmico e Cobertura do CMS (100% Dynamic CMS Auditor)**. Ela deve ser consultada e executada antes e depois de modificar ou criar qualquer página pública ou componente de interface no repositório `soltaoverbo`.

---

## 🎯 Objetivo da Skill

Garantir que **100% dos elementos visíveis** de uma página (textos, títulos, subtítulos, etiquetas/badges, frases de chamada, botões, links, imagens de capa, galerias, citações poéticas, perguntas de FAQ e listas de benefícios) sejam **totalmente editáveis via Painel Admin (CMS)**, sem dependência de textos *hardcoded* no JSX e sem alterar o Design System/UI visual.

---

## 📋 Protocolo de Auditoria em 5 Etapas

### Etapa 1: Mapeamento de Seções e Elementos Visuais
1. Abrir o arquivo de página alvo (ex: `src/pages/Landing.tsx`, `src/pages/AboutUs.tsx`, `src/components/ContrateExperienciaSection.tsx`).
2. Listar todas as seções renderizadas de cima a baixo.
3. Para cada seção, identificar **todos os elementos visuais** editáveis e determinar seu tipo de campo:
   - `badge_text` (string curta): etiquetas de topo, selos.
   - `title` (string/editorial): título principal da seção.
   - `subtitle` (string): subtítulo ou frase de apoio.
   - `body_text` / `prosa` (textarea / multiline): textos longos e parágrafos.
   - `quote_text` / `highlight` (textarea / quote): citações poéticas e frases em destaque.
   - `button_text` (string): rótulos de botões CTA.
   - `button_link` / `url` (string URL): destinos de links e redirecionamentos.
   - `image_url` / `photo` (string URL): imagens de fundo, colagens e retratos.
   - `bullet_1..N` ou `items` (array / list): listas de benefícios ou tópicos.
   - `selected_ids` (string CSV): seletores de itens de piscinas globais (ex: `testimonials_pool`).

---

### Etapa 2: Verificação do Schema Padrão (`usePageContent.ts`)
1. Abrir `src/hooks/usePageContent.ts`.
2. Verificar se o slug da página existe dentro de `DEFAULT_CMS_DATA`.
3. Confirmar que **todas as chaves de seções** e **todos os campos mapeados na Etapa 1** possuem valores padrão definidos no `DEFAULT_CMS_DATA`.
4. Garantir que fallbacks de tipo seguro estejam definidos para evitar erros de renderização caso um campo retorne `undefined` ou nulo do Supabase.

---

### Etapa 3: Auditoria da Interface do Admin (`PageContentManagement.tsx`)
1. Abrir `src/components/PageContentManagement.tsx`.
2. Confirmar que a página auditada está cadastrada no array `PAGE_OPTIONS` com todas as suas seções listadas em `sections`.
3. Verificar se o JSX do `PageContentManagement.tsx` renderiza **campos de entrada específicos** (`input`, `textarea`, `select`, upload de imagem) para cada propriedade mapeada da seção.
4. Garantir que a função `handleSectionChange` seja chamada no evento `onChange` de cada input para salvar as alterações no estado do Supabase.

---

### Etapa 4: Auditoria de Data-Binding no Componente JSX
1. Voltar ao arquivo da página / componente.
2. Confirmar que o hook `usePageContent('<page_slug>')` é invocado.
3. Verificar se cada tag JSX consome os dados retornados por `getSection('<section_key>', defaultValues)`:
   - Exemplo: `<h2>{heroSec.title || 'título padrão...'}</h2>`
   - Exemplo: `<a href={heroSec.button_link}>{heroSec.button_text}</a>`
   - Exemplo: `<img src={sec.image_url} />`
4. Confirmar que **nenhum texto em português ou URL de imagem permaneça estático / hardcoded** na árvore JSX sem fallback do CMS.

---

### Etapa 5: Preservação Intacta do Design System
1. Garantir que as alterações no data-binding **não modifiquem nenhuma classe Tailwind CSS**, tipografia (`font-editorial`, `font-gesto`, `font-corpo`), regras de minúsculas (`lowercase`), fitas washi, papéis kraft ou cartões bento.
2. Garantir que o design permaneça 100% fiel ao layout aprovado.

---

## 🔍 Checklist de Verificação Rápida

Ao finalizar a auditoria de qualquer página:

- [ ] Todos os títulos e subtítulos usam `getSection(...)`
- [ ] Todas as etiquetas e badges usam `getSection(...)`
- [ ] Todos os textos de botões e links de destino usam `getSection(...)`
- [ ] Todas as imagens usam `image_url` dinâmico do CMS
- [ ] O arquivo `usePageContent.ts` tem os defaults de todos os campos
- [ ] O arquivo `PageContentManagement.tsx` exibe inputs para 100% dos campos
- [ ] Nenhuma classe visual de layout foi alterada ou quebrada
- [ ] `npm run build` compila com 0 erros
