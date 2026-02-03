# 🚀 Setup Rápido - 5 Minutos

## Paso 1: Clonar y Setup Local (2 min)

```bash
# 1. Clonar repo
git clone <tu-repo-url>
cd adidas-runners-prototype

# 2. Instalar dependencias
npm install

# 3. Copiar .env
cp .env.example .env.local

# 4. Correr en dev (SIN VERCEL KV funciona igual, solo sin persistencia)
npm run dev
```

Ya puedes ver el prototipo en `http://localhost:3000` 🎉

**Nota:** Sin Vercel KV configurado, la cola virtual no tendrá persistencia entre refreshes, pero todo funciona visualmente.

---

## Paso 2: Deploy a Vercel (3 min)

### Opción A: Desde GitHub (más fácil)

1. **Push a GitHub:**
```bash
git add .
git commit -m "Initial commit - Adidas Runners Prototype"
git push origin main
```

2. **Importar en Vercel:**
   - Ve a [vercel.com/new](https://vercel.com/new)
   - Click "Import" en tu repo
   - Click "Deploy" (no necesitas configurar nada más por ahora)

3. **Crear Vercel KV (opcional, para que funcione la cola):**
   - En tu proyecto en Vercel → Storage → Create Database → KV
   - Nombre: `adidas-runners-queue`
   - Las variables se agregan automáticamente

4. **Redeploy:**
   - Deployments → ... → Redeploy

### Opción B: Desde CLI

```bash
# 1. Instalar Vercel CLI
npm i -g vercel

# 2. Login
vercel login

# 3. Deploy
vercel --prod

# 4. Crear KV desde dashboard
# Ve a tu proyecto → Storage → Create Database → KV
```

---

## ✅ Checklist Final

- [ ] Proyecto corriendo local en `http://localhost:3000`
- [ ] Push a GitHub completado
- [ ] Deploy en Vercel exitoso
- [ ] URL de producción funcionando (ej: `adidas-runners.vercel.app`)
- [ ] (Opcional) Vercel KV configurado para persistencia

---

## 🎯 Demo Flow para Pitch

1. **Landing** → Muestra hero limpio
2. **Login** → Ingresa cualquier email
3. **Dashboard** → Calendario con eventos
4. **Click "Reservar"** → Entra a la fila virtual
5. **Queue animado** → Contador, progress bar, tiempo estimado
6. **Auto-redirect** → Vuelve a dashboard con Boarding Pass
7. **QR Code** → Muestra código de reserva

**Tiempo total del flow:** ~30 segundos

---

## 🔥 Tips para la Demo

1. **Abre en modo incógnito** para simular usuario nuevo
2. **Usa Chrome DevTools** (F12) para mostrar responsive design
3. **Ten el código abierto** en VS Code para mostrar arquitectura
4. **Compara lado a lado** con la plataforma actual de Webmark
5. **Destaca:**
   - Sin colapsos (queue system)
   - Mobile friendly (100% responsive)
   - Loading states profesionales
   - Animaciones sutiles

---

## 📱 Testing Checklist

- [ ] Desktop (Chrome)
- [ ] Mobile (Chrome DevTools o tu teléfono)
- [ ] Flujo completo sin errores
- [ ] Screenshots del proceso

---

## 🆘 Troubleshooting

**Error: "Module not found"**
```bash
rm -rf node_modules package-lock.json
npm install
```

**Error en build de Vercel**
- Verifica que `next.config.ts` existe
- Check que todas las importaciones son correctas

**Queue no funciona en local**
- Normal sin Vercel KV configurado
- La UI funciona, solo no persiste datos
- Para demo visual es suficiente

---

## 📞 Listo para el Pitch

URL de demo: `https://tu-proyecto.vercel.app`

**Listo!** 🎉 Ahora tienes un prototipo funcional para mostrar a Adidas Runners.
