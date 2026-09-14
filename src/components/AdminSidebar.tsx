import { useSearchParams } from 'react-router-dom';
import {
  Users,
  BookOpen,
  Image as ImageIcon,
  Megaphone,
  MessageCircle,
  Mail,
  ShoppingCart,
  Layers,
  Images,
} from 'lucide-react';

export default function AdminSidebar() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'users';

  const navItems = [
    { id: 'users', label: 'alunas & membros', icon: Users },
    { id: 'courses', label: 'oficinas & cursos', icon: BookOpen },
    { id: 'banners', label: 'gestão de banners', icon: ImageIcon },
    { id: 'broadcasts', label: 'transmissões & broadcasts', icon: Megaphone },
    { id: 'moderation', label: 'moderação da comunidade', icon: MessageCircle },
    { id: 'messages', label: 'mensagens de contato', icon: Mail },
    { id: 'checkout', label: 'métricas de checkout', icon: ShoppingCart },
    { id: 'pages', label: 'gestão de páginas (cms)', icon: Layers },
    { id: 'gallery', label: 'banco de mídias & galeria', icon: Images },
  ];

  const handleSelectTab = (tabId: string) => {
    setSearchParams({ tab: tabId });
  };

  return (
    <>
      {/* DESKTOP FLOATING SIDEBAR ADMIN (Lado Esquerdo da Tela) */}
      <nav className="hidden lg:flex fixed left-5 top-1/2 -translate-y-1/2 z-50 pointer-events-none">
        <div className="bg-papelClaro/95 backdrop-blur-md rounded-3xl py-4 px-3 border border-papelKraft/70 shadow-kraft-lg flex flex-col items-center gap-3 pointer-events-auto transition-all duration-300">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleSelectTab(item.id)}
                className="relative group flex flex-col items-center justify-center cursor-pointer"
                aria-label={item.label}
              >
                {/* Active Circle Indicator */}
                <div
                  className={`w-11 h-11 rounded-2xl transition-all duration-300 flex items-center justify-center relative ${
                    active
                      ? 'bg-acentoAzul text-white shadow-md scale-105'
                      : 'bg-transparent text-tintaCarvao/70 hover:bg-papelKraft/40 hover:text-acentoAzul hover:scale-105'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>

                {/* Tooltip Lateral ao Passar o Mouse */}
                <div className="absolute left-16 px-3 py-1.5 bg-acentoAzul text-white text-xs font-semibold font-corpo lowercase rounded-xl shadow-md opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-200 whitespace-nowrap z-50">
                  {item.label}
                </div>
              </button>
            );
          })}
        </div>
      </nav>

      {/* MOBILE FLOATING BAR ADMIN (Ao Rodapé da Tela) */}
      <nav className="lg:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-50 px-3 w-full max-w-md pointer-events-none">
        <div className="bg-papelClaro/95 backdrop-blur-md rounded-full py-2 px-3 border border-papelKraft/70 shadow-kraft-lg flex items-center gap-2 overflow-x-auto no-scrollbar pointer-events-auto relative">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleSelectTab(item.id)}
                className="flex flex-col items-center justify-center shrink-0 cursor-pointer py-1 px-1"
                aria-label={item.label}
              >
                <div
                  className={`rounded-full transition-all duration-300 flex items-center justify-center ${
                    active
                      ? 'w-10 h-10 bg-acentoAzul text-white shadow-md scale-105'
                      : 'w-9 h-9 bg-transparent text-tintaCarvao/70 hover:text-acentoAzul'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
}
