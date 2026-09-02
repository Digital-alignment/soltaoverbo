---
name: solta-o-verbo-design-auditor
description: Audit and enforce the strict Solta o Verbo Brand Design System rules on all UI code, components, and layout edits. Automatically checks font usage, lowercase rule, border thickness, emoji prohibition, and solid color enforcement.
---

# 🎨 Solta o Verbo - Design System Auditor Skill

Esta skill atua como **Auditor e Guardião Supremo do Design System de Solta o Verbo**. Deve ser consultada e executada antes e depois de qualquer alteração ou criação de componentes de interface no repositório `soltaoverbo`.

---

## 📜 Regras Estritas de Design (Contrato Inviolável)

### 1. 🔤 Sistema de Tipografia da Área do Aluno (Contrato Estrito)
- **Muthazle (`font-gesto`)**: Usada para Saudações principais (`olá, aluna! font-size: 2.3rem`), Títulos de Cards Bento (`font-size: 2.2rem`), e Botões de Ação (`entrar →`, `+ novo texto`, `meus cadernos`, `retomar`, `escrever algo novo`, `abrir →`, `explorar tudo`) em **tamanho 23px no Desktop (`text-[23px]`) e 20px no Mobile (`text-[20px] sm:text-[23px]`)**.
- **Helvetica / Sans Contemporânea (`font-corpo`)**: Usada em **tamanho mínimo 14px (`text-sm`)**, em sua maioria **light/normal (`font-light` ou `font-normal`)** para descrições, tooltips, corpo de texto, etiquetas (tags), badges, metadados e **Abas de Filtro (`todos`, `ao vivo`, `convites`)**.
- **PP Editorial Serif (`font-editorial`)**: Usada exclusivamente para Títulos de eventos específicos (`café com letras`), Cursos/Oficinas (`21 dias de escrita`), Títulos de publicações e provocações poéticas da comunidade.
- 🚫 **PROIBIÇÃO DE FUNDOS COM TRANSPARÊNCIA**: Eliminar caixas de tags ou blocos com lavagens transparentes (`/10`, `/15`, `/20`, `/60`). Usar sempre fundos sólidos oficiais (`bg-white`, `bg-bgPlataforma`, `bg-papelClaro`, `bg-acentoAzul`, `bg-acentoTerracota`).
- 🚫 **PROIBIÇÃO ABSOLUTA**: NUNCA utilizar `font-mono`, fontes monospace genéricas, ou fontes não aprovadas.

---

### 2. 🔤 Regra de Minúsculas Estritas (No Uppercase)
- **TODO o texto da interface** em botões, títulos, subtítulos, selos, etiquetas (tags), datas, contadores e caixas de busca DEVE ser **estritamente em minúsculas (`lowercase`)**.
- Exemplo correto: `exercícios de escrita`, `novo texto`, `membro premium`, `agosto 2026`, `ver agenda completa`.
- 🚫 **PROIBIÇÃO ABSOLUTA**: NUNCA utilizar texto em maiúsculas, `capitalize` ou classes Tailwind como `uppercase` ou `capitalize` em rótulos de UI.

---

### 3. 📐 Borda sem Grosor (Somente Hairlines Estáticas Finas - Sem Borda em Hover)
- Os bordos de cards, botões, modais e entradas devem ser bordas finas e sutilíssimas de papel (`border border-papelKraft/40` ou `border border-papelKraft/30`).
- 🚫 **PROIBIÇÃO ABSOLUTA DE BORDAS COM GROSSURA E BORDA EM HOVER**:
  - NUNCA utilizar `border-2`, `border-4`, `border-l-4`, ou qualquer borda com espessura visível em cards, botões ou seletores.
  - NUNCA adicionar ou alterar a espessura da borda no hover (ex: `hover:border-2`, `hover:border-acentoTerracota` em cards).
  - No hover de cards e botões, alterar apenas o tom sutil do fundo (`hover:bg-white/80`) ou aplicar sombra suave (`hover:shadow-sm` ou `hover:shadow-md`), mantendo SEMPRE a borda estática fina e elegante sem mudar de espessura.

---

### 4. 🚫 Proibição Total e Absoluta de Emojis no Código e UI
- **NUNCA UTILIZE EMOJIS EM NENHUMA PARTE DO DESIGN, CÓDIGO OU INTERFACE.**
- Toda a iconografia DEVE utilizar exclusivamente ícones vetoriais SVG da biblioteca `lucide-react` (ex: `<Sun />`, `<Flame />`, `<Feather />`, `<Crown />`, `<Coffee />`, `<Rocket />`, `<Sparkles />`, `<Users />`, `<MessageSquare />`, `<Send />`, `<Maximize2 />`, `<ChevronUp />`).
- 🚫 **PROIBIÇÃO ABSOLUTA**: NUNCA utilizar caracteres emojis genéricos em Unicode (ex: 🚀, 💬, 👥, 🌅, 🔥, ✨, 🪶, ☕, 🌿, 👑, 📔, 📖) no JSX, botões, modais, títulos, tags, descrições ou placeholders. Substitua SEMPRE por ícones SVG do Lucide!

---

### 5. 🎨 Cores Sólidas da Paleta Oficial (Sem Gradientes ou Transparências em Ações)
- A paleta oficial da plataforma é composta exclusivamente por:
  - **Fundo da Plataforma**: `#EDE6D4` (`bg-bgPlataforma`)
  - **Papel Claro**: `#F7F3E8` (`bg-papelClaro`)
  - **Azul Profundo**: `#140D82` (`bg-acentoAzul text-white`)
  - **Terracota**: `#FD5E32` (`bg-acentoTerracota text-white`)
  - **Verde Limão / Oliva**: `#BEC540` (`bg-acentoOliva text-tintaCarvao`)
  - **Papel Kraft**: `#D9CDB8` (`bg-papelKraft text-tintaCarvao`)
  - **Tinta Carbão**: `#2C2720` (`text-tintaCarvao`)
- Botões primários, etiquetas de estado e blocos de data DEVEM utilizar **cores sólidas da marca**.
- 🚫 **PROIBIÇÃO ABSOLUTA**: NUNCA utilizar gradientes CSS (`bg-gradient-to-r`, `from-`, `to-`), fundos translúcidos em botões de ação principal, ou bordas fluorescentes fora da paleta.

---

### 6. 🏗️ Bento Grid e Desacoplamento de Alturas
- No container Bento Grid principal (`Dashboard.tsx`), utilizar sempre `items-start` para que cada card assuma a sua altura própria de forma independente, sem esticar ou deformar o card adjacente.

---

### 7. 🎨 Cores Dinâmicas nos Blocos de Data da Agenda
- O fundo do bloco de data varia obrigatoriamente conforme a categoria do evento:
  - **Café com Letras / Encontros Ao Vivo**: Azul (`bg-acentoAzul text-white`).
  - **Mentorias Exclusivas / Convites Admin**: Terracota (`bg-acentoTerracota text-white`).
  - **Lançamentos de Ciclo / Programas**: Verde Limão / Oliva (`bg-acentoOliva text-tintaCarvao`).
  - **Rituais Pessoais**: Papel Kraft (`bg-papelKraft text-tintaCarvao`).

---

### 8. 📐 Tamanho Uniforme dos Ícones de Categoria
- Todos os ícones de tipo de evento no canto superior direito do card de agenda devem ter tamanho estritamente uniforme (`w-5 h-5`).

---

### 9. ↗️ Botão Expander de Card (Ícone Exclusivo + Tooltip)
- O botão de expandir cards/agenda deve ser **exclusivamente o ícone `<Maximize2 className="w-4 h-4" />`** sem texto interno, posicionado no canto superior direito (`absolute top-5 right-5 z-20`) com tooltip emergente no hover (`ver agenda completa`).

---

## 🔍 Checklist de Auto-Auditoria para o Agente

Ao criar ou editar qualquer arquivo JSX/TSX de UI:

1. [ ] **Verificação de Fontes**: Pesquisar por `font-mono` no código editado. Se existir, remover e substituir pela fonte da marca.
2. [ ] **Verificação de Caixa**: Garantir que todo o texto impresso no JSX está em minúsculas e sem a classe `uppercase`.
3. [ ] **Verificação de Bordas**: Garantir que nenhum elemento possua `border-2` ou altere a espessura no `hover:`.
4. [ ] **Verificação de Emojis**: Garantir que nenhum caractere Unicode emoji está presente no JSX, substituindo por ícones do `lucide-react`.
5. [ ] **Verificação de Gradientes**: Garantir que nenhuma classe `bg-gradient-*` seja usada.
6. [ ] **Verificação de Cores Dinâmicas**: Garantir que blocos de data usam as cores sólidas por categoria.

---

*Esta skill auto-enriquece o agente Antigravity em todas as sessões e projetos de Solta o Verbo.*
