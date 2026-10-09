import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { StudentCourseProgress, StudentProduction, ProductSlug } from '../../types/productHubs';
import {
  X,
  CheckCircle2,
  Clock,
  BookOpen,
  Mail,
  Send,
  FileText,
  Save,
  Calendar,
  Sparkles,
  User,
  Check,
  Instagram,
  Linkedin,
  ExternalLink,
  Shield,
  Gift,
  Plus,
  Trash2,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import { calculateTrialStatus, isEntitlementActive, Entitlement } from '../../lib/entitlements';

interface StudentInspectionDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  student: StudentCourseProgress | null;
  productSlug: ProductSlug;
  productName: string;
  onSendBroadcastToStudent?: (student: StudentCourseProgress) => void;
}

export default function StudentInspectionDrawer({
  isOpen,
  onClose,
  student,
  productSlug,
  productName,
  onSendBroadcastToStudent,
}: StudentInspectionDrawerProps) {
  const [activeTab, setActiveTab] = useState<'progress' | 'texts' | 'access' | 'notes' | 'contact'>('progress');
  const [facilitatorNotes, setFacilitatorNotes] = useState('');
  const [savingNotes, setSavingNotes] = useState(false);
  const [notesSavedSuccess, setNotesSavedSuccess] = useState(false);

  // Individual message state
  const [messageSubject, setMessageSubject] = useState('');
  const [messageBody, setMessageBody] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);
  const [messageSentSuccess, setMessageSentSuccess] = useState(false);

  const [realProductions, setRealProductions] = useState<StudentProduction[]>([]);

  // Entitlements & Access state
  const [entitlements, setEntitlements] = useState<Entitlement[]>([]);
  const [loadingEntitlements, setLoadingEntitlements] = useState(false);
  const [grantingSlug, setGrantingSlug] = useState<string | null>(null);
  const [actionFeedback, setActionFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Email and Avatar freshness state
  const [currentEmail, setCurrentEmail] = useState<string>(student?.email_public || student?.email || '');
  const [currentAvatar, setCurrentAvatar] = useState<string | null>(student?.profile_picture_url || null);

  const fetchEntitlements = async () => {
    if (!student?.user_id) return;
    setLoadingEntitlements(true);
    try {
      const { data, error } = await supabase
        .from('user_entitlements')
        .select('*')
        .eq('user_id', student.user_id)
        .order('created_at', { ascending: false });

      if (!error && data) {
        setEntitlements(data as Entitlement[]);
      } else {
        setEntitlements([]);
      }
    } catch (e) {
      console.error('Erro ao buscar entitlements:', e);
    } finally {
      setLoadingEntitlements(false);
    }
  };

  useEffect(() => {
    if (student) {
      setCurrentEmail(student.email_public || student.email || '');
      setCurrentAvatar(student.profile_picture_url || null);

      // Sincronizar dados em tempo real direto de users_profiles
      supabase
        .from('users_profiles')
        .select('email_public, profile_picture_url')
        .eq('id', student.user_id)
        .maybeSingle()
        .then(({ data }) => {
          if (data) {
            if (data.email_public && data.email_public.trim() !== '') {
              setCurrentEmail(data.email_public);
            }
            if (data.profile_picture_url && data.profile_picture_url.trim() !== '') {
              setCurrentAvatar(data.profile_picture_url);
            }
          }
        });

      const storedNote = localStorage.getItem(`facilitator_notes_${student.user_id}_${productSlug}`);
      setFacilitatorNotes(storedNote || student.facilitator_notes || '');
      setNotesSavedSuccess(false);
      setMessageSentSuccess(false);
      setMessageSubject(`aviso individual • ${productName}`);
      setMessageBody('');
      setActionFeedback(null);

      fetchEntitlements();

      // Fetch student's real writing exercises from Supabase
      supabase
        .from('writing_exercises')
        .select('*')
        .eq('user_id', student.user_id)
        .order('created_at', { ascending: false })
        .then(({ data, error }) => {
          if (!error && data && data.length > 0) {
            const mapped: StudentProduction[] = data.map((ex) => {
              const cleanText = (ex.content || '').replace(/<[^>]*>?/gm, '').trim();
              const words = cleanText ? cleanText.split(/\s+/).filter(Boolean).length : 0;
              return {
                id: ex.id,
                title: (ex.title || 'sem título').toLowerCase(),
                excerpt: cleanText ? cleanText.substring(0, 150).toLowerCase() + '...' : 'sem conteúdo...',
                word_count: words,
                created_at: new Date(ex.created_at).toLocaleDateString('pt-BR'),
                folder_name: ex.is_published ? 'fogueira (publicado)' : 'caderno autoral',
              };
            });
            setRealProductions(mapped);
          } else {
            setRealProductions([]);
          }
        });
    }
  }, [student, productSlug]);

  if (!isOpen || !student) return null;

  const handleGrantProduct = async (slug: string, days: number, label: string) => {
    if (!student?.user_id) return;
    setGrantingSlug(slug);
    setActionFeedback(null);

    try {
      const startsAt = new Date();
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + days);

      const { error } = await supabase
        .from('user_entitlements')
        .insert({
          user_id: student.user_id,
          product_slug: slug,
          status: 'active',
          source: 'manual_admin',
          starts_at: startsAt.toISOString(),
          expires_at: expiresAt.toISOString(),
          metadata: {
            granted_by: 'facilitadora_admin',
            granted_at: startsAt.toISOString(),
            label,
            days,
          },
        });

      if (error) {
        setActionFeedback({
          type: 'error',
          message: `erro ao conceder: ${error.message}`,
        });
      } else {
        setActionFeedback({
          type: 'success',
          message: `cortesia concedida: ${label} por ${days} dias para ${student.display_name}!`,
        });
        await fetchEntitlements();
      }
    } catch (err: any) {
      setActionFeedback({
        type: 'error',
        message: `erro inesperado: ${err?.message || 'falha na requisição'}`,
      });
    } finally {
      setGrantingSlug(null);
    }
  };

  const handleRevokeEntitlement = async (entitlementId: string, label: string) => {
    if (!confirm(`tem certeza que deseja cancelar o acesso de "${label}" desta aluna?`)) return;
    setActionFeedback(null);

    try {
      const { error } = await supabase
        .from('user_entitlements')
        .update({
          status: 'cancelled',
          updated_at: new Date().toISOString(),
        })
        .eq('id', entitlementId);

      if (error) {
        setActionFeedback({
          type: 'error',
          message: `erro ao cancelar: ${error.message}`,
        });
      } else {
        setActionFeedback({
          type: 'success',
          message: `acesso de "${label}" revogado com sucesso.`,
        });
        await fetchEntitlements();
      }
    } catch (err: any) {
      setActionFeedback({
        type: 'error',
        message: `erro inesperado: ${err?.message || 'falha'}`,
      });
    }
  };

  const handleSaveNotes = () => {
    setSavingNotes(true);
    localStorage.setItem(`facilitator_notes_${student.user_id}_${productSlug}`, facilitatorNotes);
    setTimeout(() => {
      setSavingNotes(false);
      setNotesSavedSuccess(true);
      setTimeout(() => setNotesSavedSuccess(false), 3000);
    }, 400);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageSubject.trim() || !messageBody.trim()) return;

    setSendingMessage(true);
    setTimeout(() => {
      setSendingMessage(false);
      setMessageSentSuccess(true);
      setMessageSubject('');
      setMessageBody('');
      setTimeout(() => setMessageSentSuccess(false), 4000);
    }, 600);
  };

  // Use real productions if available
  const productions: StudentProduction[] = realProductions;

  const totalDays = student.total_days || (productSlug === 'programa_21_dias' ? 21 : 12);
  const currentDay = student.current_day || 1;
  const progressPercent = Math.round((currentDay / totalDays) * 100);

  const activeEntitlements = entitlements.filter(isEntitlementActive);
  const hasActivePaid = activeEntitlements.length > 0 || student.role === 'paid';
  const trial = calculateTrialStatus(student.created_at, student.role === 'admin' || hasActivePaid);

  return (
    <div className="fixed inset-0 z-50 flex justify-end animate-fadeIn">
      {/* BACKDROP */}
      <div
        className="fixed inset-0 bg-tintaCarvao/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* DRAWER PANEL */}
      <div className="relative w-full max-w-2xl bg-papelClaro h-full shadow-2xl flex flex-col z-10 border-l border-papelKraft/60 overflow-hidden">
        {/* CABEÇALHO DA FICHA POÉTICA DA ALUNA */}
        <div className="p-5 sm:p-7 border-b border-papelKraft/40 bg-bgPlataforma/60 space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs font-corpo text-tintaCarvao/70 lowercase">
              <span className="px-2.5 py-0.5 rounded-full bg-acentoAzul/10 text-acentoAzul font-bold">
                ficha poética da aluna
              </span>
              <span>•</span>
              <span className="text-acentoTerracota font-bold">{productName}</span>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-tintaCarvao/60 hover:text-acentoAzul hover:bg-papelKraft/30 transition-colors cursor-pointer"
              title="fechar ficha"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-full bg-acentoAzul text-white font-bold text-xl flex items-center justify-center shrink-0 border-2 border-acentoOliva shadow-xs overflow-hidden">
              {currentAvatar || student.profile_picture_url ? (
                <img
                  src={currentAvatar || student.profile_picture_url || ''}
                  alt={student.display_name}
                  className="w-full h-full object-cover"
                />
              ) : (
                student.display_name.charAt(0).toLowerCase()
              )}
            </div>

            <div className="space-y-1 min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="font-editorial font-bold text-2xl text-acentoAzul lowercase truncate">
                  {student.display_name}
                </h2>
                {student.role === 'admin' ? (
                  <span className="px-2.5 py-0.5 rounded-full bg-acentoAzul/15 text-acentoAzul text-[11px] font-bold font-corpo lowercase">
                    administradora
                  </span>
                ) : student.role === 'paid' && activeEntitlements.length === 0 ? (
                  <span className="px-2.5 py-0.5 rounded-full bg-acentoTerracota/15 text-acentoTerracota text-[11px] font-bold font-corpo lowercase">
                    membro premium
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full bg-papelKraft text-tintaCarvao/70 text-[11px] font-bold font-corpo lowercase">
                    membro registrado
                  </span>
                )}

                {/* Badges de Produtos Ativos */}
                {activeEntitlements.map((e) => (
                  <span
                    key={e.id || e.product_slug}
                    className="px-2.5 py-0.5 rounded-full bg-acentoOliva/20 text-acentoOliva text-[11px] font-bold font-corpo lowercase"
                  >
                    {e.product_slug === '21_dias'
                      ? '📖 21 dias'
                      : e.product_slug === 'cafe_com_letras'
                      ? '☕ café com letras'
                      : e.product_slug === 'ciclo_aprofundamento'
                      ? '✨ ciclo aprofundamento'
                      : e.product_slug === 'degustacao_atelier'
                      ? '🌱 degustação livre'
                      : e.product_slug}
                  </span>
                ))}

                {/* Badge de Trial de 4 dias se não tem produtos adquiridos */}
                {!hasActivePaid && student.role !== 'admin' && (
                  trial.isTrial ? (
                    <span className="px-2.5 py-0.5 rounded-full bg-acentoOliva/20 text-acentoOliva text-[11px] font-bold font-corpo lowercase">
                      🌱 teste ativo ({trial.daysRemaining}d restantes)
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 rounded-full bg-acentoTerracota/10 text-acentoTerracota text-[11px] font-bold font-corpo lowercase">
                      ⏳ teste expirado (modo leitura)
                    </span>
                  )
                )}
              </div>

              <div className="flex items-center gap-1.5 text-xs font-corpo text-tintaCarvao/70 lowercase">
                <Mail className="w-3.5 h-3.5 text-acentoTerracota shrink-0" />
                <span className="truncate">{currentEmail || student.email || 'e-mail não disponível'}</span>
              </div>

              <div className="flex items-center gap-3 text-[11px] font-corpo text-tintaCarvao/50 lowercase pt-0.5">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>última atividade: {student.last_activity}</span>
                </span>
              </div>

              {/* BIO DA ALUNA PARA O ADMIN */}
              {student.bio && (
                <div className="pt-2">
                  <p className="text-xs font-corpo text-tintaCarvao/85 italic lowercase leading-relaxed bg-white/70 p-3 rounded-xl border border-papelKraft/40">
                    "{student.bio}"
                  </p>
                </div>
              )}

              {/* REDES SOCIAIS E CONTATO PÚBLICO DA ALUNA */}
              {(student.substack_url || student.instagram_url || student.linkedin_url || student.email_public) && (
                <div className="flex flex-wrap items-center gap-2 pt-2">
                  {student.substack_url && (
                    <a
                      href={student.substack_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1 rounded-xl bg-white hover:bg-papelKraft/30 text-acentoAzul border border-papelKraft/40 text-[11px] font-corpo lowercase flex items-center gap-1 transition-colors cursor-pointer shadow-xs"
                      title="Substack"
                    >
                      <FileText className="w-3 h-3 text-acentoTerracota" />
                      <span>substack</span>
                      <ExternalLink className="w-2.5 h-2.5 text-tintaCarvao/40 ml-0.5" />
                    </a>
                  )}

                  {student.instagram_url && (
                    <a
                      href={student.instagram_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1 rounded-xl bg-white hover:bg-papelKraft/30 text-acentoAzul border border-papelKraft/40 text-[11px] font-corpo lowercase flex items-center gap-1 transition-colors cursor-pointer shadow-xs"
                      title="Instagram"
                    >
                      <Instagram className="w-3 h-3 text-acentoTerracota" />
                      <span>instagram</span>
                      <ExternalLink className="w-2.5 h-2.5 text-tintaCarvao/40 ml-0.5" />
                    </a>
                  )}

                  {student.linkedin_url && (
                    <a
                      href={student.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1 rounded-xl bg-white hover:bg-papelKraft/30 text-acentoAzul border border-papelKraft/40 text-[11px] font-corpo lowercase flex items-center gap-1 transition-colors cursor-pointer shadow-xs"
                      title="LinkedIn"
                    >
                      <Linkedin className="w-3 h-3 text-acentoTerracota" />
                      <span>linkedin</span>
                      <ExternalLink className="w-2.5 h-2.5 text-tintaCarvao/40 ml-0.5" />
                    </a>
                  )}

                  {student.email_public && (
                    <a
                      href={`mailto:${student.email_public}`}
                      className="px-2.5 py-1 rounded-xl bg-white hover:bg-papelKraft/30 text-acentoAzul border border-papelKraft/40 text-[11px] font-corpo lowercase flex items-center gap-1 transition-colors cursor-pointer shadow-xs"
                      title="E-mail Público"
                    >
                      <Mail className="w-3 h-3 text-acentoTerracota" />
                      <span>{student.email_public}</span>
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* NAVEGAÇÃO DE SUB-ABAS DA FICHA */}
        <div className="flex items-center gap-2 px-5 sm:px-7 py-3 border-b border-papelKraft/30 bg-papelClaro overflow-x-auto sidebar-scrollbar text-xs font-corpo lowercase">
          <button
            onClick={() => setActiveTab('progress')}
            className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'progress'
                ? 'bg-acentoAzul text-white font-bold shadow-xs'
                : 'text-tintaCarvao/70 hover:bg-papelKraft/20'
            }`}
          >
            progresso (dia {currentDay}/{totalDays})
          </button>

          <button
            onClick={() => setActiveTab('texts')}
            className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'texts'
                ? 'bg-acentoAzul text-white font-bold shadow-xs'
                : 'text-tintaCarvao/70 hover:bg-papelKraft/20'
            }`}
          >
            textos & atelier ({productions.length})
          </button>

          <button
            onClick={() => setActiveTab('access')}
            className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'access'
                ? 'bg-acentoAzul text-white font-bold shadow-xs'
                : 'text-tintaCarvao/70 hover:bg-papelKraft/20'
            }`}
          >
            assinaturas & cortesias {activeEntitlements.length > 0 ? `(${activeEntitlements.length})` : ''}
          </button>

          <button
            onClick={() => setActiveTab('notes')}
            className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'notes'
                ? 'bg-acentoAzul text-white font-bold shadow-xs'
                : 'text-tintaCarvao/70 hover:bg-papelKraft/20'
            }`}
          >
            notas da facilitadora
          </button>

          <button
            onClick={() => setActiveTab('contact')}
            className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'contact'
                ? 'bg-acentoAzul text-white font-bold shadow-xs'
                : 'text-tintaCarvao/70 hover:bg-papelKraft/20'
            }`}
          >
            enviar aviso individual
          </button>
        </div>

        {/* CORPO DO DRAWER CONFORME A ABA */}
        <div className="flex-1 overflow-y-auto sidebar-scrollbar p-5 sm:p-7 space-y-6">
          {/* TAB 1: PROGRESSO DIÁRIO */}
          {activeTab === 'progress' && (
            <div className="space-y-6 animate-fadeIn">
              {/* CARD RESUMO DE PROGRESSO */}
              <div className="bg-white p-5 rounded-2xl border border-papelKraft/40 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold font-editorial text-acentoAzul lowercase">
                    estatus de acompanhamento diário
                  </span>
                  <span className="text-xs font-bold font-corpo text-acentoTerracota">
                    {progressPercent}% concluído
                  </span>
                </div>

                <div className="w-full h-2.5 rounded-full bg-papelKraft/30 overflow-hidden">
                  <div
                    className="h-full bg-acentoTerracota rounded-full transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-xs font-corpo text-tintaCarvao/70 lowercase pt-1">
                  <span>
                    atualmente no <strong>dia {currentDay}</strong> de {totalDays}
                  </span>
                  <span>{student.completed_lessons || currentDay} lições praticadas</span>
                </div>
              </div>

              {/* TIMELINE DIVERSIFICADA DE DIAS (1 A TOTALDAYS) */}
              <div className="space-y-3">
                <h4 className="font-editorial font-bold text-base text-acentoAzul lowercase">
                  linha do tempo do programa ({productName})
                </h4>

                <div className="grid grid-cols-3 sm:grid-cols-7 gap-2">
                  {Array.from({ length: totalDays }, (_, i) => i + 1).map((dayNum) => {
                    const isCompleted = dayNum < currentDay;
                    const isCurrent = dayNum === currentDay;

                    return (
                      <div
                        key={dayNum}
                        className={`p-2.5 rounded-xl border text-center space-y-1 transition-all ${
                          isCurrent
                            ? 'bg-acentoTerracota text-white border-acentoTerracota shadow-xs font-bold'
                            : isCompleted
                            ? 'bg-acentoOliva/15 text-acentoOliva border-acentoOliva/40'
                            : 'bg-white text-tintaCarvao/40 border-papelKraft/30'
                        }`}
                      >
                        <span className="text-[10px] font-corpo lowercase block">dia</span>
                        <span className="font-gesto text-xl block leading-none">
                          {dayNum < 10 ? `0${dayNum}` : dayNum}
                        </span>
                        <div className="flex justify-center pt-0.5">
                          {isCompleted ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-acentoOliva" />
                          ) : isCurrent ? (
                            <Sparkles className="w-3.5 h-3.5 text-white animate-pulse" />
                          ) : (
                            <div className="w-2.5 h-2.5 rounded-full bg-papelKraft/40" />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: TEXTOS & PRODUÇÕES DO ATELIER */}
          {activeTab === 'texts' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="border-b border-papelKraft/30 pb-2">
                <h4 className="font-editorial font-bold text-base text-acentoAzul lowercase">
                  produções autoral no atelier ({productions.length} textos)
                </h4>
                <p className="text-xs font-corpo text-tintaCarvao/60 lowercase">
                  histórico de textos salvos, rascunhos e cadernos pessoais da aluna
                </p>
              </div>

              {productions.length === 0 ? (
                <div className="p-8 rounded-2xl bg-white border border-papelKraft/40 text-center space-y-2 shadow-xs">
                  <FileText className="w-8 h-8 text-acentoAzul/40 mx-auto" />
                  <p className="text-sm font-editorial font-bold text-acentoAzul lowercase">
                    nenhum texto criado no atelier ainda
                  </p>
                  <p className="text-xs font-corpo text-tintaCarvao/60 lowercase">
                    esta aluna ainda não gravou nem publicou rascunhos no estúdio de escrita.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {productions.map((prod) => (
                    <div
                      key={prod.id}
                      className="bg-white p-4 sm:p-5 rounded-2xl border border-papelKraft/40 shadow-xs space-y-2 hover:border-acentoAzul/60 transition-all"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <h5 className="font-editorial font-bold text-base text-acentoAzul lowercase">
                          {prod.title}
                        </h5>
                        {prod.folder_name && (
                          <span className="px-2 py-0.5 rounded-lg bg-acentoAzul/10 text-acentoAzul text-[10px] font-bold font-corpo lowercase">
                            {prod.folder_name}
                          </span>
                        )}
                      </div>

                      <p className="text-xs font-corpo text-tintaCarvao/80 italic lowercase leading-relaxed">
                        "{prod.excerpt}"
                      </p>

                      <div className="pt-2 border-t border-papelKraft/20 flex items-center justify-between text-[11px] font-corpo text-tintaCarvao/50 lowercase">
                        <span>{prod.word_count} palavras</span>
                        <span>{prod.created_at}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB: ASSINATURAS & CORTESIAS (ENTITLEMENTS & ACCESS) */}
          {activeTab === 'access' && (
            <div className="space-y-5 animate-fadeIn">
              <div className="border-b border-papelKraft/30 pb-2">
                <h4 className="font-editorial font-bold text-base text-acentoAzul lowercase">
                  assinaturas, cortesias & períodos de teste
                </h4>
                <p className="text-xs font-corpo text-tintaCarvao/60 lowercase">
                  gestão granular de entitlements, tempo de degustação e atribuição manual de produtos
                </p>
              </div>

              {actionFeedback && (
                <div
                  className={`p-3.5 rounded-2xl text-xs font-corpo lowercase flex items-center justify-between border ${
                    actionFeedback.type === 'success'
                      ? 'bg-acentoOliva/15 text-acentoOliva border-acentoOliva/40'
                      : 'bg-acentoTerracota/15 text-acentoTerracota border-acentoTerracota/40'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {actionFeedback.type === 'success' ? (
                      <Check className="w-4 h-4 shrink-0" />
                    ) : (
                      <AlertCircle className="w-4 h-4 shrink-0" />
                    )}
                    <span>{actionFeedback.message}</span>
                  </div>
                  <button
                    onClick={() => setActionFeedback(null)}
                    className="p-1 hover:opacity-70 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* CARD 1: ESTADO DO TRIAL (4 DIAS / 96 HORAS) */}
              <div className="bg-white p-5 rounded-2xl border border-papelKraft/40 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-acentoTerracota" />
                    <span className="text-xs font-bold font-editorial text-acentoAzul lowercase">
                      período de teste inicial (96 horas / 4 dias)
                    </span>
                  </div>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold font-corpo lowercase ${
                      hasActivePaid || student.role === 'admin'
                        ? 'bg-acentoOliva/15 text-acentoOliva'
                        : trial.isTrial
                        ? 'bg-acentoOliva/20 text-acentoOliva'
                        : 'bg-acentoTerracota/15 text-acentoTerracota'
                    }`}
                  >
                    {hasActivePaid || student.role === 'admin'
                      ? 'acesso coberto por produto'
                      : trial.isTrial
                      ? `${trial.daysRemaining}d restantes (${trial.hoursRemaining}h)`
                      : 'teste finalizado'}
                  </span>
                </div>

                <div className="text-xs font-corpo text-tintaCarvao/70 lowercase leading-relaxed space-y-1">
                  <p>
                    <strong>data de registro:</strong>{' '}
                    {student.created_at
                      ? new Date(student.created_at).toLocaleString('pt-BR')
                      : 'não informada'}
                  </p>
                  {trial.expiresAt && !hasActivePaid && (
                    <p>
                      <strong>prazo do teste livre:</strong>{' '}
                      {trial.expiresAt.toLocaleString('pt-BR')} (
                      {trial.isTrial ? 'em andamento' : 'expirado'})
                    </p>
                  )}
                  <p className="text-[11px] text-tintaCarvao/50 pt-1">
                    {hasActivePaid
                      ? 'a aluna possui produtos ou assinaturas ativas com acesso liberado ao estúdio.'
                      : trial.isTrial
                      ? 'aluna com acesso completo e ilimitado ao atelier e fogueira durante este período.'
                      : 'o teste expirou. a aluna pode ler todos os textos criados no atelier (modo somente leitura) e publicar até 3 vezes por semana na fogueira.'}
                  </p>
                </div>

                <div className="pt-2 border-t border-papelKraft/20 flex items-center justify-between flex-wrap gap-2">
                  <span className="text-[11px] font-corpo text-tintaCarvao/60 lowercase">
                    precisa dar mais tempo de degustação?
                  </span>
                  <button
                    onClick={() => handleGrantProduct('degustacao_atelier', 7, 'degustação atelier')}
                    disabled={grantingSlug !== null}
                    className="px-3 py-1.5 rounded-xl bg-papelClaro hover:bg-papelKraft/30 text-acentoAzul border border-papelKraft/40 text-xs font-corpo font-bold lowercase flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                  >
                    <Plus className="w-3.5 h-3.5 text-acentoTerracota" />
                    <span>conceder degustação extra (+7 dias)</span>
                  </button>
                </div>
              </div>

              {/* CARD 2: LISTAGEM DE ENTITLEMENTS / PRODUTOS REGISTRADOS */}
              <div className="bg-white p-5 rounded-2xl border border-papelKraft/40 shadow-xs space-y-3">
                <div className="flex items-center justify-between border-b border-papelKraft/20 pb-2">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-acentoAzul" />
                    <span className="text-xs font-bold font-editorial text-acentoAzul lowercase">
                      produtos & acessos cadastrados ({entitlements.length})
                    </span>
                  </div>
                  <button
                    onClick={fetchEntitlements}
                    disabled={loadingEntitlements}
                    className="text-[11px] font-corpo text-acentoAzul hover:underline cursor-pointer lowercase flex items-center gap-1"
                    title="atualizar lista"
                  >
                    <RefreshCw className={`w-3 h-3 ${loadingEntitlements ? 'animate-spin' : ''}`} />
                    <span>atualizar</span>
                  </button>
                </div>

                {loadingEntitlements ? (
                  <p className="text-xs font-corpo text-tintaCarvao/50 lowercase py-3 text-center">
                    carregando acessos da aluna...
                  </p>
                ) : entitlements.length === 0 ? (
                  <div className="py-4 text-center space-y-1">
                    <p className="text-xs font-corpo text-tintaCarvao/60 lowercase">
                      nenhum produto ou assinatura registrado para esta aluna ainda.
                    </p>
                    <p className="text-[11px] font-corpo text-tintaCarvao/40 lowercase">
                      você pode conceder uma cortesia manual na seção abaixo.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {entitlements.map((item) => {
                      const isActive = isEntitlementActive(item);
                      const isCancelled = item.status === 'cancelled';

                      const productLabels: Record<string, string> = {
                        '21_dias': '21 dias de escrita (curso autoral & atelier)',
                        'cafe_com_letras': 'café com letras (encontros terças & atelier)',
                        'ciclo_aprofundamento': 'ciclo de aprofundamento (bundle completo)',
                        'degustacao_atelier': 'degustação livre do atelier (cortesia)',
                      };
                      const label = productLabels[item.product_slug] || item.product_slug;

                      return (
                        <div
                          key={item.id}
                          className="p-3.5 rounded-xl border border-papelKraft/40 bg-papelClaro/60 space-y-2"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-editorial font-bold text-sm text-acentoAzul lowercase">
                              {label}
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-corpo lowercase ${
                                isActive
                                  ? 'bg-acentoOliva/20 text-acentoOliva'
                                  : isCancelled
                                  ? 'bg-acentoTerracota/15 text-acentoTerracota'
                                  : 'bg-papelKraft text-tintaCarvao/60'
                              }`}
                            >
                              {isActive ? 'ativo' : isCancelled ? 'cancelado' : 'expirado'}
                            </span>
                          </div>

                          <div className="flex items-center justify-between text-[11px] font-corpo text-tintaCarvao/60 lowercase flex-wrap gap-2 pt-1 border-t border-papelKraft/20">
                            <div>
                              <span>
                                {item.starts_at && (
                                  <>início: {new Date(item.starts_at).toLocaleDateString('pt-BR')} • </>
                                )}
                                {item.expires_at ? (
                                  <>válido até: {new Date(item.expires_at).toLocaleDateString('pt-BR')}</>
                                ) : (
                                  <>vitalício / sem expiração</>
                                )}
                              </span>
                              <span className="text-tintaCarvao/40 block text-[10px]">
                                origem: {item.source || 'sistema'}
                              </span>
                            </div>

                            {isActive && item.id && (
                              <button
                                onClick={() => handleRevokeEntitlement(item.id!, label)}
                                className="px-2.5 py-1 rounded-lg bg-white hover:bg-acentoTerracota/10 text-acentoTerracota border border-papelKraft/40 text-[10px] font-corpo font-bold lowercase transition-colors cursor-pointer flex items-center gap-1"
                                title="cancelar este acesso"
                              >
                                <Trash2 className="w-3 h-3" />
                                <span>revogar</span>
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* CARD 3: ATRIBUIR CORTESIA MANUAL DA FACILITADORA */}
              <div className="bg-white p-5 rounded-2xl border border-papelKraft/40 shadow-xs space-y-3">
                <div className="flex items-center gap-2 border-b border-papelKraft/20 pb-2">
                  <Gift className="w-4 h-4 text-acentoTerracota" />
                  <span className="text-xs font-bold font-editorial text-acentoAzul lowercase">
                    conceder cortesia poética ou acesso manual
                  </span>
                </div>

                <p className="text-xs font-corpo text-tintaCarvao/70 lowercase leading-relaxed">
                  escolha um dos produtos para liberar acesso imediato no perfil da aluna sem passar pelo checkout:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                  <button
                    onClick={() => handleGrantProduct('21_dias', 365, '21 dias de escrita')}
                    disabled={grantingSlug !== null}
                    className="p-3 rounded-xl bg-papelClaro hover:bg-acentoAzul/10 text-left border border-papelKraft/40 transition-all cursor-pointer space-y-1 disabled:opacity-50 group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-editorial font-bold text-xs text-acentoAzul lowercase group-hover:text-acentoTerracota transition-colors">
                        21 dias de escrita
                      </span>
                      <span className="text-[10px] text-acentoTerracota font-bold font-corpo">
                        1 ano (365d)
                      </span>
                    </div>
                    <p className="text-[10px] font-corpo text-tintaCarvao/60 lowercase">
                      libera o curso completo dos 21 dias e escrita ilimitada no atelier.
                    </p>
                  </button>

                  <button
                    onClick={() => handleGrantProduct('cafe_com_letras', 30, 'café com letras')}
                    disabled={grantingSlug !== null}
                    className="p-3 rounded-xl bg-papelClaro hover:bg-acentoAzul/10 text-left border border-papelKraft/40 transition-all cursor-pointer space-y-1 disabled:opacity-50 group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-editorial font-bold text-xs text-acentoAzul lowercase group-hover:text-acentoTerracota transition-colors">
                        café com letras
                      </span>
                      <span className="text-[10px] text-acentoTerracota font-bold font-corpo">
                        1 mês (30d)
                      </span>
                    </div>
                    <p className="text-[10px] font-corpo text-tintaCarvao/60 lowercase">
                      libera os encontros ao vivo de terças 8h00 e atelier completo.
                    </p>
                  </button>

                  <button
                    onClick={() => handleGrantProduct('ciclo_aprofundamento', 365, 'ciclo de aprofundamento')}
                    disabled={grantingSlug !== null}
                    className="p-3 rounded-xl bg-papelClaro hover:bg-acentoAzul/10 text-left border border-papelKraft/40 transition-all cursor-pointer space-y-1 disabled:opacity-50 group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-editorial font-bold text-xs text-acentoAzul lowercase group-hover:text-acentoTerracota transition-colors">
                        ciclo de aprofundamento
                      </span>
                      <span className="text-[10px] text-acentoTerracota font-bold font-corpo">
                        1 ano (bundle mestre)
                      </span>
                    </div>
                    <p className="text-[10px] font-corpo text-tintaCarvao/60 lowercase">
                      inclui 21 dias + café com letras + ciclo jout jout + atelier.
                    </p>
                  </button>

                  <button
                    onClick={() => handleGrantProduct('degustacao_atelier', 7, 'degustação atelier')}
                    disabled={grantingSlug !== null}
                    className="p-3 rounded-xl bg-papelClaro hover:bg-acentoAzul/10 text-left border border-papelKraft/40 transition-all cursor-pointer space-y-1 disabled:opacity-50 group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-editorial font-bold text-xs text-acentoAzul lowercase group-hover:text-acentoTerracota transition-colors">
                        degustação cortesia
                      </span>
                      <span className="text-[10px] text-acentoOliva font-bold font-corpo">
                        7 dias
                      </span>
                    </div>
                    <p className="text-[10px] font-corpo text-tintaCarvao/60 lowercase">
                      concede mais 7 dias de atelier livre e fogueira sem limite.
                    </p>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: NOTAS INTERNAS DA FACILITADORA */}
          {activeTab === 'notes' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="border-b border-papelKraft/30 pb-2">
                <h4 className="font-editorial font-bold text-base text-acentoAzul lowercase">
                  notas de acompanhamento da facilitadora
                </h4>
                <p className="text-xs font-corpo text-tintaCarvao/60 lowercase">
                  anotações internas privadas (apenas para a equipe de facilitação Bruna & Júlia)
                </p>
              </div>

              <div className="space-y-3">
                <textarea
                  rows={6}
                  value={facilitatorNotes}
                  onChange={(e) => setFacilitatorNotes(e.target.value)}
                  placeholder="escreva observações sobre a aluna, pontos de atenção, feedbacks oferecidos ou momentos de partilha..."
                  className="w-full p-4 rounded-2xl bg-white border border-papelKraft/50 text-tintaCarvao text-xs font-corpo lowercase focus:outline-none focus:border-acentoAzul shadow-xs"
                />

                <div className="flex items-center justify-between gap-3">
                  {notesSavedSuccess ? (
                    <span className="text-xs font-corpo text-acentoOliva font-bold flex items-center gap-1 lowercase">
                      <Check className="w-4 h-4" />
                      <span>notas salvas com sucesso!</span>
                    </span>
                  ) : (
                    <span className="text-[11px] font-corpo text-tintaCarvao/50 lowercase">
                      salvo localmente no dispositivo
                    </span>
                  )}

                  <button
                    onClick={handleSaveNotes}
                    disabled={savingNotes}
                    className="px-4 py-2 rounded-2xl bg-acentoTerracota hover:bg-acentoTerracota/90 text-white font-gesto text-[19px] lowercase shadow-xs flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    <span>{savingNotes ? 'salvando...' : 'salvar notas'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: ENVIAR COMUNICADO INDIVIDUAL */}
          {activeTab === 'contact' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="border-b border-papelKraft/30 pb-2">
                <h4 className="font-editorial font-bold text-base text-acentoAzul lowercase">
                  enviar aviso ou mensagem direta
                </h4>
                <p className="text-xs font-corpo text-tintaCarvao/60 lowercase">
                  enviar uma mensagem personalizada diretamente para o e-mail registrado ({student.email})
                </p>
              </div>

              {messageSentSuccess ? (
                <div className="bg-acentoOliva/15 border border-acentoOliva/40 p-5 rounded-2xl text-center space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-acentoOliva mx-auto" />
                  <h5 className="font-editorial font-bold text-base text-acentoAzul lowercase">
                    mensagem enviada com sucesso!
                  </h5>
                  <p className="text-xs font-corpo text-tintaCarvao/70 lowercase">
                    o aviso individual foi transmitido para a caixa de e-mail da aluna.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSendMessage} className="space-y-4 text-xs font-corpo lowercase">
                  <div>
                    <label className="block font-bold text-tintaCarvao mb-1">assunto do aviso *</label>
                    <input
                      type="text"
                      required
                      value={messageSubject}
                      onChange={(e) => setMessageSubject(e.target.value)}
                      placeholder="ex: acompanhamento carinhoso do seu 21 dias de escrita"
                      className="w-full px-3.5 py-2.5 rounded-2xl bg-white border border-papelKraft/50 text-tintaCarvao focus:outline-none focus:border-acentoAzul text-xs font-corpo lowercase"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-tintaCarvao mb-1">mensagem personalizada *</label>
                    <textarea
                      rows={5}
                      required
                      value={messageBody}
                      onChange={(e) => setMessageBody(e.target.value)}
                      placeholder={`olá, ${student.display_name}! notamos o seu progresso recente no ${productName}...`}
                      className="w-full px-3.5 py-2.5 rounded-2xl bg-white border border-papelKraft/50 text-tintaCarvao focus:outline-none focus:border-acentoAzul text-xs font-corpo lowercase"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      type="submit"
                      disabled={sendingMessage}
                      className="px-5 py-2.5 rounded-2xl bg-acentoAzul hover:bg-acentoAzul/90 text-white font-gesto text-[20px] lowercase shadow-xs flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                    >
                      <Send className="w-4 h-4" />
                      <span>{sendingMessage ? 'enviando...' : 'enviar comunicado →'}</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>

        {/* RODAPÉ DA FICHA */}
        <div className="p-4 border-t border-papelKraft/40 bg-bgPlataforma/50 flex items-center justify-between text-xs font-corpo text-tintaCarvao/60 lowercase">
          <span>aluna: {student.display_name}</span>
          <button
            onClick={onClose}
            className="px-3 py-1 rounded-xl bg-white border border-papelKraft/40 hover:bg-papelKraft/20 text-tintaCarvao text-xs lowercase cursor-pointer"
          >
            fechar ficha
          </button>
        </div>
      </div>
    </div>
  );
}
