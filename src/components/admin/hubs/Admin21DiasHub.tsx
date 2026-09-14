import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import PageContentManagement from '../../PageContentManagement';
import ProductAlunasTable from '../ProductAlunasTable';
import ProductTaskManager from '../ProductTaskManager';
import ProductBroadcastSender from '../ProductBroadcastSender';
import Admin21DiasLessonsManager from '../Admin21DiasLessonsManager';
import {
  BookOpen,
  Users,
  Layers,
  CheckSquare,
  Megaphone,
  Sparkles,
  Calendar,
  Clock,
} from 'lucide-react';

export default function Admin21DiasHub() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeSub = searchParams.get('sub') || 'overview';

  const setSub = (subKey: string) => {
    setSearchParams({ tab: 'programa_21_dias', sub: subKey });
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* CABEÇALHO DO HUB DE 21 DIAS DE ESCRITA */}
      <div className="border-b border-papelKraft/40 pb-4 space-y-1">
        <div className="flex items-center gap-2 mb-1 text-xs font-corpo font-light text-tintaCarvao/70 lowercase tracking-wide">
          <span className="font-light text-acentoAzul">painel administrativo</span>
          <span className="text-tintaCarvao/40 font-light">/</span>
          <span className="font-light text-acentoTerracota">
            21 dias de escrita
          </span>
          <span className="text-tintaCarvao/40 font-light">/</span>
          <span className="px-2.5 py-0.5 rounded-full bg-acentoAzul/10 text-acentoAzul font-light text-[11px]">
            {activeSub}
          </span>
        </div>

        <h1 className="font-gesto font-normal text-[34px] sm:text-[44px] text-acentoAzul lowercase leading-tight">
          hub • 21 dias de escrita
        </h1>
        <p className="text-xs sm:text-sm font-corpo text-tintaCarvao/70 lowercase">
          gestão de alunas, acompanhamento diário (dia X/21), conteúdo das aulas e tarefas do programa
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
          onClick={() => setSub('students')}
          className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
            activeSub === 'students'
              ? 'bg-acentoAzul text-white font-bold shadow-xs'
              : 'text-tintaCarvao/70 hover:bg-papelKraft/20'
          }`}
        >
          alunas & progresso (dia X/21)
        </button>

        <button
          onClick={() => setSub('lessons')}
          className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
            activeSub === 'lessons'
              ? 'bg-acentoAzul text-white font-bold shadow-xs'
              : 'text-tintaCarvao/70 hover:bg-papelKraft/20'
          }`}
        >
          aulas & áudios binaurais
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
          {/* CARDS DE MÉTRICAS RÁPIDAS DE 21 DIAS */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-papelClaro p-5 rounded-2xl border border-papelKraft/40 space-y-1 shadow-xs">
              <span className="text-[11px] font-bold text-tintaCarvao/60 font-corpo lowercase block">
                alunas ativas no 21 dias
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="font-gesto font-normal text-3xl text-acentoAzul">
                  142
                </span>
                <span className="text-[10px] text-tintaCarvao/50 font-corpo">alunas</span>
              </div>
            </div>

            <div className="bg-papelClaro p-5 rounded-2xl border border-papelKraft/40 space-y-1 shadow-xs">
              <span className="text-[11px] font-bold text-tintaCarvao/60 font-corpo lowercase block">
                média de dia atual
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="font-gesto font-normal text-3xl text-acentoTerracota">
                  dia 12
                </span>
                <span className="text-[10px] text-tintaCarvao/50 font-corpo">de 21</span>
              </div>
            </div>

            <div className="bg-papelClaro p-5 rounded-2xl border border-papelKraft/40 space-y-1 shadow-xs">
              <span className="text-[11px] font-bold text-tintaCarvao/60 font-corpo lowercase block">
                taxa de conclusão
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="font-gesto font-normal text-3xl text-acentoOliva">
                  84%
                </span>
                <span className="text-[10px] text-tintaCarvao/50 font-corpo">completaram</span>
              </div>
            </div>

            <div className="bg-papelClaro p-5 rounded-2xl border border-papelKraft/40 space-y-1 shadow-xs">
              <span className="text-[11px] font-bold text-tintaCarvao/60 font-corpo lowercase block">
                total de lições
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="font-gesto font-normal text-3xl text-tintaCarvao/80">
                  22
                </span>
                <span className="text-[10px] text-tintaCarvao/50 font-corpo">aulas</span>
              </div>
            </div>
          </div>

          {/* PAINEL DE ATALHOS DE GERENCIAMENTO */}
          <div className="bg-papelClaro rounded-3xl border border-papelKraft/40 p-6 sm:p-8 shadow-kraft space-y-4">
            <h3 className="font-editorial font-bold text-xl text-acentoAzul lowercase">
              atalhos de gestão dos 21 dias de escrita
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <button
                onClick={() => setSub('students')}
                className="bg-white p-5 rounded-2xl border border-papelKraft/40 text-left space-y-2 hover:border-acentoAzul transition-all shadow-xs cursor-pointer"
              >
                <Users className="w-5 h-5 text-acentoAzul" />
                <h4 className="font-editorial font-bold text-sm text-acentoAzul lowercase">
                  acompanhar alunas →
                </h4>
                <p className="text-xs font-corpo text-tintaCarvao/70 lowercase">
                  ver exatamente em qual día de escrita cada aluna se encontra.
                </p>
              </button>

              <button
                onClick={() => setSub('cms')}
                className="bg-white p-5 rounded-2xl border border-papelKraft/40 text-left space-y-2 hover:border-acentoAzul transition-all shadow-xs cursor-pointer"
              >
                <Layers className="w-5 h-5 text-acentoTerracota" />
                <h4 className="font-editorial font-bold text-sm text-acentoAzul lowercase">
                  editar página de vendas →
                </h4>
                <p className="text-xs font-corpo text-tintaCarvao/70 lowercase">
                  atualizar preço (R$ 77), textos de chamada e imagens da landing page.
                </p>
              </button>

              <button
                onClick={() => setSub('tasks')}
                className="bg-white p-5 rounded-2xl border border-papelKraft/40 text-left space-y-2 hover:border-acentoAzul transition-all shadow-xs cursor-pointer"
              >
                <CheckSquare className="w-5 h-5 text-acentoOliva" />
                <h4 className="font-editorial font-bold text-sm text-acentoAzul lowercase">
                  lista de tarefas & notas →
                </h4>
                <p className="text-xs font-corpo text-tintaCarvao/70 lowercase">
                  organizar pendências e roteiros de acompanhamento da turma.
                </p>
              </button>
            </div>
          </div>
        </div>
      )}

      {activeSub === 'cms' && (
        <PageContentManagement />
      )}

      {activeSub === 'students' && (
        <ProductAlunasTable
          productSlug="programa_21_dias"
          productName="21 Dias de Escrita"
          showProgressDay={true}
        />
      )}

      {activeSub === 'lessons' && (
        <Admin21DiasLessonsManager />
      )}

      {activeSub === 'tasks' && (
        <ProductTaskManager
          productSlug="programa_21_dias"
          productName="21 Dias de Escrita"
        />
      )}

      {activeSub === 'broadcasts' && (
        <ProductBroadcastSender
          productSlug="programa_21_dias"
          productName="21 Dias de Escrita"
        />
      )}
    </div>
  );
}
