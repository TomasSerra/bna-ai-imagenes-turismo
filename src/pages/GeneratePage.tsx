import { useEffect, useRef, useState } from 'react';
import Confetti from 'react-confetti';
import { ArrowLeft, Compass, RotateCw, ThumbsUp } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { Button } from '@/components/ui/button';
import { EmailSendDialog } from '@/components/EmailSendDialog';
import { GenerationError } from '@/components/GenerationError';
import { Skeleton } from '@/components/ui/skeleton';
import { generateImage } from '@/lib/flux';
import { toFriendlyError, type FriendlyError } from '@/lib/errors';
import { buildPrompt } from '@/lib/prompt';
import type { OpcionesGeneracion } from '@/types';

const STATUS_MESSAGES = [
  'Preparando el equipaje…',
  'Desplegando el mapa de Argentina…',
  'Buscando la mejor vista…',
  'Esperando la luz perfecta…',
  'Acomodando la cámara viajera…',
  'Recorriendo rutas argentinas…',
  'Cruzando montañas y quebradas…',
  'Escuchando el agua de las cataratas…',
  'Dibujando el hielo patagónico…',
  'Encendiendo las luces de Buenos Aires…',
  'Mirando el Nahuel Huapi…',
  'Llegando al fin del mundo…',
  'Sumando una variante del destino…',
  'Pintando cada rincón del paisaje…',
  'Dándole magia al viaje…',
  'Preparando tu foto soñada…',
  'Casi listo, último retoque…',
] as const;

type Phase = 'generating' | 'done' | 'error';

export interface GeneratePageProps {
  apiKey: string;
  photo: { base64: string; dataUrl: string };
  opciones: OpcionesGeneracion;
  onBack: () => void;
  onDone: () => void;
}

export function GeneratePage({ apiKey, photo, opciones, onBack, onDone }: GeneratePageProps) {
  const [phase, setPhase] = useState<Phase>('generating');
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [publicUrl, setPublicUrl] = useState<string | null>(null);
  const [friendlyError, setFriendlyError] = useState<FriendlyError | null>(null);
  const [statusMsg, setStatusMsg] = useState<string>(STATUS_MESSAGES[0]);
  const [showConfetti, setShowConfetti] = useState(false);
  const currentResultRef = useRef<string | null>(null);
  const hasRunRef = useRef(false);

  const run = async () => {
    setPhase('generating');
    setFriendlyError(null);
    setPublicUrl(null);
    try {
      const { prompt, extraReferenceUrl } = buildPrompt(opciones);
      const { blob, url: falUrl } = await generateImage({
        apiKey,
        prompt,
        inputImageBase64: photo.base64,
        extraReferenceUrl,
      });

      if (currentResultRef.current) URL.revokeObjectURL(currentResultRef.current);
      const objectUrl = URL.createObjectURL(blob);
      currentResultRef.current = objectUrl;
      setResultUrl(objectUrl);
      setPublicUrl(falUrl);
      setPhase('done');
    } catch (error) {
      console.warn('[turismo] generación falló', error);
      setFriendlyError(toFriendlyError(error));
      setPhase('error');
    }
  };

  useEffect(() => {
    if (hasRunRef.current) return;
    hasRunRef.current = true;
    void run();

    return () => {
      if (currentResultRef.current) URL.revokeObjectURL(currentResultRef.current);
    };
    // `opciones` is deliberately fixed for the life of this generation page.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (phase === 'done') setShowConfetti(true);
  }, [phase]);

  useEffect(() => {
    if (phase !== 'generating') return;
    setStatusMsg(STATUS_MESSAGES[Math.floor(Math.random() * STATUS_MESSAGES.length)]);
    const intervalId = window.setInterval(() => {
      setStatusMsg((previous) => {
        const pool = STATUS_MESSAGES.filter((message) => message !== previous);
        return pool[Math.floor(Math.random() * pool.length)];
      });
    }, 2200);
    return () => window.clearInterval(intervalId);
  }, [phase]);

  return (
    <div className="flex h-dvh w-dvw flex-col gap-4 overflow-hidden p-6 text-white">
      {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          colors={['#ffffff', '#4ed8f4', '#179ec8', '#003b70', '#f6c453']}
          recycle={false}
          numberOfPieces={500}
          gravity={0.15}
          tweenDuration={3000}
          onConfettiComplete={(instance) => {
            instance?.reset();
            setShowConfetti(false);
          }}
          className="pointer-events-none fixed inset-0 z-50"
        />
      )}

      <header className="relative flex shrink-0 items-center justify-center">
        {phase === 'error' && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="absolute left-0 text-lg text-white hover:bg-white/15 hover:text-white"
          >
            <ArrowLeft className="size-5" /> Volver
          </Button>
        )}
        <img src="/logo-bna.png" alt="Banco Nación" className="h-12 w-auto drop-shadow-md" />
      </header>

      <h2 className="shrink-0 text-center text-3xl font-kievit-black tracking-wide text-white drop-shadow-md">
        {phase === 'generating' ? 'Creando tu viaje' : 'Tu foto soñada'}
      </h2>

      <div className="flex min-h-0 flex-1 items-center justify-center">
        <div className="relative aspect-[9/16] h-full max-h-full w-auto max-w-full overflow-hidden rounded-[2rem] border-4 border-white/90 bg-muted shadow-2xl ring-4 ring-[#36c8e8]/35">
          {phase === 'generating' && (
            <>
              <img
                src={photo.dataUrl}
                alt=""
                aria-hidden
                className="h-full w-full scale-110 object-cover blur-2xl"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-7 bg-[#002f5a]/48 p-6">
                <div className="relative flex size-40 items-center justify-center">
                  <span className="absolute inset-0 animate-ping rounded-full border-2 border-[#65ddf3]/50" />
                  <span className="absolute inset-5 animate-[spin_5s_linear_infinite] rounded-full border-2 border-dashed border-white/65" />
                  <span className="flex size-24 items-center justify-center rounded-full bg-white text-[#006da8] shadow-2xl">
                    <Compass className="size-14 animate-[spin_8s_linear_infinite]" />
                  </span>
                </div>
                <p
                  key={statusMsg}
                  className="animate-in fade-in rounded-full border border-white/35 bg-[#003b70]/90 px-8 py-4 text-center text-2xl font-medium text-white shadow-xl backdrop-blur-md"
                >
                  {statusMsg}
                </p>
              </div>
            </>
          )}

          {phase === 'done' && resultUrl && (
            <img src={resultUrl} alt="Imagen turística generada" className="h-full w-full object-cover" />
          )}

          {phase === 'error' && friendlyError && <GenerationError error={friendlyError} />}
        </div>
      </div>

      {phase === 'generating' && (
        <>
          <Skeleton className="h-16 w-full bg-white/25" />
          <div className="flex items-center justify-center gap-6 rounded-3xl border border-white/30 bg-white/90 p-6">
            <Skeleton className="size-44 shrink-0 rounded-xl" />
            <div className="flex flex-1 flex-col gap-3">
              <Skeleton className="h-8 w-2/3" />
              <Skeleton className="h-6 w-1/2" />
            </div>
          </div>
        </>
      )}

      {phase === 'done' && (
        <Button
          onClick={onDone}
          className="h-16 w-full rounded-full border-2 border-white bg-gradient-to-r from-[#003b70] via-[#006da8] to-[#29b9dd] text-2xl font-kievit-black text-white shadow-xl hover:brightness-110 [&_svg]:size-7"
        >
          <ThumbsUp /> Listo
        </Button>
      )}

      {phase === 'done' && publicUrl && (
        <div className="flex items-center justify-center gap-6 rounded-3xl border border-white/40 bg-white/95 p-6 text-[#003b70] shadow-xl">
          <div className="size-48 shrink-0 rounded-xl bg-white p-3 ring-2 ring-[#36c8e8]/35">
            <QRCodeSVG
              value={`${window.location.origin}/descargar?u=${encodeURIComponent(publicUrl)}`}
              level="M"
              className="h-full w-full"
            />
          </div>
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <p className="text-2xl font-kievit-black tracking-wide">Escaneá para llevártela</p>
            <p className="text-lg text-[#31536c]">Apuntá la cámara de tu celular al QR</p>
            <EmailSendDialog mediaType="image" mediaUrl={publicUrl} />
          </div>
        </div>
      )}

      {phase === 'error' && (
        <Button
          onClick={() => void run()}
          className="h-16 w-full rounded-full border-2 border-white bg-gradient-to-r from-[#003b70] via-[#006da8] to-[#29b9dd] text-2xl font-kievit-black text-white shadow-xl hover:brightness-110 [&_svg]:size-7"
        >
          <RotateCw /> Reintentar
        </Button>
      )}
    </div>
  );
}
