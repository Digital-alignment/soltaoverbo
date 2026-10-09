import { useState, useEffect, useMemo, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import {
  calculateTrialStatus,
  hasProductAccess,
  canUserWrite,
  canUserPostToFogueira,
  isEntitlementActive,
  ProductSlug,
  Entitlement,
  TrialStatus,
  WEEKLY_FREE_POST_LIMIT,
} from '../lib/entitlements';
import { canAccessCourseWithLinks } from '../lib/courseProductLinks';

export interface UserAccessInfo {
  // Estados principais
  isAdmin: boolean;
  isPaidMember: boolean; // se tem qualquer assinatura/produto ou perfil 'paid'
  isTrialActive: boolean;
  isTrialExpired: boolean;
  trial: TrialStatus;
  
  // Entitlements carregados
  entitlements: Entitlement[];
  loading: boolean;
  
  // Capacidades operacionais
  canWrite: boolean; // Permissão para criar/editar textos no Atelier
  isReadOnlyMode: boolean; // Se o editor deve ficar em modo de leitura
  canPostToFogueira: boolean; // Se pode publicar na Fogueira
  weeklyPostsCount: number; // Quantas publicações fez nos últimos 7 dias
  weeklyPostsLimit: number; // 3 para free pós-trial, infinito para pagos/trial
  
  // Verificações de acesso a produtos específicos
  hasAccessTo21Dias: boolean;
  hasAccessToCafe: boolean;
  hasAccessToCiclo: boolean;
  hasAccessToCourse: (
    courseOrTitle: string | { id?: string; title?: string; course_type?: string; stripe_payment_link?: string | null },
    courseType?: 'free' | 'paid',
    stripePaymentLink?: string | null
  ) => boolean;
  
  // Ações
  refreshAccess: () => Promise<void>;
}

export function useUserAccess(): UserAccessInfo {
  const { user, profile } = useAuth();
  const [entitlements, setEntitlements] = useState<Entitlement[]>([]);
  const [weeklyPostsCount, setWeeklyPostsCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  const isAdmin = profile?.role === 'admin';
  const isLegacyPaid = profile?.role === 'paid';

  // 1. Cálculo de Trial
  const trial = useMemo(() => {
    return calculateTrialStatus(user?.created_at, isAdmin || isLegacyPaid);
  }, [user?.created_at, isAdmin, isLegacyPaid]);

  // 2. Carregar entitlements e contagem de posts da semana
  const fetchAccessData = useCallback(async () => {
    if (!user) {
      setEntitlements([]);
      setWeeklyPostsCount(0);
      setLoading(false);
      return;
    }

    try {
      // 2.1 Carrega entitlements do usuário
      const { data: entData, error: entError } = await supabase
        .from('user_entitlements')
        .select('*')
        .eq('user_id', user.id);

      if (!entError && entData) {
        setEntitlements(entData as Entitlement[]);
      } else {
        setEntitlements([]);
      }

      // 2.2 Carrega contagem de posts da última semana
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
      const { count: postCount } = await supabase
        .from('community_posts')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .gte('published_at', sevenDaysAgo);

      setWeeklyPostsCount(postCount || 0);
    } catch (err) {
      console.warn('[useUserAccess] Erro ao carregar permissões:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchAccessData();
  }, [fetchAccessData]);

  // 3. Flags de produto
  const hasAccessToCiclo = useMemo(() => {
    return hasProductAccess('ciclo_aprofundamento', entitlements, isAdmin);
  }, [entitlements, isAdmin]);

  const hasAccessTo21Dias = useMemo(() => {
    if (isLegacyPaid) return true;
    return hasProductAccess('21_dias', entitlements, isAdmin);
  }, [entitlements, isAdmin, isLegacyPaid]);

  const hasAccessToCafe = useMemo(() => {
    if (isLegacyPaid) return true;
    return hasProductAccess('cafe_com_letras', entitlements, isAdmin);
  }, [entitlements, isAdmin, isLegacyPaid]);

  const hasAnyActiveProduct = useMemo(() => {
    return entitlements.some(isEntitlementActive);
  }, [entitlements]);

  const isPaidMember = isAdmin || isLegacyPaid || hasAnyActiveProduct;

  // 4. Permissões de escrita
  const canWrite = useMemo(() => {
    return canUserWrite({
      isAdmin,
      isLegacyPaid,
      entitlements,
      trial,
    });
  }, [isAdmin, isLegacyPaid, entitlements, trial]);

  const isReadOnlyMode = !canWrite;

  // 5. Permissão de Fogueira
  const postPermission = useMemo(() => {
    return canUserPostToFogueira({
      isAdmin,
      isLegacyPaid,
      entitlements,
      trial,
      weeklyPostsCount,
    });
  }, [isAdmin, isLegacyPaid, entitlements, trial, weeklyPostsCount]);

  // 6. Helper para acesso a cursos e oficinas
  const hasAccessToCourse = useCallback(
    (
      courseOrTitle: string | { id?: string; title?: string; course_type?: string; stripe_payment_link?: string | null },
      courseType?: 'free' | 'paid',
      stripePaymentLink?: string | null
    ): boolean => {
      const courseObj = typeof courseOrTitle === 'object' && courseOrTitle !== null
        ? courseOrTitle
        : {
            id: courseOrTitle,
            title: courseOrTitle,
            course_type: courseType || 'paid',
            stripe_payment_link: stripePaymentLink || null,
          };

      return canAccessCourseWithLinks({
        course: courseObj,
        isAdmin,
        isPaidMember,
        hasAccessToCafe,
        hasAccessToCiclo,
        hasAccessTo21Dias,
      });
    },
    [isAdmin, isPaidMember, hasAccessToCafe, hasAccessToCiclo, hasAccessTo21Dias]
  );

  return {
    isAdmin,
    isPaidMember,
    isTrialActive: trial.isTrial,
    isTrialExpired: trial.isExpired,
    trial,
    entitlements,
    loading,
    canWrite,
    isReadOnlyMode,
    canPostToFogueira: postPermission.allowed,
    weeklyPostsCount,
    weeklyPostsLimit: WEEKLY_FREE_POST_LIMIT,
    hasAccessTo21Dias,
    hasAccessToCafe,
    hasAccessToCiclo,
    hasAccessToCourse,
    refreshAccess: fetchAccessData,
  };
}
