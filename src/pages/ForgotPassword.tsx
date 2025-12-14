import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { BookOpen, ArrowLeft } from 'lucide-react';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const { resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    try {
      await resetPassword(email);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'erro ao enviar e-mail de recuperação');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-paper flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1>
            <img
              src="/logo_vertical_tagline_4.png"
              alt="solta o verbo"
              className="mx-auto h-32 w-auto"
            />
          </h1>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          {success ? (
            <div className="text-center space-y-4">
              <div className="bg-green-50 text-green-700 px-4 py-3 rounded-lg text-sm">
                e-mail de recuperação enviado! verifique sua caixa de entrada.
              </div>
              <Link
                to="/login"
                className="inline-flex items-center text-amber-600 hover:text-amber-700 font-medium transition"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                voltar para login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  e-mail
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"
                  placeholder="seu@email.com"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-amber-500 to-orange-600 text-white py-3 rounded-lg font-medium hover:from-amber-600 hover:to-orange-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
              >
                {loading ? 'enviando...' : 'enviar e-mail de recuperação'}
              </button>

              <Link
                to="/login"
                className="block text-center text-sm text-gray-600 hover:text-gray-900 transition"
              >
                <ArrowLeft className="w-4 h-4 inline mr-1" />
                voltar para login
              </Link>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
