import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { B2BLead, B2BLeadStatus } from '../../types/productHubs';
import {
  Building2,
  User,
  Mail,
  Phone,
  DollarSign,
  Plus,
  Trash2,
  ChevronRight,
  ChevronLeft,
  FileText,
  X,
  Briefcase,
} from 'lucide-react';

const COLUMNS: { id: B2BLeadStatus; title: string; color: string }[] = [
  { id: 'novo_contato', title: 'novo contato', color: 'bg-acentoAzul' },
  { id: 'reuniao_agendada', title: 'reunião agendada', color: 'bg-acentoTerracota' },
  { id: 'proposta_enviada', title: 'proposta enviada', color: 'bg-tintaCarvao' },
  { id: 'fechado', title: 'contrato fechado', color: 'bg-acentoOliva' },
];

export default function B2BLeadKanban() {
  const [leads, setLeads] = useState<B2BLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [companyName, setCompanyName] = useState('');
  const [contactName, setContactName] = useState('');
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [proposalValue, setProposalValue] = useState('');
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState<B2BLeadStatus>('novo_contato');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('b2b_leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (error || !data) {
        console.warn('b2b_leads table fallback:', error?.message);
        const stored = localStorage.getItem('b2b_leads_data');
        if (stored) {
          setLeads(JSON.parse(stored));
        } else {
          setLeads([
            {
              id: 'lead-1',
              company_name: 'natura & co',
              contact_name: 'mariana costa (rh)',
              email: 'marianacosta@natura.net',
              whatsapp: '+55 11 98765-4321',
              status: 'novo_contato',
              proposal_value: 12000,
              notes: 'interesse em oficina de escrita poética para lideranças femininas.',
            },
            {
              id: 'lead-2',
              company_name: 'sesc são paulo',
              contact_name: 'roberto almeida',
              email: 'ralmeida@sescsp.org.br',
              whatsapp: '+55 11 97654-3210',
              status: 'reuniao_agendada',
              proposal_value: 8500,
              notes: 'reunião agendada para dia 18 às 15h via zoom.',
            },
            {
              id: 'lead-3',
              company_name: 'fundação itaú',
              contact_name: 'luciana pereira',
              email: 'luciana@itau.com.br',
              whatsapp: '+55 11 96543-2109',
              status: 'proposta_enviada',
              proposal_value: 18000,
              notes: 'proposta de imersão de 3 dias enviada para avaliação da diretoria.',
            },
            {
              id: 'lead-4',
              company_name: 'empresa b corp brasil',
              contact_name: 'patrícia mendes',
              email: 'patricia@bcorp.br',
              whatsapp: '+55 11 95432-1098',
              status: 'fechado',
              proposal_value: 15000,
              notes: 'contrato assinado! evento agendado para novembro.',
            },
          ]);
        }
      } else {
        setLeads(data as B2BLead[]);
      }
    } catch (err) {
      console.error('Error fetching B2B leads:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim() || !contactName.trim()) return;

    setSaving(true);
    const newLead: Omit<B2BLead, 'id'> = {
      company_name: companyName.trim().toLowerCase(),
      contact_name: contactName.trim().toLowerCase(),
      email: email.trim().toLowerCase() || undefined,
      whatsapp: whatsapp.trim() || undefined,
      status: status,
      proposal_value: proposalValue ? parseFloat(proposalValue) : undefined,
      notes: notes.trim().toLowerCase() || undefined,
    };

    try {
      const { data, error } = await supabase
        .from('b2b_leads')
        .insert([newLead])
        .select();

      if (!error && data && data.length > 0) {
        setLeads((prev) => [data[0] as B2BLead, ...prev]);
      } else {
        const fallbackLead: B2BLead = {
          id: `local-lead-${Date.now()}`,
          ...newLead,
        };
        const updated = [fallbackLead, ...leads];
        setLeads(updated);
        localStorage.setItem('b2b_leads_data', JSON.stringify(updated));
      }

      setCompanyName('');
      setContactName('');
      setEmail('');
      setWhatsapp('');
      setProposalValue('');
      setNotes('');
      setStatus('novo_contato');
      setIsModalOpen(false);
    } catch (err) {
      console.error('Error creating B2B lead:', err);
    } finally {
      setSaving(false);
    }
  };

  const updateLeadStatus = async (leadId: string, newStatus: B2BLeadStatus) => {
    const updated = leads.map((l) => (l.id === leadId ? { ...l, status: newStatus } : l));
    setLeads(updated);
    localStorage.setItem('b2b_leads_data', JSON.stringify(updated));

    try {
      await supabase.from('b2b_leads').update({ status: newStatus }).eq('id', leadId);
    } catch (err) {
      console.error('Error updating lead status:', err);
    }
  };

  const deleteLead = async (id: string) => {
    const updated = leads.filter((l) => l.id !== id);
    setLeads(updated);
    localStorage.setItem('b2b_leads_data', JSON.stringify(updated));

    try {
      await supabase.from('b2b_leads').delete().eq('id', id);
    } catch (err) {
      console.error('Error deleting lead:', err);
    }
  };

  const totalPipeline = leads.reduce((acc, l) => acc + (l.proposal_value || 0), 0);

  return (
    <div className="bg-papelClaro rounded-3xl border border-papelKraft/40 p-5 sm:p-7 shadow-kraft space-y-6">
      {/* CABEÇALHO DO CRM B2B */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-papelKraft/30 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-acentoAzul/10 text-acentoAzul text-[11px] font-bold font-corpo lowercase">
              crm b2b • contrate uma experiência
            </span>
          </div>
          <h3 className="font-editorial font-bold text-xl sm:text-2xl text-acentoAzul lowercase">
            pipeline de vendas & oportunidades corporate
          </h3>
          <p className="text-xs font-corpo text-tintaCarvao/70 lowercase">
            acompanhamento de cotações, reuniões e fechamento de workshops para empresas
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-2 rounded-2xl bg-white border border-papelKraft/50 text-xs font-corpo lowercase shadow-xs">
            <span className="text-tintaCarvao/60 block text-[10px]">pipeline total</span>
            <span className="font-gesto font-normal text-lg text-acentoOliva">
              R$ {totalPipeline.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2.5 rounded-2xl bg-acentoAzul hover:bg-acentoAzul/90 text-white font-gesto text-[20px] lowercase shadow-xs flex items-center gap-1.5 transition-all cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>+ novo lead b2b</span>
          </button>
        </div>
      </div>

      {/* TABLERO KANBAN DE 4 COLUNAS */}
      {loading ? (
        <div className="py-8 text-center text-xs font-corpo text-tintaCarvao/60 lowercase">
          carregando pipeline b2b...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
          {COLUMNS.map((col) => {
            const columnLeads = leads.filter((l) => l.status === col.id);
            const colTotal = columnLeads.reduce((acc, l) => acc + (l.proposal_value || 0), 0);

            return (
              <div
                key={col.id}
                className="bg-bgPlataforma/60 rounded-2xl border border-papelKraft/40 p-4 space-y-3 flex flex-col min-h-[400px]"
              >
                {/* CABEÇALHO DA COLUNA */}
                <div className="flex items-center justify-between border-b border-papelKraft/30 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${col.color}`} />
                    <h4 className="font-editorial font-bold text-sm text-acentoAzul lowercase">
                      {col.title}
                    </h4>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-white text-[11px] font-bold text-tintaCarvao/70 font-corpo">
                    {columnLeads.length}
                  </span>
                </div>

                {colTotal > 0 && (
                  <div className="text-[11px] font-corpo text-tintaCarvao/60 text-right pb-1">
                    subtotal: <strong className="text-acentoAzul">R$ {colTotal.toLocaleString('pt-BR')}</strong>
                  </div>
                )}

                {/* CARDS DE LEADS NA COLUNA */}
                <div className="flex-1 space-y-3">
                  {columnLeads.length === 0 ? (
                    <div className="py-8 text-center text-[11px] font-corpo text-tintaCarvao/40 italic lowercase border border-dashed border-papelKraft/40 rounded-xl">
                      nenhuma proposta aqui
                    </div>
                  ) : (
                    columnLeads.map((lead) => (
                      <div
                        key={lead.id}
                        className="bg-white p-4 rounded-xl border border-papelKraft/50 shadow-xs space-y-2.5 hover:border-acentoAzul/60 transition-all"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="space-y-0.5 min-w-0">
                            <h5 className="font-editorial font-bold text-sm text-acentoAzul lowercase truncate">
                              {lead.company_name}
                            </h5>
                            <div className="flex items-center gap-1 text-[11px] font-corpo text-tintaCarvao/70">
                              <User className="w-3 h-3 text-acentoTerracota shrink-0" />
                              <span className="truncate">{lead.contact_name}</span>
                            </div>
                          </div>

                          <button
                            onClick={() => deleteLead(lead.id)}
                            className="p-1 text-tintaCarvao/30 hover:text-acentoTerracota transition-colors cursor-pointer shrink-0"
                            title="excluir lead"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {lead.proposal_value && (
                          <div className="text-xs font-bold font-gesto text-acentoOliva bg-acentoOliva/10 px-2.5 py-1 rounded-lg inline-block">
                            R$ {lead.proposal_value.toLocaleString('pt-BR')}
                          </div>
                        )}

                        {lead.notes && (
                          <p className="text-[11px] font-corpo text-tintaCarvao/70 lowercase line-clamp-2 bg-papelClaro p-2 rounded-lg border border-papelKraft/30">
                            {lead.notes}
                          </p>
                        )}

                        {/* CONTATOS & MUDANÇA DE STATUS */}
                        <div className="pt-2 border-t border-papelKraft/20 flex items-center justify-between gap-2 text-[10px] font-corpo text-tintaCarvao/60">
                          {lead.email && <span className="truncate max-w-[110px]">{lead.email}</span>}

                          {/* SELETOR RÁPIDO DE STATUS */}
                          <select
                            value={lead.status}
                            onChange={(e) => updateLeadStatus(lead.id, e.target.value as B2BLeadStatus)}
                            className="bg-bgPlataforma border border-papelKraft/40 rounded-lg px-2 py-0.5 text-[10px] font-corpo lowercase focus:outline-none cursor-pointer"
                          >
                            <option value="novo_contato">novo contato</option>
                            <option value="reuniao_agendada">reunião agendada</option>
                            <option value="proposta_enviada">proposta enviada</option>
                            <option value="fechado">contrato fechado</option>
                          </select>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL DE ADICIONAR LEAD B2B */}
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
                  novo lead corporate • b2b
                </h4>
                <p className="text-xs font-corpo text-tintaCarvao/60 lowercase">
                  cadastrar empresa interessada em contratar uma experiência
                </p>
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-xl text-tintaCarvao/60 hover:text-acentoAzul"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateLead} className="space-y-4 text-xs font-corpo lowercase">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-tintaCarvao mb-1">nome da empresa *</label>
                  <input
                    type="text"
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="ex: natura, sesc, itaú"
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-white border border-papelKraft/50 text-tintaCarvao focus:outline-none focus:border-acentoAzul text-xs font-corpo lowercase"
                  />
                </div>

                <div>
                  <label className="block font-bold text-tintaCarvao mb-1">nome do contato *</label>
                  <input
                    type="text"
                    required
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="ex: mariana silva (rh)"
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-white border border-papelKraft/50 text-tintaCarvao focus:outline-none focus:border-acentoAzul text-xs font-corpo lowercase"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-tintaCarvao mb-1">e-mail corporativo</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="contato@empresa.com.br"
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-white border border-papelKraft/50 text-tintaCarvao focus:outline-none focus:border-acentoAzul text-xs font-corpo lowercase"
                  />
                </div>

                <div>
                  <label className="block font-bold text-tintaCarvao mb-1">whatsapp / telefone</label>
                  <input
                    type="text"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    placeholder="+55 11 99999-9999"
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-white border border-papelKraft/50 text-tintaCarvao focus:outline-none focus:border-acentoAzul text-xs font-corpo lowercase"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-tintaCarvao mb-1">valor estimado da proposta (R$)</label>
                  <input
                    type="number"
                    step="500"
                    value={proposalValue}
                    onChange={(e) => setProposalValue(e.target.value)}
                    placeholder="ex: 12000"
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-white border border-papelKraft/50 text-tintaCarvao focus:outline-none focus:border-acentoAzul text-xs font-corpo lowercase"
                  />
                </div>

                <div>
                  <label className="block font-bold text-tintaCarvao mb-1">estágio inicial</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as B2BLeadStatus)}
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-white border border-papelKraft/50 text-tintaCarvao focus:outline-none focus:border-acentoAzul text-xs font-corpo lowercase"
                  >
                    <option value="novo_contato">novo contato</option>
                    <option value="reuniao_agendada">reunião agendada</option>
                    <option value="proposta_enviada">proposta enviada</option>
                    <option value="fechado">contrato fechado</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-tintaCarvao mb-1">anotações & escopo do projeto</label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="detalhes da demanda, número de participantes, formato..."
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-white border border-papelKraft/50 text-tintaCarvao focus:outline-none focus:border-acentoAzul text-xs font-corpo lowercase"
                />
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
                  className="px-5 py-2 rounded-2xl bg-acentoAzul hover:bg-acentoAzul/90 text-white font-gesto text-[20px] lowercase shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                >
                  {saving ? 'salvando...' : 'salvar lead b2b'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
