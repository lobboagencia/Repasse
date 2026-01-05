
import type { VercelRequest, VercelResponse } from '@vercel/node';

const ASAAS_API_URL = process.env.ASAAS_API_URL || 'https://sandbox.asaas.com/api/v3';
const ASAAS_API_KEY = process.env.ASAAS_API_KEY;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método não permitido' });

  if (!ASAAS_API_KEY) {
    return res.status(500).json({ error: 'ASAAS_API_KEY não configurada no servidor.' });
  }

  const { action, payload } = req.body;

  try {
    let endpoint = '';
    let body = {};

    switch (action) {
      case 'createCustomer':
        endpoint = '/customers';
        body = {
          name: payload.name,
          email: payload.email,
          externalReference: payload.id
        };
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
        break;

      default:
        return res.status(400).json({ error: 'Ação inválida' });
    }

    const response = await fetch(`${ASAAS_API_URL}${endpoint}`, {
      method: action === 'getPixQrCode' ? 'GET' : 'POST',
      headers: {
        'Content-Type': 'application/json',
        'access_token': ASAAS_API_KEY
      },
      body: action === 'getPixQrCode' ? null : JSON.stringify(body)
    });

    const data = await response.json();
    return res.status(200).json(data);

  } catch (error: any) {
    console.error('[Asaas Proxy] Erro:', error.message);
    return res.status(500).json({ error: 'Falha na comunicação com o Asaas.' });
  }
}
