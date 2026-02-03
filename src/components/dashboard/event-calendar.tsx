'use client';

import { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, isSameDay } from 'date-fns';
import { es } from 'date-fns/locale';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, MapPin, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Event } from '@/types';

interface EventCalendarProps {
  onEventSelect: (event: Event) => void;
}

export function EventCalendar({ onEventSelect }: EventCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 1)); // Febrero 2026
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date(2026, 1, 3));

  // Mock events
  const events: Event[] = [
    {
      id: '1',
      title: 'Vitacura - Pinsa',
      date: new Date(2026, 1, 3, 19, 30),
      location: 'Vitacura',
      address: 'Candelaria Goyenechea 3868',
      spotsTotal: 30,
      spotsLeft: 15,
      trainer: 'Belu'
    },
    {
      id: '2',
      title: 'Ñuñoa - Casa de Origen',
      date: new Date(2026, 1, 3, 19, 30),
      location: 'Ñuñoa',
      address: 'Plaza Ñuñoa',
      spotsTotal: 25,
      spotsLeft: 8,
      trainer: 'Seba Campos'
    },
    {
      id: '3',
      title: 'Providencia - La Pastora',
      date: new Date(2026, 1, 3, 19, 30),
      location: 'Providencia',
      address: 'Providencia 1234',
      spotsTotal: 20,
      spotsLeft: 0,
      trainer: 'Guti'
    }
  ];

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getEventsForDate = (date: Date) => {
    return events.filter(event => 
      isSameDay(event.date, date)
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold capitalize">
          {format(currentMonth, 'MMMM yyyy', { locale: es })}
        </h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1))}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1))}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Calendar Grid */}
      <Card className="p-6">
        <div className="grid grid-cols-7 gap-2 mb-4">
          {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map(day => (
            <div key={day} className="text-center text-sm font-medium text-gray-600 py-2">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2">
          {days.map(day => {
            const dayEvents = getEventsForDate(day);
            const hasEvents = dayEvents.length > 0;
            const hasSpots = dayEvents.some(e => e.spotsLeft > 0);

            return (
              <button
                key={day.toString()}
                onClick={() => setSelectedDate(day)}
                className={cn(
                  "aspect-square p-2 rounded-lg text-sm transition-all hover:bg-gray-100",
                  !isSameMonth(day, currentMonth) && "text-gray-300",
                  isToday(day) && "bg-black text-white hover:bg-black/90",
                  hasEvents && !isToday(day) && "font-bold",
                  selectedDate && isSameDay(selectedDate, day) && "ring-2 ring-black"
                )}
              >
                <div className="flex flex-col items-center justify-center h-full">
                  <span>{format(day, 'd')}</span>
                  {hasEvents && (
                    <div className={cn(
                      "w-2 h-2 rounded-full mt-1",
                      hasSpots ? "bg-blue-500" : "bg-gray-400"
                    )} />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </Card>

      {/* Events List */}
      {selectedDate && getEventsForDate(selectedDate).length > 0 && (
        <div className="space-y-3">
          <h3 className="font-semibold">
            Eventos - {format(selectedDate, 'd MMMM', { locale: es })}
          </h3>
          {getEventsForDate(selectedDate).map(event => (
            <EventCard key={event.id} event={event} onSelect={onEventSelect} />
          ))}
        </div>
      )}
    </div>
  );
}

function EventCard({ event, onSelect }: { event: Event; onSelect: (event: Event) => void }) {
  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <h4 className="font-semibold mb-2">{event.title}</h4>
          <div className="space-y-1 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <span className="font-mono">{format(event.date, 'HH:mm')}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>{event.address}</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>Entrenador: {event.trainer}</span>
            </div>
          </div>
          <div className="mt-2">
            {event.spotsLeft > 0 ? (
              <Badge variant="secondary" className="text-xs">
                {event.spotsLeft} cupos disponibles
              </Badge>
            ) : (
              <Badge variant="destructive" className="text-xs">
                Sin cupos
              </Badge>
            )}
          </div>
        </div>
        <Button 
          disabled={event.spotsLeft === 0}
          onClick={() => onSelect(event)}
          className="shrink-0"
        >
          Reservar
        </Button>
      </div>
    </Card>
  );
}
