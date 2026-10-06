/**
 * Microserviço Node.js para Solta o Verbo
 * Endpoints:
 * - GET  /api/health
 * - POST /api/auth/welcome-email
 * - POST /api/webhooks/infinitepay
 * - POST /api/contact
 */

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

// Carrega variáveis do arquivo .env automaticamente caso presentes
try {
  const envPath = path.resolve(process.cwd(), '.env');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    for (const line of envContent.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const idx = trimmed.indexOf('=');
      if (idx !== -1) {
        const key = trimmed.slice(0, idx).trim();
        const value = trimmed.slice(idx + 1).trim();
        if (key && !process.env[key]) {
          process.env[key] = value;
        }
      }
    }
  }
} catch (e) {
  console.warn('[Env] Falha ao ler .env:', e.message);
}

import {
  getWelcomeEmailHtml,
  getPaymentConfirmedHtml,
  getAdminNotificationHtml,
  getOnboardingStepsEmailHtml,
  get21DiasWelcomeEmailHtml,
  getCafeWelcomeEmailHtml,
  getTrialCountdownEmailHtml,
} from './templates/emailTemplates.mjs';

const PORT = parseInt(process.env.PORT || '3001', 10);
const RESEND_API_KEY = process.env.RESEND_API_KEY || '';
const RESEND_FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'Solta o Verbo <ola@contato.soltaoverbocoletivo.com>';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'soltaoverbocoletivo@gmail.com';
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://qtdruienammtqodgfqty.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const CRON_SECRET = process.env.CRON_SECRET || '';

// Cache em memória para reforço de idempotência
const sentTrialRemindersCache = new Set();

/**
 * Envio seguro de e-mails via Resend API
 */
async function sendEmailViaResend({ to, subject, html, replyTo = 'soltaoverbocoletivo@gmail.com' }) {
  if (!RESEND_API_KEY) {
    console.warn('[Resend] RESEND_API_KEY não configurada. E-mail simulado.');
    return { success: false, reason: 'missing_api_key' };
  }

  const recipientList = Array.isArray(to) ? to : [to];

  try {
    const payload = {
      from: RESEND_FROM_EMAIL,
      to: recipientList,
      subject,
      html,
      reply_to: replyTo,
    };

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const resData = await response.json();

    if (!response.ok) {
      console.warn(`[Resend Error ${response.status}]:`, resData);

      // Se o erro for de validação por domínio não verificado no modo de teste,
      // encaminha a notificação diretamente para o e-mail administrativo com alerta claro.
      if (response.status === 403 || (resData.message && resData.message.includes('only send testing emails'))) {
        console.info(`[Resend Fallback]: Encaminhando cópia para ${ADMIN_EMAIL} enquanto o domínio é verificado.`);
        const fallbackSubject = `[Aviso Teste Resend] ${subject} (Para: ${recipientList.join(', ')})`;
        const fallbackHtml = `
          <div style="background-color: #FEF3C7; border: 1px solid #F59E0B; padding: 12px 16px; border-radius: 8px; margin-bottom: 20px; font-family: sans-serif; font-size: 13px; color: #92400E;">
            <strong>Aviso de Modo de Teste do Resend:</strong><br>
            Este e-mail era destinado a: <strong>${recipientList.join(', ')}</strong>.<br>
            Como o domínio oficial ainda está pendente de verificação DNS no Resend, o envio foi direcionado à sua caixa administrativa.
          </div>
          ${html}
        `;

        const fallbackResponse = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: RESEND_FROM_EMAIL,
            to: [ADMIN_EMAIL],
            subject: fallbackSubject,
            html: fallbackHtml,
          }),
        });

        const fallbackData = await fallbackResponse.json();
        return { success: true, forwardedToAdmin: true, details: fallbackData };
      }

      return { success: false, error: resData };
    }

    console.info(`[Resend Success]: E-mail enviado com sucesso para ${recipientList.join(', ')} (ID: ${resData.id})`);
    return { success: true, data: resData };
  } catch (error) {
    console.error('[Resend Exception]:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Utilitário Supabase REST API via Service Role
 */
async function supabaseRest(endpoint, options = {}) {
  const url = `${SUPABASE_URL}/rest/v1/${endpoint}`;
  const headers = {
    'apikey': SUPABASE_SERVICE_ROLE_KEY,
    'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
    'Content-Type': 'application/json',
    'Prefer': 'return=representation',
    ...(options.headers || {}),
  };

  const response = await fetch(url, { ...options, headers });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Supabase REST Error (${response.status}): ${errorText}`);
  }
  return await response.json();
}

/**
 * Busca e-mail de login real da usuária no Supabase Auth Admin
 */
async function fetchAuthUserEmail(userId) {
  try {
    const url = `${SUPABASE_URL}/auth/v1/admin/users/${encodeURIComponent(userId)}`;
    const res = await fetch(url, {
      headers: {
        'apikey': SUPABASE_SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data?.email || null;
  } catch (err) {
    console.warn(`[Auth Admin] Falha ao obter e-mail da usuária ${userId}:`, err.message);
    return null;
  }
}

/**
 * Processador de Lembretes de Contagem Regressiva de Degustação (Fase 1)
 * Envia e-mail afetuoso faltando ~24h para o término do período de 96h (janela: 70h a 95h após cadastro)
 */
async function processTrialCountdownReminders({ dryRun = false, forceUserId = null } = {}) {
  const now = Date.now();
  const windowStart = new Date(now - 95 * 60 * 60 * 1000).toISOString(); // 95h atrás
  const windowEnd = new Date(now - 70 * 60 * 60 * 1000).toISOString();   // 70h atrás

  console.info(`[Trial Countdown Cron] Iniciando verificação... (dryRun: ${dryRun}, forceUser: ${forceUserId || 'nenhum'})`);

  let candidateProfiles = [];

  if (forceUserId) {
    try {
      candidateProfiles = await supabaseRest(`users_profiles?id=eq.${encodeURIComponent(forceUserId)}`);
    } catch (e) {
      console.error('[Trial Countdown Cron] Erro ao buscar usuária forçada:', e.message);
      return { success: false, error: e.message };
    }
  } else {
    try {
      candidateProfiles = await supabaseRest(
        `users_profiles?created_at=gte.${encodeURIComponent(windowStart)}&created_at=lte.${encodeURIComponent(windowEnd)}&order=created_at.asc`
      );
    } catch (e) {
      console.error('[Trial Countdown Cron] Erro ao buscar candidatas:', e.message);
      return { success: false, error: e.message };
    }
  }

  const results = {
    totalCandidates: candidateProfiles.length,
    processed: [],
    skipped: [],
    sentCount: 0,
    dryRun,
    timestamp: new Date().toISOString(),
  };

  for (const profile of candidateProfiles) {
    const userId = profile.id;

    // 1. Pular administradoras ou usuárias pagas
    if (profile.role === 'admin' || profile.role === 'paid') {
      results.skipped.push({ userId, reason: `papel_${profile.role}` });
      continue;
    }

    // 2. Verificar se já possui entitlements ativos
    try {
      const entitlements = await supabaseRest(`user_entitlements?user_id=eq.${encodeURIComponent(userId)}&status=eq.active`);
      const hasActive = entitlements.some(e => !e.expires_at || new Date(e.expires_at).getTime() > now);
      if (hasActive) {
        results.skipped.push({ userId, reason: 'entitlement_ativo' });
        continue;
      }
    } catch (entErr) {
      console.warn(`[Trial Countdown Cron] Aviso ao checar entitlements de ${userId}:`, entErr.message);
    }

    // 3. Verificar idempotência via campo no perfil ou cache local em memória
    if (profile.trial_reminder_sent_at || sentTrialRemindersCache.has(userId)) {
      results.skipped.push({ userId, reason: 'lembrete_ja_enviado_previamente' });
      continue;
    }

    // 4. Verificar idempotência via tabela de notificações in-app
    try {
      const existingNotifs = await supabaseRest(
        `notifications?user_id=eq.${encodeURIComponent(userId)}&title=ilike.*degusta%C3%A7%C3%A3o%20termina*&limit=1`
      );
      if (existingNotifs && existingNotifs.length > 0) {
        sentTrialRemindersCache.add(userId);
        results.skipped.push({ userId, reason: 'notificacao_ja_existente' });
        continue;
      }
    } catch (notifErr) {
      console.warn(`[Trial Countdown Cron] Aviso ao checar notificações de ${userId}:`, notifErr.message);
    }

    // 5. Determinar e-mail de destino
    let recipientEmail = profile.email_public && profile.email_public.includes('@') ? profile.email_public : null;
    if (!recipientEmail) {
      recipientEmail = await fetchAuthUserEmail(userId);
    }

    if (!recipientEmail) {
      results.skipped.push({ userId, reason: 'email_nao_localizado' });
      continue;
    }

    // 6. Contar rascunhos poéticos para personalizar o e-mail
    let draftsCount = 0;
    try {
      const drafts = await supabaseRest(`writing_exercises?user_id=eq.${encodeURIComponent(userId)}&select=id`);
      draftsCount = Array.isArray(drafts) ? drafts.length : 0;
    } catch (draftErr) {
      console.warn(`[Trial Countdown Cron] Aviso ao contar rascunhos de ${userId}:`, draftErr.message);
    }

    // 7. Se for dryRun, apenas relata sem disparar e-mail
    if (dryRun) {
      results.processed.push({
        userId,
        email: recipientEmail,
        displayName: profile.display_name,
        draftsCount,
        status: 'dry_run_elegivel',
      });
      continue;
    }

    // 8. Enviar e-mail de contagem regressiva via Resend
    try {
      const emailHtml = getTrialCountdownEmailHtml({
        displayName: profile.display_name,
        draftsCount,
      });

      console.info(`[Trial Countdown Cron] Enviando e-mail de 24h restantes para ${recipientEmail} (${profile.display_name})...`);
      const emailResult = await sendEmailViaResend({
        to: recipientEmail,
        subject: 'sua degustação termina em 24 horas 𖦹',
        html: emailHtml,
      });

      // Registrar envio no perfil (se a coluna existir)
      try {
        await supabaseRest(`users_profiles?id=eq.${encodeURIComponent(userId)}`, {
          method: 'PATCH',
          body: JSON.stringify({ trial_reminder_sent_at: new Date().toISOString() }),
        });
      } catch (patchErr) {
        console.warn(`[Trial Countdown Cron] Aviso ao atualizar trial_reminder_sent_at no perfil de ${userId}:`, patchErr.message);
      }

      // Inserir notificação in-app na plataforma
      try {
        await supabaseRest('notifications', {
          method: 'POST',
          body: JSON.stringify({
            user_id: userId,
            type: 'course_update',
            title: 'sua degustação termina em 24 horas',
            message: 'faltam 24 horas para o fim da sua degustação livre. seus cadernos continuam guardados com carinho na sua estante!',
            link: '/exercicios',
            is_read: false,
          }),
        });
      } catch (notifInsertErr) {
        console.warn(`[Trial Countdown Cron] Aviso ao criar notificação de ${userId}:`, notifInsertErr.message);
      }

      // Adicionar ao cache em memória
      sentTrialRemindersCache.add(userId);
      results.sentCount += 1;
      results.processed.push({
        userId,
        email: recipientEmail,
        displayName: profile.display_name,
        draftsCount,
        status: 'enviado_com_sucesso',
        emailResult,
      });
    } catch (sendErr) {
      console.error(`[Trial Countdown Cron] Erro ao enviar e-mail para ${recipientEmail}:`, sendErr.message);
      results.processed.push({
        userId,
        email: recipientEmail,
        status: 'erro_ao_enviar',
        error: sendErr.message,
      });
    }
  }

  console.info(`[Trial Countdown Cron] Processamento concluído: ${results.sentCount} e-mails enviados, ${results.skipped.length} ignorados.`);
  return results;
}

/**
 * Handlers de rota
 */
const server = http.createServer(async (req, res) => {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);

  // 1. Healthcheck
  if (req.method === 'GET' && (url.pathname === '/api/health' || url.pathname === '/health')) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'ok',
      service: 'soltaoverbo-api',
      timestamp: new Date().toISOString(),
      resendConfigured: !!RESEND_API_KEY,
    }));
    return;
  }

  // Helper para ler JSON do corpo
  const parseJsonBody = () => new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (err) {
        reject(err);
      }
    });
    req.on('error', reject);
  });

  // 2. POST /api/auth/welcome-email (Registro de novas alunas: boas-vindas + primeiros passos)
  if (req.method === 'POST' && url.pathname === '/api/auth/welcome-email') {
    try {
      const { email, displayName } = await parseJsonBody();

      if (!email || !email.includes('@')) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'E-mail inválido ou ausente' }));
        return;
      }

      console.info(`[Auth] Disparando e-mail de boas-vindas para: ${email} (${displayName})`);

      const emailHtml = getWelcomeEmailHtml({
        displayName: displayName || email.split('@')[0],
        email,
      });

      // 1. Envia boas-vindas para a usuária
      const welcomeResult = await sendEmailViaResend({
        to: email,
        subject: 'boas-vindas ao solta o verbo · sua jornada de escrita começa aqui',
        html: emailHtml,
      });

      // 2. Envia guia de primeiros passos da travessia logo em seguida
      console.info(`[Auth] Disparando guia de primeiros passos para: ${email}`);
      const onboardingHtml = getOnboardingStepsEmailHtml({
        displayName: displayName || email.split('@')[0],
        email,
      });

      const onboardingResult = await sendEmailViaResend({
        to: email,
        subject: 'preparada para soltar o verbo? 𖦹',
        html: onboardingHtml,
      });

      // 3. Envia notificação para admin
      const adminNoticeHtml = getAdminNotificationHtml({
        type: 'novo cadastro de usuária',
        details: {
          'Nome': displayName || 'não informado',
          'E-mail': email,
          'Data': new Date().toLocaleString('pt-BR'),
        },
      });

      await sendEmailViaResend({
        to: ADMIN_EMAIL,
        subject: `[novo cadastro] ${displayName || 'nova usuária'} criou conta no solta o verbo`,
        html: adminNoticeHtml,
      }).catch(err => console.error('[Admin Alert Error]:', err));

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: true,
        welcomeEmail: welcomeResult,
        onboardingEmail: onboardingResult,
      }));
    } catch (err) {
      console.error('[Welcome Email Error]:', err);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err.message }));
    }
    return;
  }

  // 3. POST /api/email/onboarding-steps (Guia da travessia / Primeiros passos)
  if (req.method === 'POST' && (url.pathname === '/api/email/onboarding-steps' || url.pathname === '/api/onboarding-email')) {
    try {
      const { email, displayName } = await parseJsonBody();

      if (!email || !email.includes('@')) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'E-mail inválido ou ausente' }));
        return;
      }

      console.info(`[Email] Disparando guia de primeiros passos para: ${email} (${displayName})`);

      const onboardingHtml = getOnboardingStepsEmailHtml({
        displayName: displayName || email.split('@')[0],
        email,
      });

      const sendResult = await sendEmailViaResend({
        to: email,
        subject: 'preparada para soltar o verbo? 𖦹',
        html: onboardingHtml,
      });

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, sendResult }));
    } catch (err) {
      console.error('[Onboarding Steps Error]:', err);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err.message }));
    }
    return;
  }

  // 4. GET / POST /api/cron/trial-countdown-reminders (Lembrete poético das 24h restantes do período de teste)
  if (
    (req.method === 'POST' || req.method === 'GET') &&
    url.pathname === '/api/cron/trial-countdown-reminders'
  ) {
    try {
      const authHeader = req.headers['authorization'] || '';
      const secretHeader = req.headers['x-cron-secret'] || '';
      const querySecret = url.searchParams.get('secret') || '';
      const bearerToken = authHeader.replace(/^Bearer\s+/i, '');

      if (CRON_SECRET) {
        const matches = secretHeader === CRON_SECRET || bearerToken === CRON_SECRET || querySecret === CRON_SECRET;
        if (!matches) {
          res.writeHead(401, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Acesso não autorizado ao endpoint de cron' }));
          return;
        }
      }

      let bodyData = {};
      if (req.method === 'POST') {
        bodyData = await parseJsonBody().catch(() => ({}));
      }

      const dryRun = url.searchParams.get('dryRun') === 'true' || bodyData.dryRun === true;
      const forceUserId = url.searchParams.get('forceUserId') || bodyData.forceUserId || null;

      const result = await processTrialCountdownReminders({ dryRun, forceUserId });

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(result));
    } catch (err) {
      console.error('[Cron Trial Countdown Error]:', err);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err.message }));
    }
    return;
  }

  // 3. POST /api/webhooks/infinitepay (Confirmação de pagamento InfinitePay)
  if (req.method === 'POST' && (url.pathname === '/api/webhooks/infinitepay' || url.pathname === '/api/infinitepay-webhook')) {
    try {
      const payload = await parseJsonBody();
      console.info('[InfinitePay Webhook] Dados recebidos:', JSON.stringify(payload));

      const {
        invoice_slug,
        amount,
        paid_amount,
        installments = 1,
        capture_method = 'pix / cartão',
        transaction_nsu,
        order_nsu,
        receipt_url,
        customer,
        items,
      } = payload;

      const orderIdentifier = order_nsu || transaction_nsu || invoice_slug;
      if (!orderIdentifier) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Identificador do pedido ausente (order_nsu / transaction_nsu)' }));
        return;
      }

      let userId = null;
      let customerEmail = customer?.email || null;
      let customerName = customer?.name || null;

      // 1. Localizar tentativa de checkout pelo order_nsu
      if (order_nsu) {
        try {
          const attempts = await supabaseRest(`checkout_attempts?order_nsu=eq.${encodeURIComponent(order_nsu)}&order=attempted_at.desc&limit=1`);
          if (attempts && attempts.length > 0) {
            userId = attempts[0].user_id;
            if (!customerEmail) customerEmail = attempts[0].email;
          }
        } catch (e) {
          console.warn('[Webhook] Aviso ao buscar checkout_attempts:', e.message);
        }
      }

      // 2. Se não achou por checkout_attempts, busca pelo perfil da usuária
      if (!userId && customerEmail) {
        try {
          const profiles = await supabaseRest(`users_profiles?email_public=eq.${encodeURIComponent(customerEmail)}&limit=1`);
          if (profiles && profiles.length > 0) {
            userId = profiles[0].id;
            if (!customerName) customerName = profiles[0].display_name;
          }
        } catch (e) {
          console.warn('[Webhook] Aviso ao buscar users_profiles:', e.message);
        }
      }

      // 3. Atualizar papel da usuária no Supabase
      if (userId) {
        try {
          // Atualiza para papel 'paid'
          await supabaseRest(`users_profiles?id=eq.${encodeURIComponent(userId)}`, {
            method: 'PATCH',
            body: JSON.stringify({ role: 'paid' }),
          });

          // Determinar produto comprado a partir de valor e itens
          const paidCents = paid_amount || amount || 0;
          const itemsDesc = (items && items[0]?.description) ? items[0].description.toLowerCase() : '';
          let productSlug = 'ciclo_aprofundamento'; // Default bundle
          let durationDays = 365;

          if (paidCents === 7700 || itemsDesc.includes('21 dias') || itemsDesc.includes('21_dias')) {
            productSlug = '21_dias';
            durationDays = 365;
          } else if (itemsDesc.includes('cafe') || itemsDesc.includes('café') || itemsDesc.includes('mensal')) {
            productSlug = 'cafe_com_letras';
            durationDays = 30;
          } else if (itemsDesc.includes('ciclo') || itemsDesc.includes('aprofundamento')) {
            productSlug = 'ciclo_aprofundamento';
            durationDays = 365;
          }

          const expiresDate = new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000).toISOString();

          // Registra entitlement granular do produto
          try {
            await supabaseRest('user_entitlements', {
              method: 'POST',
              body: JSON.stringify({
                user_id: userId,
                product_slug: productSlug,
                status: 'active',
                source: 'infinitepay',
                order_id: transaction_nsu || order_nsu || invoice_slug,
                starts_at: new Date().toISOString(),
                expires_at: expiresDate,
                metadata: {
                  paid_amount: paidCents,
                  installments,
                  capture_method,
                },
              }),
            });
            console.info(`[Webhook] Entitlement '${productSlug}' registrado com sucesso para a usuária ${userId}`);
          } catch (entErr) {
            console.warn('[Webhook] Aviso ao registrar user_entitlements:', entErr.message);
          }

          // Registra assinatura legada para retrocompatibilidade
          await supabaseRest('user_subscriptions', {
            method: 'POST',
            body: JSON.stringify({
              user_id: userId,
              stripe_payment_id: transaction_nsu || order_nsu || invoice_slug,
              status: 'active',
              started_at: new Date().toISOString(),
              expires_at: expiresDate,
              installment_plan: installments > 1 ? `${installments}x` : 'one_time',
              total_installments: installments,
              completed_installments: 1,
            }),
          });

          // Insere notificação in-app
          await supabaseRest('notifications', {
            method: 'POST',
            body: JSON.stringify({
              user_id: userId,
              type: 'course_update',
              title: 'Pagamento confirmado com sucesso!',
              message: `Seu pagamento via InfinitePay (${capture_method}) foi confirmado! Seu acesso total está liberado.`,
              link: '/dashboard',
              is_read: false,
            }),
          });

          // Marca checkout_attempts como concluído
          if (order_nsu) {
            await supabaseRest(`checkout_attempts?order_nsu=eq.${encodeURIComponent(order_nsu)}`, {
              method: 'PATCH',
              body: JSON.stringify({
                completed: true,
                completed_at: new Date().toISOString(),
                user_id: userId,
              }),
            });
          }

          console.info(`[Webhook] Usuária ${userId} promovida com sucesso para 'paid'`);
        } catch (dbErr) {
          console.error('[Webhook DB Update Error]:', dbErr);
        }
      }

      // 4. Identificar nome do plano ou produto
      let planDescription = 'inscrição solta o verbo';
      if (items && Array.isArray(items) && items.length > 0 && items[0].description) {
        planDescription = items[0].description;
      }

      // 5. Enviar e-mail de confirmação ao comprador via Resend
      const targetEmail = customerEmail || ADMIN_EMAIL;
      const paymentEmailHtml = getPaymentConfirmedHtml({
        customerName: customerName || customer?.name || 'escritora',
        customerEmail: customerEmail,
        amount: paid_amount || amount,
        planName: planDescription,
        orderId: orderIdentifier,
        captureMethod: capture_method,
        installments,
        receiptUrl: receipt_url,
      });

      const buyerEmailResult = await sendEmailViaResend({
        to: targetEmail,
        subject: 'pagamento confirmado · seu acesso ao solta o verbo está liberado!',
        html: paymentEmailHtml,
      });

      // 6. Enviar guia de boas-vindas específico do produto comprado
      let onboardingEmailResult = null;
      try {
        console.info(`[InfinitePay] Enviando guia específico para '${productSlug}' para: ${targetEmail}`);
        let specializedHtml = '';
        let specializedSubject = '';

        if (productSlug === '21_dias') {
          specializedSubject = 'bem-vinda aos 21 dias de escrita 𖦹';
          specializedHtml = get21DiasWelcomeEmailHtml({
            displayName: customerName || customer?.name || 'escritora',
            email: targetEmail,
          });
        } else if (productSlug === 'cafe_com_letras') {
          specializedSubject = 'bem-vinda ao café com letras ☕';
          specializedHtml = getCafeWelcomeEmailHtml({
            displayName: customerName || customer?.name || 'escritora',
            email: targetEmail,
          });
        } else {
          // Ciclo de Aprofundamento (bundle com Jout Jout e encontros ao vivo)
          specializedSubject = 'preparada para soltar o verbo? 𖦹';
          specializedHtml = getOnboardingStepsEmailHtml({
            displayName: customerName || customer?.name || 'escritora',
            email: targetEmail,
          });
        }

        onboardingEmailResult = await sendEmailViaResend({
          to: targetEmail,
          subject: specializedSubject,
          html: specializedHtml,
        });
      } catch (onboardingErr) {
        console.warn('[InfinitePay] Aviso ao enviar guia específico do produto:', onboardingErr.message);
      }

      // 7. Notificar o administrador por e-mail
      const adminNotification = getAdminNotificationHtml({
        type: 'pagamento confirmado (infinitepay)',
        details: {
          'Produto / Plano': planDescription,
          'Valor': `R$ ${((paid_amount || amount || 0) / 100).toFixed(2).replace('.', ',')}`,
          'Cliente': customerName || 'não informado',
          'E-mail': customerEmail || 'não informado',
          'Telefone': customer?.phone_number || 'não informado',
          'Forma de Pagamento': capture_method,
          'Parcelas': `${installments}x`,
          'ID Pedido': orderIdentifier,
        },
        rawPayload: payload,
      });

      await sendEmailViaResend({
        to: ADMIN_EMAIL,
        subject: `[pagamento recebido] R$ ${((paid_amount || amount || 0) / 100).toFixed(2).replace('.', ',')} · ${customerName || customerEmail || 'nova inscrição'}`,
        html: adminNotification,
      }).catch(err => console.error('[Admin Order Alert Error]:', err));

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: true,
        order: orderIdentifier,
        buyerEmailResult,
        onboardingEmailResult,
      }));
    } catch (err) {
      console.error('[InfinitePay Webhook Error]:', err);
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err.message }));
    }
    return;
  }

  // 404 para outras rotas
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Endpoint não encontrado' }));
});

server.listen(PORT, '0.0.0.0', () => {
  console.info(`[soltaoverbo-api] Servidor ativo ouvindo na porta ${PORT}`);

  // Agendador autônomo periódico para lembretes de contagem regressiva (a cada 30 minutos)
  const THIRTY_MINUTES_MS = 30 * 60 * 1000;
  setTimeout(() => {
    processTrialCountdownReminders().catch(err => {
      console.error('[Trial Countdown Scheduler Exception]:', err);
    });
    setInterval(() => {
      processTrialCountdownReminders().catch(err => {
        console.error('[Trial Countdown Scheduler Exception]:', err);
      });
    }, THIRTY_MINUTES_MS);
  }, 60 * 1000); // Primeiro ciclo inicia 1 minuto após o boot
});

