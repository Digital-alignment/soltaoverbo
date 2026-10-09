/**
 * Gerenciador e utilitários de vinculação de oficinas a produtos (Solta o Verbo)
 * Uma oficina pode ser gratuita ou vinculada a um ou mais produtos (café com letras, 21 dias, ciclo de aprofundamento, experiências).
 */

export interface ProductOption {
  slug: string;
  label: string;
  shortLabel: string;
  description: string;
}

export const AVAILABLE_PRODUCTS: ProductOption[] = [
  {
    slug: 'cafe_com_letras',
    label: 'café com letras',
    shortLabel: 'café com letras',
    description: 'rodas de escrita ao vivo e leituras compartilhadas',
  },
  {
    slug: '21_dias',
    label: '21 dias de escrita',
    shortLabel: '21 dias',
    description: 'jornada autoral de 3 semanas de escrita diária',
  },
  {
    slug: 'ciclo_aprofundamento',
    label: 'ciclo de aprofundamento',
    shortLabel: 'ciclo de aprofundamento',
    description: 'travessia completa anual com mentoria e encontros',
  },
  {
    slug: 'contrate_experiencia',
    label: 'contrate uma experiência (b2b)',
    shortLabel: 'experiências b2b',
    description: 'vivências corporativas e oficinas para equipes',
  },
];

const LOCAL_STORAGE_KEY = 'solta_courses_product_links';

/**
 * Extrai os produtos vinculados de uma oficina
 * Verifica o campo stripe_payment_link (onde é serializado como 'products:a,b'),
 * o cache local e o título legadot.
 */
export function getCourseLinkedProducts(course: {
  id?: string;
  title?: string;
  course_type?: string;
  stripe_payment_link?: string | null;
}): string[] {
  // Se for gratuita, não requer produto
  if (course.course_type === 'free') {
    return [];
  }

  // 1. Tentar ler do campo stripe_payment_link
  const rawLink = course.stripe_payment_link || '';
  if (rawLink.startsWith('products:')) {
    const slugs = rawLink
      .replace('products:', '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    if (slugs.length > 0) return slugs;
  }

  if (rawLink.startsWith('{')) {
    try {
      const parsed = JSON.parse(rawLink);
      if (Array.isArray(parsed.products) && parsed.products.length > 0) {
        return parsed.products;
      }
    } catch {}
  }

  // 2. Tentar ler do cache local pelo ID
  if (course.id) {
    try {
      const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (cached) {
        const map = JSON.parse(cached);
        if (Array.isArray(map[course.id]) && map[course.id].length > 0) {
          return map[course.id];
        }
      }
    } catch {}
  }

  // 3. Fallback inteligente por título
  const title = (course.title || '').toLowerCase();
  if (title.includes('21') || title.includes('hábito')) {
    return ['21_dias'];
  }
  if (title.includes('ciclo') || title.includes('aprofundamento')) {
    return ['ciclo_aprofundamento'];
  }
  if (title.includes('cafe') || title.includes('café') || title.includes('letras')) {
    return ['cafe_com_letras'];
  }

  // Padrão para oficinas premium sem vínculo explícito: ciclo de aprofundamento
  return ['ciclo_aprofundamento'];
}

/**
 * Serializa a lista de produtos vinculados para armazenamento no campo stripe_payment_link
 */
export function serializeCourseLinkedProducts(products: string[]): string {
  if (!products || products.length === 0) return '';
  return `products:${products.join(',')}`;
}

/**
 * Retorna os nomes formatados dos produtos vinculados
 */
export function getCourseProductLabels(productSlugs: string[]): string[] {
  const map = new Map(AVAILABLE_PRODUCTS.map((p) => [p.slug, p.label]));
  return productSlugs.map((slug) => map.get(slug) || slug);
}

/**
 * Salva localmente o vínculo de uma oficina
 */
export function cacheCourseProductLinks(courseId: string, products: string[]): void {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    const map = raw ? JSON.parse(raw) : {};
    map[courseId] = products;
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(map));
  } catch (err) {
    console.warn('[courseProductLinks] Falha ao atualizar cache local:', err);
  }
}

/**
 * Avalia se uma usuária tem permissão para acessar a oficina
 */
export function canAccessCourseWithLinks(params: {
  course: {
    id?: string;
    title?: string;
    course_type?: string;
    stripe_payment_link?: string | null;
  };
  isAdmin: boolean;
  isPaidMember: boolean;
  hasAccessToCafe: boolean;
  hasAccessToCiclo: boolean;
  hasAccessTo21Dias: boolean;
}): boolean {
  const { course, isAdmin, hasAccessToCafe, hasAccessToCiclo, hasAccessTo21Dias, isPaidMember } = params;

  // Administradora tem acesso total
  if (isAdmin) return true;

  // Oficina gratuita é livre para qualquer usuária logada
  if (course.course_type === 'free') return true;

  // Alunas com o Ciclo de Aprofundamento (bundle mestre integral) têm acesso a todas as oficinas
  if (hasAccessToCiclo) return true;

  const linked = getCourseLinkedProducts(course);

  // Se não tiver produtos especificados
  if (linked.length === 0) {
    return isPaidMember;
  }

  // Verifica se a usuária tem acesso a pelo menos UM dos produtos vinculados
  for (const slug of linked) {
    if (slug === 'cafe_com_letras' && hasAccessToCafe) return true;
    if (slug === '21_dias' && hasAccessTo21Dias) return true;
    if (slug === 'ciclo_aprofundamento' && hasAccessToCiclo) return true;
    if (slug === 'contrate_experiencia' && isPaidMember) return true;
  }

  return false;
}
