interface CreateCheckoutSessionParams {
  priceId: string;
  email: string;
  mode: 'payment' | 'subscription';
}

function getPlanTypeFromPriceId(priceId: string): string {
  const oneTimeId = import.meta.env.VITE_STRIPE_PRICE_ONE_TIME;
  const twoXId = import.meta.env.VITE_STRIPE_PRICE_2X;
  const threeXId = import.meta.env.VITE_STRIPE_PRICE_3X;
  const fourXId = import.meta.env.VITE_STRIPE_PRICE_4X;
  const fiveXId = import.meta.env.VITE_STRIPE_PRICE_5X;

  if (priceId === oneTimeId) return 'one_time';
  if (priceId === twoXId) return '2x';
  if (priceId === threeXId) return '3x';
  if (priceId === fourXId) return '4x';
  if (priceId === fiveXId) return '5x';
  return 'unknown';
}

export async function createCheckoutSession({
  priceId,
  email,
  mode
}: CreateCheckoutSessionParams) {
  try {
    const planType = getPlanTypeFromPriceId(priceId);

    const response = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/stripe-checkout`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId,
          email,
          mode,
          planType,
          successUrl: `${window.location.origin}/checkout-success`,
          cancelUrl: `${window.location.origin}/roteiro-original`,
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erro ao criar sessão de pagamento');
    }

    const { url } = await response.json();
    return url;
  } catch (error) {
    console.error('Erro ao criar sessão de Stripe:', error);
    throw error;
  }
}
