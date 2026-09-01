import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, PenTool, Flame, BookOpen } from 'lucide-react';

export default function FloatingNavbar() {
  const location = useLocation();

  const navItems = [
    { to: '/dashboard', label: 'dashboard', icon: LayoutDashboard },
    { to: '/exercises', label: 'escrita', icon: PenTool },
    { to: '/fogueira', label: 'fogueira', icon: Flame },
    { to: '/programs', label: 'oficinas', icon: BookOpen },
  ];

  const isActive = (path: string) => {
    if (path === '/dashboard') return location.pathname === '/dashboard';
    if (path === '/exercises') return location.pathname.startsWith('/exercise');
    if (path === '/fogueira') return location.pathname.startsWith('/fogueira');
    if (path === '/programs') return location.pathname.startsWith('/program') || location.pathname.startsWith('/oficina');
    return location.pathname === path;
  };

  return (
    <>
      {/* DESKTOP FLOATING NAVBAR (Lado Esquerdo da Tela - Pill Vertical Modal) */}
      <nav className="hidden lg:flex fixed left-5 top-1/2 -translate-y-1/2 z-50 pointer-events-none">
        <div className="bg-papelClaro/95 backdrop-blur-md rounded-full py-6 px-3.5 border border-papelKraft/70 shadow-kraft-lg flex flex-col items-center gap-6 pointer-events-auto transition-all duration-300">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.to);

            return (
              <Link
                key={item.to}
                to={item.to}
                className="relative group flex flex-col items-center justify-center"
                aria-label={item.label}
              >
                {/* Active Circle Indicator (Apenas background azul profundo, sem borda verde) */}
                <div
                  className={`w-12 h-12 rounded-full transition-all duration-300 flex items-center justify-center relative ${
                    active
                      ? 'bg-acentoAzul text-white shadow-md scale-110'
                      : 'bg-transparent text-tintaCarvao/70 hover:bg-papelKraft/40 hover:text-acentoAzul hover:scale-105'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>

                {/* Tooltip Lateral ao Passar o Mouse */}
                <div className="absolute left-16 px-3 py-1.5 bg-acentoAzul text-white text-xs font-semibold lowercase rounded-xl shadow-md opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-200 whitespace-nowrap z-50">
                  {item.label}
                </div>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* MOBILE FLOATING NAVBAR (Ao Rodapé da Tela - Bar Horizontal com Bolha Elevada sem borda verde) */}
      <nav className="lg:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-50 px-3 w-full max-w-xs pointer-events-none">
        <div className="bg-papelClaro/95 backdrop-blur-md rounded-full py-2 px-5 border border-papelKraft/70 shadow-kraft-lg flex items-center justify-between pointer-events-auto relative">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.to);

            return (
              <Link
                key={item.to}
                to={item.to}
                className="flex flex-col items-center justify-center group relative py-1"
                aria-label={item.label}
              >
                {/* Efeito de Bolha Elevada para Item Ativo (Sem borda verde) */}
                <div
                  className={`rounded-full transition-all duration-300 flex items-center justify-center ${
                    active
                      ? 'w-12 h-12 -mt-6 bg-acentoAzul text-white shadow-xl scale-110'
                      : 'w-9 h-9 bg-transparent text-tintaCarvao/70 group-hover:text-acentoAzul'
                  }`}
                >
                  <Icon className={active ? 'w-5 h-5' : 'w-4 h-4'} />
                </div>

                <span
                  className={`text-[10px] font-bold lowercase leading-none mt-1 transition-colors ${
                    active ? 'text-acentoAzul font-extrabold' : 'text-tintaCarvao/60'
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
