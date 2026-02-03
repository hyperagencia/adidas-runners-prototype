import { NextResponse } from 'next/server';
import { QueueManager } from '@/lib/redis';

export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get('eventId');
    
    if (!eventId) {
      return NextResponse.json(
        { error: 'Missing eventId' },
        { status: 400 }
      );
    }
    
    // Procesar los primeros 2-3 usuarios de la cola
    await QueueManager.processQueue(eventId, 3);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Queue process error:', error);
    return NextResponse.json(
      { error: 'Failed to process queue' },
      { status: 500 }
    );
  }
}