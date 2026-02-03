// Mock Queue Manager para demo (sin persistencia)
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

// Simulación en memoria (se resetea al refrescar)
const queues = new Map<string, Map<string, number>>();
const processed = new Map<string, Set<string>>();

export class QueueManager {
  private static getQueue(eventId: string) {
    if (!queues.has(eventId)) {
      queues.set(eventId, new Map());
    }
    return queues.get(eventId)!;
  }

  private static getProcessed(eventId: string) {
    if (!processed.has(eventId)) {
      processed.set(eventId, new Set());
    }
    return processed.get(eventId)!;
  }

  static async joinQueue(userId: string, eventId: string): Promise<QueuePosition> {
  const timestamp = Date.now();
  const queue = this.getQueue(eventId);
  
  // 🎭 DEMO: Si la cola está vacía, agregar usuarios simulados
  if (queue.size === 0) {
    // Agregar 15-20 usuarios fake con timestamps anteriores
    const fakeUsersCount = Math.floor(Math.random() * 6) + 15; // 15-20 usuarios
    for (let i = 0; i < fakeUsersCount; i++) {
      const fakeUserId = `demo-user-${i}@fake.com`;
      const fakeTimestamp = timestamp - ((fakeUsersCount - i) * 1000); // 1 seg de diferencia
      queue.set(fakeUserId, fakeTimestamp);
    }
  }
  
  if (!queue.has(userId)) {
    queue.set(userId, timestamp);
  }
  
  // Calcular posición
  const sortedUsers = Array.from(queue.entries())
    .sort((a, b) => a[1] - b[1]);
  
  const position = sortedUsers.findIndex(([id]) => id === userId) + 1;
  
  return {
    userId,
    position,
    joinedAt: timestamp,
    eventId
  };
}

  static async getPosition(userId: string, eventId: string): Promise<number> {
    const processedSet = this.getProcessed(eventId);
    
    if (processedSet.has(userId)) {
      return 0; // Ya procesado
    }
    
    const queue = this.getQueue(eventId);
    if (!queue.has(userId)) {
      return -1; // No está en la cola
    }
    
    const sortedUsers = Array.from(queue.entries())
      .sort((a, b) => a[1] - b[1]);
    
    return sortedUsers.findIndex(([id]) => id === userId) + 1;
  }

  static async getQueueStatus(userId: string, eventId: string): Promise<QueueStatus> {
    const position = await this.getPosition(userId, eventId);
    const total = await this.getTotalInQueue(eventId);
    
    // Los primeros 10 pueden proceder
    const canProceed = position <= 10 && position > 0;
    
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

  static async markAsProcessed(userId: string, eventId: string): Promise<void> {
    const processedSet = this.getProcessed(eventId);
    processedSet.add(userId);
    
    const queue = this.getQueue(eventId);
    queue.delete(userId);
  }

  static async getTotalInQueue(eventId: string): Promise<number> {
    const queue = this.getQueue(eventId);
    return queue.size;
  }

  static async clearQueue(eventId: string): Promise<void> {
    queues.delete(eventId);
    processed.delete(eventId);
  }

  static async isInQueue(userId: string, eventId: string): Promise<boolean> {
    const queue = this.getQueue(eventId);
    return queue.has(userId);
  }
  static async processQueue(eventId: string, slots: number = 3): Promise<string[]> {
  const queue = this.getQueue(eventId);
  const processedSet = this.getProcessed(eventId);
  
  // Obtener primeros N usuarios
  const sortedUsers = Array.from(queue.entries())
    .sort((a, b) => a[1] - b[1])
    .slice(0, slots)
    .map(([userId]) => userId);
  
  // Solo procesar usuarios fake para la demo
  const fakeUsers = sortedUsers.filter(id => id.startsWith('demo-user-'));
  
  // Marcarlos como procesados y removerlos
  fakeUsers.forEach(userId => {
    processedSet.add(userId);
    queue.delete(userId);
  });
  
  return fakeUsers;
}
}