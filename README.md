# BNA — Turismo Argentino con IA

Aplicación standalone para kiosco vertical de Banco Nación. La persona se saca una selfie, elige un destino argentino y un estilo ilustrado, y recibe una postal 9:16 generada con IA. Cada destino agrega al azar una de sus variantes regionales.

## Stack

- Vite, React y TypeScript
- Tailwind CSS y componentes Radix
- fal.ai Queue API (`fal-ai/nano-banana-2/edit`)
- PWA fullscreen en orientación vertical
- Vercel Functions y Brevo para envío por email

## Desarrollo

```bash
npm install
cp .env.example .env.local
npm run dev
```

Abrí `http://localhost:5173`. La primera vez la app solicita una API key de fal.ai y la guarda únicamente en `localStorage`. El diálogo también se abre con un doble toque en la esquina superior derecha.

Comandos de validación:

```bash
npm run typecheck
npm test
npm run lint
npm run build
```

## Configuración de email

El endpoint `POST /api/send-email` requiere:

- `BREVO_API_KEY`: API key transaccional de Brevo.
- `BREVO_SENDER_EMAIL`: remitente verificado.
- `BREVO_SENDER_NAME`: nombre visible; por defecto, `BNA Turismo Argentino`.
- `BREVO_TEMPLATE_ID_IMAGE`: template transaccional opcional.
- `PUBLIC_BASE_URL`: origen público sin `/` final, usado para construir el enlace `/descargar`.

Si no se configura un template, el endpoint envía un email HTML simple con un enlace funcional a la descarga.

## Miniaturas de destinos

Las siete tarjetas muestran placeholders hasta recibir las imágenes finales. Para reemplazarlas:

1. Guardá los assets cuadrados en `public/destinos/`.
2. En `src/lib/options.ts`, asigná su ruta pública en `imageSrc`, por ejemplo `'/destinos/cataratas.webp'`.

No es necesario modificar el componente de selección.

## Entrega de la imagen

El resultado se muestra en el kiosco y expone un QR hacia `/descargar?u=...`. La página móvil prepara un JPEG con el texto “Descubrí Argentina con” y el logo BNA. Usa Web Share cuando está disponible y descarga directa como fallback.

Las URLs originales de fal.ai son temporales; la descarga debe realizarse mientras la URL siga vigente.
