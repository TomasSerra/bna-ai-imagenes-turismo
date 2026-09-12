import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PhotoCapture } from '@/components/PhotoCapture';
import { OptionsForm } from '@/components/OptionsForm';
import type { Opciones } from '@/types';

interface CapturePageProps {
  photo: { base64: string; dataUrl: string } | null;
  setPhoto: (photo: { base64: string; dataUrl: string } | null) => void;
  opciones: Opciones;
  setOpciones: (opciones: Opciones) => void;
  canGenerate: boolean;
  onGenerate: () => void;
}

export function CapturePage({
  photo,
  setPhoto,
  opciones,
  setOpciones,
  canGenerate,
  onGenerate,
}: CapturePageProps) {
  return (
    <div className="flex min-h-dvh w-full flex-col gap-5 overflow-x-hidden px-4 py-5 sm:h-dvh sm:w-dvw sm:gap-[clamp(1.25rem,2vh,2.5rem)] sm:overflow-hidden sm:px-[clamp(1rem,3vw,2rem)] sm:py-[clamp(1.25rem,2.5vh,3rem)]">
      <header className="flex shrink-0 items-center justify-center py-1">
        <img src="/logo-bna.png" alt="Banco Nación" className="h-12 w-auto drop-shadow-md" />
      </header>
      <section className="flex h-[26rem] shrink-0 flex-col sm:h-auto sm:min-h-0 sm:flex-[0.9] sm:shrink">
        <PhotoCapture
          hasPhoto={Boolean(photo)}
          previewUrl={photo?.dataUrl}
          onCapture={setPhoto}
          onReset={() => setPhoto(null)}
        />
      </section>
      <section className="flex flex-col gap-5 sm:min-h-0 sm:flex-[1.2] sm:overflow-hidden">
        <div className="rounded-[2rem] border border-white/30 bg-[#002f5a]/72 p-4 shadow-[0_18px_50px_rgba(0,22,47,0.38)] backdrop-blur-md sm:min-h-0 sm:flex-1 sm:overflow-auto sm:p-5">
          <OptionsForm value={opciones} onChange={setOpciones} />
        </div>
        <div className="h-16 shrink-0 sm:h-20">
          {photo && (
            <Button
              className="h-full w-full rounded-full border-2 border-white bg-gradient-to-r from-[#003b70] via-[#006da8] to-[#29b9dd] text-2xl font-kievit-black text-white shadow-[0_14px_36px_rgba(0,31,64,0.42)] hover:brightness-110 sm:text-3xl [&_svg]:size-7 sm:[&_svg]:size-8"
              disabled={!canGenerate}
              onClick={onGenerate}
            >
              <Sparkles /> Generar imagen
            </Button>
          )}
        </div>
      </section>
    </div>
  );
}
