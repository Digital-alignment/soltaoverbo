export interface InfinitePayItem {
  quantity: number;
  price: number; // Valor em centavos: R$ 10,00 = 1000
  description: string;
}

export interface InfinitePayCustomer {
  name?: string;
  email?: string;
  phone_number?: string;
}

export interface CreateInfinitePayCheckoutParams {
  items: InfinitePayItem[];
  orderNsu?: string;
  customer?: InfinitePayCustomer;
  redirectUrl?: string;
  webhookUrl?: string;
}

export const INFINITEPAY_HANDLE = 'soltaoverbo';

export async function createInfinitePayCheckout({
  items,
  orderNsu,
  customer,
  redirectUrl,
  webhookUrl,
}: CreateInfinitePayCheckoutParams): Promise<string> {
  try {
    const generatedOrderNsu = orderNsu || `sv-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const defaultRedirectUrl = `${window.location.origin}/checkout-success`;
    const defaultWebhookUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/infinitepay-webhook`;

    const payload = {
      handle: INFINITEPAY_HANDLE,
      items,
      order_nsu: generatedOrderNsu,
      redirect_url: redirectUrl || defaultRedirectUrl,
      webhook_url: webhookUrl || defaultWebhookUrl,
      ...(customer && (customer.email || customer.name || customer.phone_number) ? { customer } : {}),
    };

    const response = await fetch('https://api.checkout.infinitepay.io/links', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || errorData.error || `Erro ao gerar link de pagamento (${response.status})`);
    }

    const data = await response.json();
    const checkoutUrl = data.url || data.link || data.checkout_url;

    if (!checkoutUrl) {
      throw new Error('Link de pagamento não retornado pela InfinitePay');
    }

    return checkoutUrl;
  } catch (error) {
    console.error('Erro ao criar sessão de InfinitePay:', error);
    throw error;
  }
}

export async function checkInfinitePayPaymentStatus({
  orderNsu,
  transactionNsu,
  slug,
}: {
  orderNsu: string;
  transactionNsu?: string;
  slug?: string;
}) {
  try {
    const response = await fetch('https://api.checkout.infinitepay.io/payment_check', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        handle: INFINITEPAY_HANDLE,
        order_nsu: orderNsu,
        transaction_nsu: transactionNsu,
        slug: slug,
      }),
    });

    if (!response.ok) {
      throw new Error(`Erro ao verificar status do pagamento (${response.status})`);
    }

    return await response.json();
  } catch (error) {
    console.error('Erro ao consultar status na InfinitePay:', error);
    throw error;
  }
}
