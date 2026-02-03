'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { VirtualQueue } from '@/components/queue/virtual-queue';
import { Loader2 } from 'lucide-react';

function QueuePageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  
  const eventId = searchParams.get('event') || '1';
  const eventName = searchParams.get('name') || 'Vitacura - Pinsa';

  useEffect(() => {
    // Verificar si el usuario está logueado
    if (typeof window !== 'undefined') {
      const userStr = sessionStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        setUserId(user.email);
        
        // Unirse a la cola automáticamente
        fetch('/api/queue/join', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ eventId, userId: user.email })
        }).catch(err => console.error('Error joining queue:', err));
      } else {
        // No hay sesión, redirigir al login
        router.push('/login');
      }
    }
  }, [eventId, router]);

  if (!userId) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <VirtualQueue 
      eventId={eventId}
      eventName={eventName}
      userId={userId}
    />
  );
}

export default function QueuePage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    }>
      <QueuePageContent />
    </Suspense>
  );
}
