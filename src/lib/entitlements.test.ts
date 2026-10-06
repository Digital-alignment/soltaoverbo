import { describe, it, expect } from 'vitest';
import {
  calculateTrialStatus,
  hasProductAccess,
  canUserWrite,
  canUserPostToFogueira,
  TRIAL_DURATION_MS,
  WEEKLY_FREE_POST_LIMIT,
  Entitlement,
} from './entitlements';

describe('entitlements and trial logic', () => {
  it('calcula trial ativo para usuário recém-criado (< 96 horas)', () => {
    const now = new Date();
    const createdTwoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString();

    const status = calculateTrialStatus(createdTwoHoursAgo, false);
    expect(status.isTrial).toBe(true);
    expect(status.isExpired).toBe(false);
    expect(status.hoursRemaining).toBeGreaterThanOrEqual(93);
    expect(status.daysRemaining).toBe(4);
  });

  it('calcula trial expirado para usuário criado há mais de 96 horas', () => {
    const now = new Date();
    const created5DaysAgo = new Date(now.getTime() - (TRIAL_DURATION_MS + 24 * 60 * 60 * 1000)).toISOString();

    const status = calculateTrialStatus(created5DaysAgo, false);
    expect(status.isTrial).toBe(false);
    expect(status.isExpired).toBe(true);
    expect(status.hoursRemaining).toBe(0);
  });

  it('não ativa trial para admin ou membro já pago', () => {
    const now = new Date().toISOString();
    const status = calculateTrialStatus(now, true);
    expect(status.isTrial).toBe(false);
    expect(status.isExpired).toBe(false);
  });

  it('permite escrita se usuário estiver no trial ativo', () => {
    const trial = {
      isTrial: true,
      isExpired: false,
      hoursRemaining: 48,
      daysRemaining: 2,
      expiresAt: new Date(),
    };

    const allowed = canUserWrite({
      isAdmin: false,
      isLegacyPaid: false,
      entitlements: [],
      trial,
    });

    expect(allowed).toBe(true);
  });

  it('bloqueia escrita (modo somente leitura) se trial estiver expirado e sem produto ativo', () => {
    const trial = {
      isTrial: false,
      isExpired: true,
      hoursRemaining: 0,
      daysRemaining: 0,
      expiresAt: new Date(),
    };

    const allowed = canUserWrite({
      isAdmin: false,
      isLegacyPaid: false,
      entitlements: [],
      trial,
    });

    expect(allowed).toBe(false);
  });

  it('permite escrita se tiver entitlement ativo mesmo após trial expirado', () => {
    const trial = {
      isTrial: false,
      isExpired: true,
      hoursRemaining: 0,
      daysRemaining: 0,
      expiresAt: new Date(),
    };

    const entitlements: Entitlement[] = [
      {
        product_slug: '21_dias',
        status: 'active',
        expires_at: new Date(Date.now() + 10000000).toISOString(),
      },
    ];

    const allowed = canUserWrite({
      isAdmin: false,
      isLegacyPaid: false,
      entitlements,
      trial,
    });

    expect(allowed).toBe(true);
  });

  it('bundle do ciclo de aprofundamento desbloqueia 21 dias e café com letras', () => {
    const entitlements: Entitlement[] = [
      {
        product_slug: 'ciclo_aprofundamento',
        status: 'active',
        expires_at: new Date(Date.now() + 10000000).toISOString(),
      },
    ];

    expect(hasProductAccess('21_dias', entitlements, false)).toBe(true);
    expect(hasProductAccess('cafe_com_letras', entitlements, false)).toBe(true);
    expect(hasProductAccess('ciclo_aprofundamento', entitlements, false)).toBe(true);
  });

  it('produto 21 dias avulso só desbloqueia 21 dias e não café com letras', () => {
    const entitlements: Entitlement[] = [
      {
        product_slug: '21_dias',
        status: 'active',
        expires_at: new Date(Date.now() + 10000000).toISOString(),
      },
    ];

    expect(hasProductAccess('21_dias', entitlements, false)).toBe(true);
    expect(hasProductAccess('cafe_com_letras', entitlements, false)).toBe(false);
  });

  it('limite de 3 postagens na Fogueira para free pós-trial', () => {
    const expiredTrial = {
      isTrial: false,
      isExpired: true,
      hoursRemaining: 0,
      daysRemaining: 0,
      expiresAt: new Date(),
    };

    // 2 posts na semana -> permitido
    const check1 = canUserPostToFogueira({
      isAdmin: false,
      isLegacyPaid: false,
      entitlements: [],
      trial: expiredTrial,
      weeklyPostsCount: 2,
    });
    expect(check1.allowed).toBe(true);

    // 3 posts na semana -> bloqueado
    const check2 = canUserPostToFogueira({
      isAdmin: false,
      isLegacyPaid: false,
      entitlements: [],
      trial: expiredTrial,
      weeklyPostsCount: 3,
    });
    expect(check2.allowed).toBe(false);
    expect(check2.reason).toBe('limit_reached');
  });

  it('cortesia degustacao_atelier concede escrita no atelier e publicações na fogueira', () => {
    const expiredTrial = {
      isTrial: false,
      isExpired: true,
      hoursRemaining: 0,
      daysRemaining: 0,
      expiresAt: new Date(),
    };

    const courtesyEntitlement: Entitlement = {
      product_slug: 'degustacao_atelier',
      status: 'active',
      source: 'manual_admin',
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    };

    const allowedWrite = canUserWrite({
      isAdmin: false,
      isLegacyPaid: false,
      entitlements: [courtesyEntitlement],
      trial: expiredTrial,
    });
    expect(allowedWrite).toBe(true);

    const fogueiraCheck = canUserPostToFogueira({
      isAdmin: false,
      isLegacyPaid: false,
      entitlements: [courtesyEntitlement],
      trial: expiredTrial,
      weeklyPostsCount: 10,
    });
    expect(fogueiraCheck.allowed).toBe(true);
    expect(fogueiraCheck.reason).toBe('subscribed');
  });
});

