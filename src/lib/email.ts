/**
 * Helper para envio de e-mails transacionais via API Solta o Verbo (Resend)
 */

export interface SendWelcomeEmailParams {
  email: string;
  displayName: string;
}

export async function sendWelcomeEmail({ email, displayName }: SendWelcomeEmailParams): Promise<boolean> {
  try {
    const response = await fetch('/api/auth/welcome-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, displayName }),
    });

    if (!response.ok) {
      console.warn(`[email] Resposta ao enviar email de boas-vindas: status ${response.status}`);
      return false;
    }

    const data = await response.json();
    return data.success === true;
  } catch (error) {
    console.warn('[email] Aviso ao disparar email de boas-vindas (executando em modo silencioso):', error);
    return false;
  }
}
