import { Link, useLocation } from 'react-router-dom';
import { Home, PenTool, Flame } from 'lucide-react';
import { APP_VERSION } from '../config/version';

export default function BottomNav() {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { to: '/dashboard', icon: Home, label: 'início' },
    { to: '/exercises', icon: PenTool, label: 'exercícios' },
    { to: '/fogueira', icon: Flame, label: 'fogueira' },
  ];

  return (
    <>
      <nav className="md:hidden fixed bottom-4 left-0 right-0 z-40 px-4 pointer-events-none">
        <div className="max-w-xs mx-auto pointer-events-auto">
          <div className="bg-papelClaro/95 backdrop-blur-md rounded-full shadow-kraft-lg border border-papelKraft/70 px-4 py-2">
            <div className="flex items-center justify-around gap-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.to);

                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className="flex flex-col items-center justify-center gap-1 group py-1"
                    aria-label={item.label}
                  >
                    <div
                      className={`rounded-full transition-all duration-300 flex items-center justify-center ${
                        active
                          ? 'w-10 h-10 bg-acentoAzul text-white shadow-sm scale-105'
                          : 'w-10 h-10 bg-transparent text-tintaCarvao/70 group-hover:bg-papelKraft/30 group-hover:text-acentoAzul'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <span
                      className={`text-[11px] font-medium lowercase leading-none transition-colors ${
                        active ? 'text-acentoAzul font-bold' : 'text-tintaCarvao/60'
                      }`}
                    >
                      {item.label}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </nav>
      <div className="md:hidden fixed bottom-1 left-0 right-0 z-30 pointer-events-none text-center">
        <p className="text-[10px] text-tintaCarvao/40 font-mono">v{APP_VERSION}</p>
      </div>
    </>
  );
}
