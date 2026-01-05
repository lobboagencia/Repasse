
import { NextResponse } from 'next/server';

const ASAAS_API_URL = process.env.ASAAS_API_URL || 'https://sandbox.asaas.com/api/v3';
const ASAAS_API_KEY = process.env.ASAAS_API_KEY;

export async function POST(req: Request) {
  if (!ASAAS_API_KEY) {
    return NextResponse.json({ error: 'ASAAS_API_KEY não configurada.' }, { status: 500 });
  }

  try {
    const { action, payload } = await req.json();
    let endpoint = '';
    let body: any = null;
    let method = 'POST';

    switch (action) {
      case 'createCustomer':
        endpoint = '/customers';
        body = { name: payload.name, email: payload.email, externalReference: payload.id };
        break;
      case 'createPayment':
        endpoint = '/payments';
        body = {
          customer: payload.customerId,
          billingType: payload.type || 'PIX',
          value: payload.value,
          dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
          description: payload.description,
          externalReference: payload.externalId
        };
        break;
      case 'getPixQrCode':
        endpoint = `/payments/${payload.paymentId}/pixQrCode`;
        method = 'GET';
        break;
      default:
        return NextResponse.json({ error: 'Ação inválida' }, { status: 400 });
    }

    const response = await fetch(`${ASAAS_API_URL}${endpoint}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'access_token': ASAAS_API_KEY
      },
      body: method === 'GET' ? null : JSON.stringify(body)
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Falha no Asaas Proxy' }, { status: 500 });
  }
}
