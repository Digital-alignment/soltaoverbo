/**
 * Utilitários e cliente para Antologia Mensal da Fogueira (Fase 4)
 * Solta o Verbo Coletivo
 */

import { supabase } from './supabase';
import type { Database } from './database.types';

export type FogueiraAnthologyRow = Database['public']['Tables']['fogueira_anthologies']['Row'];

export interface AnthologyPost {
  id: string;
  writing_exercise_id: string;
  user_id: string;
  likes_count: number;
  comments_count: number;
  published_at: string;
  writing_exercise?: {
    id: string;
    title: string;
    content: string;
    created_at?: string;
  } | null;
  user_profile?: {
    id: string;
    display_name: string;
    profile_picture_url?: string | null;
    bio?: string | null;
  } | null;
}

export interface Anthology {
  id: string;
  title: string;
  month: number;
  year: number;
  curator_note: string | null;
  cover_image_url: string | null;
  featured_post_ids: string[];
  featured_posts?: AnthologyPost[];
  published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

const MONTH_NAMES = [
  'janeiro',
  'fevereiro',
  'março',
  'abril',
  'maio',
  'junho',
  'julho',
  'agosto',
  'setembro',
  'outubro',
  'novembro',
  'dezembro',
];

export function getMonthName(monthNumber: number): string {
  if (monthNumber < 1 || monthNumber > 12) return '';
  return MONTH_NAMES[monthNumber - 1];
}

/**
 * Busca antologias publicadas (ou todas se for solicitada visão administrativa)
 */
export async function fetchAnthologies(options: { includeDrafts?: boolean } = {}): Promise<Anthology[]> {
  try {
    // 1. Tentar via endpoint de microserviço
    const query = options.includeDrafts ? '?includeDrafts=true' : '';
    const res = await fetch(`/api/anthologies${query}`);
    if (res.ok) {
      const json = await res.json();
      if (Array.isArray(json.anthologies) && json.anthologies.length > 0) {
        try {
          localStorage.setItem('solta_anthologies_cache', JSON.stringify(json.anthologies));
        } catch {}
        return json.anthologies;
      }
    }
  } catch (err) {
    console.warn('[Anthology] Falha ao consultar /api/anthologies, usando fallback:', err);
  }

  // 2. Fallback via cache local
  try {
    const cached = localStorage.getItem('solta_anthologies_cache');
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return options.includeDrafts ? parsed : parsed.filter((a: any) => a.published);
      }
    }
  } catch {}

  const defaultList: Anthology[] = [
    {
      id: 'ant-2026-10',
      title: 'antologia de outubro · as palavras que dançam',
      month: 10,
      year: 2026,
      curator_note: 'uma seleção de textos colhidos do fogo e da escuta mútua deste mês. que cada linha continue acesa no peito de quem lê.',
      cover_image_url: null,
      featured_post_ids: [],
      featured_posts: [],
      published: false,
      published_at: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ];

  try {
    localStorage.setItem('solta_anthologies_cache', JSON.stringify(defaultList));
  } catch {}

  return options.includeDrafts ? defaultList : defaultList.filter((a) => a.published);
}

/**
 * Busca a antologia publicada mais recente
 */
export async function fetchLatestPublishedAnthology(): Promise<Anthology | null> {
  const all = await fetchAnthologies({ includeDrafts: false });
  return all.length > 0 ? all[0] : null;
}

/**
 * Popula posts específicos a partir de uma lista de IDs
 */
export async function fetchPostsByIds(postIds: string[]): Promise<AnthologyPost[]> {
  if (!postIds || postIds.length === 0) return [];

  try {
    const { data: posts, error } = await supabase
      .from('community_posts')
      .select(`
        id,
        writing_exercise_id,
        user_id,
        likes_count,
        comments_count,
        published_at,
        writing_exercise:writing_exercises(id, title, content, created_at),
        user_profile:users_profiles(id, display_name, profile_picture_url, bio)
      `)
      .in('id', postIds);

    if (error) throw error;

    // Preservar a ordem exata de curadoria
    const postMap = new Map((posts || []).map((p: any) => [p.id, p as AnthologyPost]));
    return postIds
      .map((id) => postMap.get(id))
      .filter((p): p is AnthologyPost => !!p);
  } catch (err) {
    console.warn('[Anthology] Erro ao popular posts por IDs:', err);
    return [];
  }
}

/**
 * Busca os textos da comunidade mais aplaudidos de um determinado mês e ano (para auxílio na curadoria)
 */
export async function fetchMonthPostCandidates(month: number, year: number): Promise<AnthologyPost[]> {
  try {
    // 1. Tentar endpoint do microserviço
    const res = await fetch(`/api/anthologies/month-candidates?month=${month}&year=${year}`);
    if (res.ok) {
      const json = await res.json();
      if (Array.isArray(json.candidates)) {
        return json.candidates;
      }
    }
  } catch {
    // fallback
  }

  // 2. Fallback via Supabase
  try {
    const startDate = new Date(year, month - 1, 1).toISOString();
    const endDate = new Date(year, month, 0, 23, 59, 59, 999).toISOString();

    const { data, error } = await supabase
      .from('community_posts')
      .select(`
        id,
        writing_exercise_id,
        user_id,
        likes_count,
        comments_count,
        published_at,
        writing_exercise:writing_exercises(id, title, content, created_at),
        user_profile:users_profiles(id, display_name, profile_picture_url, bio)
      `)
      .eq('hidden_from_fogueira', false)
      .gte('published_at', startDate)
      .lte('published_at', endDate)
      .order('likes_count', { ascending: false })
      .limit(30);

    if (error) throw error;
    return (data || []) as unknown as AnthologyPost[];
  } catch (err: any) {
    console.warn('[Anthology] Erro ao buscar candidatos do mês:', err.message);
    return [];
  }
}

/**
 * Salva ou atualiza uma edição da antologia
 */
export async function saveAnthology(
  payload: {
    id?: string;
    title: string;
    month: number;
    year: number;
    curator_note?: string;
    cover_image_url?: string;
    featured_post_ids: string[];
    published?: boolean;
  }
): Promise<{ success: boolean; data?: Anthology; error?: string }> {
  // 1. Tentar microserviço
  try {
    const res = await fetch('/api/anthologies', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      const json = await res.json();
      if (json.success && json.anthology) {
        // Atualizar cache local
        try {
          const list = await fetchAnthologies({ includeDrafts: true });
          const existingIdx = list.findIndex(a => a.id === json.anthology.id);
          if (existingIdx >= 0) list[existingIdx] = json.anthology;
          else list.unshift(json.anthology);
          localStorage.setItem('solta_anthologies_cache', JSON.stringify(list));
        } catch {}
        return { success: true, data: json.anthology };
      }
    }
  } catch (err) {
    console.warn('[Anthology] Erro de rede ao salvar antologia:', err);
  }

  // 2. Fallback resiliente via cache local
  try {
    const list = await fetchAnthologies({ includeDrafts: true });
    const antId = payload.id || `ant-${payload.year}-${String(payload.month).padStart(2, '0')}`;
    const existingIdx = list.findIndex(a => a.id === antId);

    const record: Anthology = {
      id: antId,
      title: payload.title.toLowerCase().trim(),
      month: payload.month,
      year: payload.year,
      curator_note: payload.curator_note || null,
      cover_image_url: payload.cover_image_url || null,
      featured_post_ids: payload.featured_post_ids || [],
      published: payload.published ?? false,
      published_at: payload.published ? new Date().toISOString() : null,
      created_at: existingIdx >= 0 ? list[existingIdx].created_at : new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (existingIdx >= 0) {
      list[existingIdx] = record;
    } else {
      list.unshift(record);
    }

    localStorage.setItem('solta_anthologies_cache', JSON.stringify(list));
    return { success: true, data: record };
  } catch (err: any) {
    return { success: false, error: err.message || 'erro ao salvar antologia' };
  }
}

/**
 * Alterna status de publicação de uma edição
 */
export async function togglePublishAnthology(
  id: string,
  published: boolean
): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch('/api/anthologies/toggle-publish', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, published }),
    });
    if (res.ok) {
      const json = await res.json();
      if (json.success) {
        try {
          const list = await fetchAnthologies({ includeDrafts: true });
          const target = list.find(a => a.id === id);
          if (target) {
            target.published = published;
            target.published_at = published ? new Date().toISOString() : null;
            localStorage.setItem('solta_anthologies_cache', JSON.stringify(list));
          }
        } catch {}
        return { success: true };
      }
    }
  } catch {}

  // Fallback local
  try {
    const list = await fetchAnthologies({ includeDrafts: true });
    const target = list.find(a => a.id === id);
    if (target) {
      target.published = published;
      target.published_at = published ? new Date().toISOString() : null;
      localStorage.setItem('solta_anthologies_cache', JSON.stringify(list));
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

/**
 * Exclui uma antologia
 */
export async function deleteAnthology(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch('/api/anthologies', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    if (res.ok) {
      const json = await res.json();
      if (json.success) {
        try {
          let list = await fetchAnthologies({ includeDrafts: true });
          list = list.filter(a => a.id !== id);
          localStorage.setItem('solta_anthologies_cache', JSON.stringify(list));
        } catch {}
        return { success: true };
      }
    }
  } catch {}

  try {
    let list = await fetchAnthologies({ includeDrafts: true });
    list = list.filter(a => a.id !== id);
    localStorage.setItem('solta_anthologies_cache', JSON.stringify(list));
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
