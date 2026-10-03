/**
 * Templates de e-mail oficiais do Solta o Verbo
 * Design System: Cores sólidas (papel #FBF9F5, azul #23395B, terracota #BD5338, oliva #8B9A46, tinta #2D2926)
 * Tipografia minúscula e poética, botões arredondados, responsivo para desktop e mobile.
 */

export function getEmailBaseWrapper({ title, content, previewText = '' }) {
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #F8F5EE;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #2D2926;
      -webkit-font-smoothing: antialiased;
    }
    .wrapper {
      width: 100%;
      background-color: #F8F5EE;
      padding: 40px 16px;
    }
    .container {
      max-width: 580px;
      margin: 0 auto;
      background-color: #FFFFFF;
      border-radius: 24px;
      border: 1px solid #E6DEC8;
      overflow: hidden;
      box-shadow: 0 4px 20px rgba(45, 41, 38, 0.04);
    }
    .header {
      background-color: #23395B;
      padding: 36px 32px 30px;
      text-align: center;
    }
    .header-logo {
      max-width: 190px;
      height: auto;
      margin-bottom: 12px;
    }
    .header-tag {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 9999px;
      background-color: rgba(255, 255, 255, 0.12);
      color: #BEC540;
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.5px;
      text-transform: lowercase;
    }
    .body {
      padding: 36px 32px;
      font-size: 15px;
      line-height: 1.65;
      color: #2D2926;
    }
    .greeting {
      font-size: 22px;
      font-weight: 700;
      color: #23395B;
      margin-top: 0;
      margin-bottom: 18px;
      text-transform: lowercase;
      letter-spacing: -0.3px;
    }
    .poetic-quote {
      border-left: 3px solid #BD5338;
      padding-left: 16px;
      margin: 22px 0;
      color: #BD5338;
      font-style: italic;
      font-size: 15px;
    }
    .info-card {
      background-color: #FBF9F5;
      border: 1px solid #E6DEC8;
      border-radius: 16px;
      padding: 20px 22px;
      margin: 24px 0;
    }
    .info-title {
      font-size: 12px;
      font-weight: 700;
      color: #23395B;
      text-transform: lowercase;
      letter-spacing: 0.5px;
      margin-top: 0;
      margin-bottom: 12px;
    }
    .info-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
      font-size: 13px;
    }
    .info-label {
      color: #6B655D;
      text-transform: lowercase;
    }
    .info-value {
      font-weight: 600;
      color: #2D2926;
      text-align: right;
    }
    .btn-container {
      text-align: center;
      margin: 32px 0 16px;
    }
    .btn {
      display: inline-block;
      background-color: #23395B;
      color: #FFFFFF !important;
      text-decoration: none;
      font-size: 14px;
      font-weight: 600;
      padding: 14px 32px;
      border-radius: 9999px;
      text-transform: lowercase;
      letter-spacing: 0.2px;
    }
    .btn-terracota {
      background-color: #BD5338;
    }
    .footer {
      background-color: #FBF9F5;
      border-top: 1px solid #E6DEC8;
      padding: 26px 32px;
      text-align: center;
      font-size: 12px;
      color: #6B655D;
      line-height: 1.6;
    }
    .footer a {
      color: #23395B;
      text-decoration: none;
      font-weight: 600;
    }
    .footer-divider {
      display: inline-block;
      margin: 0 6px;
      color: #CCC4B0;
    }
  </style>
</head>
<body>
  ${previewText ? `<div style="display:none;font-size:1px;color:#333;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;">${previewText}</div>` : ''}
  <div class="wrapper">
    <div class="container">
      <div class="header">
        <a href="https://soltaoverbocoletivo.com" target="_blank" style="text-decoration: none;">
          <img src="https://soltaoverbocoletivo.com/logo_horizontal_4.png" alt="solta o verbo" class="header-logo" />
        </a>
        <div>
          <span class="header-tag">comunidade de escrita autoral</span>
        </div>
      </div>
      <div class="body">
        ${content}
      </div>
      <div class="footer">
        <p style="margin: 0 0 10px 0; font-weight: 600; color: #23395B;">solta o verbo coletivo</p>
        <p style="margin: 0 0 14px 0;">
          <a href="https://soltaoverbocoletivo.com" target="_blank">soltaoverbocoletivo.com</a>
          <span class="footer-divider">·</span>
          <a href="https://www.instagram.com/soltaoverbocoletivo" target="_blank">@soltaoverbocoletivo</a>
          <span class="footer-divider">·</span>
          <a href="mailto:soltaoverbocoletivo@gmail.com">fale conosco</a>
        </p>
        <p style="margin: 0; font-size: 11px; color: #9B9488;">
          você recebeu esta mensagem porque criou uma conta ou realizou uma inscrição no solta o verbo.
        </p>
      </div>
    </div>
  </div>
</body>
</html>`;
}

/**
 * 1. Email de Boas-Vindas para Nova Usuária Cadastrada
 */
export function getWelcomeEmailHtml({ displayName, email }) {
  const safeName = (displayName || 'escritora').toLowerCase();
  const safeEmail = (email || '').toLowerCase();

  const content = `
    <h1 class="greeting">olá, ${safeName}</h1>

    <p>
      que alegria te receber por aqui. a partir de agora, você faz parte de um espaço acolhedor dedicado à escrita autoral, à escuta atenta e à coragem de soltar a própria voz.
    </p>

    <div class="poetic-quote">
      “escrever é abrir espaço para a voz que habita em você.”
    </div>

    <p>
      aqui, a escrita não é sobre perfeição, gramática engessada ou regras rígidas. é sobre presença, autoconhecimento e o prazer de colocar a caneta no papel sem medo do julgamento.
    </p>

    <div class="info-card">
      <div class="info-title">seus dados de acesso</div>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 4px 0; font-size: 13px; color: #6B655D;">e-mail de login:</td>
          <td style="padding: 4px 0; font-size: 13px; font-weight: 600; color: #23395B; text-align: right;">${safeEmail}</td>
        </tr>
        <tr>
          <td style="padding: 4px 0; font-size: 13px; color: #6B655D;">acesso à plataforma:</td>
          <td style="padding: 4px 0; font-size: 13px; font-weight: 600; color: #2D2926; text-align: right;">soltaoverbocoletivo.com/login</td>
        </tr>
      </table>
    </div>

    <p style="font-weight: 600; color: #23395B; margin-bottom: 6px;">por onde começar:</p>
    <ul style="padding-left: 20px; margin-top: 0; margin-bottom: 20px; color: #4A443D; font-size: 14px; line-height: 1.7;">
      <li>acesse seu perfil e personalize como quer ser chamada na comunidade</li>
      <li>experimente os primeiros exercícios guiados de escrita</li>
      <li>leia as partilhas e reflexões ao redor da nossa fogueira virtual</li>
    </ul>

    <div class="btn-container">
      <a href="https://soltaoverbocoletivo.com/dashboard" class="btn" target="_blank">
        entrar na plataforma →
      </a>
    </div>

    <p style="margin-top: 30px; margin-bottom: 0; font-size: 14px; color: #6B655D;">
      com carinho,<br>
      <strong style="color: #23395B;">coletivo solta o verbo</strong>
    </p>
  `;

  return getEmailBaseWrapper({
    title: 'boas-vindas ao solta o verbo',
    previewText: 'sua conta foi criada com sucesso! comece sua jornada de escrita autoral.',
    content,
  });
}

/**
 * 2. Email de Confirmação de Pagamento InfinitePay (Comprador)
 */
export function getPaymentConfirmedHtml({
  customerName,
  customerEmail,
  amount,
  planName = 'inscrição solta o verbo',
  orderId,
  captureMethod = 'pix / cartão',
  installments = 1,
  receiptUrl = null,
}) {
  const safeName = (customerName || 'escritora').toLowerCase();
  const formattedAmount = typeof amount === 'number'
    ? (amount > 1000 ? (amount / 100) : amount).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
    : amount || 'R$ 97,00';

  const installmentText = installments > 1 ? `${installments}x parcelado` : 'pagamento único';

  const content = `
    <h1 class="greeting">pagamento confirmado!</h1>

    <p>
      olá, <strong>${safeName}</strong>. recebemos com sucesso a confirmação do seu pagamento via infinitepay.
    </p>

    <div class="poetic-quote">
      “seu lugar na nossa roda de escrita está reservado e acolhido com carinho.”
    </div>

    <p>
      seu acesso completo aos conteúdos e materiais exclusivos do <strong>${planName.toLowerCase()}</strong> já foi liberado na sua conta.
    </p>

    <div class="info-card">
      <div class="info-title">resumo do seu pedido</div>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 4px 0; font-size: 13px; color: #6B655D;">produto / experiência:</td>
          <td style="padding: 4px 0; font-size: 13px; font-weight: 600; color: #23395B; text-align: right;">${planName.toLowerCase()}</td>
        </tr>
        <tr>
          <td style="padding: 4px 0; font-size: 13px; color: #6B655D;">valor confirmado:</td>
          <td style="padding: 4px 0; font-size: 13px; font-weight: 700; color: #BD5338; text-align: right;">${formattedAmount}</td>
        </tr>
        <tr>
          <td style="padding: 4px 0; font-size: 13px; color: #6B655D;">forma de pagamento:</td>
          <td style="padding: 4px 0; font-size: 13px; font-weight: 600; color: #2D2926; text-align: right;">${captureMethod.toLowerCase()} (${installmentText})</td>
        </tr>
        ${orderId ? `
        <tr>
          <td style="padding: 4px 0; font-size: 13px; color: #6B655D;">identificador:</td>
          <td style="padding: 4px 0; font-size: 11px; font-family: monospace; color: #6B655D; text-align: right;">${orderId}</td>
        </tr>` : ''}
        ${customerEmail ? `
        <tr>
          <td style="padding: 4px 0; font-size: 13px; color: #6B655D;">e-mail cadastrado:</td>
          <td style="padding: 4px 0; font-size: 13px; font-weight: 600; color: #23395B; text-align: right;">${customerEmail.toLowerCase()}</td>
        </tr>` : ''}
      </table>
    </div>

    ${receiptUrl ? `
    <p style="font-size: 13px; text-align: center; margin: 16px 0;">
      <a href="${receiptUrl}" target="_blank" style="color: #23395B; font-weight: 600; text-decoration: underline;">
        visualizar comprovante oficial na infinitepay →
      </a>
    </p>` : ''}

    <div class="btn-container">
      <a href="https://soltaoverbocoletivo.com/dashboard" class="btn btn-terracota" target="_blank">
        acessar minha jornada agora →
      </a>
    </div>

    <p style="margin-top: 26px; font-size: 13px; color: #6B655D; line-height: 1.6;">
      caso precise de qualquer apoio com seu acesso, responda a este e-mail ou chame nossa equipe diretamente pelo
      <a href="https://wa.me/5548991823637" target="_blank" style="color: #23395B; font-weight: 600;">whatsapp de suporte</a>.
    </p>

    <p style="margin-top: 24px; margin-bottom: 0; font-size: 14px; color: #6B655D;">
      com gratidão e carinho,<br>
      <strong style="color: #23395B;">coletivo solta o verbo</strong>
    </p>
  `;

  return getEmailBaseWrapper({
    title: 'pagamento confirmado · solta o verbo',
    previewText: `pagamento de ${formattedAmount} confirmado com sucesso. seu acesso está liberado!`,
    content,
  });
}

/**
 * 3. Notificação Administrativa (Cópia para soltaoverbocoletivo@gmail.com)
 */
export function getAdminNotificationHtml({ type, details, rawPayload }) {
  const content = `
    <h1 class="greeting">notificação de ${type}</h1>
    <p>uma nova ação foi registrada na plataforma solta o verbo:</p>
    
    <div class="info-card">
      <div class="info-title">detalhes da operação</div>
      <table style="width: 100%; border-collapse: collapse;">
        ${Object.entries(details).map(([key, val]) => `
          <tr>
            <td style="padding: 4px 0; font-size: 13px; color: #6B655D;">${key}:</td>
            <td style="padding: 4px 0; font-size: 13px; font-weight: 600; color: #23395B; text-align: right;">${val || '–'}</td>
          </tr>
        `).join('')}
      </table>
    </div>

    ${rawPayload ? `
    <div style="background-color: #F2EFE8; border-radius: 12px; padding: 12px; margin-top: 16px;">
      <p style="margin: 0 0 6px 0; font-size: 11px; font-weight: 700; color: #6B655D;">payload técnico:</p>
      <pre style="margin: 0; font-size: 11px; color: #2D2926; overflow-x: auto; white-space: pre-wrap;">${typeof rawPayload === 'string' ? rawPayload : JSON.stringify(rawPayload, null, 2)}</pre>
    </div>` : ''}
  `;

  return getEmailBaseWrapper({
    title: `[solta o verbo] notificação: ${type}`,
    previewText: `nova atividade: ${type}`,
    content,
  });
}
