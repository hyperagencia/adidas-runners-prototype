import { NextResponse } from 'next/server';
import { QueueManager } from '@/lib/redis';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get('eventId');
    const userId = searchParams.get('userId');
    
    if (!eventId || !userId) {
      return NextResponse.json(
        { error: 'Missing eventId or userId' },
        { status: 400 }
      );
    }
    
    // Obtener estado de la cola
    const status = await QueueManager.getQueueStatus(userId, eventId);
    
    return NextResponse.json(status);
  } catch (error) {
    console.error('Queue status error:', error);
    return NextResponse.json(
      { error: 'Failed to get queue status' },
      { status: 500 }
    );
  }
}
