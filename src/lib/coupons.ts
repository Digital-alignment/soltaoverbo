/**
 * Helpers e Serviços para Cupons Poéticos & Bolsas Comunitárias (Fase 3)
 * Solta o Verbo
 */

import { supabase } from './supabase';

export type CouponType = 'trial_extension' | 'discount_percent' | 'free_access';
export type CouponProductTarget = 'all' | '21_dias' | 'cafe_com_letras' | 'ciclo_aprofundamento';

export interface Coupon {
  id: string;
  code: string;
  description?: string | null;
  type: CouponType;
  benefit_value: number;
  product_target: CouponProductTarget;
  max_uses?: number | null;
  used_count: number;
  expires_at?: string | null;
  active: boolean;
  created_at: string;
  updated_at?: string;
}

export interface CouponRedemption {
  id: string;
  coupon_id: string;
  coupon_code: string;
  user_id: string;
  user_email?: string | null;
  benefit_type: string;
  benefit_value: number;
  product_slug?: string | null;
  metadata?: any;
  redeemed_at: string;
}

export interface CouponValidationResult {
  valid: boolean;
  coupon?: Coupon;
  error?: string;
  message?: string;
}

/**
 * Normaliza códigos para maiúsculas sem espaços externos
 */
export function normalizeCouponCode(code: string): string {
  return (code || '').trim().toUpperCase();
}

/**
 * Mapeia chaves de produto do frontend para slugs do banco
 */
export function mapProductKeyToSlug(productKey?: string): string {
  if (!productKey) return 'all';
  const lower = productKey.toLowerCase().replace(/-/g, '_');
  if (lower.includes('21')) return '21_dias';
  if (lower.includes('cafe')) return 'cafe_com_letras';
  if (lower.includes('ciclo') || lower.includes('aprofundamento')) return 'ciclo_aprofundamento';
  return 'all';
}

/**
 * Calcula desconto em centavos e valor final
 */
export function calculateCouponDiscount(
  coupon: Coupon,
  originalPriceInCents: number
): { discountInCents: number; finalPriceInCents: number; percent: number } {
  if (coupon.type === 'free_access') {
    return {
      discountInCents: originalPriceInCents,
      finalPriceInCents: 0,
      percent: 100,
    };
  }

  if (coupon.type === 'discount_percent') {
    const percent = Math.min(100, Math.max(0, Number(coupon.benefit_value) || 0));
    const discountInCents = Math.round((originalPriceInCents * percent) / 100);
    const finalPriceInCents = Math.max(0, originalPriceInCents - discountInCents);
    return { discountInCents, finalPriceInCents, percent };
  }

  // trial_extension não altera o preço em centavos diretamente
  return {
    discountInCents: 0,
    finalPriceInCents: originalPriceInCents,
    percent: 0,
  };
}

/**
 * Valida um cupom verificando existência, validade, limite de usos e restrição de produto
 */
export async function validateCoupon(params: {
  code: string;
  productKey?: string;
  userId?: string;
}): Promise<CouponValidationResult> {
  const cleanCode = normalizeCouponCode(params.code);
  if (!cleanCode) {
    return { valid: false, error: 'informe um código de cupom ou bolsa.' };
  }

  const targetSlug = mapProductKeyToSlug(params.productKey);

  // 1. Tentar validação via microserviço Node.js
  try {
    const response = await fetch('/api/coupons/validate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code: cleanCode,
        productSlug: targetSlug,
        userId: params.userId,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      return data;
    }
  } catch (err) {
    console.warn('[Coupon] Falha na rota /api/coupons/validate, executando fallback direto pelo Supabase:', err);
  }

  // 2. Fallback direto pelo Supabase Client
  try {
    const { data: coupon, error } = await supabase
      .from('coupons')
      .select('*')
      .eq('code', cleanCode)
      .maybeSingle();

    if (error || !coupon) {
      return { valid: false, error: 'código de cupom não encontrado ou inválido.' };
    }

    if (!coupon.active) {
      return { valid: false, error: 'este cupom foi desativado.' };
    }

    if (coupon.expires_at && new Date(coupon.expires_at).getTime() < Date.now()) {
      return { valid: false, error: 'este cupom já expirou.' };
    }

    if (coupon.max_uses !== null && coupon.used_count >= coupon.max_uses) {
      return { valid: false, error: 'este cupom atingiu o limite máximo de utilizações.' };
    }

    if (coupon.product_target !== 'all' && targetSlug !== 'all' && coupon.product_target !== targetSlug) {
      return {
        valid: false,
        error: `este cupom é exclusivo para ${
          coupon.product_target === '21_dias'
            ? 'a oficina 21 dias'
            : coupon.product_target === 'cafe_com_letras'
            ? 'o café com letras'
            : 'o ciclo de aprofundamento'
        }.`,
      };
    }

    // Se usuário fornecido, checa se já resgatou
    if (params.userId) {
      const { data: previousRedemption } = await supabase
        .from('coupon_redemptions')
        .select('id')
        .eq('coupon_id', coupon.id)
        .eq('user_id', params.userId)
        .maybeSingle();

      if (previousRedemption) {
        return { valid: false, error: 'você já resgatou este cupom anteriormente.' };
      }
    }

    return {
      valid: true,
      coupon: coupon as Coupon,
      message:
        coupon.type === 'free_access'
          ? 'bolsa comunitária 100% integral disponível!'
          : coupon.type === 'trial_extension'
          ? `extensão de degustação por +${coupon.benefit_value} dias!`
          : `desconto de ${coupon.benefit_value}% aplicado com afeto!`,
    };
  } catch (err: any) {
    return { valid: false, error: err.message || 'erro ao validar cupom.' };
  }
}

/**
 * Resgata e aplica o benefício do cupom de forma atômica
 */
export async function redeemCoupon(params: {
  code: string;
  productKey?: string;
  userId: string;
  userEmail?: string;
}): Promise<{ success: boolean; message: string; error?: string; entitlement?: any }> {
  const cleanCode = normalizeCouponCode(params.code);
  const targetSlug = mapProductKeyToSlug(params.productKey);

  // 1. Chamar rota segura do backend (Node.js com Service Role)
  try {
    const response = await fetch('/api/coupons/redeem', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code: cleanCode,
        productSlug: targetSlug,
        userId: params.userId,
        userEmail: params.userEmail,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      return data;
    }

    const errData = await response.json().catch(() => ({}));
    if (errData?.error) {
      return { success: false, error: errData.error, message: '' };
    }
  } catch (err) {
    console.warn('[Coupon] Falha ao resgatar via /api/coupons/redeem, tentando fallback direto:', err);
  }

  // 2. Fallback direto via Supabase se a rota falhou
  try {
    const validation = await validateCoupon({
      code: cleanCode,
      productKey: params.productKey,
      userId: params.userId,
    });

    if (!validation.valid || !validation.coupon) {
      return { success: false, error: validation.error || 'cupom inválido', message: '' };
    }

    const coupon = validation.coupon;
    const finalProductSlug =
      coupon.product_target === 'all'
        ? targetSlug === 'all'
          ? '21_dias'
          : targetSlug
        : coupon.product_target;

    let expiresAt: string | null = null;
    let durationDays = 365;

    if (coupon.type === 'trial_extension') {
      durationDays = Number(coupon.benefit_value) || 30;
      expiresAt = new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000).toISOString();
    } else if (coupon.type === 'free_access') {
      durationDays = finalProductSlug === 'cafe_com_letras' ? 30 : 365;
      expiresAt = new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000).toISOString();
    }

    // Inserir entitlement
    const { data: entData, error: entError } = await supabase
      .from('user_entitlements')
      .insert({
        user_id: params.userId,
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
      })
      .select()
      .single();

    if (entError) {
      console.warn('aviso ao criar entitlement:', entError);
    }

    // Atualizar papel para paid
    await supabase
      .from('users_profiles')
      .update({ role: 'paid' })
      .eq('id', params.userId);

    // Incrementar used_count do cupom
    await supabase
      .from('coupons')
      .update({ used_count: coupon.used_count + 1 })
      .eq('id', coupon.id);

    // Inserir registro de redenção
    await supabase.from('coupon_redemptions').insert({
      coupon_id: coupon.id,
      coupon_code: coupon.code,
      user_id: params.userId,
      user_email: params.userEmail,
      benefit_type: coupon.type,
      benefit_value: coupon.benefit_value,
      product_slug: finalProductSlug,
    });

    return {
      success: true,
      message: `código ${coupon.code} ativado com afeto! seus benefícios já estão livres.`,
      entitlement: entData,
    };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || 'não foi possível concluir o resgate do cupom.',
      message: '',
    };
  }
}
