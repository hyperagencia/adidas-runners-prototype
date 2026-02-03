import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-gray-50 to-white">
      {/* Logo */}
      <div className="mb-12">
        <div className="flex items-center gap-2">
          <div className="text-4xl font-bold">ADIDAS</div>
          <div className="text-4xl font-light">RUNNERS</div>
        </div>
        <div className="text-sm text-gray-600 mt-1 text-center">SANTIAGO</div>
      </div>

      {/* Hero */}
      <div className="max-w-2xl mx-auto text-center mb-12">
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
          Corre con nosotros
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Únete a la comunidad de running más grande de Santiago. 
          Entrenamientos gratuitos todos los martes a las 19:30.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/login">
            <Button size="lg" className="w-full sm:w-auto group">
              Iniciar sesión
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Features */}
      <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mt-20">
        <div className="text-center">
          <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
            1
          </div>
          <h3 className="font-semibold mb-2">Inscripción sin estrés</h3>
          <p className="text-sm text-gray-600">
            Sistema de fila virtual que garantiza una experiencia justa y sin colapsos
          </p>
        </div>

        <div className="text-center">
          <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
            2
          </div>
          <h3 className="font-semibold mb-2">Reserva tu cupo</h3>
          <p className="text-sm text-gray-600">
            Elige tu ubicación favorita y asegura tu lugar en segundos
          </p>
        </div>

        <div className="text-center">
          <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
            3
          </div>
          <h3 className="font-semibold mb-2">Acceso instantáneo</h3>
          <p className="text-sm text-gray-600">
            Recibe tu pase de abordaje con código QR al completar tu reserva
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-20 text-center text-sm text-gray-500">
        <div className="flex items-center gap-2 justify-center">
          <span>Prototipo desarrollado por</span>
          <span className="font-bold text-black">HYPER</span>
        </div>
      </footer>
    </main>
  );
}
