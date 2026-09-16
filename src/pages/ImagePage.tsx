import { useEffect, useLayoutEffect, useState } from 'react';
import { Download, Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

const WATERMARK = {
  text: 'Viajá por Argentina',
  textSizePct: 0.042,
  logoHeightMultiplier: 1.5,
  bottomMarginPct: 0.025,
  gapPct: 0.014,
  gradientHeightPct: 0.22,
  logoSrc: '/logo-bna.png',
} as const;

function loadImage(src: string, crossOrigin?: 'anonymous'): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    if (crossOrigin) image.crossOrigin = crossOrigin;
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(`No pudimos cargar la imagen: ${src}`));
    image.src = src;
  });
}

async function composeWatermarked(falUrl: string): Promise<HTMLCanvasElement> {
  const [photo, logo] = await Promise.all([
    loadImage(falUrl, 'anonymous'),
    loadImage(WATERMARK.logoSrc),
  ]);

  const canvas = document.createElement('canvas');
  canvas.width = photo.naturalWidth;
  canvas.height = photo.naturalHeight;
  const context = canvas.getContext('2d');
  if (!context) throw new Error('No pudimos preparar el archivo para descargar.');

  const width = canvas.width;
  const height = canvas.height;
  context.drawImage(photo, 0, 0);

  const gradientHeight = height * WATERMARK.gradientHeightPct;
  const gradient = context.createLinearGradient(0, height - gradientHeight, 0, height);
  gradient.addColorStop(0, 'rgba(0,32,65,0)');
  gradient.addColorStop(1, 'rgba(0,32,65,0.96)');
  context.fillStyle = gradient;
  context.fillRect(0, height - gradientHeight, width, gradientHeight);

  const fontSize = Math.round(width * WATERMARK.textSizePct);
  const fontSpec = `700 ${fontSize}px "Kievit", sans-serif`;
  try {
    await document.fonts.load(fontSpec, WATERMARK.text);
  } catch {
    // Canvas falls back to sans-serif if the webfont cannot be loaded.
  }

  context.font = fontSpec;
  context.textBaseline = 'middle';
  context.textAlign = 'left';
  const textWidth = context.measureText(WATERMARK.text).width;
  const logoHeight = fontSize * WATERMARK.logoHeightMultiplier;
  const logoWidth = logoHeight * (logo.naturalWidth / logo.naturalHeight);
  const gap = width * WATERMARK.gapPct;
  const totalWidth = textWidth + gap + logoWidth;
  const blockHeight = Math.max(fontSize, logoHeight);
  const centerY = height - height * WATERMARK.bottomMarginPct - blockHeight / 2;
  const startX = (width - totalWidth) / 2;

  context.fillStyle = '#ffffff';
  context.fillText(WATERMARK.text, startX, centerY);
  context.drawImage(
    logo,
    startX + textWidth + gap,
    centerY - logoHeight / 2,
    logoWidth,
    logoHeight,
  );

  return canvas;
}

function canvasToFile(canvas: HTMLCanvasElement): Promise<File> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error('No pudimos generar el archivo para descargar.'));
        return;
      }
      resolve(
        new File([blob], `bna-turismo-argentina-${Date.now()}.jpg`, {
          type: 'image/jpeg',
        }),
      );
    }, 'image/jpeg', 0.95);
  });
}

function fallbackDownload(file: File) {
  const url = URL.createObjectURL(file);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = file.name;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

export function ImagePage() {
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);
  const [downloadFile, setDownloadFile] = useState<File | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);
  useLayoutEffect(() => {
    document.documentElement.classList.add('download-page');
    document.body.classList.add('allow-native-gestures');
    return () => {
      document.documentElement.classList.remove('download-page');
      document.body.classList.remove('allow-native-gestures');
    };
  }, []);

  useEffect(() => {
    const mediaUrl = new URLSearchParams(window.location.search).get('u');
    if (!mediaUrl) {
      setErrorMsg('No se especificó la imagen.');
      return;
    }

    let cancelled = false;
    void (async () => {
      try {
        const canvas = await composeWatermarked(mediaUrl);
        const file = await canvasToFile(canvas);
        if (cancelled) return;
        setPreviewSrc(canvas.toDataURL('image/jpeg', 0.92));
        setDownloadFile(file);
      } catch (error) {
        if (cancelled) return;
        setErrorMsg(error instanceof Error ? error.message : 'No pudimos preparar la imagen.');
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleDownload = () => {
    if (!downloadFile) return;
    setDownloading(true);
    const nav = navigator as Navigator & {
      canShare?: (data: { files: File[] }) => boolean;
      share?: (data: { files: File[]; title?: string }) => Promise<void>;
    };

    if (nav.canShare?.({ files: [downloadFile] }) && nav.share) {
      nav
        .share({ files: [downloadFile], title: 'Mi foto soñada en Argentina' })
        .catch(() => fallbackDownload(downloadFile))
        .finally(() => setDownloading(false));
      return;
    }

    fallbackDownload(downloadFile);
    setDownloading(false);
  };

  return (
    <div className="relative flex h-dvh w-full flex-col items-center gap-4 overflow-x-hidden overflow-y-auto bg-[url('/bg-game.png')] bg-cover bg-center bg-no-repeat p-4 text-white">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 bg-[linear-gradient(180deg,rgba(0,42,78,0.68),rgba(0,28,58,0.84))]"
      />
      <div className="relative z-10 flex w-full max-w-3xl flex-col items-center gap-4">
        <img src="/logo-bna.png" alt="Banco Nación" className="mt-2 h-12 w-auto drop-shadow-md" />
        <h1 className="text-center text-3xl font-kievit-black">Tu foto soñada</h1>

        {errorMsg && (
          <Alert variant="destructive" className="max-w-md bg-white">
            <AlertTitle>No pudimos preparar la imagen</AlertTitle>
            <AlertDescription>{errorMsg}</AlertDescription>
          </Alert>
        )}

        {!errorMsg && !previewSrc && (
          <div className="flex min-h-[70dvh] items-center justify-center">
            <div className="flex items-center gap-3 rounded-full bg-[#003b70]/85 px-7 py-4 text-xl text-white shadow-xl">
              <Loader2 className="size-6 animate-spin" />
              Preparando tu imagen…
            </div>
          </div>
        )}

        {previewSrc && (
          <>
            <img
              src={previewSrc}
              alt="Tu imagen de Turismo Argentino"
              draggable
              className="max-h-[76dvh] w-auto max-w-full rounded-2xl border-4 border-white/90 bg-muted object-contain shadow-2xl ring-4 ring-[#36c8e8]/35"
              style={{
                WebkitTouchCallout: 'default',
                WebkitUserSelect: 'auto',
                userSelect: 'auto',
                touchAction: 'auto',
              }}
            />
            <Button
              onClick={handleDownload}
              disabled={downloading || !downloadFile}
              className="h-16 w-full gap-3 rounded-full border-2 border-white bg-gradient-to-r from-[#003b70] via-[#006da8] to-[#29b9dd] text-2xl font-kievit-black text-white shadow-xl hover:brightness-110 sm:h-20 sm:w-[90%] sm:gap-4 sm:text-3xl [&_svg]:size-7 sm:[&_svg]:size-8"
            >
              {downloading ? (
                <>
                  <Loader2 className="animate-spin" /> Preparando descarga…
                </>
              ) : (
                <>
                  <Download /> Descargar
                </>
              )}
            </Button>
            <p className="pb-4 text-center text-lg text-white sm:text-xl">
              También podés <strong>mantener apretada</strong> la imagen
              <br />y guardarla en tus fotos.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
