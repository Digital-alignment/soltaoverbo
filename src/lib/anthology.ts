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
    avatar_url?: string | null;
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
      if (Array.isArray(json.anthologies)) {
        return json.anthologies;
      }
    }
  } catch (err) {
    // Silently fall back to Supabase client
  }

  // 2. Fallback direto via Supabase Client
  try {
    let query = supabase
      .from('fogueira_anthologies')
      .select('*')
      .order('year', { ascending: false })
      .order('month', { ascending: false });

    if (!options.includeDrafts) {
      query = query.eq('published', true);
    }

    const { data, error } = await query;
    if (error) {
      console.warn('[Anthology] Erro ao buscar antologias via Supabase:', error.message);
      return [];
    }

    const anthologies: Anthology[] = (data || []) as unknown as Anthology[];

    // Popula posts para cada antologia
    for (const ant of anthologies) {
      if (ant.featured_post_ids && ant.featured_post_ids.length > 0) {
        ant.featured_posts = await fetchPostsByIds(ant.featured_post_ids);
      } else {
        ant.featured_posts = [];
      }
    }

    return anthologies;
  } catch (err) {
    console.warn('[Anthology] Falha ao recuperar antologias:', err);
    return [];
  }
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
        user_profile:users_profiles(id, display_name, avatar_url, bio)
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
        user_profile:users_profiles(id, display_name, avatar_url, bio)
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
  try {
    // 1. Tentar microserviço
    const res = await fetch('/api/anthologies', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      const json = await res.json();
      if (json.success) return { success: true, data: json.anthology };
    }
  } catch {
    // Fallback
  }

  // 2. Fallback Supabase
  try {
    const record = {
      title: payload.title.toLowerCase().trim(),
      month: payload.month,
      year: payload.year,
      curator_note: payload.curator_note || null,
      cover_image_url: payload.cover_image_url || null,
      featured_post_ids: payload.featured_post_ids || [],
      published: payload.published ?? false,
      published_at: payload.published ? new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
    };

    if (payload.id) {
      const { data, error } = await supabase
        .from('fogueira_anthologies')
        .update(record)
        .eq('id', payload.id)
        .select()
        .single();

      if (error) throw error;
      return { success: true, data: data as unknown as Anthology };
    } else {
      const { data, error } = await supabase
        .from('fogueira_anthologies')
        .insert(record)
        .select()
        .single();

      if (error) throw error;
      return { success: true, data: data as unknown as Anthology };
    }
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
      if (json.success) return { success: true };
    }
  } catch {
    // fallback
  }

  try {
    const { error } = await supabase
      .from('fogueira_anthologies')
      .update({
        published,
        published_at: published ? new Date().toISOString() : null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);

    if (error) throw error;
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
      if (json.success) return { success: true };
    }
  } catch {
    // fallback
  }

  try {
    const { error } = await supabase.from('fogueira_anthologies').delete().eq('id', id);
    if (error) throw error;
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
