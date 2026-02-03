'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { QRCodeSVG } from 'qrcode.react';
import { MapPin, Calendar, Clock } from 'lucide-react';
import type { Event } from '@/types';

interface BoardingPassProps {
  event: Event;
  reservationCode: string;
}

export function BoardingPass({ event, reservationCode }: BoardingPassProps) {
  return (
    <Card className="p-6">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Tu pase de abordaje</h3>
            <Badge className="bg-green-500">Confirmado</Badge>
          </div>
        </div>

        {/* Event Info + QR Code */}
        <div className="grid md:grid-cols-[1fr,auto] gap-6">
          {/* Event Details */}
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500 mb-1">Evento</p>
              <p className="text-xl font-bold">{event.title}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 mb-1 flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Fecha
                </p>
                <p className="font-medium">
                  {format(event.date, 'd MMMM yyyy', { locale: es })}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-1 flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  Hora
                </p>
                <p className="font-medium">{format(event.date, 'HH:mm')}</p>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-500 mb-1 flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                Lugar
              </p>
              <p className="font-medium">{event.address}</p>
              <p className="text-sm text-gray-500">{event.location}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500 mb-1">Código de reserva</p>
              <p className="font-mono text-2xl font-bold tracking-wide">
                {reservationCode}
              </p>
            </div>
          </div>

          {/* QR Code */}
          <div className="flex items-center justify-center md:justify-end">
            <div className="bg-white p-4 rounded-lg border">
              <QRCodeSVG 
                value={`ADIDAS-RUNNERS-${reservationCode}`}
                size={180}
                level="H"
                includeMargin
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t">
          <p className="text-xs text-gray-500">
            Muestra este QR al llegar al evento. Tu entrenador es {event.trainer}.
          </p>
        </div>
      </div>
    </Card>
  );
}
