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

export function normalizePhoneNumber(phone?: string): string | undefined {
  if (!phone) return undefined;
  const digits = phone.replace(/\D/g, '');
  if (!digits) return undefined;
  if (phone.startsWith('+')) return phone.replace(/\s+/g, '');
  if (digits.length === 10 || digits.length === 11) {
    return `+55${digits}`;
  }
  if (digits.length >= 12) {
    return `+${digits}`;
  }
  return `+55${digits}`;
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
    const supabaseUrl = (import.meta as any)?.env?.VITE_SUPABASE_URL || 'https://qtdruienammtqodgfqty.supabase.co';
    const defaultRedirectUrl = `${window.location.origin}/checkout-success`;
    const defaultWebhookUrl = `${supabaseUrl}/functions/v1/infinitepay-webhook`;

    // Normalizar dados mínimos do cliente (Nome, E-mail e Telefone)
    // Facilitam o preenchimento automático no checkout
    const formattedCustomer: InfinitePayCustomer = {};
    if (customer?.name?.trim()) formattedCustomer.name = customer.name.trim();
    if (customer?.email?.trim()) formattedCustomer.email = customer.email.trim();
    const cleanPhone = normalizePhoneNumber(customer?.phone_number);
    if (cleanPhone) formattedCustomer.phone_number = cleanPhone;

    // Payload para api.checkout.infinitepay.io/links
    // IMPORTANTE: 'address' NUNCA é enviado pois os produtos são 100% digitais.
    // Omitir 'address' instrui a InfinitePay a NÃO solicitar endereço de entrega.
    const payload: Record<string, any> = {
      handle: INFINITEPAY_HANDLE,
      items,
      order_nsu: generatedOrderNsu,
      redirect_url: redirectUrl || defaultRedirectUrl,
      webhook_url: webhookUrl || defaultWebhookUrl,
    };

    if (Object.keys(formattedCustomer).length > 0) {
      payload.customer = formattedCustomer;
    }

    const response = await fetch('https://api.checkout.infinitepay.io/links', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      console.warn(`api infinitepay retornou status ${response.status}, usando fallback direto.`);
      return `https://checkout.infinitepay.io/${INFINITEPAY_HANDLE}`;
    }

    const data = await response.json();
    const checkoutUrl = data.url || data.link || data.checkout_url;

    if (!checkoutUrl) {
      return `https://checkout.infinitepay.io/${INFINITEPAY_HANDLE}`;
    }

    return checkoutUrl;
  } catch (error) {
    console.warn('aviso na criação de sessão infinitepay, redirecionando para link direto:', error);
    return `https://checkout.infinitepay.io/${INFINITEPAY_HANDLE}`;
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
