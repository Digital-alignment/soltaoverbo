---
name: solta-o-verbo-vps-deploy-verifier
description: Execute end-to-end build verification, PWA cache unregistration, git versioning, zero-downtime Docker deployment on Hostinger VPS using the dedicated soltaoverbo_vps SSH key, and Obsidian Vault history logging after any CMS or feature edit.
---

# 🚀 Solta o Verbo - VPS Deploy & Post-Edit Verifier Skill

Esta skill atua como **Gerenciador de Deploy e Verificação em Produção (VPS Deploy & Verification Master)**. Ela deve ser executada após alterar qualquer campo do CMS, fix de bug ou nova funcionalidade no repositório `soltaoverbo`.

---

## 🎯 Objetivo da Skill

Garantir um pipeline de integração e publicação **zero-downtime**, seguro e rastreável no servidor Hostinger VPS (`soltaoverbocoletivo.com`), cumprindo estritamente as reglas de aislamiento SSH, desactivación temporal de caché PWA durante desarrollos activos y registro de bitácora en el vault de Obsidian.

---

## 🔒 Regra de Ouro: Aislamiento Estrito de Claves SSH (Regla 6)

> [!CAUTION]
> **REGLA 6 DE DIGITAL ALIGNMENT**:
> Bajo NINGUNA circunstancia se debe acceder, modificar o interactuar con el proyecto Nipei OS (`nipei-os`, `nipei-gateway`) ni utilizar la clave `nipei_vps`.
> Para **Solta o Verbo**, se debe utilizar EXCLUSIVAMENTE la clave SSH dedicada:
> `C:\Users\ondig\.ssh\soltaoverbo_vps` no servidor `root@85.31.61.100`.

---

## 📋 Protocolo de Deploy e Verificação em 5 Passos

### Passo 1: Validação e Compilação Local
1. Executar no terminal na raiz de `soltaoverbo`:
   ```bash
   npm run build
   ```
2. Confirmar que a compilação Vite e o bundling de tipos TypeScript foram concluídos com **0 erros** (código de saída 0).
3. Caso ocorram erros de sintaxe ou de importação, corrigir imediatamente antes de prosseguir.

---

### Passo 2: Gerenciamento de PWA e Polítia de Cachê
1. Durante fases de desenvolvimento ativo com múltiplas edições consecutivas, garantir que a PWA esteja configurada como desativada (`disable: true`, `selfDestroying: true` em `vite.config.ts`).
2. Confirmar que `src/main.tsx` executa a desinstalação de Service Workers ativos e limpeza de `caches.delete()`, para que os navegadores das usuárias e administradoras recebam as atualizações sem retenção de cachê.

---

### Passo 3: Controle de Versão Git (Commit & Push)
1. Adicionar todos os arquivos modificados:
   ```bash
   git add .
   ```
2. Criar um commit claro com prefixo semântico (`feat`, `fix`, `chore`):
   ```bash
   git commit -m "feat(cms): descrição clara da alteração realizada"
   ```
3. Enviar as alterações para o repositório remoto:
   ```bash
   git push origin main
   ```

---

### Passo 4: Deploy Automatizado na Hostinger VPS
1. Executar o comando SSH remoto utilizando obrigatoriamente a chave dedicada `soltaoverbo_vps`:
   ```powershell
   ssh -o BatchMode=yes -o StrictHostKeyChecking=no -i C:\Users\ondig\.ssh\soltaoverbo_vps root@85.31.61.100 "cd /docker/soltaoverbocoletivo && git pull origin main && docker compose build --no-cache && docker compose up -d --force-recreate"
   ```
2. Acompanhar a saída do comando Docker Compose até a confirmação final:
   - `Image soltaoverbocoletivo-soltaoverbo Built`
   - `Container soltaoverbo Started`

---

### Passo 5: Registro de Bitácora no Vault Obsidian (Regra 4)
1. Abrir a nota viva do cliente em `C:\Users\ondig\Desktop\DA\digitalalignment\Clientes\Solta o verbo.md`.
2. Incluir uma nova entrada com a data atual sob o bloco `historial:` no frontmatter YAML:
   ```yaml
   historial:
     - fecha: "YYYY-MM-DD"
       texto: "Descrição detalhada do recurso ou campo editado no CMS e implantado via Docker em soltaoverbocoletivo.com."
   ```
3. Atualizar também o arquivo `walkthrough.md` no artifact da sessão.

---

## 🔍 Checklist de Confirmação de Deploy

- [ ] Build local `npm run build` passou com 0 erros
- [ ] Push concluído com sucesso para `origin/main`
- [ ] Deploy na VPS executado com a chave `C:\Users\ondig\.ssh\soltaoverbo_vps`
- [ ] Container Docker reiniciado sem quedas (`Container soltaoverbo Started`)
- [ ] Nota viva `Solta o verbo.md` no vault atualizada com histórico e data
- [ ] Verificação em produção no domínio `soltaoverbocoletivo.com`
