import React from 'react';
import { useSearchParams } from 'react-router-dom';
import PageContentManagement from '../../PageContentManagement';
import ProductAlunasTable from '../ProductAlunasTable';
import ProductMeetingScheduler from '../ProductMeetingScheduler';
import ProductTaskManager from '../ProductTaskManager';
import ProductBroadcastSender from '../ProductBroadcastSender';
import ProductMaterialsManager from '../ProductMaterialsManager';
import { Coffee, Calendar, Users, Layers, CheckSquare, Megaphone, FileText } from 'lucide-react';

export default function AdminCafeHub() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeSub = searchParams.get('sub') || 'overview';

  const setSub = (subKey: string) => {
    setSearchParams({ tab: 'programa_cafe_com_letras', sub: subKey });
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* CABEÇALHO DO HUB CAFÉ COM LETRAS */}
      <div className="border-b border-papelKraft/40 pb-4 space-y-1">
        <div className="flex items-center gap-2 mb-1 text-xs font-corpo font-light text-tintaCarvao/70 lowercase tracking-wide">
          <span className="font-light text-acentoAzul">painel administrativo</span>
          <span className="text-tintaCarvao/40 font-light">/</span>
          <span className="font-light text-acentoTerracota">
            café com letras
          </span>
          <span className="text-tintaCarvao/40 font-light">/</span>
          <span className="px-2.5 py-0.5 rounded-full bg-acentoAzul/10 text-acentoAzul font-light text-[11px]">
            {activeSub}
          </span>
        </div>

        <h1 className="font-gesto font-normal text-[34px] sm:text-[44px] text-acentoAzul lowercase leading-tight">
          hub • café com letras
        </h1>
        <p className="text-xs sm:text-sm font-corpo text-tintaCarvao/70 lowercase">
          rodas de escrita ao vivo (terças 8h-8h30), agendamento de reuniões, participantes e materiais de apoio
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
          visão geral
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
          onClick={() => setSub('participants')}
          className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
            activeSub === 'participants'
              ? 'bg-acentoAzul text-white font-bold shadow-xs'
              : 'text-tintaCarvao/70 hover:bg-papelKraft/20'
          }`}
        >
          participantes registradas
        </button>

        <button
          onClick={() => setSub('meetings')}
          className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
            activeSub === 'meetings'
              ? 'bg-acentoAzul text-white font-bold shadow-xs'
              : 'text-tintaCarvao/70 hover:bg-papelKraft/20'
          }`}
        >
          agendar encontros ao vivo
        </button>

        <button
          onClick={() => setSub('materials')}
          className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
            activeSub === 'materials'
              ? 'bg-acentoAzul text-white font-bold shadow-xs'
              : 'text-tintaCarvao/70 hover:bg-papelKraft/20'
          }`}
        >
          materiais de apoio
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

        <button
          onClick={() => setSub('broadcasts')}
          className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
            activeSub === 'broadcasts'
              ? 'bg-acentoAzul text-white font-bold shadow-xs'
              : 'text-tintaCarvao/70 hover:bg-papelKraft/20'
          }`}
        >
          comunicação & avisos
        </button>
      </div>

      {/* CONTEÚDO DEPENDENDO DA SUB-ABA */}
      {activeSub === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-papelClaro p-5 rounded-2xl border border-papelKraft/40 space-y-1 shadow-xs">
              <span className="text-[11px] font-bold text-tintaCarvao/60 font-corpo lowercase block">
                horário fixo semanal
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="font-gesto font-normal text-2xl text-acentoAzul">
                  terças 8h
                </span>
                <span className="text-[10px] text-tintaCarvao/50 font-corpo">8h às 8h30</span>
              </div>
            </div>

            <div className="bg-papelClaro p-5 rounded-2xl border border-papelKraft/40 space-y-1 shadow-xs">
              <span className="text-[11px] font-bold text-tintaCarvao/60 font-corpo lowercase block">
                inscrição mensal
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="font-gesto font-normal text-3xl text-acentoTerracota">
                  R$ 97
                </span>
                <span className="text-[10px] text-tintaCarvao/50 font-corpo">/mês</span>
              </div>
            </div>

            <div className="bg-papelClaro p-5 rounded-2xl border border-papelKraft/40 space-y-1 shadow-xs">
              <span className="text-[11px] font-bold text-tintaCarvao/60 font-corpo lowercase block">
                participantes ativas
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="font-gesto font-normal text-3xl text-acentoOliva">
                  54
                </span>
                <span className="text-[10px] text-tintaCarvao/50 font-corpo">alunas</span>
              </div>
            </div>

            <div className="bg-papelClaro p-5 rounded-2xl border border-papelKraft/40 space-y-1 shadow-xs">
              <span className="text-[11px] font-bold text-tintaCarvao/60 font-corpo lowercase block">
                edición atual
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="font-gesto font-normal text-3xl text-tintaCarvao/80">
                  #24
                </span>
                <span className="text-[10px] text-tintaCarvao/50 font-corpo">roda</span>
              </div>
            </div>
          </div>

          <div className="bg-papelClaro rounded-3xl border border-papelKraft/40 p-6 sm:p-8 shadow-kraft space-y-4">
            <h3 className="font-editorial font-bold text-xl text-acentoAzul lowercase">
              atalhos de gestão do café com letras
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <button
                onClick={() => setSub('meetings')}
                className="bg-white p-5 rounded-2xl border border-papelKraft/40 text-left space-y-2 hover:border-acentoAzul transition-all shadow-xs cursor-pointer"
              >
                <Calendar className="w-5 h-5 text-acentoAzul" />
                <h4 className="font-editorial font-bold text-sm text-acentoAzul lowercase">
                  agendar próxima terça-feira →
                </h4>
                <p className="text-xs font-corpo text-tintaCarvao/70 lowercase">
                  definir o link da sala zoom do próximo encontro de 8h às 8h30.
                </p>
              </button>

              <button
                onClick={() => setSub('materials')}
                className="bg-white p-5 rounded-2xl border border-papelKraft/40 text-left space-y-2 hover:border-acentoAzul transition-all shadow-xs cursor-pointer"
              >
                <FileText className="w-5 h-5 text-acentoTerracota" />
                <h4 className="font-editorial font-bold text-sm text-acentoAzul lowercase">
                  materiais de apoio →
                </h4>
                <p className="text-xs font-corpo text-tintaCarvao/70 lowercase">
                  cadernos de provocação em pdf e áudios de sintonização.
                </p>
              </button>

              <button
                onClick={() => setSub('tasks')}
                className="bg-white p-5 rounded-2xl border border-papelKraft/40 text-left space-y-2 hover:border-acentoAzul transition-all shadow-xs cursor-pointer"
              >
                <CheckSquare className="w-5 h-5 text-acentoOliva" />
                <h4 className="font-editorial font-bold text-sm text-acentoAzul lowercase">
                  to-do list do evento →
                </h4>
                <p className="text-xs font-corpo text-tintaCarvao/70 lowercase">
                  preparativos, provocação poética do dia e tarefas de facilitação.
                </p>
              </button>
            </div>
          </div>
        </div>
      )}

      {activeSub === 'cms' && <PageContentManagement />}

      {activeSub === 'participants' && (
        <ProductAlunasTable
          productSlug="programa_cafe_com_letras"
          productName="Café com Letras"
          showProgressDay={false}
        />
      )}

      {activeSub === 'meetings' && (
        <ProductMeetingScheduler
          productSlug="programa_cafe_com_letras"
          productName="Café com Letras"
        />
      )}

      {activeSub === 'materials' && (
        <ProductMaterialsManager
          productSlug="programa_cafe_com_letras"
          productName="Café com Letras"
        />
      )}

      {activeSub === 'tasks' && (
        <ProductTaskManager
          productSlug="programa_cafe_com_letras"
          productName="Café com Letras"
        />
      )}

      {activeSub === 'broadcasts' && (
        <ProductBroadcastSender
          productSlug="programa_cafe_com_letras"
          productName="Café com Letras"
        />
      )}
    </div>
  );
}
