import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import Stripe from 'npm:stripe@17.7.0';
import { createClient } from 'npm:@supabase/supabase-js@2.49.1';

const stripeSecret = Deno.env.get('STRIPE_SECRET_KEY')!;
const stripeWebhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')!;
const stripe = new Stripe(stripeSecret, {
  appInfo: {
    name: 'Bolt Integration',
    version: '1.0.0',
  },
});

const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);

Deno.serve(async (req) => {
  try {
    // Handle OPTIONS request for CORS preflight
    if (req.method === 'OPTIONS') {
      return new Response(null, { status: 204 });
    }

    if (req.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }

    // get the signature from the header
    const signature = req.headers.get('stripe-signature');

    if (!signature) {
      return new Response('No signature found', { status: 400 });
    }

    // get the raw body
    const body = await req.text();

    // verify the webhook signature
    let event: Stripe.Event;

    try {
      event = await stripe.webhooks.constructEventAsync(body, signature, stripeWebhookSecret);
    } catch (error: any) {
      console.error(`Webhook signature verification failed: ${error.message}`);
      return new Response(`Webhook signature verification failed: ${error.message}`, { status: 400 });
    }

    EdgeRuntime.waitUntil(handleEvent(event));

    return Response.json({ received: true });
  } catch (error: any) {
    console.error('Error processing webhook:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});

async function handleEvent(event: Stripe.Event) {
  try {
    // Handle invoice payment success for subscription installments
    if (event.type === 'invoice.payment_succeeded') {
      const invoice = event.data.object as Stripe.Invoice;

      if (invoice.subscription) {
        console.info(`Processing invoice payment for subscription: ${invoice.subscription}`);

        // Find subscription record by stripe subscription id
        const { data: stripeSubData, error: findSubError } = await supabase
          .from('stripe_subscriptions')
          .select('id, customer_id, installment_plan, total_installments, completed_installments')
          .eq('subscription_id', invoice.subscription as string)
          .maybeSingle();

        if (!findSubError && stripeSubData) {
          const newCompletedInstallments = stripeSubData.completed_installments + 1;
          const nextPaymentDate = newCompletedInstallments < stripeSubData.total_installments
            ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
            : null;

          // Update subscription with new installment count
          const { error: updateSubError } = await supabase
            .from('stripe_subscriptions')
            .update({
              completed_installments: newCompletedInstallments,
              next_payment_date: nextPaymentDate,
            })
            .eq('id', stripeSubData.id);

          if (updateSubError) {
            console.error('Error updating subscription installments:', updateSubError);
            return;
          }

          // Find user by customer id
          const { data: customerData, error: findCustomerError } = await supabase
            .from('stripe_customers')
            .select('user_id')
            .eq('customer_id', stripeSubData.customer_id)
            .maybeSingle();

          if (!findCustomerError && customerData) {
            // Create notification
            const { error: notifError } = await supabase.from('notifications').insert({
              user_id: customerData.user_id,
              type: 'course_update',
              title: `Parcela ${newCompletedInstallments} de ${stripeSubData.total_installments} confirmada!`,
              message: newCompletedInstallments === stripeSubData.total_installments
                ? 'Parabéns! Você completou todos os pagamentos!'
                : `Próximo pagamento em ${new Date(nextPaymentDate!).toLocaleDateString('pt-BR')}`,
              link: '/dashboard',
              is_read: false,
            });

            if (notifError) {
              console.error('Error creating installment notification:', notifError);
            }

            console.info(`Installment ${newCompletedInstallments}/${stripeSubData.total_installments} recorded for subscription ${invoice.subscription}`);
          }
        }
      }
    }
    // Handle checkout.session.completed events
    else if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;

      if (!session.customer_details?.email) {
        console.error('No customer email found in checkout session');
        return;
      }

      const email = session.customer_details.email;
      const sessionId = session.id;
      const paymentStatus = session.payment_status;
      const mode = session.mode;
      const metadata = session.metadata || {};
      const planType = metadata.planType || 'one_time';
      const totalInstallments = parseInt(metadata.installments || '1', 10);

      console.info(`Processing checkout session: ${sessionId} for email: ${email} with plan: ${planType}`);

      if (paymentStatus === 'paid') {
        // Find user by email
        const { data: { users }, error: findUserError } = await supabase.auth.admin.listUsers();

        if (findUserError) {
          console.error('Error fetching users:', findUserError);
          return;
        }

        const user = users.find(u => u.email === email);

        if (!user) {
          console.error(`No user found with email: ${email}`);
          return;
        }

        // Update user role to 'paid'
        const { error: updateError } = await supabase
          .from('users_profiles')
          .update({ role: 'paid' })
          .eq('id', user.id);

        if (updateError) {
          console.error(`Error updating user role for ${user.id}:`, updateError);
          return;
        }

        // Store customer id for future webhook processing
        if (session.customer) {
          const { error: custError } = await supabase.from('stripe_customers').upsert({
            user_id: user.id,
            customer_id: session.customer as string,
          }, {
            onConflict: 'user_id'
          });

          if (custError) {
            console.error('Error saving customer id:', custError);
          }
        }

        // Calculate next payment date (30 days from now for installment plans)
        const nextPaymentDate = totalInstallments > 1
          ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
          : null;

        // Get subscription id from session for subscription mode
        const subscriptionId = mode === 'subscription' ? session.subscription as string : null;

        // Create subscription record in stripe_subscriptions for tracking
        if (subscriptionId && session.customer) {
          const { error: stripSubError } = await supabase.from('stripe_subscriptions').insert({
            customer_id: session.customer as string,
            subscription_id: subscriptionId,
            status: 'active',
            installment_plan: planType,
            total_installments: totalInstallments,
            completed_installments: 1,
            next_payment_date: nextPaymentDate,
          });

          if (stripSubError) {
            console.error('Error creating stripe subscription record:', stripSubError);
          }
        }

        // Create subscription record with installment tracking
        const { error: subError } = await supabase.from('user_subscriptions').insert({
          user_id: user.id,
          stripe_payment_id: sessionId,
          status: 'active',
          started_at: new Date().toISOString(),
          expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
          installment_plan: planType,
          total_installments: totalInstallments,
          completed_installments: 1,
          next_payment_date: nextPaymentDate,
        });

        if (subError) {
          console.error(`Error creating subscription record:`, subError);
          return;
        }

        // Create notification for successful payment
        const notificationType = totalInstallments > 1 ? 'course_update' : 'course_update';
        const notificationTitle = totalInstallments > 1
          ? `Parcela ${1} de ${totalInstallments} paga com sucesso!`
          : 'Pagamento realizado com sucesso!';
        const notificationMessage = totalInstallments > 1
          ? `Sua primeira parcela foi confirmada. Próximo pagamento em ${new Date(nextPaymentDate!).toLocaleDateString('pt-BR')}`
          : 'Seu pagamento foi confirmado e você agora tem acesso total ao Roteiro Original!';

        const { error: notifError } = await supabase.from('notifications').insert({
          user_id: user.id,
          type: notificationType,
          title: notificationTitle,
          message: notificationMessage,
          link: '/dashboard',
          is_read: false,
        });

        if (notifError) {
          console.error('Error creating notification:', notifError);
        }

        console.info(`Successfully processed payment and updated user role for: ${email} with ${totalInstallments} installments`);
      }
    }
  } catch (error: any) {
    console.error('Error in handleEvent:', error);
  }
}
