import { describe, it, expect } from 'vitest';
import {
  getWelcomeEmailHtml,
  getPaymentConfirmedHtml,
  getOnboardingStepsEmailHtml,
  get21DiasWelcomeEmailHtml,
  getCafeWelcomeEmailHtml,
} from './emailTemplates.mjs';

describe('Transactional Email Templates', () => {
  it('renderiza email de boas-vindas com dados de acesso e mencao ao teste de 4 dias', () => {
    const html = getWelcomeEmailHtml({
      displayName: 'Camila',
      email: 'camila@exemplo.com',
    });

    expect(html).toContain('olá, camila');
    expect(html).toContain('camila@exemplo.com');
    expect(html).toContain('4 dias de teste livre no atelier');
    expect(html).toContain('entrar e começar a escrever');
  });

  it('renderiza email de boas-vindas do Ciclo de Aprofundamento (com Jout Jout e formulário)', () => {
    const html = getOnboardingStepsEmailHtml({
      displayName: 'Mariana',
      email: 'mariana@exemplo.com',
    });

    expect(html).toContain('ei, mariana!');
    expect(html).toContain('Jout Jout');
    expect(html).toContain('responda o formulário de boas-vindas');
    expect(html).toContain('salve os encontros na sua agenda');
  });

  it('renderiza email de boas-vindas específico para 21 Dias de Escrita', () => {
    const html = get21DiasWelcomeEmailHtml({
      displayName: 'Beatriz',
      email: 'beatriz@exemplo.com',
    });

    expect(html).toContain('olá, beatriz');
    expect(html).toContain('21 dias de escrita');
    expect(html).toContain('áudio guiado com fones');
    expect(html).toContain('abrir meus 21 dias');
  });

  it('renderiza email de boas-vindas específico para Café com Letras', () => {
    const html = getCafeWelcomeEmailHtml({
      displayName: 'Fernanda',
      email: 'fernanda@exemplo.com',
    });

    expect(html).toContain('bem-vinda à roda, fernanda!');
    expect(html).toContain('café com letras');
    expect(html).toContain('toda terça-feira, das 08h00 às 08h30');
    expect(html).toContain('google agenda');
  });

  it('renderiza email de confirmacao de pagamento com valores corretos', () => {
    const html = getPaymentConfirmedHtml({
      customerName: 'Julia',
      customerEmail: 'julia@exemplo.com',
      amount: 7700,
      planName: '21 dias de escrita',
      orderId: 'sv-21dias-1234',
      captureMethod: 'PIX',
      installments: 1,
    });

    expect(html).toContain('pagamento confirmado');
    expect(html).toContain('77,00');
    expect(html).toContain('21 dias de escrita');
    expect(html).toContain('sv-21dias-1234');
  });
});
