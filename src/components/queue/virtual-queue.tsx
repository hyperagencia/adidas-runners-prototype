'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Users, Clock } from 'lucide-react';

interface VirtualQueueProps {
  eventId: string;
  eventName: string;
  userId: string;
}

export function VirtualQueue({ eventId, eventName, userId }: VirtualQueueProps) {
  const [position, setPosition] = useState<number | null>(null);
  const [totalInQueue, setTotalInQueue] = useState(0);
  const [canProceed, setCanProceed] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Poll cada 2 segundos
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/queue/status?eventId=${eventId}&userId=${userId}`);
        const data = await res.json();
        
        setPosition(data.position);
        setTotalInQueue(data.totalInQueue);
        setCanProceed(data.canProceed);
        setLoading(false);
        
        if (data.canProceed) {
          // Redirigir al dashboard para reservar
          setTimeout(() => {
            router.push(`/dashboard?reserved=${eventId}`);
          }, 1500);
        }
      } catch (error) {
        console.error('Error polling queue:', error);
      }
    }, 2000);

    // Primera llamada inmediata
    fetch(`/api/queue/status?eventId=${eventId}&userId=${userId}`)
      .then(res => res.json())
      .then(data => {
        setPosition(data.position);
        setTotalInQueue(data.totalInQueue);
        setCanProceed(data.canProceed);
        setLoading(false);
        
        if (data.canProceed) {
          setTimeout(() => {
            router.push(`/dashboard?reserved=${eventId}`);
          }, 1500);
        }
      });

    return () => clearInterval(interval);
  }, [eventId, userId, router]);

  const estimatedWaitTime = position ? position * 2 : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (canProceed) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", duration: 0.5 }}
        >
          <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mb-6">
            <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </motion.div>
        <h2 className="text-2xl font-bold mb-2">¡Es tu turno!</h2>
        <p className="text-gray-600">Redirigiendo a la reserva...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gradient-to-b from-gray-50 to-white">
      <Card className="w-full max-w-md p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="inline-block mb-4"
          >
            <Loader2 className="w-16 h-16 text-black" />
          </motion.div>
          
          <h2 className="text-2xl font-bold mb-2">En la fila virtual</h2>
          <p className="text-gray-600">{eventName}</p>
        </div>

        {/* Position Counter */}
        <motion.div
          key={position}
          initial={{ scale: 1.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center mb-6"
        >
          <div className="text-6xl font-bold mb-2">
            {position !== null ? position : '...'}
          </div>
          <p className="text-gray-600 font-medium">
            {position === 1 ? 'persona adelante' : 'personas adelante'}
          </p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <Users className="w-5 h-5 mx-auto mb-2 text-gray-600" />
            <div className="text-2xl font-bold">{totalInQueue}</div>
            <div className="text-xs text-gray-600">En cola</div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <Clock className="w-5 h-5 mx-auto mb-2 text-gray-600" />
            <div className="text-2xl font-bold">
              {Math.floor(estimatedWaitTime / 60)}:{(estimatedWaitTime % 60).toString().padStart(2, '0')}
            </div>
            <div className="text-xs text-gray-600">Tiempo estimado</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            className="absolute top-0 left-0 h-full bg-black"
            initial={{ width: '0%' }}
            animate={{ 
              width: position ? `${Math.max(0, 100 - (position / Math.max(totalInQueue, 1) * 100))}%` : '0%' 
            }}
            transition={{ duration: 0.5 }}
          />
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <Badge variant="secondary" className="text-xs">
            Tu lugar está asegurado
          </Badge>
        </div>
      </Card>

      {/* Branding */}
      <div className="mt-8 text-center">
        <div className="inline-flex items-center gap-2 text-sm text-gray-600">
          <span>Powered by</span>
          <span className="font-bold text-black">HYPER</span>
        </div>
      </div>
    </div>
  );
}
