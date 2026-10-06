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
 * Popula posts em destaque da antologia com dados de exercício e perfil de autora
 */
async function populateFeaturedPosts(postIds) {
  if (!postIds || postIds.length === 0) return [];
  try {
    const filter = postIds.map(id => `id.eq.${id}`).join(',');
    const posts = await supabaseRest(`community_posts?or=(${filter})&select=id,writing_exercise_id,user_id,likes_count,comments_count,published_at`);
    if (!posts || posts.length === 0) return [];

    const exerciseIds = [...new Set(posts.map(p => p.writing_exercise_id).filter(Boolean))];
    const userIds = [...new Set(posts.map(p => p.user_id).filter(Boolean))];

    const [exercises, users] = await Promise.all([
      exerciseIds.length > 0 ? supabaseRest(`writing_exercises?or=(${exerciseIds.map(id => `id.eq.${id}`).join(',')})&select=id,title,content,created_at`) : [],
      userIds.length > 0 ? supabaseRest(`users_profiles?or=(${userIds.map(id => `id.eq.${id}`).join(',')})&select=id,display_name,avatar_url,bio`) : [],
    ]);

    const exMap = new Map((exercises || []).map(e => [e.id, e]));
    const usrMap = new Map((users || []).map(u => [u.id, u]));

    const populated = posts.map(p => ({
      ...p,
      writing_exercise: exMap.get(p.writing_exercise_id) || null,
      user_profile: usrMap.get(p.user_id) || null,
    }));

    const orderMap = new Map(postIds.map((id, idx) => [id, idx]));
    return populated.sort((a, b) => (orderMap.get(a.id) ?? 999) - (orderMap.get(b.id) ?? 999));
  } catch (err) {
    console.warn('[Anthology Populate Error]:', err.message);
    return [];
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

  // 5. POST /api/coupons/validate (Validação de cupom poético)
  if (req.method === 'POST' && url.pathname === '/api/coupons/validate') {
    try {
      const { code, productSlug, userId } = await parseJsonBody();
      const cleanCode = (code || '').trim().toUpperCase();

      if (!cleanCode) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ valid: false, error: 'Código de cupom não informado' }));
        return;
      }

      const coupons = await supabaseRest(`coupons?code=eq.${encodeURIComponent(cleanCode)}&limit=1`);
      if (!coupons || coupons.length === 0) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ valid: false, error: 'Código de cupom não encontrado ou inválido' }));
        return;
      }

      const coupon = coupons[0];

      if (!coupon.active) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ valid: false, error: 'Este cupom foi desativado' }));
        return;
      }

      if (coupon.expires_at && new Date(coupon.expires_at).getTime() < Date.now()) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ valid: false, error: 'Este cupom já expirou' }));
        return;
      }

      if (coupon.max_uses !== null && coupon.used_count >= coupon.max_uses) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ valid: false, error: 'Este cupom atingiu o limite máximo de utilizações' }));
        return;
      }

      if (coupon.product_target !== 'all' && productSlug && productSlug !== 'all' && coupon.product_target !== productSlug) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          valid: false,
          error: `Este cupom é exclusivo para ${coupon.product_target === '21_dias' ? 'a oficina 21 dias' : coupon.product_target === 'cafe_com_letras' ? 'o café com letras' : 'o ciclo de aprofundamento'}.`,
        }));
        return;
      }

      if (userId) {
        const redemptions = await supabaseRest(`coupon_redemptions?coupon_id=eq.${encodeURIComponent(coupon.id)}&user_id=eq.${encodeURIComponent(userId)}&limit=1`);
        if (redemptions && redemptions.length > 0) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ valid: false, error: 'Você já resgatou este cupom anteriormente' }));
          return;
        }
      }

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        valid: true,
        coupon,
        message:
          coupon.type === 'free_access'
            ? 'Bolsa comunitária 100% integral disponível!'
            : coupon.type === 'trial_extension'
            ? `Extensão de degustação por +${coupon.benefit_value} dias!`
            : `Desconto de ${coupon.benefit_value}% aplicado com afeto!`,
      }));
    } catch (err) {
      console.error('[Coupon Validate Error]:', err);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ valid: false, error: err.message }));
    }
    return;
  }

  // 6. POST /api/coupons/redeem (Resgate e aplicação de cupom / bolsa comunitária)
  if (req.method === 'POST' && url.pathname === '/api/coupons/redeem') {
    try {
      const { code, productSlug, userId, userEmail } = await parseJsonBody();
      const cleanCode = (code || '').trim().toUpperCase();

      if (!cleanCode || !userId) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: 'Código e usuário são obrigatórios para resgate' }));
        return;
      }

      const coupons = await supabaseRest(`coupons?code=eq.${encodeURIComponent(cleanCode)}&limit=1`);
      if (!coupons || coupons.length === 0) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: 'Cupom não encontrado' }));
        return;
      }

      const coupon = coupons[0];

      if (!coupon.active) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: 'Este cupom foi desativado' }));
        return;
      }

      if (coupon.expires_at && new Date(coupon.expires_at).getTime() < Date.now()) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: 'Este cupom já expirou' }));
        return;
      }

      if (coupon.max_uses !== null && coupon.used_count >= coupon.max_uses) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: 'Limite de utilizações atingido' }));
        return;
      }

      const redemptions = await supabaseRest(`coupon_redemptions?coupon_id=eq.${encodeURIComponent(coupon.id)}&user_id=eq.${encodeURIComponent(userId)}&limit=1`);
      if (redemptions && redemptions.length > 0) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: 'Você já resgatou este cupom anteriormente' }));
        return;
      }

      // Determinar produto
      const finalProductSlug =
        coupon.product_target === 'all'
          ? (!productSlug || productSlug === 'all' ? '21_dias' : productSlug)
          : coupon.product_target;

      let expiresAt = null;
      let durationDays = 365;

      if (coupon.type === 'trial_extension') {
        durationDays = Number(coupon.benefit_value) || 30;
        expiresAt = new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000).toISOString();
      } else if (coupon.type === 'free_access') {
        durationDays = finalProductSlug === 'cafe_com_letras' ? 30 : 365;
        expiresAt = new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000).toISOString();
      }

      // 1. Inserir entitlement
      let entitlementData = null;
      try {
        const entRes = await supabaseRest('user_entitlements', {
          method: 'POST',
          body: JSON.stringify({
            user_id: userId,
            product_slug: coupon.type === 'trial_extension' ? 'degustacao_estendida' : finalProductSlug,
            status: 'active',
            source: 'coupon',
            order_id: `coupon-${coupon.code}`,
            starts_at: new Date().toISOString(),
            expires_at: expiresAt,
            metadata: {
              coupon_code: coupon.code,
              benefit_type: coupon.type,
              benefit_value: coupon.benefit_value,
            },
          }),
        });
        entitlementData = entRes;
      } catch (entErr) {
        console.warn('[Coupon Redeem] Aviso ao registrar user_entitlements:', entErr.message);
      }

      // 2. Atualizar papel da usuária para 'paid'
      try {
        await supabaseRest(`users_profiles?id=eq.${encodeURIComponent(userId)}`, {
          method: 'PATCH',
          body: JSON.stringify({ role: 'paid' }),
        });
      } catch (profileErr) {
        console.warn('[Coupon Redeem] Aviso ao atualizar users_profiles:', profileErr.message);
      }

      // 3. Incrementar used_count do cupom
      try {
        await supabaseRest(`coupons?id=eq.${encodeURIComponent(coupon.id)}`, {
          method: 'PATCH',
          body: JSON.stringify({ used_count: coupon.used_count + 1 }),
        });
      } catch (cupErr) {
        console.warn('[Coupon Redeem] Aviso ao incrementar used_count:', cupErr.message);
      }

      // 4. Inserir registro em coupon_redemptions
      try {
        await supabaseRest('coupon_redemptions', {
          method: 'POST',
          body: JSON.stringify({
            coupon_id: coupon.id,
            coupon_code: coupon.code,
            user_id: userId,
            user_email: userEmail || null,
            benefit_type: coupon.type,
            benefit_value: coupon.benefit_value,
            product_slug: finalProductSlug,
          }),
        });
      } catch (redErr) {
        console.warn('[Coupon Redeem] Aviso ao registrar coupon_redemptions:', redErr.message);
      }

      // 5. Inserir notificação in-app
      try {
        await supabaseRest('notifications', {
          method: 'POST',
          body: JSON.stringify({
            user_id: userId,
            type: 'system',
            title: 'bolsa / cupom ativado com afeto ✨',
            message: `seu código ${coupon.code} foi ativado com sucesso! aproveite a sua jornada.`,
            is_read: false,
          }),
        });
      } catch (notifErr) {
        // silencioso
      }

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: true,
        message: `código ${coupon.code} ativado com afeto! seus benefícios já estão livres.`,
        entitlement: entitlementData,
      }));
    } catch (err) {
      console.error('[Coupon Redeem Error]:', err);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: err.message }));
    }
    return;
  }

  // 6. ROTAS DE ANTOLOGIA MENSAL DA FOGUEIRA (Fase 4)
  // GET /api/anthologies
  if (req.method === 'GET' && url.pathname === '/api/anthologies') {
    try {
      const includeDrafts = url.searchParams.get('includeDrafts') === 'true';
      let endpoint = 'fogueira_anthologies?order=year.desc,month.desc';
      if (!includeDrafts) {
        endpoint += '&published=eq.true';
      }

      let anthologies = [];
      try {
        anthologies = await supabaseRest(endpoint);
      } catch (dbErr) {
        console.warn('[Anthologies API] Falha ao consultar fogueira_anthologies:', dbErr.message);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ anthologies: [] }));
        return;
      }

      // Popular posts para cada antologia
      const populatedAnthologies = await Promise.all(
        (anthologies || []).map(async (ant) => {
          if (!ant.featured_post_ids || ant.featured_post_ids.length === 0) {
            return { ...ant, featured_posts: [] };
          }
          const posts = await populateFeaturedPosts(ant.featured_post_ids);
          return { ...ant, featured_posts: posts };
        })
      );

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ anthologies: populatedAnthologies }));
    } catch (err) {
      console.error('[Anthologies API Error]:', err);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err.message, anthologies: [] }));
    }
    return;
  }

  // GET /api/anthologies/month-candidates?month=X&year=Y
  if (req.method === 'GET' && url.pathname === '/api/anthologies/month-candidates') {
    try {
      const month = parseInt(url.searchParams.get('month') || `${new Date().getMonth() + 1}`, 10);
      const year = parseInt(url.searchParams.get('year') || `${new Date().getFullYear()}`, 10);

      const startDate = new Date(year, month - 1, 1).toISOString();
      const endDate = new Date(year, month, 0, 23, 59, 59, 999).toISOString();

      let posts = [];
      try {
        posts = await supabaseRest(
          `community_posts?hidden_from_fogueira=eq.false&published_at=gte.${encodeURIComponent(startDate)}&published_at=lte.${encodeURIComponent(endDate)}&order=likes_count.desc&limit=30`
        );
      } catch (fetchErr) {
        console.warn('[Anthologies Candidates DB Error]:', fetchErr.message);
        posts = [];
      }

      if (!posts || posts.length === 0) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ candidates: [] }));
        return;
      }

      const exerciseIds = [...new Set(posts.map(p => p.writing_exercise_id).filter(Boolean))];
      const userIds = [...new Set(posts.map(p => p.user_id).filter(Boolean))];

      const [exercises, users] = await Promise.all([
        exerciseIds.length > 0 ? supabaseRest(`writing_exercises?or=(${exerciseIds.map(id => `id.eq.${id}`).join(',')})&select=id,title,content,created_at`) : [],
        userIds.length > 0 ? supabaseRest(`users_profiles?or=(${userIds.map(id => `id.eq.${id}`).join(',')})&select=id,display_name,avatar_url,bio`) : [],
      ]);

      const exMap = new Map((exercises || []).map(e => [e.id, e]));
      const usrMap = new Map((users || []).map(u => [u.id, u]));

      const candidates = posts.map(p => ({
        ...p,
        writing_exercise: exMap.get(p.writing_exercise_id) || null,
        user_profile: usrMap.get(p.user_id) || null,
      }));

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ candidates }));
    } catch (err) {
      console.error('[Anthologies Candidates Error]:', err);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err.message, candidates: [] }));
    }
    return;
  }

  // POST /api/anthologies (Criar ou atualizar antologia)
  if (req.method === 'POST' && url.pathname === '/api/anthologies') {
    try {
      const payload = await parseJsonBody();
      const { id, title, month, year, curator_note, cover_image_url, featured_post_ids, published } = payload;

      if (!title || !month || !year) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: 'Título, mês e ano são obrigatórios' }));
        return;
      }

      const record = {
        title: title.trim().toLowerCase(),
        month: parseInt(month, 10),
        year: parseInt(year, 10),
        curator_note: curator_note || null,
        cover_image_url: cover_image_url || null,
        featured_post_ids: featured_post_ids || [],
        published: published ?? false,
        published_at: published ? new Date().toISOString() : null,
        updated_at: new Date().toISOString(),
      };

      let result;
      if (id) {
        result = await supabaseRest(`fogueira_anthologies?id=eq.${encodeURIComponent(id)}`, {
          method: 'PATCH',
          body: JSON.stringify(record),
          headers: { 'Prefer': 'return=representation' },
        });
      } else {
        result = await supabaseRest('fogueira_anthologies', {
          method: 'POST',
          body: JSON.stringify(record),
          headers: { 'Prefer': 'return=representation' },
        });
      }

      const saved = Array.isArray(result) ? result[0] : result;
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, anthology: saved }));
    } catch (err) {
      console.error('[Anthologies Save Error]:', err);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: err.message }));
    }
    return;
  }

  // POST /api/anthologies/toggle-publish
  if (req.method === 'POST' && url.pathname === '/api/anthologies/toggle-publish') {
    try {
      const { id, published } = await parseJsonBody();
      if (!id) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: 'ID da antologia não informado' }));
        return;
      }

      await supabaseRest(`fogueira_anthologies?id=eq.${encodeURIComponent(id)}`, {
        method: 'PATCH',
        body: JSON.stringify({
          published: !!published,
          published_at: published ? new Date().toISOString() : null,
          updated_at: new Date().toISOString(),
        }),
      });

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true }));
    } catch (err) {
      console.error('[Anthologies Toggle Error]:', err);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: err.message }));
    }
    return;
  }

  // DELETE /api/anthologies
  if (req.method === 'DELETE' && url.pathname === '/api/anthologies') {
    try {
      const { id } = await parseJsonBody();
      if (!id) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: 'ID não informado' }));
        return;
      }

      await supabaseRest(`fogueira_anthologies?id=eq.${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true }));
    } catch (err) {
      console.error('[Anthologies Delete Error]:', err);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: err.message }));
    }
    return;
  }

  // 7. POST /api/webhooks/infinitepay (Confirmação de pagamento InfinitePay)
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
      let checkoutAttempt = null;
      if (order_nsu) {
        try {
          const attempts = await supabaseRest(`checkout_attempts?order_nsu=eq.${encodeURIComponent(order_nsu)}&order=attempted_at.desc&limit=1`);
          if (attempts && attempts.length > 0) {
            checkoutAttempt = attempts[0];
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

          // Determinar produto comprado a partir de valor, descrição e tentativa original de checkout
          const paidCents = paid_amount || amount || 0;
          const itemsDesc = (items && items[0]?.description) ? items[0].description.toLowerCase() : '';
          const attemptPlan = (checkoutAttempt?.plan_type || '').toLowerCase();
          let productSlug = 'ciclo_aprofundamento'; // Default bundle
          let durationDays = 365;

          if (
            paidCents === 7700 ||
            itemsDesc.includes('21 dias') ||
            itemsDesc.includes('21_dias') ||
            attemptPlan.includes('21 dias') ||
            attemptPlan.includes('21_dias')
          ) {
            productSlug = '21_dias';
            durationDays = 365;
          } else if (
            itemsDesc.includes('cafe') ||
            itemsDesc.includes('café') ||
            itemsDesc.includes('mensal') ||
            attemptPlan.includes('cafe') ||
            attemptPlan.includes('café')
          ) {
            productSlug = 'cafe_com_letras';
            durationDays = 30;
          } else if (
            itemsDesc.includes('ciclo') ||
            itemsDesc.includes('aprofundamento') ||
            attemptPlan.includes('ciclo') ||
            attemptPlan.includes('aprofundamento')
          ) {
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

          // Se houve cupom aplicado nesta tentativa de checkout, registrar e incrementar uso
          const appliedCouponCode = checkoutAttempt?.coupon_code || checkoutAttempt?.metadata?.coupon_code;
          if (appliedCouponCode) {
            try {
              const cupList = await supabaseRest(`coupons?code=eq.${encodeURIComponent(appliedCouponCode)}&limit=1`);
              if (cupList && cupList.length > 0) {
                const cup = cupList[0];
                await supabaseRest(`coupons?id=eq.${encodeURIComponent(cup.id)}`, {
                  method: 'PATCH',
                  body: JSON.stringify({ used_count: (cup.used_count || 0) + 1 }),
                });
                await supabaseRest('coupon_redemptions', {
                  method: 'POST',
                  body: JSON.stringify({
                    coupon_id: cup.id,
                    coupon_code: cup.code,
                    user_id: userId,
                    user_email: customerEmail,
                    benefit_type: cup.type,
                    benefit_value: cup.benefit_value,
                    product_slug: productSlug,
                    metadata: { order_nsu, transaction_nsu, paid_amount: paidCents },
                  }),
                });
                console.info(`[Webhook] Redenção de cupom ${cup.code} registrada com sucesso para usuária ${userId}`);
              }
            } catch (cupLogErr) {
              console.warn('[Webhook] Aviso ao registrar redenção de cupom:', cupLogErr.message);
            }
          }

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

