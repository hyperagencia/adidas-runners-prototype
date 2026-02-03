export interface Event {
  id: string;
  title: string;
  date: Date;
  location: string;
  address: string;
  spotsTotal: number;
  spotsLeft: number;
  trainer: string;
  description?: string;
}

export interface Reservation {
  id: string;
  eventId: string;
  userId: string;
  code: string;
  qrCode: string;
  createdAt: Date;
  event: Event;
}

export interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
}

export interface QueueData {
  position: number;
  totalInQueue: number;
  estimatedWaitSeconds: number;
  canProceed: boolean;
}
