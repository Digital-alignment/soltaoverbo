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

export function getEmailBaseWrapper({ title, content, previewText = '', headerPill = 'comunidade de autodesenvolvimento através da escrita' }) {
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
      <div class="info-title">seus dados de acesso & período de teste</div>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 5px 0; font-size: 13px; color: #7D7569;">e-mail de login:</td>
          <td style="padding: 5px 0; font-size: 13px; font-weight: 600; color: #140D82; text-align: right;">${safeEmail}</td>
        </tr>
        <tr>
          <td style="padding: 5px 0; font-size: 13px; color: #7D7569;">endereço da comunidade:</td>
          <td style="padding: 5px 0; font-size: 13px; font-weight: 600; color: #2C2720; text-align: right;">soltaoverbocoletivo.com/login</td>
        </tr>
        <tr>
          <td style="padding: 5px 0; font-size: 13px; color: #7D7569;">período de experiência:</td>
          <td style="padding: 5px 0; font-size: 13px; font-weight: 600; color: #FD5E32; text-align: right;">4 dias de teste livre no atelier</td>
        </tr>
      </table>
    </div>

    <div class="btn-container">
      <a href="https://soltaoverbocoletivo.com/dashboard" class="btn-pill btn-navy" target="_blank">
        entrar e começar a escrever →
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

/**
 * 4. Email de Primeiros Passos da Travessia (Ciclo de Aprofundamento)
 * Enviado após as boas-vindas / compra do ciclo
 */
export function getOnboardingStepsEmailHtml({ displayName, email }) {
  const safeName = (displayName || 'escritora').toLowerCase();

  const content = `
    <h1 class="title-serif" style="margin-bottom: 4px;">ei, ${safeName}!</h1>
    <p class="subtitle-terracota" style="margin-bottom: 22px;">preparada para soltar o verbo? 𖦹</p>

    <p style="font-size: 15px; line-height: 1.7; margin-bottom: 16px;">
      que alegria ter você com a gente.
    </p>

    <p style="font-size: 15px; line-height: 1.7; margin-bottom: 18px;">
      a partir de hoje, você faz parte da <strong>primeira travessia do ciclo de aprofundamento</strong> da solta o verbo. nos próximos três meses, vamos descascar juntas as camadas da vontade de agradar, com a escrita como principal ferramenta e o livro <em>A Coragem de Não Agradar</em>, de Ichiro Kishimi e Fumitake Koga, como bússola.
    </p>

    <!-- Destaque Jout Jout -->
    <div style="background-color: #FFFFFF; border: 1.5px solid #FD5E32; border-radius: 20px; padding: 22px 24px; margin: 24px 0;">
      <div style="display: inline-block; padding: 4px 12px; border-radius: 9999px; background-color: #FD5E32; color: #FFFFFF; font-size: 11px; font-weight: 700; text-transform: lowercase; margin-bottom: 10px; letter-spacing: 0.3px;">
        encontro de encerramento
      </div>
      <p style="margin: 0; font-size: 14px; line-height: 1.65; color: #2C2720;">
        ah, e pra fechar com chave de ouro, teremos simplesmente a maior, a diva, a icônica <strong>Jout Jout</strong> com a gente!!!!! sim, você leu certo. estamos muito felizes, e não tinha pessoa melhor pra falar sobre a coragem de não agradar do que ela.
      </p>
    </div>

    <p style="font-family: Georgia, serif; font-size: 17px; font-weight: 700; color: #140D82; margin: 28px 0 16px 0; text-transform: lowercase;">
      pra você chegar inteira, separamos alguns primeiros passos:
    </p>

    <!-- Passo 1 -->
    <div style="background-color: #FFFFFF; border: 1px solid #E8DFD0; border-radius: 18px; padding: 20px 22px; margin-bottom: 16px;">
      <div style="margin-bottom: 8px;">
        <span style="display: inline-block; width: 24px; height: 24px; line-height: 24px; border-radius: 50%; background-color: #140D82; color: #FFFFFF; font-size: 11px; font-weight: 700; text-align: center; margin-right: 8px; vertical-align: middle;">1</span>
        <strong style="font-size: 15px; color: #140D82; vertical-align: middle; text-transform: lowercase;">responda o formulário de boas-vindas</strong>
      </div>
      <p style="font-size: 13.5px; line-height: 1.6; color: #4A443D; margin: 6px 0 14px 0;">
        ele é o seu primeiro gesto dentro da travessia: é onde você conta um pouco de quem é, o que traz e o que deseja receber. leva uns 10 minutinhos.
      </p>
      <div>
        <a href="https://forms.gle/yxPd7LCDroe5qQzB7" target="_blank" style="display: inline-block; background-color: #FD5E32; color: #FFFFFF !important; text-decoration: none; font-size: 13px; font-weight: 600; padding: 9px 22px; border-radius: 9999px; text-transform: lowercase;">
          clica aqui para responder →
        </a>
      </div>
    </div>

    <!-- Passo 2 -->
    <div style="background-color: #FFFFFF; border: 1px solid #E8DFD0; border-radius: 18px; padding: 20px 22px; margin-bottom: 16px;">
      <div style="margin-bottom: 8px;">
        <span style="display: inline-block; width: 24px; height: 24px; line-height: 24px; border-radius: 50%; background-color: #140D82; color: #FFFFFF; font-size: 11px; font-weight: 700; text-align: center; margin-right: 8px; vertical-align: middle;">2</span>
        <strong style="font-size: 15px; color: #140D82; vertical-align: middle; text-transform: lowercase;">salve os encontros na sua agenda</strong>
      </div>
      <p style="font-size: 13.5px; line-height: 1.6; color: #4A443D; margin: 6px 0 10px 0;">
        a travessia tem dois ritmos:
      </p>
      <div style="background-color: #FAF7F0; border-radius: 12px; padding: 12px 14px; margin-bottom: 14px; font-size: 13px; line-height: 1.6; color: #2C2720;">
        <p style="margin: 0 0 8px 0;">
          ☕ <strong>café com letras:</strong> toda terça, das 8h às 8h30, pelo zoom. nosso ritual semanal de escrita coletiva, pra começar o dia escrevendo junto;
        </p>
        <p style="margin: 0;">
          ✨ <strong>encontros do ciclo:</strong> três encontros ao vivo, pelo zoom, nas terças <strong>27/10</strong>, <strong>24/11</strong> e <strong>15/12</strong>, das 19h às 20:30h. é onde a gente junta tudo o que foi lido, escrito e sentido no mês.
        </p>
      </div>
      <div>
        <a href="https://calendar.google.com/calendar/embed?src=698c2a3109cf616865d61cfd3a99f4cd580fe76ddaf6bab1e89c13af41b537b4%40group.calendar.google.com&ctz=America%2FSao_Paulo" target="_blank" style="display: inline-block; background-color: #140D82; color: #FFFFFF !important; text-decoration: none; font-size: 13px; font-weight: 600; padding: 9px 22px; border-radius: 9999px; text-transform: lowercase;">
          salve a agenda do ciclo no seu google agenda →
        </a>
      </div>
    </div>

    <!-- Passo 3 -->
    <div style="background-color: #FFFFFF; border: 1px solid #E8DFD0; border-radius: 18px; padding: 20px 22px; margin-bottom: 16px;">
      <div style="margin-bottom: 8px;">
        <span style="display: inline-block; width: 24px; height: 24px; line-height: 24px; border-radius: 50%; background-color: #140D82; color: #FFFFFF; font-size: 11px; font-weight: 700; text-align: center; margin-right: 8px; vertical-align: middle;">3</span>
        <strong style="font-size: 15px; color: #140D82; vertical-align: middle; text-transform: lowercase;">acesse a nossa plataforma</strong>
      </div>
      <p style="font-size: 13.5px; line-height: 1.6; color: #4A443D; margin: 6px 0 14px 0;">
        web app completo com diário pessoal, inspiração de escrita, área de partilha e muito mais. para se cadastrar, é só entrar com o seu e-mail.
      </p>
      <div>
        <a href="https://www.soltaoverbocoletivo.com" target="_blank" style="display: inline-block; background-color: #FAF7F0; color: #140D82 !important; border: 1px solid #140D82; text-decoration: none; font-size: 13px; font-weight: 600; padding: 8px 20px; border-radius: 9999px; text-transform: lowercase;">
          www.soltaoverbocoletivo.com →
        </a>
      </div>
    </div>

    <!-- Passo 4 -->
    <div style="background-color: #FFFFFF; border: 1px solid #E8DFD0; border-radius: 18px; padding: 20px 22px; margin-bottom: 16px;">
      <div style="margin-bottom: 8px;">
        <span style="display: inline-block; width: 24px; height: 24px; line-height: 24px; border-radius: 50%; background-color: #140D82; color: #FFFFFF; font-size: 11px; font-weight: 700; text-align: center; margin-right: 8px; vertical-align: middle;">4</span>
        <strong style="font-size: 15px; color: #140D82; vertical-align: middle; text-transform: lowercase;">entre no nosso grupo do whatsapp</strong>
      </div>
      <p style="font-size: 13.5px; line-height: 1.6; color: #4A443D; margin: 6px 0 14px 0;">
        é onde a conversa acontece no dia a dia: trocas, textos, avisos e muito afeto.
      </p>
      <div>
        <a href="https://chat.whatsapp.com/IfXG4tiWx3F2zjTxGBDEUA" target="_blank" style="display: inline-block; background-color: #140D82; color: #FFFFFF !important; text-decoration: none; font-size: 13px; font-weight: 600; padding: 9px 22px; border-radius: 9999px; text-transform: lowercase;">
          entrar no grupo do whatsapp →
        </a>
      </div>
    </div>

    <!-- Passo 5 -->
    <div style="background-color: #FFFFFF; border: 1px solid #E8DFD0; border-radius: 18px; padding: 20px 22px; margin-bottom: 22px;">
      <div style="margin-bottom: 8px;">
        <span style="display: inline-block; width: 24px; height: 24px; line-height: 24px; border-radius: 50%; background-color: #140D82; color: #FFFFFF; font-size: 11px; font-weight: 700; text-align: center; margin-right: 8px; vertical-align: middle;">5</span>
        <strong style="font-size: 15px; color: #140D82; vertical-align: middle; text-transform: lowercase;">garanta o seu livro</strong>
      </div>
      <p style="font-size: 13.5px; line-height: 1.6; color: #4A443D; margin: 6px 0 0 0;">
        o ideal é estar com ele em mãos até o primeiro encontro. dá pra encontrar em livrarias, no formato digital ou em sebos. se tiver qualquer dificuldade pra conseguir, é só falar com a gente.
      </p>
    </div>

    <!-- Contato de Suporte Bru -->
    <div style="background-color: #FAF7F0; border-radius: 16px; border: 1px solid #E8DFD0; padding: 16px 18px; margin: 22px 0; font-size: 13.5px; line-height: 1.6; color: #4A443D;">
      qualquer dúvida, é só responder este e-mail ou chamar no WhatsApp
      <a href="https://wa.me/5548991901483" target="_blank" style="color: #140D82; font-weight: 700; text-decoration: underline;">(48) 99190-1483</a>
      (telefone da bru).
    </div>

    <p style="font-size: 14.5px; line-height: 1.7; color: #2C2720; margin: 22px 0 16px 0;">
      a gente acredita que comunidade se faz com presença, e a sua já faz diferença por aqui. que bom que você chegou.
    </p>

    <p style="margin-top: 24px; margin-bottom: 0; font-size: 14px; color: #7D7569; line-height: 1.6;">
      nos vemos na travessia,<br>
      <strong style="font-size: 16px; color: #140D82; font-family: Georgia, serif;">Bru e Ju</strong><br>
      <span style="font-size: 12px; color: #FD5E32; font-weight: 600;">Solta o Verbo</span>
    </p>
  `;

  return getEmailBaseWrapper({
    title: 'preparada para soltar o verbo? 𖦹',
    previewText: 'primeiros passos para a sua travessia no ciclo de aprofundamento.',
    headerPill: 'ciclo de aprofundamento · guia da travessia 𖦹',
    content,
  });
}

/**
 * 5. Email de Boas-Vindas aos 21 Dias de Escrita (R$ 77)
 * Foco em iniciar a prática diária no atelier e ouvir o primeiro áudio
 */
export function get21DiasWelcomeEmailHtml({ displayName, email }) {
  const safeName = (displayName || 'escritora').toLowerCase();

  const content = `
    <h1 class="title-serif" style="margin-bottom: 4px;">olá, ${safeName}</h1>
    <p class="subtitle-terracota" style="margin-bottom: 22px;">seu hábito de escrita autoral começa agora 𖦹</p>

    <p style="font-size: 15px; line-height: 1.7; margin-bottom: 16px;">
      que alegria imensa ter você nos <strong>21 dias de escrita</strong>! durante as próximas três semanas, você terá um espaço sagrado e descomplicado para soltar o que sente no papel.
    </p>

    <div class="quote-box">
      <p class="quote-text">“escrever todos os dias não é sobre perfeição, é sobre presença.”</p>
      <p class="quote-author">21 dias de escrita · solta o verbo</p>
    </div>

    <p style="font-family: Georgia, serif; font-size: 17px; font-weight: 700; color: #140D82; margin: 28px 0 16px 0; text-transform: lowercase;">
      como começar o seu dia 1:
    </p>

    <!-- Passo 1 -->
    <div style="background-color: #FFFFFF; border: 1px solid #E8DFD0; border-radius: 18px; padding: 20px 22px; margin-bottom: 16px;">
      <div style="margin-bottom: 8px;">
        <span style="display: inline-block; width: 24px; height: 24px; line-height: 24px; border-radius: 50%; background-color: #140D82; color: #FFFFFF; font-size: 11px; font-weight: 700; text-align: center; margin-right: 8px; vertical-align: middle;">1</span>
        <strong style="font-size: 15px; color: #140D82; vertical-align: middle; text-transform: lowercase;">acesse o curso na plataforma</strong>
      </div>
      <p style="font-size: 13.5px; line-height: 1.6; color: #4A443D; margin: 6px 0 14px 0;">
        seu acesso ao curso completo e a 1 ano de atelier de escrita já está liberado. entre com o seu e-mail cadastrado.
      </p>
      <div>
        <a href="https://soltaoverbocoletivo.com/dashboard" target="_blank" style="display: inline-block; background-color: #FD5E32; color: #FFFFFF !important; text-decoration: none; font-size: 13px; font-weight: 600; padding: 9px 22px; border-radius: 9999px; text-transform: lowercase;">
          abrir meus 21 dias →
        </a>
      </div>
    </div>

    <!-- Passo 2 -->
    <div style="background-color: #FFFFFF; border: 1px solid #E8DFD0; border-radius: 18px; padding: 20px 22px; margin-bottom: 16px;">
      <div style="margin-bottom: 8px;">
        <span style="display: inline-block; width: 24px; height: 24px; line-height: 24px; border-radius: 50%; background-color: #140D82; color: #FFFFFF; font-size: 11px; font-weight: 700; text-align: center; margin-right: 8px; vertical-align: middle;">2</span>
        <strong style="font-size: 15px; color: #140D82; vertical-align: middle; text-transform: lowercase;">ouça o primeiro áudio guiado com fones</strong>
      </div>
      <p style="font-size: 13.5px; line-height: 1.6; color: #4A443D; margin: 6px 0 0 0;">
        cada dia possui um sopro em áudio com frequências binaurais para te colocar em estado de fluxo antes de escrever. reserve 10 a 15 minutinhos no seu melhor momento do dia.
      </p>
    </div>

    <!-- Passo 3 -->
    <div style="background-color: #FFFFFF; border: 1px solid #E8DFD0; border-radius: 18px; padding: 20px 22px; margin-bottom: 22px;">
      <div style="margin-bottom: 8px;">
        <span style="display: inline-block; width: 24px; height: 24px; line-height: 24px; border-radius: 50%; background-color: #140D82; color: #FFFFFF; font-size: 11px; font-weight: 700; text-align: center; margin-right: 8px; vertical-align: middle;">3</span>
        <strong style="font-size: 15px; color: #140D82; vertical-align: middle; text-transform: lowercase;">partilhe na nossa fogueira</strong>
      </div>
      <p style="font-size: 13.5px; line-height: 1.6; color: #4A443D; margin: 6px 0 0 0;">
        quando terminar de escrever seu exercício do dia, você pode publicá-lo com um clique no mural comunitário para ler e se inspirar com outras mulheres.
      </p>
    </div>

    <p style="margin-top: 24px; margin-bottom: 0; font-size: 14px; color: #7D7569; line-height: 1.6;">
      nos vemos no primeiro dia,<br>
      <strong style="font-size: 16px; color: #140D82; font-family: Georgia, serif;">Bru e Ju</strong><br>
      <span style="font-size: 12px; color: #FD5E32; font-weight: 600;">Solta o Verbo</span>
    </p>
  `;

  return getEmailBaseWrapper({
    title: 'bem-vinda aos 21 dias de escrita 𖦹',
    previewText: 'seu acesso está liberado. comece o seu dia 1 de prática autoral.',
    headerPill: '21 dias de escrita · início da prática 𖦹',
    content,
  });
}

/**
 * 6. Email de Boas-Vindas ao Café com Letras (Membros Recorrentes)
 * Foco nos encontros de terça-feira 8h, link do zoom e ritual ao vivo
 */
export function getCafeWelcomeEmailHtml({ displayName, email }) {
  const safeName = (displayName || 'escritora').toLowerCase();

  const content = `
    <h1 class="title-serif" style="margin-bottom: 4px;">bem-vinda à roda, ${safeName}!</h1>
    <p class="subtitle-terracota" style="margin-bottom: 22px;">o café com letras te espera toda terça ☕</p>

    <p style="font-size: 15px; line-height: 1.7; margin-bottom: 16px;">
      sua assinatura mensal do <strong>café com letras</strong> está confirmada! toda terça-feira abrimos nossa sala virtual para escrever juntas antes do mundo acordar.
    </p>

    <div style="background-color: #FAF7F0; border-radius: 16px; border: 1px solid #E8DFD0; padding: 18px 20px; margin: 22px 0;">
      <p style="margin: 0 0 6px 0; font-size: 14px; font-weight: 700; color: #140D82;">
        ☕ nosso ritual semanal ao vivo:
      </p>
      <p style="margin: 0; font-size: 13.5px; color: #2C2720; line-height: 1.6;">
        <strong>quando:</strong> toda terça-feira, das 08h00 às 08h30 (horário de brasília)<br>
        <strong>onde:</strong> sala ao vivo pelo zoom<br>
        <strong>como funciona:</strong> 5min de provocação poética, 20min de escrita silenciosa concentrada e 5min de partilha opcional.
      </p>
    </div>

    <!-- Salvar na agenda -->
    <div class="btn-container">
      <a href="https://calendar.google.com/calendar/render?action=TEMPLATE&text=Caf%C3%A9+com+Letras+%C2%B7+Solta+o+Verbo&details=Ritual+semanal+de+escrita+coletiva+ao+vivo.&location=Zoom&ctz=America/Sao_Paulo" target="_blank" class="btn-pill" style="background-color: #140D82;">
        adicionar as terças no google agenda →
      </a>
    </div>

    <p style="font-size: 13.5px; line-height: 1.6; color: #4A443D; margin-top: 20px;">
      enquanto a terça não chega, aproveite seu <strong>atelier de escrita ilimitado</strong> na plataforma para registrar suas páginas matinais e pensamentos.
    </p>

    <p style="margin-top: 24px; margin-bottom: 0; font-size: 14px; color: #7D7569; line-height: 1.6;">
      prepare a sua xícara e até terça,<br>
      <strong style="font-size: 16px; color: #140D82; font-family: Georgia, serif;">Bru e Ju</strong><br>
      <span style="font-size: 12px; color: #FD5E32; font-weight: 600;">Solta o Verbo</span>
    </p>
  `;

  return getEmailBaseWrapper({
    title: 'bem-vinda ao café com letras ☕',
    previewText: 'sua vaga na roda semanal de escrita está confirmada.',
    headerPill: 'café com letras · roda semanal de escrita ☕',
    content,
  });
}

/**
 * 7. Email de Contagem Regressiva de Degustação (72h decorridas · 24h restantes)
 * Tom afetuoso e acolhedor convidando a aluna a revisitar seus textos guardados
 * e escolher sua jornada de continuidade no coletivo.
 */
export function getTrialCountdownEmailHtml({ displayName, draftsCount = 0 }) {
  const safeName = (displayName || 'escritora').toLowerCase();
  const draftsNotice = draftsCount > 0 
    ? `você já tem <strong>${draftsCount} ${draftsCount === 1 ? 'texto guardado' : 'textos guardados'}</strong> no seu caderno autoral.` 
    : 'suas palavras escritas até aqui continuam guardadas em segurança na sua estante.';

  const content = `
    <h1 class="title-serif" style="margin-bottom: 4px;">olá, ${safeName}</h1>
    <p class="subtitle-terracota" style="margin-bottom: 22px;">faltam 24 horas para o fim da sua degustação livre 𖦹</p>

    <p style="font-size: 15px; line-height: 1.7; margin-bottom: 16px;">
      escrever é um ato de presença e coragem. durante esses primeiros dias, as portas do atelier e da fogueira estiveram abertas para você experimentar como é ter um refúgio para as suas palavras.
    </p>

    <div class="quote-box">
      <p class="quote-text">“a escrita não pede pressa, pede permanência.”</p>
      <p class="quote-author">solta o verbo colectivo</p>
    </div>

    <p style="font-size: 14.5px; line-height: 1.65; color: #4A443D; margin-bottom: 20px;">
      amanhã o período de teste livre chega ao final. ${draftsNotice} mesmo após o término, você poderá reler seus cadernos a qualquer momento.
    </p>

    <p style="font-size: 14.5px; line-height: 1.65; color: #4A443D; margin-bottom: 24px;">
      para que você continue escrevendo sem interrupções e faça parte dos nossos rituais ao vivo, aqui estão os dois caminhos abertos no coletivo:
    </p>

    <!-- Opção 1: Café com Letras -->
    <div style="background-color: #FFFFFF; border: 1px solid #E8DFD0; border-radius: 18px; padding: 22px; margin-bottom: 16px;">
      <div style="margin-bottom: 6px;">
        <span style="display: inline-block; padding: 4px 12px; border-radius: 9999px; background-color: #FAF7F0; color: #140D82; font-size: 11px; font-weight: 600; text-transform: lowercase; border: 1px solid #E8DFD0; margin-bottom: 8px;">
          mensalidade viva
        </span>
        <h3 style="font-family: Georgia, serif; font-size: 18px; color: #140D82; margin: 0 0 6px 0; text-transform: lowercase;">
          café com letras
        </h3>
      </div>
      <p style="font-size: 13.5px; line-height: 1.6; color: #4A443D; margin: 0 0 16px 0;">
        encontros de escrita ao vivo toda terça-feira das 08h00 às 08h30 pelo zoom, atelier de escrita ilimitado o mês todo e partilha contínua na nossa fogueira.
      </p>
      <div>
        <a href="https://soltaoverbocoletivo.com/cafe-com-letras" target="_blank" style="display: inline-block; background-color: #FD5E32; color: #FFFFFF !important; text-decoration: none; font-size: 13px; font-weight: 600; padding: 9px 22px; border-radius: 9999px; text-transform: lowercase;">
          entrar na roda do café →
        </a>
      </div>
    </div>

    <!-- Opção 2: 21 Dias de Escrita -->
    <div style="background-color: #FFFFFF; border: 1px solid #E8DFD0; border-radius: 18px; padding: 22px; margin-bottom: 22px;">
      <div style="margin-bottom: 6px;">
        <span style="display: inline-block; padding: 4px 12px; border-radius: 9999px; background-color: #FAF7F0; color: #140D82; font-size: 11px; font-weight: 600; text-transform: lowercase; border: 1px solid #E8DFD0; margin-bottom: 8px;">
          jornada autoral de 1 ano
        </span>
        <h3 style="font-family: Georgia, serif; font-size: 18px; color: #140D82; margin: 0 0 6px 0; text-transform: lowercase;">
          21 dias de escrita poética
        </h3>
      </div>
      <p style="font-size: 13.5px; line-height: 1.6; color: #4A443D; margin: 0 0 16px 0;">
        curso prático completo com 21 exercícios guiados, frequências sonoras binaurais para destravar o fluxo e 1 ano inteiro de atelier de escrita liberado.
      </p>
      <div>
        <a href="https://soltaoverbocoletivo.com/21-dias" target="_blank" style="display: inline-block; background-color: #140D82; color: #FFFFFF !important; text-decoration: none; font-size: 13px; font-weight: 600; padding: 9px 22px; border-radius: 9999px; text-transform: lowercase;">
          conhecer os 21 dias (r$ 77) →
        </a>
      </div>
    </div>

    <!-- Releitura dos cadernos -->
    <div style="text-align: center; padding: 12px 0 20px 0;">
      <p style="font-size: 13.5px; color: #7D7569; margin-bottom: 12px;">
        prefere reler o que você escreveu durante esses dias antes de escolher?
      </p>
      <a href="https://soltaoverbocoletivo.com/exercicios" target="_blank" style="display: inline-block; background-color: #FAF7F0; border: 1px solid #E8DFD0; color: #140D82 !important; text-decoration: none; font-size: 12.5px; font-weight: 600; padding: 8px 20px; border-radius: 9999px; text-transform: lowercase;">
        abrir meus cadernos no atelier →
      </a>
    </div>

    <p style="margin-top: 24px; margin-bottom: 0; font-size: 14px; color: #7D7569; line-height: 1.6;">
      com carinho pelas suas palavras,<br>
      <strong style="font-size: 16px; color: #140D82; font-family: Georgia, serif;">Bru e Ju</strong><br>
      <span style="font-size: 12px; color: #FD5E32; font-weight: 600;">Solta o Verbo</span>
    </p>
  `;

  return getEmailBaseWrapper({
    title: 'sua degustação termina em 24 horas 𖦹',
    previewText: 'faltam 24 horas para o fim da sua degustação livre. seus textos continuam guardados com carinho.',
    headerPill: 'solta o verbo · degustação livre 𖦹',
    content,
  });
}



