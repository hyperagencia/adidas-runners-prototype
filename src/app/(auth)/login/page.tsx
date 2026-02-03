'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Mail } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Para el demo, simular login exitoso
    if (email) {
      // Guardar email en sessionStorage para simular sesión
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('user', JSON.stringify({ email, name: 'Luis' }));
      }
      
      // Redirigir al dashboard
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-gray-50 to-white">
      <Card className="w-full max-w-md p-8">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">ADIDAS RUNNERS</h1>
          <p className="text-gray-600">Inicia sesión para continuar</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {/* Email Input */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              Correo electrónico
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              autoComplete="email"
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          {/* Submit Button */}
          <Button type="submit" className="w-full" size="lg">
            <Mail className="mr-2" />
            Continuar con Email
          </Button>
        </form>

        {/* Demo Note */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-800">
            <strong>Demo:</strong> Ingresa cualquier email para continuar. 
            Este es un prototipo funcional.
          </p>
        </div>
      </Card>

      {/* Back Link */}
      <div className="mt-8">
        <a href="/" className="text-sm text-gray-600 hover:text-black transition-colors">
          ← Volver al inicio
        </a>
      </div>
    </div>
  );
}
