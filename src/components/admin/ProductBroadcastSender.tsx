import React, { useState } from 'react';
import { ProductSlug } from '../../types/productHubs';
import { Megaphone, Send, Mail, CheckCircle, Users } from 'lucide-react';

interface ProductBroadcastSenderProps {
  productSlug: ProductSlug;
  productName: string;
}

export default function ProductBroadcastSender({
  productSlug,
  productName,
}: ProductBroadcastSenderProps) {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) return;

    setSending(true);
    setTimeout(() => {
      setSending(false);
      setSentSuccess(true);
      setSubject('');
      setMessage('');
      setTimeout(() => setSentSuccess(false), 5000);
    }, 1200);
  };

  return (
    <div className="bg-papelClaro rounded-3xl border border-papelKraft/40 p-5 sm:p-7 shadow-kraft space-y-6">
      {/* CABEÇALHO DE BROADCAST */}
      <div className="border-b border-papelKraft/30 pb-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2.5 py-0.5 rounded-full bg-acentoAzul/10 text-acentoAzul text-[11px] font-bold font-corpo lowercase">
            comunicação direta • {productName}
          </span>
        </div>
        <h3 className="font-editorial font-bold text-xl sm:text-2xl text-acentoAzul lowercase">
          enviar comunicados & e-mails para alunas
        </h3>
        <p className="text-xs font-corpo text-tintaCarvao/70 lowercase">
          disparo de mensagem filtrada exclusivamente para participantes deste programa
        </p>
      </div>

      {sentSuccess && (
        <div className="p-4 rounded-2xl bg-acentoOliva/15 border border-acentoOliva/40 text-acentoOliva text-xs font-corpo font-bold flex items-center gap-2 lowercase animate-fadeIn">
          <CheckCircle className="w-4 h-4 shrink-0" />
          <span>comunicado enviado com sucesso para a lista de participantes do {productName}!</span>
        </div>
      )}

      {/* FORMULÁRIO DE ENVIO */}
      <form onSubmit={handleSendBroadcast} className="bg-white p-5 rounded-2xl border border-papelKraft/40 shadow-xs space-y-4 text-xs font-corpo lowercase">
        <div className="flex items-center justify-between bg-bgPlataforma/60 p-3 rounded-xl border border-papelKraft/30 text-tintaCarvao/80">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-acentoAzul" />
            <span>destinatários: <strong className="text-acentoAzul font-bold">todas as alunas de {productName}</strong></span>
          </div>
          <span className="text-[11px] text-tintaCarvao/50">filtro automático ativo</span>
        </div>

        <div>
          <label className="block font-bold text-tintaCarvao mb-1">assunto da mensagem *</label>
          <input
            type="text"
            required
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder={`ex: lembrete importante • ${productName}`}
            className="w-full px-3.5 py-2.5 rounded-2xl bg-papelClaro border border-papelKraft/50 text-tintaCarvao focus:outline-none focus:border-acentoAzul text-xs font-corpo lowercase"
          />
        </div>

        <div>
          <label className="block font-bold text-tintaCarvao mb-1">corpo da mensagem (prosa / avisos) *</label>
          <textarea
            rows={5}
            required
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="escreva a mensagem para as alunas..."
            className="w-full px-3.5 py-2.5 rounded-2xl bg-papelClaro border border-papelKraft/50 text-tintaCarvao focus:outline-none focus:border-acentoAzul text-xs font-corpo lowercase"
          />
        </div>

        <div className="flex items-center justify-end pt-2">
          <button
            type="submit"
            disabled={sending}
            className="px-5 py-2.5 rounded-2xl bg-acentoAzul hover:bg-acentoAzul/90 text-white font-gesto text-[20px] lowercase shadow-xs flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            <span>{sending ? 'disparando...' : 'disparar comunicado →'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
