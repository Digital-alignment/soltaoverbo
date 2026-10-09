import { supabase } from './supabase';
import { ProductMeeting, ProductSlug } from '../types/productHubs';

const STORAGE_KEY = 'admin_all_meetings';
const SYNC_EVENT = 'solta_meetings_updated';

// Encontros padrão sincronizados com datas dinâmicas no mês atual (outubro)
export function getDefaultMeetings(): ProductMeeting[] {
  const now = Date.now();
  // Próximo sábado às 21:49
  const dateSabado = new Date(now + 86400000 * 2);
  dateSabado.setHours(21, 49, 0, 0);

  // Próxima terça-feira às 21:49
  const dateTerca = new Date(now + 86400000 * 5);
  dateTerca.setHours(21, 49, 0, 0);

  return [
    {
      id: 'm-demo-1',
      product_slug: 'programa_cafe_com_letras',
      title: 'café com letras: roda de leitura e afeto',
      date_time: dateSabado.toISOString(),
      meeting_link: 'https://zoom.us/j/soltaoverbo-cafe',
      description: 'leitura comentada de contos contemporâneos e partilha poética ao vivo.',
      is_published: true,
      audience_type: 'product',
      target_products: ['programa_cafe_com_letras'],
    },
    {
      id: 'm-demo-2',
      product_slug: 'comunidade',
      title: 'fogueira aberta: boas-vindas do mês',
      date_time: dateTerca.toISOString(),
      meeting_link: 'https://zoom.us/j/soltaoverbo-fogueira',
      description: 'encontro mensal aberto para todas as alunas e exploradoras da comunidade.',
      is_published: true,
      audience_type: 'all',
    },
  ];
}

class MeetingsService {
  /**
   * Retorna todos os encontros cadastrados, priorizando Supabase e fazendo fallback confiável para localStorage.
   */
  async getAllMeetings(): Promise<ProductMeeting[]> {
    try {
      const { data, error } = await supabase
        .from('product_meetings')
        .select('*')
        .order('date_time', { ascending: true });

      if (!error && data && data.length > 0) {
        // Mantém cache local atualizado com o Supabase
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        return data as ProductMeeting[];
      }
    } catch (err) {
      console.warn('[MeetingsService] Falha na consulta remota do Supabase, utilizando armazenamento local:', err);
    }

    // Leitura do localStorage
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch (e) {
        console.error('[MeetingsService] Erro ao decodificar encontros locais:', e);
      }
    }

    // Se ainda não houver nenhum, semeia os encontros padrão e persiste
    const defaults = getDefaultMeetings();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaults));
    return defaults;
  }

  /**
   * Retorna apenas encontros publicados
   */
  async getPublishedMeetings(): Promise<ProductMeeting[]> {
    const all = await this.getAllMeetings();
    return all.filter((m) => m.is_published !== false);
  }

  /**
   * Cria ou atualiza um encontro, sincronizando local e remotamente
   */
  async saveMeeting(payload: Omit<ProductMeeting, 'id'>, id?: string): Promise<ProductMeeting> {
    let savedMeeting: ProductMeeting;

    // 1. Tentar salvar no Supabase
    if (id) {
      try {
        await supabase.from('product_meetings').update(payload).eq('id', id);
      } catch (e) {
        console.warn('[MeetingsService] Falha no update remoto:', e);
      }
      savedMeeting = { id, ...payload };
    } else {
      let createdId = `m-${Date.now()}`;
      try {
        const { data, error } = await supabase
          .from('product_meetings')
          .insert([payload])
          .select();
        if (!error && data && data.length > 0) {
          createdId = data[0].id;
        }
      } catch (e) {
        console.warn('[MeetingsService] Falha no insert remoto:', e);
      }
      savedMeeting = { id: createdId, ...payload };
    }

    // 2. Atualizar armazenamento local
    const current = await this.getAllMeetings();
    let updated: ProductMeeting[];
    if (id) {
      updated = current.map((m) => (m.id === id ? savedMeeting : m));
    } else {
      updated = [savedMeeting, ...current.filter((m) => m.id !== savedMeeting.id)];
    }

    // Ordenar cronologicamente
    updated.sort((a, b) => new Date(a.date_time).getTime() - new Date(b.date_time).getTime());

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    // 3. Notificar todos os ouvintes em tempo real
    this.notifyChange();

    return savedMeeting;
  }

  /**
   * Remove um encontro
   */
  async deleteMeeting(id: string): Promise<void> {
    try {
      await supabase.from('product_meetings').delete().eq('id', id);
    } catch (e) {
      console.warn('[MeetingsService] Falha no delete remoto:', e);
    }

    const current = await this.getAllMeetings();
    const updated = current.filter((m) => m.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    this.notifyChange();
  }

  /**
   * Dispara evento de sincronização para outros componentes na mesma aba e abas externas
   */
  private notifyChange() {
    window.dispatchEvent(new CustomEvent(SYNC_EVENT));
  }

  /**
   * Assina atualizações em tempo real
   */
  onMeetingsChanged(callback: () => void): () => void {
    const handleCustom = () => callback();
    const handleStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        callback();
      }
    };

    window.addEventListener(SYNC_EVENT, handleCustom);
    window.addEventListener('storage', handleStorage);

    return () => {
      window.removeEventListener(SYNC_EVENT, handleCustom);
      window.removeEventListener('storage', handleStorage);
    };
  }
}

export const meetingsService = new MeetingsService();
