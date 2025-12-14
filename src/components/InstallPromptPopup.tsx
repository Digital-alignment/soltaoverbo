import { useState } from 'react';
import { X, Share, Download } from 'lucide-react';

interface InstallPromptPopupProps {
  onInstall: () => void;
  onDismiss: (permanent: boolean) => void;
  isIOS: boolean;
  isAndroid: boolean;
}

export default function InstallPromptPopup({ onInstall, onDismiss, isIOS, isAndroid }: InstallPromptPopupProps) {
  const [dontShowAgain, setDontShowAgain] = useState(false);

  const handleDismiss = () => {
    onDismiss(dontShowAgain);
  };

  const handleInstall = () => {
    onInstall();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-slide-up">
        <div className="relative bg-[#fff9e4] p-6">
          <button
            onClick={handleDismiss}
            className="absolute top-4 right-4 p-2 hover:bg-[#140d82]/10 rounded-full transition-colors text-[#140d82]"
          >
            <X size={20} />
          </button>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-white/50 rounded-xl">
              <img src="/icone.svg" alt="Logo" className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#140d82]">Instale o App</h2>
              <p className="text-sm text-[#140d82]/70">Acesse mais rápido</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          {isIOS ? (
            <div className="space-y-4">
              <p className="text-gray-700 font-medium">Para instalar no seu iPhone ou iPad:</p>
              <ol className="space-y-3 text-sm text-gray-600">
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-gray-900 text-white rounded-full flex items-center justify-center text-xs font-bold">1</span>
                  <span>Toque no botão de <strong>Compartilhar</strong> <Share className="inline w-4 h-4" /> na parte inferior da tela</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-gray-900 text-white rounded-full flex items-center justify-center text-xs font-bold">2</span>
                  <span>Role para baixo e selecione <strong>"Adicionar à Tela de Início"</strong></span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-gray-900 text-white rounded-full flex items-center justify-center text-xs font-bold">3</span>
                  <span>Toque em <strong>"Adicionar"</strong> no canto superior direito</span>
                </li>
              </ol>
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-xs text-blue-800">
                  O ícone do app aparecerá na sua tela inicial para acesso rápido!
                </p>
              </div>
            </div>
          ) : isAndroid ? (
            <div className="space-y-4">
              <p className="text-gray-700 font-medium">Instale o app com um clique:</p>
              <button
                onClick={handleInstall}
                className="w-full py-3 px-4 bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg"
              >
                <Download size={20} />
                Instalar App
              </button>
              <p className="text-xs text-gray-500 text-center">
                Após instalar, o app estará disponível na sua tela inicial
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-gray-700 font-medium">Instale o app no seu navegador:</p>
              <button
                onClick={handleInstall}
                className="w-full py-3 px-4 bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg"
              >
                <Download size={20} />
                Instalar App
              </button>
              <p className="text-xs text-gray-500 text-center">
                O app funcionará mesmo quando você estiver offline
              </p>
            </div>
          )}

          <div className="mt-6 pt-4 border-t border-gray-200">
            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={dontShowAgain}
                onChange={(e) => setDontShowAgain(e.target.checked)}
                className="mt-1 w-4 h-4 text-gray-900 rounded border-gray-300 focus:ring-gray-900"
              />
              <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">
                Não mostrar novamente
              </span>
            </label>

            <button
              onClick={handleDismiss}
              className="w-full mt-4 py-2 px-4 text-gray-700 hover:text-gray-900 font-medium rounded-lg hover:bg-gray-100 transition-colors"
            >
              Agora não
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
