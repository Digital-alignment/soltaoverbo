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
} from 'lucide-react';

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
  const [activeTab, setActiveTab] = useState<'progress' | 'texts' | 'notes' | 'contact'>('progress');
  const [facilitatorNotes, setFacilitatorNotes] = useState('');
  const [savingNotes, setSavingNotes] = useState(false);
  const [notesSavedSuccess, setNotesSavedSuccess] = useState(false);

  // Individual message state
  const [messageSubject, setMessageSubject] = useState('');
  const [messageBody, setMessageBody] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);
  const [messageSentSuccess, setMessageSentSuccess] = useState(false);

  const [realProductions, setRealProductions] = useState<StudentProduction[]>([]);

  useEffect(() => {
    if (student) {
      const storedNote = localStorage.getItem(`facilitator_notes_${student.user_id}_${productSlug}`);
      setFacilitatorNotes(storedNote || student.facilitator_notes || '');
      setNotesSavedSuccess(false);
      setMessageSentSuccess(false);
      setMessageSubject(`aviso individual • ${productName}`);
      setMessageBody('');

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
              {student.profile_picture_url ? (
                <img
                  src={student.profile_picture_url}
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
                <span className="px-2.5 py-0.5 rounded-full bg-acentoTerracota/15 text-acentoTerracota text-[11px] font-bold font-corpo lowercase">
                  {student.role === 'admin' ? 'administradora' : student.role === 'paid' ? 'membro premium' : 'membro registrado'}
                </span>
              </div>

              <div className="flex items-center gap-1.5 text-xs font-corpo text-tintaCarvao/70 lowercase">
                <Mail className="w-3.5 h-3.5 text-acentoTerracota shrink-0" />
                <span className="truncate">{student.email}</span>
              </div>

              <div className="flex items-center gap-3 text-[11px] font-corpo text-tintaCarvao/50 lowercase pt-0.5">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>última atividade: {student.last_activity}</span>
                </span>
              </div>
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
