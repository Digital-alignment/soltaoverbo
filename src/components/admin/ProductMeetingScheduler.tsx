import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { ProductSlug, ProductMeeting } from '../../types/productHubs';
import {
  Calendar,
  Clock,
  Video,
  Plus,
  Trash2,
  ExternalLink,
  CheckCircle,
  Eye,
  EyeOff,
  X,
} from 'lucide-react';

interface ProductMeetingSchedulerProps {
  productSlug: ProductSlug;
  productName: string;
}

export default function ProductMeetingScheduler({
  productSlug,
  productName,
}: ProductMeetingSchedulerProps) {
  const [meetings, setMeetings] = useState<ProductMeeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [dateTime, setDateTime] = useState('');
  const [meetingLink, setMeetingLink] = useState('');
  const [description, setDescription] = useState('');
  const [isPublished, setIsPublished] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchMeetings();
  }, [productSlug]);

  const fetchMeetings = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('product_meetings')
        .select('*')
        .eq('product_slug', productSlug)
        .order('date_time', { ascending: true });

      if (error) {
        console.warn('product_meetings table fallback:', error.message);
        const stored = localStorage.getItem(`meetings_${productSlug}`);
        if (stored) {
          setMeetings(JSON.parse(stored));
        } else {
          setMeetings([
            {
              id: 'demo-m1',
              product_slug: productSlug,
              title: `encontro ao vivo • ${productName}`,
              date_time: new Date(Date.now() + 86400000 * 2).toISOString(),
              meeting_link: 'https://zoom.us/j/soltaoverbo-demo',
              description: 'rodada de escrita e partilha ao vivo com a comunidade.',
              is_published: true,
            },
          ]);
        }
      } else if (data) {
        setMeetings(data as ProductMeeting[]);
      }
    } catch (err) {
      console.error('Error fetching meetings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateMeeting = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !dateTime) return;

    setSaving(true);
    const newMeeting: Omit<ProductMeeting, 'id'> = {
      product_slug: productSlug,
      title: title.trim().toLowerCase(),
      date_time: new Date(dateTime).toISOString(),
      meeting_link: meetingLink.trim() || undefined,
      description: description.trim().toLowerCase() || undefined,
      is_published: isPublished,
    };

    try {
      const { data, error } = await supabase
        .from('product_meetings')
        .insert([newMeeting])
        .select();

      if (!error && data && data.length > 0) {
        setMeetings((prev) => [...prev, data[0] as ProductMeeting]);
      } else {
        const fallbackMeeting: ProductMeeting = {
          id: `local-m-${Date.now()}`,
          ...newMeeting,
        };
        const updated = [...meetings, fallbackMeeting];
        setMeetings(updated);
        localStorage.setItem(`meetings_${productSlug}`, JSON.stringify(updated));
      }

      setTitle('');
      setDateTime('');
      setMeetingLink('');
      setDescription('');
      setIsPublished(true);
      setIsModalOpen(false);
    } catch (err) {
      console.error('Error creating meeting:', err);
    } finally {
      setSaving(false);
    }
  };

  const togglePublishStatus = async (meeting: ProductMeeting) => {
    const updated = meetings.map((m) =>
      m.id === meeting.id ? { ...m, is_published: !m.is_published } : m
    );
    setMeetings(updated);
    localStorage.setItem(`meetings_${productSlug}`, JSON.stringify(updated));

    try {
      await supabase
        .from('product_meetings')
        .update({ is_published: !meeting.is_published })
        .eq('id', meeting.id);
    } catch (err) {
      console.error('Error toggling publish status:', err);
    }
  };

  const deleteMeeting = async (id: string) => {
    const updated = meetings.filter((m) => m.id !== id);
    setMeetings(updated);
    localStorage.setItem(`meetings_${productSlug}`, JSON.stringify(updated));

    try {
      await supabase.from('product_meetings').delete().eq('id', id);
    } catch (err) {
      console.error('Error deleting meeting:', err);
    }
  };

  return (
    <div className="bg-papelClaro rounded-3xl border border-papelKraft/40 p-5 sm:p-7 shadow-kraft space-y-6">
      {/* CABEÇALHO DE AGENDAMENTO DE ENCONTROS */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-papelKraft/30 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-acentoTerracota/10 text-acentoTerracota text-[11px] font-bold font-corpo lowercase">
              agenda ao vivo • {productName}
            </span>
          </div>
          <h3 className="font-editorial font-bold text-xl sm:text-2xl text-acentoAzul lowercase">
            agendamento de encontros & lives
          </h3>
          <p className="text-xs font-corpo text-tintaCarvao/70 lowercase">
            agendar reuniões do zoom/meet e disponibilizar o acesso no dashboard das alunas
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 rounded-2xl bg-acentoTerracota hover:bg-acentoTerracota/90 text-white font-gesto text-[20px] lowercase shadow-xs flex items-center gap-1.5 transition-all cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>+ agendar encontro</span>
        </button>
      </div>

      {/* LISTAGEM DE ENCONTROS */}
      {loading ? (
        <div className="py-8 text-center text-xs font-corpo text-tintaCarvao/60 lowercase">
          carregando agenda de encontros...
        </div>
      ) : meetings.length === 0 ? (
        <div className="py-12 text-center bg-white rounded-2xl border border-papelKraft/30 p-6 space-y-2">
          <Calendar className="w-8 h-8 text-acentoTerracota/40 mx-auto" />
          <p className="text-sm font-editorial font-bold text-acentoAzul lowercase">
            nenhum encontro agendado
          </p>
          <p className="text-xs font-corpo text-tintaCarvao/60 lowercase">
            clique em "+ agendar encontro" para definir a próxima mentoria ou roda de escrita.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {meetings.map((meeting) => {
            const dateObj = new Date(meeting.date_time);
            const dateFormatted = dateObj.toLocaleDateString('pt-BR', {
              weekday: 'short',
              day: '2-digit',
              month: 'short',
            });
            const timeFormatted = dateObj.toLocaleTimeString('pt-BR', {
              hour: '2-digit',
              minute: '2-digit',
            });

            return (
              <div
                key={meeting.id}
                className="bg-white p-5 rounded-2xl border border-papelKraft/40 shadow-xs space-y-3 flex flex-col justify-between hover:border-acentoAzul/60 transition-all"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-xs font-corpo font-bold text-acentoTerracota lowercase">
                      <span className="px-2 py-0.5 rounded-lg bg-acentoTerracota/15 border border-acentoTerracota/30 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{dateFormatted} • {timeFormatted}</span>
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => togglePublishStatus(meeting)}
                        className={`p-1 rounded-lg transition-colors cursor-pointer ${
                          meeting.is_published
                            ? 'text-acentoOliva hover:bg-acentoOliva/10'
                            : 'text-tintaCarvao/40 hover:bg-black/5'
                        }`}
                        title={meeting.is_published ? 'visível para alunas' : 'oculto no dashboard'}
                      >
                        {meeting.is_published ? (
                          <Eye className="w-4 h-4" />
                        ) : (
                          <EyeOff className="w-4 h-4" />
                        )}
                      </button>

                      <button
                        onClick={() => deleteMeeting(meeting.id)}
                        className="p-1 rounded-lg text-tintaCarvao/40 hover:text-acentoTerracota hover:bg-acentoTerracota/10 transition-colors cursor-pointer"
                        title="cancelar encontro"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <h4 className="font-editorial font-bold text-base text-acentoAzul lowercase leading-snug">
                    {meeting.title}
                  </h4>

                  {meeting.description && (
                    <p className="text-xs font-corpo text-tintaCarvao/70 lowercase line-clamp-2">
                      {meeting.description}
                    </p>
                  )}
                </div>

                <div className="pt-3 border-t border-papelKraft/30 flex items-center justify-between gap-2">
                  <span className="text-[11px] font-corpo text-tintaCarvao/60 lowercase">
                    status: <strong className={meeting.is_published ? 'text-acentoOliva' : 'text-tintaCarvao/50'}>
                      {meeting.is_published ? 'publicado' : 'rascunho'}
                    </strong>
                  </span>

                  {meeting.meeting_link ? (
                    <a
                      href={meeting.meeting_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-xl bg-acentoAzul text-white font-corpo text-xs font-bold lowercase flex items-center gap-1.5 hover:bg-acentoAzul/90 transition-colors"
                    >
                      <Video className="w-3.5 h-3.5" />
                      <span>abrir link da sala →</span>
                    </a>
                  ) : (
                    <span className="text-[11px] font-corpo text-tintaCarvao/40 italic lowercase">
                      sem link de sala
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL DE AGENDAMENTO DE REUNIÃO */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-tintaCarvao/40 backdrop-blur-xs"
            onClick={() => setIsModalOpen(false)}
          />

          <div className="relative w-full max-w-lg bg-papelClaro rounded-3xl border border-papelKraft/60 shadow-2xl p-6 space-y-5 z-10 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-papelKraft/30 pb-3">
              <div>
                <h4 className="font-editorial font-bold text-lg text-acentoAzul lowercase">
                  novo encontro • {productName}
                </h4>
                <p className="text-xs font-corpo text-tintaCarvao/60 lowercase">
                  agendar aula ao vivo ou mentoria com link de transmisión
                </p>
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-xl text-tintaCarvao/60 hover:text-acentoAzul"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateMeeting} className="space-y-4 text-xs font-corpo lowercase">
              <div>
                <label className="block font-bold text-tintaCarvao mb-1">título do encontro *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="ex: mentoria ao vivo #04 • ciclo poético"
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-white border border-papelKraft/50 text-tintaCarvao focus:outline-none focus:border-acentoAzul text-xs font-corpo lowercase"
                />
              </div>

              <div>
                <label className="block font-bold text-tintaCarvao mb-1">data e horário *</label>
                <input
                  type="datetime-local"
                  required
                  value={dateTime}
                  onChange={(e) => setDateTime(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-white border border-papelKraft/50 text-tintaCarvao focus:outline-none focus:border-acentoAzul text-xs font-corpo lowercase"
                />
              </div>

              <div>
                <label className="block font-bold text-tintaCarvao mb-1">link da sala (zoom / google meet)</label>
                <input
                  type="url"
                  value={meetingLink}
                  onChange={(e) => setMeetingLink(e.target.value)}
                  placeholder="https://zoom.us/j/123456789"
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-white border border-papelKraft/50 text-tintaCarvao focus:outline-none focus:border-acentoAzul text-xs font-corpo lowercase"
                />
              </div>

              <div>
                <label className="block font-bold text-tintaCarvao mb-1">orientações para as alunas</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="resumo do que será abordado na reunião..."
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-white border border-papelKraft/50 text-tintaCarvao focus:outline-none focus:border-acentoAzul text-xs font-corpo lowercase"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="isPublished"
                  checked={isPublished}
                  onChange={(e) => setIsPublished(e.target.checked)}
                  className="rounded border-papelKraft/60 text-acentoAzul focus:ring-acentoAzul"
                />
                <label htmlFor="isPublished" className="text-xs font-corpo text-tintaCarvao lowercase cursor-pointer">
                  exibir imediatamente na agenda do dashboard das alunas
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-papelKraft/30">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-2xl border border-papelKraft/50 text-tintaCarvao/70 hover:bg-papelKraft/20 font-corpo text-xs lowercase transition-colors cursor-pointer"
                >
                  cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-2xl bg-acentoTerracota hover:bg-acentoTerracota/90 text-white font-gesto text-[20px] lowercase shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                >
                  {saving ? 'salvando...' : 'confirmar agendamento'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
