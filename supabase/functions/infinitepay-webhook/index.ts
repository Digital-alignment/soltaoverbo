import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { createClient } from 'npm:@supabase/supabase-js@2.49.1';

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

Deno.serve(async (req) => {
  try {
    if (req.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      });
    }

    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const payload = await req.json();
    console.info('InfinitePay webhook received:', JSON.stringify(payload));

    const {
      invoice_slug,
      amount,
      paid_amount,
      installments = 1,
      capture_method,
      transaction_nsu,
      order_nsu,
      receipt_url,
      customer,
    } = payload;

    if (!order_nsu && !transaction_nsu) {
      return new Response(JSON.stringify({ error: 'Missing order_nsu or transaction_nsu' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    let userId: string | null = null;
    let customerEmail: string | null = customer?.email || null;

    if (order_nsu) {
      const { data: attempt } = await supabase
        .from('checkout_attempts')
        .select('user_id, email')
        .eq('order_nsu', order_nsu)
        .order('attempted_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (attempt) {
        userId = attempt.user_id;
        if (!customerEmail) customerEmail = attempt.email;
      }
    }

    if (!userId && customerEmail) {
      const { data: { users } } = await supabase.auth.admin.listUsers();
      const userMatch = users.find((u) => u.email === customerEmail);
      if (userMatch) {
        userId = userMatch.id;
      }
    }

    if (userId) {
      // Upgrade user profile role to 'paid'
      await supabase
        .from('users_profiles')
        .update({ role: 'paid' })
        .eq('id', userId);

      // Insert subscription record
      await supabase.from('user_subscriptions').insert({
        user_id: userId,
        stripe_payment_id: transaction_nsu || order_nsu || invoice_slug,
        status: 'active',
        started_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        installment_plan: installments > 1 ? `${installments}x` : 'one_time',
        total_installments: installments,
        completed_installments: 1,
      });

      // Create notification
      await supabase.from('notifications').insert({
        user_id: userId,
        type: 'course_update',
        title: 'Pagamento confirmado com sucesso!',
        message: `Seu pagamento via InfinitePay (${capture_method || 'Pix/Cartão'}) foi confirmado! Você já tem acesso total.`,
        link: '/dashboard',
        is_read: false,
      });

      // Mark checkout attempt completed
      if (order_nsu) {
        await supabase
          .from('checkout_attempts')
          .update({
            completed: true,
            completed_at: new Date().toISOString(),
            user_id: userId,
          })
          .eq('order_nsu', order_nsu);
      }

      console.info(`Successfully activated user ${userId} for InfinitePay order ${order_nsu}`);
    } else {
      console.warn(`Webhook received for InfinitePay order ${order_nsu}, but no matching user found.`);
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('Error in InfinitePay webhook:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});
