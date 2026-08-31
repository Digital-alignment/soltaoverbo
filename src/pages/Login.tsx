import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoadingPage from '../components/LoadingPage';
import { ShieldCheck, UserCheck } from 'lucide-react';

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
    <div className="min-h-screen bg-bgPlataforma flex items-center justify-center px-4 py-12 relative overflow-hidden text-tintaCarvao">
      {/* Background Pattern */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: 'url(/padrão_linhas_offwhite.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      <div className="max-w-md w-full relative z-10 space-y-6">
        <div className="text-center">
          <Link to="/" className="inline-block group">
            <img
              src="/logo_vertical_tagline_4.png"
              alt="solta o verbo"
              className="mx-auto h-28 sm:h-32 w-auto transition-transform group-hover:scale-105"
            />
          </Link>
        </div>

        {/* PAINEL DE CONTAS DEMO (1-CLICK FILL) */}
        <div className="bg-papelClaro rounded-2xl border border-papelKraft/60 p-4 shadow-sm space-y-2.5 text-center">
          <span className="text-xs font-bold text-acentoAzul uppercase tracking-wider block">
            🔑 contas de teste (acesso rápido)
          </span>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleDemoLogin('admin@soltaoverbocoletivo.com', 'admin123456')}
              className="px-3 py-2 rounded-xl bg-acentoAzul/10 hover:bg-acentoAzul text-acentoAzul hover:text-white transition-all text-xs font-bold flex items-center justify-center gap-1.5 border border-acentoAzul/20 lowercase"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>admin demo</span>
            </button>

            <button
              type="button"
              onClick={() => handleDemoLogin('aluno@soltaoverbocoletivo.com', 'aluno123456')}
              className="px-3 py-2 rounded-xl bg-acentoTerracota/10 hover:bg-acentoTerracota text-acentoTerracota hover:text-white transition-all text-xs font-bold flex items-center justify-center gap-1.5 border border-acentoTerracota/20 lowercase"
            >
              <UserCheck className="w-4 h-4" />
              <span>aluno demo</span>
            </button>
          </div>
        </div>

        <div className="bg-papelClaro rounded-3xl border border-papelKraft/60 p-7 sm:p-8 shadow-kraft">
          {hasCheckoutIntent && (
            <div className="mb-6 p-4 bg-acentoOliva/20 border border-acentoOliva rounded-2xl">
              <p className="text-acentoAzul font-semibold text-center text-sm lowercase">
                entre na sua conta para continuar sua compra
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-50 text-red-700 px-4 py-3 rounded-xl text-sm border border-red-200">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-tintaCarvao mb-1.5 lowercase">
                e-mail
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-papelKraft/60 bg-bgPlataforma text-tintaCarvao focus:outline-none focus:border-acentoAzul text-sm font-medium"
                placeholder="seu@email.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-tintaCarvao mb-1.5 lowercase">
                senha
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-papelKraft/60 bg-bgPlataforma text-tintaCarvao focus:outline-none focus:border-acentoAzul text-sm font-medium"
                placeholder="••••••••"
              />
            </div>

            <div className="text-right">
              <Link
                to="/forgot-password"
                className="text-xs text-acentoAzul font-bold hover:text-acentoTerracota transition-colors lowercase"
              >
                esqueceu sua senha?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-pill-primary w-full py-3.5 rounded-full text-base font-semibold lowercase shadow-md"
            >
              {loading ? 'entrando...' : 'entrar'}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-papelKraft/40"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-3 bg-papelClaro text-tintaCarvao/60 lowercase">ou continue com</span>
            </div>
          </div>

          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-papelKraft/60 rounded-full text-tintaCarvao font-medium hover:bg-bgPlataforma transition-all text-sm lowercase"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            <span>entrar com google</span>
          </button>

          <div className="mt-6 text-center">
            <Link
              to="/register"
              className="text-xs text-acentoAzul font-bold hover:text-acentoTerracota transition-colors lowercase"
            >
              não tem uma conta? crie uma conta gratuitamente →
            </Link>
          </div>
        </div>

        <div className="text-center">
          <Link to="/" className="text-xs text-tintaCarvao/60 hover:text-acentoAzul transition-colors lowercase font-medium">
            ← voltar para a página inicial
          </Link>
        </div>
      </div>
    </div>
  );
}
