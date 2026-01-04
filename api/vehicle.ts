
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Configuração de CORS para ambiente Serverless
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, DeviceToken');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido.' });
  }

  const { placa } = req.body;
  if (!placa) {
    return res.status(400).json({ error: 'Placa não informada.' });
  }

  const cleanPlate = placa.toUpperCase().replace(/[^A-Z0-9]/g, '');
  
  // Proteção contra ambiente mal configurado
  if (!process.env.APIBRASIL_DEVICE_TOKEN || !process.env.APIBRASIL_BEARER_TOKEN) {
    console.error('[APIBrasil Proxy] Erro: Variáveis de ambiente (Tokens) não configuradas.');
    return res.status(500).json({ error: 'Configuração de API pendente no servidor.' });
  }

  try {
    console.log(`[APIBrasil Proxy] Iniciando consulta: ${cleanPlate}`);
    
    const response = await fetch('https://gateway.apibrasil.io/api/v2/vehicles/dados', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'DeviceToken': process.env.APIBRASIL_DEVICE_TOKEN,
        'Authorization': `Bearer ${process.env.APIBRASIL_BEARER_TOKEN}`
      },
      body: JSON.stringify({ placa: cleanPlate })
    });

    const result = await response.json();
    
    if (!response.ok) {
      console.error(`[APIBrasil Proxy] Erro Gateway (${response.status}):`, result);
      return res.status(response.status).json({ 
        error: result.message || 'Erro ao consultar placa no gateway oficial.',
        details: result 
      });
    }

    // Retorna o corpo da resposta original
    return res.status(200).json(result);

  } catch (error: any) {
    console.error('[APIBrasil Proxy] Erro Crítico:', error.message);
    return res.status(500).json({ error: 'Falha na comunicação com o serviço de dados veiculares.' });
  }
}
