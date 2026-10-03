/**
 * Templates de e-mail oficiais do Solta o Verbo
 * Alinhado estritamente com o Brand Guide:
 * - Fundo suave de papel natural (#F7F3E8)
 * - Azul profundo (#140D82) para títulos e destaques
 * - Terracota autoral (#FD5E32) para frases de manifesto e botões primários
 * - Tinta carvão (#2C2720) para tipografia com espaçamento arejado
 * - Cartões brancos (#FFFFFF) com bordas ultrafinas de papel kraft (#E8DFD0)
 * - Botões arredondados em formato de pílula (pill)
 * - 100% minúsculas (lowercase) e sem emojis
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
      background-color: #F7F3E8;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #2C2720;
      -webkit-font-smoothing: antialiased;
    }
    .wrapper {
      width: 100%;
      background-color: #F7F3E8;
      padding: 44px 16px;
    }
    .container {
      max-width: 560px;
      margin: 0 auto;
      background-color: #FAF7F0;
      border-radius: 28px;
      border: 1px solid #E8DFD0;
      overflow: hidden;
      box-shadow: 0 4px 20px rgba(44, 39, 32, 0.04);
    }
    .header {
      padding: 38px 36px 12px;
      text-align: center;
    }
    .header-pill {
      display: inline-block;
      padding: 6px 16px;
      border-radius: 9999px;
      background-color: #FFFFFF;
      border: 1px solid #E8DFD0;
      color: #140D82;
      font-size: 11px;
      font-weight: 500;
      letter-spacing: 0.2px;
      text-transform: lowercase;
      margin-bottom: 20px;
    }
    .header-logo {
      max-width: 180px;
      height: auto;
      display: block;
      margin: 0 auto;
    }
    .body {
      padding: 24px 36px 36px;
      font-size: 15px;
      line-height: 1.65;
      color: #2C2720;
    }
    .title-serif {
      font-family: Georgia, 'Times New Roman', serif;
      font-size: 26px;
      font-weight: 700;
      color: #140D82;
      margin: 0 0 6px 0;
      text-transform: lowercase;
      letter-spacing: -0.4px;
      line-height: 1.25;
    }
    .subtitle-terracota {
      font-family: Georgia, 'Times New Roman', serif;
      font-size: 17px;
      font-style: italic;
      color: #FD5E32;
      margin: 0 0 22px 0;
      text-transform: lowercase;
      line-height: 1.4;
    }
    .quote-box {
      background-color: #FFFFFF;
      border: 1px solid #E8DFD0;
      border-radius: 20px;
      padding: 24px;
      margin: 24px 0;
      text-align: center;
    }
    .quote-text {
      font-family: Georgia, 'Times New Roman', serif;
      font-size: 19px;
      font-weight: 700;
      color: #140D82;
      line-height: 1.35;
      margin: 0 0 10px 0;
      text-transform: lowercase;
    }
    .quote-author {
      font-size: 12px;
      color: #7D7569;
      text-transform: lowercase;
      margin: 0;
    }
    .info-card {
      background-color: #FFFFFF;
      border: 1px solid #E8DFD0;
      border-radius: 18px;
      padding: 20px 22px;
      margin: 22px 0;
    }
    .info-title {
      font-size: 11px;
      font-weight: 700;
      color: #140D82;
      text-transform: lowercase;
      letter-spacing: 0.4px;
      margin-top: 0;
      margin-bottom: 12px;
    }
    .btn-container {
      text-align: center;
      margin: 28px 0 16px;
    }
    .btn-pill {
      display: inline-block;
      background-color: #FD5E32;
      color: #FFFFFF !important;
      text-decoration: none;
      font-size: 14px;
      font-weight: 600;
      padding: 13px 32px;
      border-radius: 9999px;
      text-transform: lowercase;
      letter-spacing: 0.2px;
    }
    .btn-navy {
      background-color: #140D82;
    }
    .footer {
      padding: 24px 36px 32px;
      text-align: center;
      font-size: 12px;
      color: #7D7569;
      border-top: 1px solid #E8DFD0;
      background-color: #FAF7F0;
      line-height: 1.6;
    }
    .footer-brand {
      font-weight: 700;
      color: #140D82;
      margin: 0 0 4px 0;
      text-transform: lowercase;
    }
    .footer-motto {
      font-size: 11px;
      color: #9C9488;
      margin: 0 0 12px 0;
      text-transform: lowercase;
    }
    .footer a {
      color: #140D82;
      text-decoration: none;
      font-weight: 600;
    }
    .footer-divider {
      display: inline-block;
      margin: 0 6px;
      color: #D9CDB8;
    }
  </style>
</head>
<body>
  ${previewText ? `<div style="display:none;font-size:1px;color:#333;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;">${previewText}</div>` : ''}
  <div class="wrapper">
    <div class="container">
      <div class="header">
        <div class="header-pill">
          comunidade de autodesenvolvimento através da escrita
        </div>
        <a href="https://soltaoverbocoletivo.com" target="_blank" style="text-decoration: none; display: inline-block;">
          <img src="https://soltaoverbocoletivo.com/logo_horizontal_4.png" alt="solta o verbo" class="header-logo" />
        </a>
      </div>
      <div class="body">
        ${content}
      </div>
      <div class="footer">
        <p class="footer-brand">solta o verbo coletivo</p>
        <p class="footer-motto">movimento de escrita e presença</p>
        <p style="margin: 0 0 12px 0;">
          <a href="https://soltaoverbocoletivo.com" target="_blank">soltaoverbocoletivo.com</a>
          <span class="footer-divider">·</span>
          <a href="https://www.instagram.com/soltaoverbocoletivo" target="_blank">@soltaoverbocoletivo</a>
          <span class="footer-divider">·</span>
          <a href="mailto:soltaoverbocoletivo@gmail.com">fale conosco</a>
        </p>
        <p style="margin: 0; font-size: 11px; color: #9C9488;">
          você recebeu esta mensagem porque faz parte da comunidade solta o verbo.
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
    <h1 class="title-serif">olá, ${safeName}</h1>
    <p class="subtitle-terracota">a narrativa muda a partir do ponto que você a observa.</p>

    <p>
      que alegria te receber por aqui. a partir de agora, você faz parte de um espaço acolhedor dedicado à escrita autoral, à escuta atenta e à coragem de soltar a própria voz.
    </p>

    <div class="quote-box">
      <p class="quote-text">“escrever é abrir espaço para a voz que habita em você.”</p>
      <p class="quote-author">comunidade solta o verbo · movimento de escrita e presença</p>
    </div>

    <p>
      reescreva sua história ao ampliar a perspectiva e abrir espaço para uma escrita (e vida) mais consciente. dê contorno ao que te habita, ao que pede passagem e ao que ainda não encontrou palavras.
    </p>

    <div class="info-card">
      <div class="info-title">seus dados de acesso à plataforma</div>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 5px 0; font-size: 13px; color: #7D7569;">e-mail de login:</td>
          <td style="padding: 5px 0; font-size: 13px; font-weight: 600; color: #140D82; text-align: right;">${safeEmail}</td>
        </tr>
        <tr>
          <td style="padding: 5px 0; font-size: 13px; color: #7D7569;">endereço da comunidade:</td>
          <td style="padding: 5px 0; font-size: 13px; font-weight: 600; color: #2C2720; text-align: right;">soltaoverbocoletivo.com/login</td>
        </tr>
      </table>
    </div>

    <div class="btn-container">
      <a href="https://soltaoverbocoletivo.com/dashboard" class="btn-pill btn-navy" target="_blank">
        entrar na plataforma →
      </a>
    </div>

    <p style="margin-top: 30px; margin-bottom: 0; font-size: 13px; color: #7D7569;">
      com carinho e presença,<br>
      <strong style="color: #140D82;">coletivo solta o verbo</strong>
    </p>
  `;

  return getEmailBaseWrapper({
    title: 'boas-vindas ao solta o verbo',
    previewText: 'sua jornada de escrita autoral começa agora. entre na comunidade.',
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
    <h1 class="title-serif">pagamento confirmado</h1>
    <p class="subtitle-terracota">seu lugar na nossa roda de escrita está acolhido.</p>

    <p>
      olá, <strong>${safeName}</strong>. confirmamos com sucesso o seu pagamento via infinitepay. seu acesso completo aos conteúdos e encontros do <strong>${planName.toLowerCase()}</strong> já está liberado.
    </p>

    <div class="quote-box">
      <p class="quote-text">“a narrativa muda a partir do ponto que você a observa.”</p>
      <p class="quote-author">seu ciclo de escrita e transformação começou</p>
    </div>

    <div class="info-card">
      <div class="info-title">resumo da sua inscrição</div>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 5px 0; font-size: 13px; color: #7D7569;">experiência / plano:</td>
          <td style="padding: 5px 0; font-size: 13px; font-weight: 600; color: #140D82; text-align: right;">${planName.toLowerCase()}</td>
        </tr>
        <tr>
          <td style="padding: 5px 0; font-size: 13px; color: #7D7569;">valor confirmado:</td>
          <td style="padding: 5px 0; font-size: 13px; font-weight: 700; color: #FD5E32; text-align: right;">${formattedAmount}</td>
        </tr>
        <tr>
          <td style="padding: 5px 0; font-size: 13px; color: #7D7569;">forma de pagamento:</td>
          <td style="padding: 5px 0; font-size: 13px; font-weight: 600; color: #2C2720; text-align: right;">${captureMethod.toLowerCase()} (${installmentText})</td>
        </tr>
        ${orderId ? `
        <tr>
          <td style="padding: 5px 0; font-size: 13px; color: #7D7569;">id do pedido:</td>
          <td style="padding: 5px 0; font-size: 11px; font-family: monospace; color: #7D7569; text-align: right;">${orderId}</td>
        </tr>` : ''}
        ${customerEmail ? `
        <tr>
          <td style="padding: 5px 0; font-size: 13px; color: #7D7569;">e-mail de acesso:</td>
          <td style="padding: 5px 0; font-size: 13px; font-weight: 600; color: #140D82; text-align: right;">${customerEmail.toLowerCase()}</td>
        </tr>` : ''}
      </table>
    </div>

    ${receiptUrl ? `
    <p style="font-size: 12px; text-align: center; margin: 16px 0;">
      <a href="${receiptUrl}" target="_blank" style="color: #140D82; font-weight: 600; text-decoration: underline;">
        visualizar comprovante na infinitepay →
      </a>
    </p>` : ''}

    <div class="btn-container">
      <a href="https://soltaoverbocoletivo.com/dashboard" class="btn-pill" target="_blank">
        acessar minha jornada agora →
      </a>
    </div>

    <p style="margin-top: 26px; font-size: 13px; color: #7D7569; line-height: 1.6;">
      caso precise de apoio ou tenha qualquer dúvida, basta responder a este e-mail ou chamar nossa equipe no
      <a href="https://wa.me/5548991823637" target="_blank" style="color: #140D82; font-weight: 600;">whatsapp de suporte</a>.
    </p>

    <p style="margin-top: 20px; margin-bottom: 0; font-size: 13px; color: #7D7569;">
      com carinho e presença,<br>
      <strong style="color: #140D82;">coletivo solta o verbo</strong>
    </p>
  `;

  return getEmailBaseWrapper({
    title: 'pagamento confirmado · solta o verbo',
    previewText: `seu pagamento de ${formattedAmount} foi confirmado! comece agora.`,
    content,
  });
}

/**
 * 3. Notificação Administrativa (Cópia para soltaoverbocoletivo@gmail.com)
 */
export function getAdminNotificationHtml({ type, details, rawPayload }) {
  const content = `
    <h1 class="title-serif">notificação: ${type}</h1>
    <p class="subtitle-terracota">registro de atividade na plataforma</p>
    
    <div class="info-card">
      <div class="info-title">detalhes da operação</div>
      <table style="width: 100%; border-collapse: collapse;">
        ${Object.entries(details).map(([key, val]) => `
          <tr>
            <td style="padding: 4px 0; font-size: 13px; color: #7D7569;">${key}:</td>
            <td style="padding: 4px 0; font-size: 13px; font-weight: 600; color: #140D82; text-align: right;">${val || '–'}</td>
          </tr>
        `).join('')}
      </table>
    </div>

    ${rawPayload ? `
    <div style="background-color: #FAF7F0; border: 1px solid #E8DFD0; border-radius: 12px; padding: 12px; margin-top: 16px;">
      <p style="margin: 0 0 6px 0; font-size: 11px; font-weight: 700; color: #7D7569;">payload:</p>
      <pre style="margin: 0; font-size: 11px; color: #2C2720; overflow-x: auto; white-space: pre-wrap;">${typeof rawPayload === 'string' ? rawPayload : JSON.stringify(rawPayload, null, 2)}</pre>
    </div>` : ''}
  `;

  return getEmailBaseWrapper({
    title: `[solta o verbo] ${type}`,
    previewText: `atividade: ${type}`,
    content,
  });
}
