/**
 * Microserviço Node.js para Solta o Verbo
 * Endpoints:
 * - GET  /api/health
 * - POST /api/auth/welcome-email
 * - POST /api/webhooks/infinitepay
 * - POST /api/contact
 */

import http from 'node:http';
import {
  getWelcomeEmailHtml,
  getPaymentConfirmedHtml,
  getAdminNotificationHtml,
} from './templates/emailTemplates.mjs';

const PORT = parseInt(process.env.PORT || '3001', 10);
const RESEND_API_KEY = process.env.RESEND_API_KEY || '';
const RESEND_FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'Solta o Verbo <ola@contato.soltaoverbocoletivo.com>';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'soltaoverbocoletivo@gmail.com';
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://qtdruienammtqodgfqty.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

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

  // 2. POST /api/auth/welcome-email (Registro de novas alunas)
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

      // Envia para o usuário
      const sendResult = await sendEmailViaResend({
        to: email,
        subject: 'boas-vindas ao solta o verbo · sua jornada de escrita começa aqui',
        html: emailHtml,
      });

      // Envia notificação para admin
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
      res.end(JSON.stringify({ success: true, sendResult }));
    } catch (err) {
      console.error('[Welcome Email Error]:', err);
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

          // Registra assinatura
          await supabaseRest('user_subscriptions', {
            method: 'POST',
            body: JSON.stringify({
              user_id: userId,
              stripe_payment_id: transaction_nsu || order_nsu || invoice_slug,
              status: 'active',
              started_at: new Date().toISOString(),
              expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
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

      // 6. Notificar o administrador por e-mail
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
});
