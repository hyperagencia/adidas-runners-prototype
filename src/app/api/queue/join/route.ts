import { NextResponse } from 'next/server';
import { QueueManager } from '@/lib/redis';

export async function POST(request: Request) {
  try {
    const { eventId, userId } = await request.json();
    
    if (!eventId || !userId) {
      return NextResponse.json(
        { error: 'Missing eventId or userId' },
        { status: 400 }
      );
    }
    
    // Unirse a la cola
    const position = await QueueManager.joinQueue(userId, eventId);
    const total = await QueueManager.getTotalInQueue(eventId);
    
    return NextResponse.json({
      success: true,
      position: position.position,
      estimatedWaitSeconds: position.position * 2, // 2 seg por persona
      totalInQueue: total
    });
  } catch (error) {
    console.error('Queue join error:', error);
    return NextResponse.json(
      { error: 'Failed to join queue' },
      { status: 500 }
    );
  }
}
