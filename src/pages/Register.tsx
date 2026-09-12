import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoadingPage from '../components/LoadingPage';
import { ArrowLeft, UserPlus, LogIn } from 'lucide-react';
import { BRAND_ASSETS } from '../config/brandAssets';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  const hasCheckoutIntent = localStorage.getItem('checkout_intent') !== null;

  if (loading) {
    return <LoadingPage />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (password.length < 6) {
      setError('a senha deve ter pelo menos 6 caracteres');
      setLoading(false);
      return;
    }

    try {
      await signUp(email, password, displayName);

      const checkoutIntent = localStorage.getItem('checkout_intent');
      if (checkoutIntent) {
        navigate('/roteirooriginal?openCheckout=true');
      } else {
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'erro ao criar conta');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);

    try {
      await signInWithGoogle();
    } catch (err: any) {
      setError(err.message || 'erro ao fazer login com google');
      setLoading(false);
    }
  };

  return (
    <div className="h-screen max-h-screen w-full bg-bgPlataforma flex items-center justify-center p-3 sm:p-5 lg:p-8 relative overflow-hidden text-tintaCarvao select-none">
      {/* Texture Background Overlay */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: 'url(/padrão_linhas_offwhite.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* Main Split Container - Fits Screen Without Scroll */}
      <div className="w-full max-w-5xl h-full max-h-[640px] bg-papelClaro rounded-3xl border border-papelKraft/60 shadow-kraft-lg overflow-hidden grid grid-cols-1 lg:grid-cols-12 relative z-10">
        
        {/* SEÇÃO 1 (ESQUERDA): Formulário de Cadastro */}
        <div className="lg:col-span-6 xl:col-span-6 p-5 sm:p-7 flex flex-col justify-between h-full overflow-y-auto space-y-3 sm:space-y-4">
          
          {/* Header do Form: Logo Horizontal + Voltar */}
          <div className="flex items-center justify-between">
            <Link to="/" className="inline-block group">
              <img
                src={BRAND_ASSETS.logos.horizontal}
                alt="solta o verbo"
                className="h-7 sm:h-8 w-auto object-contain transition-transform group-hover:scale-105"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/logo_horizontal_4.png';
                }}
              />
            </Link>
            <Link
              to="/"
              className="text-xs font-semibold text-tintaCarvao/60 hover:text-acentoAzul transition-colors lowercase flex items-center gap-1 font-corpo"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>voltar</span>
            </Link>
          </div>

          {/* Banner de Checkout Intent (se houver) */}
          {hasCheckoutIntent && (
            <div className="p-3 bg-acentoOliva/20 border border-acentoOliva/40 rounded-2xl text-center">
              <p className="text-acentoAzul font-bold text-xs lowercase font-corpo">
                falta apenas um passo para garantir sua vaga! crie sua conta para continuar.
              </p>
            </div>
          )}

          {/* Título Poético */}
          <div>
            <h1 className="font-editorial text-xl sm:text-2xl text-acentoAzul font-bold lowercase leading-snug">
              faça parte da comunidade
            </h1>
            <p className="text-xs text-tintaCarvao/60 lowercase font-corpo mt-0.5">
              crie sua conta gratuita e comece sua jornada de escrita autoral
            </p>
          </div>

          {/* Formulário Principal */}
          <form onSubmit={handleSubmit} className="space-y-3">
            {error && (
              <div className="bg-red-50 text-red-700 px-3 py-2 rounded-xl text-xs font-medium border border-red-200 lowercase font-corpo">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="displayName" className="block text-xs font-bold text-tintaCarvao/80 mb-1 lowercase font-corpo">
                nome de exibição
              </label>
              <input
                id="displayName"
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-papelKraft/60 bg-bgPlataforma text-tintaCarvao focus:outline-none focus:border-acentoAzul text-xs sm:text-sm font-medium font-corpo lowercase"
                placeholder="como você quer ser chamada"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-xs font-bold text-tintaCarvao/80 mb-1 lowercase font-corpo">
                e-mail
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-papelKraft/60 bg-bgPlataforma text-tintaCarvao focus:outline-none focus:border-acentoAzul text-xs sm:text-sm font-medium font-corpo lowercase"
                placeholder="seu@email.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-bold text-tintaCarvao/80 mb-1 lowercase font-corpo">
                senha
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-papelKraft/60 bg-bgPlataforma text-tintaCarvao focus:outline-none focus:border-acentoAzul text-xs sm:text-sm font-medium font-corpo lowercase"
                placeholder="mínimo 6 caracteres"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-pill-primary w-full py-3 rounded-full text-xs sm:text-sm font-semibold lowercase shadow-md hover:scale-[1.02] transition-transform cursor-pointer flex items-center justify-center gap-2 font-corpo"
            >
              <UserPlus className="w-4 h-4" />
              <span>{loading ? 'criando conta...' : 'criar minha conta'}</span>
            </button>
          </form>

          {/* Divisor & Botão Google */}
          <div className="space-y-2.5">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-papelKraft/40"></div>
              </div>
              <div className="relative flex justify-center text-[11px]">
                <span className="px-3 bg-papelClaro text-tintaCarvao/60 lowercase font-corpo">ou continue com</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2.5 px-3 py-2.5 border border-papelKraft/60 rounded-full text-tintaCarvao font-medium hover:bg-bgPlataforma transition-all text-xs lowercase cursor-pointer font-corpo"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <span>criar conta com google</span>
            </button>
          </div>

          {/* Link para Login */}
          <div className="text-center pt-1 border-t border-papelKraft/30">
            <Link
              to="/login"
              className="text-xs text-acentoAzul font-bold hover:text-acentoTerracota transition-colors lowercase inline-flex items-center gap-1 font-corpo"
            >
              <LogIn className="w-3.5 h-3.5 text-acentoTerracota" />
              <span>já possui conta? entre aqui →</span>
            </Link>
          </div>

        </div>

        {/* SEÇÃO 2 (DIREITA): Colagem Artística Scrapbook & Manifesto (Apenas Desktop) */}
        <div className="hidden lg:flex lg:col-span-6 bg-acentoAzul text-papelClaro p-8 sm:p-10 flex-col justify-between relative overflow-hidden group">
          {/* Fita Washi no Canto Superior */}
          <div className="absolute -top-2 right-8 w-28 h-7 pointer-events-none z-20 opacity-90">
            <img
              src="/brand-assets/elements/stickers/fitas-washi-flores-terracota.png"
              alt="fita washi"
              className="w-full h-full object-contain"
            />
          </div>

          {/* Sombra / Marca d'Água poética */}
          <div className="absolute -bottom-10 -left-10 opacity-10 pointer-events-none">
            <img
              src="/brand-assets/icons/icone_63.svg"
              alt="icone"
              className="w-72 h-72 object-contain filter invert"
            />
          </div>

          {/* Badge Poética Superior */}
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-acentoOliva text-xs font-semibold lowercase tracking-wider border border-white/15 font-corpo">
              <span>comunidade solta o verbo</span>
            </div>
          </div>

          {/* Ilustração de Colagem Scrapbook Central */}
          <div className="relative z-10 my-auto py-4 flex items-center justify-center">
            <div className="relative max-w-xs w-full transition-transform duration-700 group-hover:scale-105">
              <img
                src="/brand-assets/elements/collages/png-retro-collages-whit-book-publication-flower-plant.png"
                alt="colagem poética solta o verbo"
                className="w-full h-auto object-contain drop-shadow-2xl filter brightness-105"
              />
            </div>
          </div>

          {/* Manifesto Poético Inferior */}
          <div className="relative z-10 space-y-2 border-t border-white/20 pt-4">
            <blockquote className="font-editorial text-xl xl:text-2xl text-papelClaro font-bold lowercase leading-snug">
              “escrever é abrir espaço para a voz que habita em você.”
            </blockquote>
            <p className="text-xs text-papelClaro/70 font-mono lowercase">
              movimento de escrita autoral & autoconhecimento
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
