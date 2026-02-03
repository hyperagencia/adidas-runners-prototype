# Adidas Runners Santiago - Prototipo Mejorado

Sistema de inscripción con fila virtual para eventos de Adidas Runners Santiago.

## 🚀 Features

- ✅ **Landing Page** - Hero minimalista tipo Luma
- ✅ **Login Simple** - Email authentication (demo)
- ✅ **Sistema de Cola Virtual** - Queue con Redis (Vercel KV)
- ✅ **Dashboard** - Calendario de eventos responsive
- ✅ **Boarding Pass** - QR code generation
- ✅ **Mobile Responsive** - Diseño adaptativo completo

## 🛠 Tech Stack

- **Framework:** Next.js 15 (App Router)
- **UI:** Shadcn UI + Tailwind CSS
- **Animations:** Framer Motion
- **Queue System:** Vercel KV (Redis)
- **QR Codes:** qrcode.react
- **Dates:** date-fns
- **Hosting:** Vercel

## 📦 Instalación

### 1. Clonar el repositorio

```bash
git clone <tu-repo-url>
cd adidas-runners-prototype
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```env
# Vercel KV (Redis) - Para sistema de cola
# Obtén estos valores creando un KV Store en Vercel Dashboard
KV_URL=
KV_REST_API_URL=
KV_REST_API_TOKEN=
KV_REST_API_READ_ONLY_TOKEN=

# NextAuth (opcional para demo)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=genera-un-secret-con-openssl-rand-base64-32
```

### 4. Configurar Vercel KV (importante)

#### Opción A: Usar Vercel CLI (Recomendado)

```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Link proyecto
vercel link

# Ir a Vercel Dashboard y crear KV Store
# 1. Ve a: https://vercel.com/dashboard
# 2. Storage → Create Database → KV
# 3. Nombre: adidas-runners-queue
# 4. Create

# Pull environment variables
vercel env pull .env.local
```

#### Opción B: Configurar manualmente en Vercel Web

1. Ve a tu proyecto en Vercel Dashboard
2. Settings → Storage → Create → KV
3. Copia las credenciales a `.env.local`

### 5. Correr en desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000)

## 🚢 Deploy a Vercel

### Opción 1: Desde GitHub (Recomendado)

1. Push tu código a GitHub
2. Ve a [vercel.com](https://vercel.com)
3. Import Repository
4. Configure Project:
   - **Framework Preset:** Next.js
   - **Build Command:** `npm run build`
   - **Output Directory:** `.next`
5. Add Environment Variables (las de KV se agregan automáticamente si creaste el KV en Vercel)
6. Deploy

### Opción 2: Desde CLI

```bash
vercel --prod
```

## 🎯 Flujo de Usuario

```
1. Landing (/) 
   ↓ Click "Iniciar sesión"
   
2. Login (/login)
   ↓ Ingresa email (cualquiera para demo)
   
3. Dashboard (/dashboard)
   ↓ Selecciona un evento del calendario
   ↓ Click "Reservar"
   
4. Virtual Queue (/queue)
   ↓ Sistema de fila virtual con:
      - Contador de posición
      - Tiempo estimado
      - Progress bar
   ↓ Cuando es tu turno (posición ≤ 10)
   
5. Dashboard con Boarding Pass
   ↓ Muestra:
      - QR Code
      - Código de reserva
      - Detalles del evento
```

## 📂 Estructura del Proyecto

```
src/
├── app/
│   ├── (auth)/
│   │   └── login/           # Página de login
│   ├── api/
│   │   └── queue/           # API routes para cola
│   │       ├── join/        # Unirse a la cola
│   │       └── status/      # Estado de la cola
│   ├── dashboard/           # Dashboard principal
│   ├── queue/               # Página de cola virtual
│   └── page.tsx             # Landing page
├── components/
│   ├── ui/                  # Componentes Shadcn
│   ├── queue/               # Componente de cola virtual
│   └── dashboard/           # Componentes del dashboard
│       ├── event-calendar.tsx
│       └── boarding-pass.tsx
├── lib/
│   ├── redis.ts             # Queue manager con Vercel KV
│   └── utils.ts             # Utilidades
└── types/
    └── index.ts             # TypeScript types
```

## 🔧 Personalización

### Modificar eventos

Edita el array `events` en `src/components/dashboard/event-calendar.tsx`:

```typescript
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
  // ... más eventos
];
```

### Ajustar velocidad de la cola

En `src/lib/redis.ts`, modifica el método `getQueueStatus`:

```typescript
// Cambiar el número de personas que pueden pasar (default: 10)
const canProceed = position <= 10 && position > 0;

// Ajustar tiempo estimado (default: 2 segundos por persona)
estimatedWaitSeconds: position > 0 ? position * 2 : 0
```

### Cambiar colores

Edita `tailwind.config.ts` para customizar el tema.

## 🎨 Diseño

El prototipo usa un diseño minimalista inspirado en:
- **Luma** - Eventos y calendario
- **Adidas Running** - Onboarding y branding

Características del diseño:
- Tipografía: Inter (similar a Adidas)
- Colores: Monocromático (negro/blanco/grises)
- Espaciado: Generoso y limpio
- Animaciones: Sutiles con Framer Motion

## 📱 Mobile First

El prototipo está completamente optimizado para móvil:
- Calendario responsive
- Touch-friendly buttons
- Optimized spacing
- Progressive Web App ready

## 🔐 Seguridad

Para producción, implementar:
- [ ] NextAuth.js completo con providers
- [ ] Rate limiting en API routes
- [ ] CSRF protection
- [ ] Input validation y sanitization
- [ ] Database real (PostgreSQL/Supabase)

## 📊 Próximos Pasos

### Para la Demo/Pitch:
- ✅ Sistema de cola funcional
- ✅ UI moderna y responsive
- ✅ Flujo completo de reserva
- ⏳ Agregar más animaciones
- ⏳ Mejorar loading states

### Para Producción:
- [ ] Backend con base de datos real
- [ ] Sistema de autenticación completo
- [ ] Panel admin para gestión de eventos
- [ ] Notificaciones push
- [ ] Analytics dashboard
- [ ] Tests automatizados

## 🤝 Contribuir

Este es un prototipo para pitch. Para contribuir:
1. Fork el repo
2. Crea una branch (`git checkout -b feature/mejora`)
3. Commit cambios (`git commit -m 'Add mejora'`)
4. Push (`git push origin feature/mejora`)
5. Abre un Pull Request

## 📄 Licencia

Prototipo desarrollado por **HYPER Branding & Technology Agency** para presentación a Adidas Runners Santiago.

## 💡 Contacto

**HYPER**
- Website: [hyper.cl](https://hyper.cl) (ejemplo)
- Email: contacto@hyper.cl (ejemplo)

---

**Built with ❤️ by HYPER**
