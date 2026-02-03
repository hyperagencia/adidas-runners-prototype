'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { EventCalendar } from '@/components/dashboard/event-calendar';
import { BoardingPass } from '@/components/dashboard/boarding-pass';
import { Button } from '@/components/ui/button';
import { Loader2, LogOut } from 'lucide-react';
import type { Event } from '@/types';

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [user, setUser] = useState<{ email: string; name: string } | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [reservationCode, setReservationCode] = useState<string | null>(null);

  useEffect(() => {
    // Verificar si el usuario está logueado
    if (typeof window !== 'undefined') {
      const userStr = sessionStorage.getItem('user');
      if (userStr) {
        setUser(JSON.parse(userStr));
      } else {
        router.push('/login');
      }
    }

    // Verificar si viene de queue con reserva
    const reserved = searchParams.get('reserved');
    if (reserved) {
      // Simular reserva automática del evento 1
      const mockEvent: Event = {
        id: '1',
        title: 'Vitacura - Pinsa',
        date: new Date(2026, 1, 3, 19, 30),
        location: 'Vitacura',
        address: 'Candelaria Goyenechea 3868',
        spotsTotal: 30,
        spotsLeft: 14,
        trainer: 'Belu'
      };
      setSelectedEvent(mockEvent);
      setReservationCode(generateReservationCode());
    }
  }, [router, searchParams]);

  const handleEventSelect = (event: Event) => {
    // Redirigir a queue
    router.push(`/queue?event=${event.id}&name=${encodeURIComponent(event.title)}`);
  };

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('user');
    }
    router.push('/');
  };

  const generateReservationCode = () => {
    return Math.floor(1000 + Math.random() * 9000).toString();
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">ADIDAS RUNNERS</h1>
              <p className="text-sm text-gray-600">Hola, {user.name}</p>
            </div>
            <Button variant="ghost" onClick={handleLogout}>
              <LogOut className="mr-2 w-4 h-4" />
              Cerrar sesión
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Boarding Pass if exists */}
          {selectedEvent && reservationCode && (
            <div>
              <BoardingPass 
                event={selectedEvent}
                reservationCode={reservationCode}
              />
            </div>
          )}

          {/* Calendar */}
          <div>
            <EventCalendar onEventSelect={handleEventSelect} />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-20 pb-8 text-center text-sm text-gray-500">
        <div className="flex items-center gap-2 justify-center">
          <span>Prototipo desarrollado por</span>
          <span className="font-bold text-black">HYPER</span>
        </div>
      </footer>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}
