import React from 'react';
import { X, Printer, Award, Feather, Sparkles } from 'lucide-react';
import { BRAND_ASSETS } from '../config/brandAssets';

interface PoeticCertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentName: string;
  courseTitle?: string;
  completionDate?: string;
}

export default function PoeticCertificateModal({
  isOpen,
  onClose,
  studentName,
  courseTitle = '21 dias de escrita sem cobrança',
  completionDate = new Date().toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' }),
}: PoeticCertificateModalProps) {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-tintaCarvao/60 backdrop-blur-sm flex items-center justify-center z-[99999] p-3 sm:p-6 animate-fadeIn">
      
      {/* ESTILOS DE IMPRESSÃO A4 EM PDF */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #poetic-certificate-frame, #poetic-certificate-frame * {
            visibility: visible;
          }
          #poetic-certificate-frame {
            position: fixed;
            left: 0;
            top: 0;
            width: 100vw;
            height: 100vh;
            margin: 0;
            padding: 2rem;
            background-color: #FDFBF7 !important;
            box-shadow: none !important;
            border: none !important;
            display: flex;
            align-items: center;
            justify-center: center;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      <div className="bg-[#FDFBF7] rounded-3xl border border-papelKraft/60 p-6 sm:p-10 max-w-3xl w-full shadow-kraft-lg relative flex flex-col space-y-6 max-h-[92vh] overflow-y-auto">
        
        {/* BOTÃO FECHAR */}
        <button
          onClick={onClose}
          className="no-print absolute top-4 right-4 p-2 rounded-full hover:bg-papelKraft/20 text-tintaCarvao/60 hover:text-tintaCarvao transition-colors border border-papelKraft/40 cursor-pointer z-10"
          title="fechar"
        >
          <X className="w-5 h-5" />
        </button>

        {/* ESTRUTURA DO QUADRO DO CERTIFICADO */}
        <div
          id="poetic-certificate-frame"
          className="border-2 border-acentoAzul/30 p-6 sm:p-10 rounded-2xl relative space-y-6 text-center flex flex-col justify-between bg-[#FDFBF7]"
        >
          {/* FRISO INTERNO ELEGANTE */}
          <div className="absolute inset-1.5 border border-acentoTerracota/40 rounded-xl pointer-events-none" />

          {/* TOPO: LOGO DA MARCA */}
          <div className="flex justify-center pt-2">
            <img
              src={BRAND_ASSETS.logos.horizontal}
              alt="solta o verbo"
              className="h-9 sm:h-11 w-auto object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/logo_horizontal_4.png';
              }}
            />
          </div>

          {/* SEÇÃO PRINCIPAL */}
          <div className="space-y-4 my-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-acentoAzul/10 text-acentoAzul text-xs font-bold font-corpo lowercase">
              <Award className="w-4 h-4 text-acentoTerracota" />
              <span>oficina autoral concluída</span>
            </div>

            <h1 className="font-gesto font-normal text-[32px] sm:text-[42px] text-acentoAzul lowercase leading-tight">
              certificado de conclusão poética
            </h1>

            <div className="max-w-xl mx-auto space-y-3 pt-2">
              <p className="font-editorial text-lg sm:text-2xl text-tintaCarvao leading-relaxed lowercase">
                certificamos que <strong className="font-bold text-acentoAzul capitalize underline decoration-acentoTerracota/40 underline-offset-4">{studentName}</strong> concluiu com presença, sensibilidade e dedicação os
              </p>
              
              <div className="py-2">
                <span className="font-editorial font-bold text-xl sm:text-2xl text-acentoTerracota block lowercase">
                  “{courseTitle}”
                </span>
              </div>

              <p className="font-editorial text-base sm:text-lg text-tintaCarvao/80 leading-relaxed lowercase italic">
                integrando o ritual diário de voz, escuta e liberdade poética da comunidade solta o verbo.
              </p>
            </div>
          </div>

          {/* RODAPÉ E ASSINATURA EDITORIAL */}
          <div className="pt-6 border-t border-papelKraft/40 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-corpo text-tintaCarvao/70 lowercase">
            <div className="text-left space-y-0.5">
              <span className="block font-bold text-acentoAzul">emissão poética</span>
              <span>{completionDate}</span>
            </div>

            <div className="flex items-center gap-2">
              <Feather className="w-4 h-4 text-acentoTerracota" />
              <span className="font-editorial text-sm font-bold text-acentoAzul">curadoria solta o verbo coletivo</span>
            </div>
          </div>
        </div>

        {/* BARRA DE AÇÕES INFERIOR */}
        <div className="no-print flex flex-col sm:flex-row items-center justify-end gap-3 pt-2 border-t border-papelKraft/30">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 rounded-2xl bg-white hover:bg-papelKraft/25 text-tintaCarvao/80 border border-papelKraft/40 text-xs font-bold font-corpo lowercase transition-colors cursor-pointer"
          >
            fechar
          </button>

          <button
            onClick={handlePrint}
            className="w-full sm:w-auto px-6 py-2.5 rounded-2xl bg-acentoTerracota hover:bg-acentoTerracota/90 text-white font-gesto text-[20px] lowercase shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Printer className="w-4.5 h-4.5 text-white" />
            <span>imprimir / guardar em pdf</span>
          </button>
        </div>

      </div>
    </div>
  );
}
