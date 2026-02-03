import { kv } from '@vercel/kv';

export interface QueuePosition {
  userId: string;
  position: number;
  joinedAt: number;
  eventId: string;
}

export interface QueueStatus {
  position: number;
  canProceed: boolean;
  totalInQueue: number;
  estimatedWaitSeconds: number;
}

export class QueueManager {
  private static QUEUE_KEY = 'event_queue';
  private static ACTIVE_KEY = 'active_users';
  private static PROCESSED_KEY = 'processed_users';
  
  /**
   * Agregar usuario a la cola
   */
  static async joinQueue(userId: string, eventId: string): Promise<QueuePosition> {
    const timestamp = Date.now();
    const queueKey = `${this.QUEUE_KEY}:${eventId}`;
    
    // Agregar a sorted set con timestamp como score (FIFO)
    await kv.zadd(queueKey, { score: timestamp, member: userId });
    
    // Obtener posición actual
    const position = await kv.zrank(queueKey, userId);
    
    return {
      userId,
      position: (position || 0) + 1,
      joinedAt: timestamp,
      eventId
    };
  }
  
  /**
   * Obtener posición actual del usuario
   */
  static async getPosition(userId: string, eventId: string): Promise<number> {
    const queueKey = `${this.QUEUE_KEY}:${eventId}`;
    const processedKey = `${this.PROCESSED_KEY}:${eventId}`;
    
    // Verificar si ya fue procesado
    const isProcessed = await kv.sismember(processedKey, userId);
    if (isProcessed) {
      return 0; // Puede proceder
    }
    
    // Obtener posición en la cola
    const position = await kv.zrank(queueKey, userId);
    return position !== null ? position + 1 : -1;
  }
  
  /**
   * Verificar estado completo de la cola para un usuario
   */
  static async getQueueStatus(userId: string, eventId: string): Promise<QueueStatus> {
    const position = await this.getPosition(userId, eventId);
    const total = await this.getTotalInQueue(eventId);
    
    // Los primeros 10 en la cola pueden proceder
    const canProceed = position <= 10 && position > 0;
    
    // Marcar como procesado si puede proceder
    if (canProceed) {
      await this.markAsProcessed(userId, eventId);
    }
    
    return {
      position: position > 0 ? position : 0,
      canProceed: position <= 10 || position === 0,
      totalInQueue: total,
      estimatedWaitSeconds: position > 0 ? position * 2 : 0
    };
  }
  
  /**
   * Marcar usuario como procesado (ya puede acceder)
   */
  static async markAsProcessed(userId: string, eventId: string): Promise<void> {
    const processedKey = `${this.PROCESSED_KEY}:${eventId}`;
    await kv.sadd(processedKey, userId);
    
    // Remover de la cola
    const queueKey = `${this.QUEUE_KEY}:${eventId}`;
    await kv.zrem(queueKey, userId);
  }
  
  /**
   * Procesar cola (permitir entrar a los siguientes N usuarios)
   */
  static async processQueue(eventId: string, slots: number = 10): Promise<string[]> {
    const queueKey = `${this.QUEUE_KEY}:${eventId}`;
    const processedKey = `${this.PROCESSED_KEY}:${eventId}`;
    
    // Obtener primeros N usuarios
    const users = await kv.zrange(queueKey, 0, slots - 1);
    
    // Marcarlos como procesados
    if (users.length > 0) {
      await kv.sadd(processedKey, ...users);
      await kv.zrem(queueKey, ...users);
    }
    
    return users as string[];
  }
  
  /**
   * Obtener total de usuarios en cola
   */
  static async getTotalInQueue(eventId: string): Promise<number> {
    const queueKey = `${this.QUEUE_KEY}:${eventId}`;
    return (await kv.zcard(queueKey)) || 0;
  }
  
  /**
   * Limpiar cola de un evento
   */
  static async clearQueue(eventId: string): Promise<void> {
    const queueKey = `${this.QUEUE_KEY}:${eventId}`;
    const processedKey = `${this.PROCESSED_KEY}:${eventId}`;
    await kv.del(queueKey);
    await kv.del(processedKey);
  }
  
  /**
   * Verificar si un usuario está en la cola
   */
  static async isInQueue(userId: string, eventId: string): Promise<boolean> {
    const queueKey = `${this.QUEUE_KEY}:${eventId}`;
    const score = await kv.zscore(queueKey, userId);
    return score !== null;
  }
}
