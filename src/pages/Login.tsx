import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoadingPage from '../components/LoadingPage';
import { ShieldCheck, UserCheck, ArrowLeft, Pencil } from 'lucide-react';
import { BRAND_ASSETS } from '../config/brandAssets';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  const hasCheckoutIntent = localStorage.getItem('checkout_intent') !== null;

  if (loading) {
    return <LoadingPage />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signIn(email, password);

      const checkoutIntent = localStorage.getItem('checkout_intent');
      if (checkoutIntent) {
        navigate('/roteirooriginal?openCheckout=true');
      } else {
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError('');
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

      {/* Main Split Container - 2 Seções no Desktop, Reenchia a Tela Sem Scroll */}
      <div className="w-full max-w-5xl h-full max-h-[640px] bg-papelClaro rounded-3xl border border-papelKraft/60 shadow-kraft-lg overflow-hidden grid grid-cols-1 lg:grid-cols-12 relative z-10">
        
        {/* SEÇÃO 1 (ESQUERDA): Formulário de Login & Contas Demo */}
        <div className="lg:col-span-6 xl:col-span-6 p-5 sm:p-7 flex flex-col justify-between h-full overflow-y-auto space-y-4">
          
          {/* Header do Form: Logo Horizontal */}
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
              className="text-xs font-semibold text-tintaCarvao/60 hover:text-acentoAzul transition-colors lowercase flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>voltar</span>
            </Link>
          </div>

          {/* Banner de Checkout Intent (se houver) */}
          {hasCheckoutIntent && (
            <div className="p-3 bg-acentoOliva/20 border border-acentoOliva/40 rounded-2xl text-center">
              <p className="text-acentoAzul font-bold text-xs lowercase">
                entre na sua conta para concluir a sua inscrição
              </p>
            </div>
          )}

          {/* PAINEL DE CONTAS DEMO (1-CLICK FILL) */}
          <div className="bg-bgPlataforma/70 rounded-2xl border border-papelKraft/50 p-3 text-center space-y-2">
            <span className="text-[11px] font-bold text-acentoAzul lowercase tracking-wider block">
              🔑 contas de teste (acesso rápido)
            </span>

            <div className="grid grid-cols-3 gap-1.5">
              <button
                type="button"
                onClick={() => handleDemoLogin('admin@soltaoverbocoletivo.com', 'admin123456')}
                className="px-2 py-1.5 rounded-xl bg-acentoAzul/10 hover:bg-acentoAzul text-acentoAzul hover:text-white transition-all text-[11px] font-semibold flex items-center justify-center gap-1 border border-acentoAzul/20 lowercase cursor-pointer"
                title="preencher como admin demo"
              >
                <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                <span>admin</span>
              </button>

              <button
                type="button"
                onClick={() => handleDemoLogin('aluno@soltaoverbocoletivo.com', 'aluno123456')}
                className="px-2 py-1.5 rounded-xl bg-acentoTerracota/10 hover:bg-acentoTerracota text-acentoTerracota hover:text-white transition-all text-[11px] font-semibold flex items-center justify-center gap-1 border border-acentoTerracota/20 lowercase cursor-pointer"
                title="preencher como aluno demo 1"
              >
                <UserCheck className="w-3.5 h-3.5 shrink-0" />
                <span>demo 1</span>
              </button>

              <button
                type="button"
                onClick={() => handleDemoLogin('aluno2@soltaoverbocoletivo.com', 'aluno123456')}
                className="px-2 py-1.5 rounded-xl bg-acentoOliva/20 hover:bg-acentoOliva text-acentoAzul hover:text-tintaCarvao transition-all text-[11px] font-semibold flex items-center justify-center gap-1 border border-acentoOliva/40 lowercase cursor-pointer"
                title="preencher como aluna demo 2 (camila oliveira)"
              >
                <UserCheck className="w-3.5 h-3.5 text-acentoAzul shrink-0" />
                <span>demo 2</span>
              </button>
            </div>
          </div>

          {/* Formulário Principal */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {error && (
              <div className="bg-red-50 text-red-700 px-3 py-2 rounded-xl text-xs font-medium border border-red-200">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-xs font-bold text-tintaCarvao/80 mb-1 lowercase">
                e-mail
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-papelKraft/60 bg-bgPlataforma text-tintaCarvao focus:outline-none focus:border-acentoAzul text-xs sm:text-sm font-medium"
                placeholder="seu@email.com"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label htmlFor="password" className="block text-xs font-bold text-tintaCarvao/80 lowercase">
                  senha
                </label>
                <Link
                  to="/forgot-password"
                  className="text-[11px] text-acentoAzul font-bold hover:text-acentoTerracota transition-colors lowercase"
                >
                  esqueceu sua senha?
                </Link>
              </div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-papelKraft/60 bg-bgPlataforma text-tintaCarvao focus:outline-none focus:border-acentoAzul text-xs sm:text-sm font-medium"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-pill-primary w-full py-3 rounded-full text-sm font-semibold lowercase shadow-md hover:scale-[1.02] transition-transform cursor-pointer"
            >
              {loading ? 'entrando...' : 'entrar'}
            </button>
          </form>

          {/* Divisor & Botão Google */}
          <div className="space-y-3">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-papelKraft/40"></div>
              </div>
              <div className="relative flex justify-center text-[11px]">
                <span className="px-3 bg-papelClaro text-tintaCarvao/60 lowercase">ou continue com</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2.5 px-3 py-2.5 border border-papelKraft/60 rounded-full text-tintaCarvao font-medium hover:bg-bgPlataforma transition-all text-xs lowercase cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <span>entrar com google</span>
            </button>
          </div>

          {/* Link para Registro */}
          <div className="text-center pt-1 border-t border-papelKraft/30">
            <Link
              to="/register"
              className="text-xs text-acentoAzul font-bold hover:text-acentoTerracota transition-colors lowercase inline-flex items-center gap-1"
            >
              <Pencil className="w-3.5 h-3.5 text-acentoTerracota" />
              <span>não tem conta? crie gratuitamente →</span>
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
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-acentoOliva text-xs font-semibold lowercase tracking-wider border border-white/15">
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
              “a escrita é um gesto de presença e coragem. bem-vinda de volta ao coletivo.”
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
