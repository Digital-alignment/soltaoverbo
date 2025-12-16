import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoadingPage from '../components/LoadingPage';
import { BookOpen } from 'lucide-react';

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
    <div className="min-h-screen bg-paper flex items-center justify-center px-4 relative overflow-hidden">
      {/* Animated Background Pattern */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: 'url(/padrão_linhas_offwhite.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          animation: 'slowFloat 20s ease-in-out infinite'
        }}
      />

      <div className="max-w-md w-full relative z-10">
        <div className="text-center mb-8">
          <h1>
            <img
              src="/logo_vertical_tagline_4.png"
              alt="solta o verbo"
              className="mx-auto h-32 w-auto"
            />
          </h1>
        </div>

        <div className="bg-white rounded-2xl border border-darkNeutral/10 p-8">
          {hasCheckoutIntent && (
            <div className="mb-6 p-4 bg-limeGreen/10 border-2 border-limeGreen rounded-xl">
              <p className="text-deepBlue font-semibold text-center">
                Entre na sua conta para continuar sua compra
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-darkNeutral mb-2">
                e-mail
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="input-field"
                placeholder="seu@email.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-darkNeutral mb-2">
                senha
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="input-field"
                placeholder="••••••••"
              />
            </div>

            <div className="text-right">
              <Link
                to="/forgot-password"
                className="text-sm hover:text-deepBlue transition"
                style={{ color: '#1f008f' }}
              >
                esqueceu sua senha?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 rounded-lg font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-white hover:shadow-lg"
              style={{ backgroundColor: '#1f008f' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#170069'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#1f008f'}
            >
              {loading ? 'entrando...' : 'entrar'}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-darkNeutral/20"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-darkNeutral/60">ou continue com</span>
            </div>
          </div>

          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 border-2 border-darkNeutral/20 rounded-lg text-darkNeutral font-medium hover:bg-gray-50 hover:border-darkNeutral/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            <span>entrar com google</span>
          </button>

          <div className="mt-6 text-left">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-lg text-sm font-medium transition hover:bg-blue-100"
              style={{ color: '#1f008f' }}
            >
              criar conta
            </Link>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link to="/" className="text-sm text-darkNeutral/70 hover:text-darkNeutral transition">
            ← voltar para home
          </Link>
        </div>
      </div>
    </div>
  );
}
