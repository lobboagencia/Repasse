
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { placa } = await req.json();
    if (!placa) return NextResponse.json({ error: 'Placa ausente' }, { status: 400 });

    const response = await fetch('https://gateway.apibrasil.io/api/v2/vehicles/dados', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'DeviceToken': process.env.APIBRASIL_DEVICE_TOKEN as string,
        'Authorization': `Bearer ${process.env.APIBRASIL_BEARER_TOKEN}`
      },
      body: JSON.stringify({ placa })
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: 'Erro no servidor' }, { status: 500 });
  }
}
