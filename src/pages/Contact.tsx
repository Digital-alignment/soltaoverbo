import { Mail, Send, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { supabase } from '../lib/supabase';
import PreLoginNavbar from '../components/PreLoginNavbar';
import PreLoginFooter from '../components/PreLoginFooter';
import WavyLine from '../components/WavyLine';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { error: insertError } = await supabase
        .from('contact_messages')
        .insert([{
          name: formData.name,
          email: formData.email,
          message: formData.message,
        }]);

      if (insertError) throw insertError;

      setSubmitted(true);
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => {
        setSubmitted(false);
      }, 5000);
    } catch (err) {
      setError('erro ao enviar mensagem. tente novamente.');
      console.error('Error submitting contact form:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-paper overflow-x-clip">
      <PreLoginNavbar />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="font-editorial text-5xl md:text-6xl font-bold text-deepBlue mb-6">
            entre em contato
          </h1>
          <div className="flex justify-center mb-8">
            <WavyLine color="#BEC540" width={200} animate />
          </div>
          <p className="text-xl text-deepBlue/80">
            tem alguma dúvida ou sugestão? adoraríamos ouvir você!
          </p>
        </div>

        <div className="bg-white/60 backdrop-blur-sm rounded-3xl shadow-xl p-8 border-2 border-deepBlue/10">
          {submitted ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-limeGreen/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Send className="w-8 h-8 text-deepBlue" />
              </div>
              <h3 className="font-editorial text-2xl font-bold text-deepBlue mb-2">mensagem enviada!</h3>
              <p className="text-darkNeutral">
                obrigado pelo contato. responderemos em breve.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
                  <AlertCircle className="w-5 h-5 text-red-600 mr-3 mt-0.5 flex-shrink-0" />
                  <p className="text-red-800">{error}</p>
                </div>
              )}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-deepBlue mb-2">
                  nome
                </label>
                <input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="input-field"
                  placeholder="seu nome"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-deepBlue mb-2">
                  e-mail
                </label>
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="input-field"
                  placeholder="seu@email.com"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-deepBlue mb-2">
                  mensagem
                </label>
                <textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                  rows={6}
                  className="textarea-field"
                  placeholder="como podemos ajudar?"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5 mr-2" />
                {loading ? 'enviando...' : 'enviar mensagem'}
              </button>
            </form>
          )}
        </div>

      </div>

      <PreLoginFooter />
    </div>
  );
}
