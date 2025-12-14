import { Link, useLocation } from 'react-router-dom';
import { Home, PenTool, Flame } from 'lucide-react';
import { APP_VERSION } from '../config/version';

export default function BottomNav() {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { to: '/dashboard', icon: Home, label: 'Início' },
    { to: '/exercises', icon: PenTool, label: 'Exercícios' },
    { to: '/fogueira', icon: Flame, label: 'Nossa Fogueira' },
  ];

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 z-40 px-4 pb-3 pointer-events-none">
        <div className="max-w-xs mx-auto pointer-events-auto">
          <div className="bg-white rounded-full shadow-lg border border-darkNeutral/10 px-4 py-2">
            <div className="flex items-center justify-around gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.to);

                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className="flex items-center justify-center group"
                    aria-label={item.label}
                  >
                    <div
                      className={`rounded-full transition-all duration-300 transform ${
                        active
                          ? 'w-11 h-11 shadow-md'
                          : 'bg-transparent w-10 h-10 group-hover:bg-darkNeutral/5'
                      } flex items-center justify-center`}
                      style={
                        active
                          ? { backgroundColor: '#1f008f', color: '#fff7ed' }
                          : { color: '#1f008f' }
                      }
                    >
                      <Icon className={`${active ? 'w-5 h-5' : 'w-5 h-5'} transition-all`} />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </nav>
      <div className="fixed bottom-0 left-0 right-0 z-30 pb-20 pointer-events-none">
        <p className="text-center text-xs text-gray-400">v{APP_VERSION}</p>
      </div>
    </>
  );
}
