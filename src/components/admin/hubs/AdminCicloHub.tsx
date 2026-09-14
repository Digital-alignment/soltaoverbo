import React from 'react';
import { useSearchParams } from 'react-router-dom';
import PageContentManagement from '../../PageContentManagement';
import ProductAlunasTable from '../ProductAlunasTable';
import ProductMeetingScheduler from '../ProductMeetingScheduler';
import ProductTaskManager from '../ProductTaskManager';
import ProductBroadcastSender from '../ProductBroadcastSender';
import { RefreshCw, Calendar, Users, Layers, CheckSquare, Megaphone } from 'lucide-react';

export default function AdminCicloHub() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeSub = searchParams.get('sub') || 'overview';

  const setSub = (subKey: string) => {
    setSearchParams({ tab: 'programa_ciclo', sub: subKey });
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* CABEÇALHO DO HUB O CICLO */}
      <div className="border-b border-papelKraft/40 pb-4 space-y-1">
        <div className="flex items-center gap-2 mb-1 text-xs font-corpo font-light text-tintaCarvao/70 lowercase tracking-wide">
          <span className="font-light text-acentoAzul">painel administrativo</span>
          <span className="text-tintaCarvao/40 font-light">/</span>
          <span className="font-light text-acentoTerracota">
            ciclo de aprofundamento
          </span>
          <span className="text-tintaCarvao/40 font-light">/</span>
          <span className="px-2.5 py-0.5 rounded-full bg-acentoAzul/10 text-acentoAzul font-light text-[11px]">
            {activeSub}
          </span>
        </div>

        <h1 className="font-gesto font-normal text-[34px] sm:text-[44px] text-acentoAzul lowercase leading-tight">
          hub • ciclo de aprofundamento
        </h1>
        <p className="text-xs sm:text-sm font-corpo text-tintaCarvao/70 lowercase">
          gestão de assinantes premium, mentoria ao vivo, gravação de encontros e conteúdo exclusivo
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
          onClick={() => setSub('members')}
          className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
            activeSub === 'members'
              ? 'bg-acentoAzul text-white font-bold shadow-xs'
              : 'text-tintaCarvao/70 hover:bg-papelKraft/20'
          }`}
        >
          assinantes premium
        </button>

        <button
          onClick={() => setSub('meetings')}
          className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
            activeSub === 'meetings'
              ? 'bg-acentoAzul text-white font-bold shadow-xs'
              : 'text-tintaCarvao/70 hover:bg-papelKraft/20'
          }`}
        >
          encontros ao vivo & gravações
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
                assinantes ativas no ciclo
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="font-gesto font-normal text-3xl text-acentoTerracota">
                  68
                </span>
                <span className="text-[10px] text-tintaCarvao/50 font-corpo">membros</span>
              </div>
            </div>

            <div className="bg-papelClaro p-5 rounded-2xl border border-papelKraft/40 space-y-1 shadow-xs">
              <span className="text-[11px] font-bold text-tintaCarvao/60 font-corpo lowercase block">
                valor da assinatura
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="font-gesto font-normal text-3xl text-acentoAzul">
                  R$ 597
                </span>
                <span className="text-[10px] text-tintaCarvao/50 font-corpo">/trimestre</span>
              </div>
            </div>

            <div className="bg-papelClaro p-5 rounded-2xl border border-papelKraft/40 space-y-1 shadow-xs">
              <span className="text-[11px] font-bold text-tintaCarvao/60 font-corpo lowercase block">
                encontros realizados
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="font-gesto font-normal text-3xl text-acentoOliva">
                  18
                </span>
                <span className="text-[10px] text-tintaCarvao/50 font-corpo">lives</span>
              </div>
            </div>

            <div className="bg-papelClaro p-5 rounded-2xl border border-papelKraft/40 space-y-1 shadow-xs">
              <span className="text-[11px] font-bold text-tintaCarvao/60 font-corpo lowercase block">
                renovação média
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="font-gesto font-normal text-3xl text-tintaCarvao/80">
                  92%
                </span>
                <span className="text-[10px] text-tintaCarvao/50 font-corpo">retencao</span>
              </div>
            </div>
          </div>

          <div className="bg-papelClaro rounded-3xl border border-papelKraft/40 p-6 sm:p-8 shadow-kraft space-y-4">
            <h3 className="font-editorial font-bold text-xl text-acentoAzul lowercase">
              atalhos de gestão do ciclo de aprofundamento
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <button
                onClick={() => setSub('meetings')}
                className="bg-white p-5 rounded-2xl border border-papelKraft/40 text-left space-y-2 hover:border-acentoAzul transition-all shadow-xs cursor-pointer"
              >
                <Calendar className="w-5 h-5 text-acentoTerracota" />
                <h4 className="font-editorial font-bold text-sm text-acentoAzul lowercase">
                  agendar encontro ao vivo →
                </h4>
                <p className="text-xs font-corpo text-tintaCarvao/70 lowercase">
                  definir data, hora e link do zoom da próxima mentoria.
                </p>
              </button>

              <button
                onClick={() => setSub('members')}
                className="bg-white p-5 rounded-2xl border border-papelKraft/40 text-left space-y-2 hover:border-acentoAzul transition-all shadow-xs cursor-pointer"
              >
                <Users className="w-5 h-5 text-acentoAzul" />
                <h4 className="font-editorial font-bold text-sm text-acentoAzul lowercase">
                  gerenciar assinantes →
                </h4>
                <p className="text-xs font-corpo text-tintaCarvao/70 lowercase">
                  consultar lista de membros com assinatura premium ativa.
                </p>
              </button>

              <button
                onClick={() => setSub('cms')}
                className="bg-white p-5 rounded-2xl border border-papelKraft/40 text-left space-y-2 hover:border-acentoAzul transition-all shadow-xs cursor-pointer"
              >
                <Layers className="w-5 h-5 text-acentoOliva" />
                <h4 className="font-editorial font-bold text-sm text-acentoAzul lowercase">
                  cms da página de vendas →
                </h4>
                <p className="text-xs font-corpo text-tintaCarvao/70 lowercase">
                  editar promessa de valor, parcelas e fotos da imersão.
                </p>
              </button>
            </div>
          </div>
        </div>
      )}

      {activeSub === 'cms' && <PageContentManagement />}

      {activeSub === 'members' && (
        <ProductAlunasTable
          productSlug="programa_ciclo"
          productName="Ciclo de Aprofundamento"
          showProgressDay={false}
        />
      )}

      {activeSub === 'meetings' && (
        <ProductMeetingScheduler
          productSlug="programa_ciclo"
          productName="Ciclo de Aprofundamento"
        />
      )}

      {activeSub === 'tasks' && (
        <ProductTaskManager
          productSlug="programa_ciclo"
          productName="Ciclo de Aprofundamento"
        />
      )}

      {activeSub === 'broadcasts' && (
        <ProductBroadcastSender
          productSlug="programa_ciclo"
          productName="Ciclo de Aprofundamento"
        />
      )}
    </div>
  );
}
