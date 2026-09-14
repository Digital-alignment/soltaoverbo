import React from 'react';
import { useSearchParams } from 'react-router-dom';
import PageContentManagement from '../../PageContentManagement';
import B2BLeadKanban from '../B2BLeadKanban';
import ProductMeetingScheduler from '../ProductMeetingScheduler';
import ProductTaskManager from '../ProductTaskManager';
import ProductBroadcastSender from '../ProductBroadcastSender';
import {
  Briefcase,
  Building2,
  Calendar,
  Layers,
  CheckSquare,
  FileText,
  DollarSign,
  Download,
} from 'lucide-react';

export default function AdminExperienciasHub() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeSub = searchParams.get('sub') || 'overview';

  const setSub = (subKey: string) => {
    setSearchParams({ tab: 'contrate_experiencia', sub: subKey });
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* CABEÇALHO DO HUB CONTRATE UMA EXPERIÊNCIA (B2B) */}
      <div className="border-b border-papelKraft/40 pb-4 space-y-1">
        <div className="flex items-center gap-2 mb-1 text-xs font-corpo font-light text-tintaCarvao/70 lowercase tracking-wide">
          <span className="font-light text-acentoAzul">painel administrativo</span>
          <span className="text-tintaCarvao/40 font-light">/</span>
          <span className="font-light text-acentoTerracota">
            contrate uma experiência (b2b)
          </span>
          <span className="text-tintaCarvao/40 font-light">/</span>
          <span className="px-2.5 py-0.5 rounded-full bg-acentoAzul/10 text-acentoAzul font-light text-[11px]">
            {activeSub}
          </span>
        </div>

        <h1 className="font-gesto font-normal text-[34px] sm:text-[44px] text-acentoAzul lowercase leading-tight">
          hub • contrate uma experiência (b2b)
        </h1>
        <p className="text-xs sm:text-sm font-corpo text-tintaCarvao/70 lowercase">
          gestão de propostas corporativas, crm de oportunidades, materiais de venda e reuniões b2b
        </p>
      </div>

      {/* SUB-MENU DE NAVEGAÇÃO DO HUB */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-papelKraft/30 sidebar-scrollbar text-xs font-corpo lowercase">
        <button
          onClick={() => setSub('overview')}
          className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
            activeSub === 'overview'
              ? 'bg-acentoAzul text-white font-bold shadow-xs'
              : 'text-tintaCarvao/70 hover:bg-papelKraft/20'
          }`}
        >
          visão geral b2b
        </button>

        <button
          onClick={() => setSub('crm')}
          className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
            activeSub === 'crm'
              ? 'bg-acentoAzul text-white font-bold shadow-xs'
              : 'text-tintaCarvao/70 hover:bg-papelKraft/20'
          }`}
        >
          crm de leads & propostas (kanban)
        </button>

        <button
          onClick={() => setSub('cms')}
          className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
            activeSub === 'cms'
              ? 'bg-acentoAzul text-white font-bold shadow-xs'
              : 'text-tintaCarvao/70 hover:bg-papelKraft/20'
          }`}
        >
          cms da página de vendas
        </button>

        <button
          onClick={() => setSub('meetings')}
          className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
            activeSub === 'meetings'
              ? 'bg-acentoAzul text-white font-bold shadow-xs'
              : 'text-tintaCarvao/70 hover:bg-papelKraft/20'
          }`}
        >
          reuniões b2b agendadas
        </button>

        <button
          onClick={() => setSub('materials')}
          className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
            activeSub === 'materials'
              ? 'bg-acentoAzul text-white font-bold shadow-xs'
              : 'text-tintaCarvao/70 hover:bg-papelKraft/20'
          }`}
        >
          materiais de vendas (deck/pdf)
        </button>

        <button
          onClick={() => setSub('tasks')}
          className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
            activeSub === 'tasks'
              ? 'bg-acentoAzul text-white font-bold shadow-xs'
              : 'text-tintaCarvao/70 hover:bg-papelKraft/20'
          }`}
        >
          tarefas & organizacao
        </button>
      </div>

      {/* CONTEÚDO DEPENDENDO DA SUB-ABA */}
      {activeSub === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-papelClaro p-5 rounded-2xl border border-papelKraft/40 space-y-1 shadow-xs">
              <span className="text-[11px] font-bold text-tintaCarvao/60 font-corpo lowercase block">
                pipeline estimado
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="font-gesto font-normal text-3xl text-acentoOliva">
                  R$ 53,5k
                </span>
                <span className="text-[10px] text-tintaCarvao/50 font-corpo">em propostas</span>
              </div>
            </div>

            <div className="bg-papelClaro p-5 rounded-2xl border border-papelKraft/40 space-y-1 shadow-xs">
              <span className="text-[11px] font-bold text-tintaCarvao/60 font-corpo lowercase block">
                leads em negociação
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="font-gesto font-normal text-3xl text-acentoAzul">
                  4
                </span>
                <span className="text-[10px] text-tintaCarvao/50 font-corpo">empresas</span>
              </div>
            </div>

            <div className="bg-papelClaro p-5 rounded-2xl border border-papelKraft/40 space-y-1 shadow-xs">
              <span className="text-[11px] font-bold text-tintaCarvao/60 font-corpo lowercase block">
                contratos fechados
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="font-gesto font-normal text-3xl text-acentoTerracota">
                  1
                </span>
                <span className="text-[10px] text-tintaCarvao/50 font-corpo">assinado</span>
              </div>
            </div>

            <div className="bg-papelClaro p-5 rounded-2xl border border-papelKraft/40 space-y-1 shadow-xs">
              <span className="text-[11px] font-bold text-tintaCarvao/60 font-corpo lowercase block">
                ticket médio b2b
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="font-gesto font-normal text-3xl text-tintaCarvao/80">
                  R$ 13,3k
                </span>
                <span className="text-[10px] text-tintaCarvao/50 font-corpo">/evento</span>
              </div>
            </div>
          </div>

          <div className="bg-papelClaro rounded-3xl border border-papelKraft/40 p-6 sm:p-8 shadow-kraft space-y-4">
            <h3 className="font-editorial font-bold text-xl text-acentoAzul lowercase">
              atalhos de gestão corporate (b2b)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <button
                onClick={() => setSub('crm')}
                className="bg-white p-5 rounded-2xl border border-papelKraft/40 text-left space-y-2 hover:border-acentoAzul transition-all shadow-xs cursor-pointer"
              >
                <Building2 className="w-5 h-5 text-acentoAzul" />
                <h4 className="font-editorial font-bold text-sm text-acentoAzul lowercase">
                  abrir crm kanban b2b →
                </h4>
                <p className="text-xs font-corpo text-tintaCarvao/70 lowercase">
                  mover propostas entre etapas (*novo contato*, *proposta enviada*, *fechado*).
                </p>
              </button>

              <button
                onClick={() => setSub('materials')}
                className="bg-white p-5 rounded-2xl border border-papelKraft/40 text-left space-y-2 hover:border-acentoAzul transition-all shadow-xs cursor-pointer"
              >
                <FileText className="w-5 h-5 text-acentoTerracota" />
                <h4 className="font-editorial font-bold text-sm text-acentoAzul lowercase">
                  deck de vendas & pdfs →
                </h4>
                <p className="text-xs font-corpo text-tintaCarvao/70 lowercase">
                  acessar arquivos de apresentação institucional para enviar a clientes.
                </p>
              </button>

              <button
                onClick={() => setSub('cms')}
                className="bg-white p-5 rounded-2xl border border-papelKraft/40 text-left space-y-2 hover:border-acentoAzul transition-all shadow-xs cursor-pointer"
              >
                <Layers className="w-5 h-5 text-acentoOliva" />
                <h4 className="font-editorial font-bold text-sm text-acentoAzul lowercase">
                  cms da página b2b →
                </h4>
                <p className="text-xs font-corpo text-tintaCarvao/70 lowercase">
                  editar chamada corporativa e formulário de contato via whatsapp.
                </p>
              </button>
            </div>
          </div>
        </div>
      )}

      {activeSub === 'crm' && <B2BLeadKanban />}

      {activeSub === 'cms' && <PageContentManagement />}

      {activeSub === 'meetings' && (
        <ProductMeetingScheduler
          productSlug="contrate_experiencia"
          productName="Contrate uma Experiência"
        />
      )}

      {activeSub === 'materials' && (
        <div className="bg-papelClaro rounded-3xl border border-papelKraft/40 p-6 sm:p-8 shadow-kraft space-y-6">
          <div className="border-b border-papelKraft/30 pb-4">
            <h3 className="font-editorial font-bold text-xl text-acentoAzul lowercase">
              materiais de vendas & apresentações corporativas
            </h3>
            <p className="text-xs font-corpo text-tintaCarvao/70 lowercase">
              decks institucionais, pdfs de propostas e portfólio b2b para apresentações a empresas
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-papelKraft/40 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-editorial font-bold text-base text-acentoAzul lowercase">
                  deck institucional solta o verbo 2026.pdf
                </h4>
                <FileText className="w-5 h-5 text-acentoTerracota" />
              </div>
              <p className="text-xs font-corpo text-tintaCarvao/70 lowercase">
                apresentação institucional completa com metodologia Pennebaker, estatísticas e formatos de workshops para empresas.
              </p>
              <button className="px-4 py-2 rounded-xl bg-acentoAzul/10 text-acentoAzul font-corpo text-xs font-bold lowercase flex items-center gap-1.5 hover:bg-acentoAzul/20 transition-colors cursor-pointer">
                <Download className="w-3.5 h-3.5" />
                <span>baixar pdf do deck →</span>
              </button>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-papelKraft/40 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-editorial font-bold text-base text-acentoAzul lowercase">
                  modelo de proposta comercial b2b.docx
                </h4>
                <FileText className="w-5 h-5 text-acentoOliva" />
              </div>
              <p className="text-xs font-corpo text-tintaCarvao/70 lowercase">
                template personalizável de proposta comercial com escopo de entregáveis, investimentos e cronograma de encontros.
              </p>
              <button className="px-4 py-2 rounded-xl bg-acentoOliva/10 text-acentoOliva font-corpo text-xs font-bold lowercase flex items-center gap-1.5 hover:bg-acentoOliva/20 transition-colors cursor-pointer">
                <Download className="w-3.5 h-3.5" />
                <span>baixar template docx →</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {activeSub === 'tasks' && (
        <ProductTaskManager
          productSlug="contrate_experiencia"
          productName="Contrate uma Experiência"
        />
      )}
    </div>
  );
}
