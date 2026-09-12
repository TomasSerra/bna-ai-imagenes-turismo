import { useEffect, useMemo, useRef, useState } from 'react';
import { ApiKeyDialog } from '@/components/ApiKeyDialog';
import { IdleScreenOverlay } from '@/components/IdleScreenOverlay';
import { selectVariante } from '@/lib/options';
import { CapturePage } from '@/pages/CapturePage';
import { GeneratePage } from '@/pages/GeneratePage';
import { HomePage } from '@/pages/HomePage';
import { ImagePage } from '@/pages/ImagePage';
import type { Opciones, OpcionesGeneracion } from '@/types';

const STORAGE_KEY = 'fal_api_key';
const IMAGE_PATH = '/descargar';

const DEFAULT_OPCIONES: Opciones = {
  destino: 'cataratas',
  estilo: 'pixar',
};

type Page = 'home' | 'capture' | 'generate';

export default function App() {
  if (typeof window !== 'undefined' && window.location.pathname === IMAGE_PATH) {
    return <ImagePage />;
  }
  return <KioskApp />;
}

export function KioskApp() {
  const [apiKey, setApiKey] = useState(() => localStorage.getItem(STORAGE_KEY) ?? '');
  const [keyDialogOpen, setKeyDialogOpen] = useState(false);
  const [photo, setPhoto] = useState<{ base64: string; dataUrl: string } | null>(null);
  const [opciones, setOpciones] = useState<Opciones>(DEFAULT_OPCIONES);
  const [opcionesGeneracion, setOpcionesGeneracion] = useState<OpcionesGeneracion | null>(null);
  const [page, setPage] = useState<Page>('home');
  const lastSecretTapRef = useRef(0);

  useEffect(() => {
    if (!apiKey) setKeyDialogOpen(true);
  }, [apiKey]);

  const canGenerate = useMemo(() => Boolean(apiKey && photo), [apiKey, photo]);

  const resetAndGoHome = () => {
    setPhoto(null);
    setOpciones(DEFAULT_OPCIONES);
    setOpcionesGeneracion(null);
    setPage('home');
  };

  const handleSaveKey = (key: string) => {
    localStorage.setItem(STORAGE_KEY, key);
    setApiKey(key);
    setKeyDialogOpen(false);
  };

  const handleSecretTap = () => {
    const now = Date.now();
    if (now - lastSecretTapRef.current < 600) {
      setKeyDialogOpen(true);
      lastSecretTapRef.current = 0;
      return;
    }
    lastSecretTapRef.current = now;
  };

  const handleGenerate = () => {
    if (!canGenerate) return;
    const variante = selectVariante(opciones.destino);
    setOpcionesGeneracion({ ...opciones, variante: variante.id });
    setPage('generate');
  };

  const handleBackToCapture = () => {
    setOpcionesGeneracion(null);
    setPage('capture');
  };

  return (
    <div className="relative h-dvh w-full overflow-x-hidden overflow-y-auto bg-[url('/bg-game.png')] bg-cover bg-center bg-no-repeat sm:w-dvw sm:overflow-hidden">
      {page !== 'home' && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-0 bg-[linear-gradient(180deg,rgba(0,42,78,0.64),rgba(0,28,58,0.78))]"
        />
      )}

      <ApiKeyDialog
        open={keyDialogOpen}
        onSave={handleSaveKey}
        onClose={apiKey ? () => setKeyDialogOpen(false) : undefined}
        initialKey={apiKey}
      />

      <button
        type="button"
        aria-label="Configuración"
        onClick={handleSecretTap}
        className="absolute right-0 top-0 z-40 size-24 cursor-default bg-transparent opacity-0"
      />

      <main className="relative z-10 min-h-dvh w-full sm:h-full sm:min-h-0">
        {page === 'home' && <HomePage onStart={() => setPage('capture')} />}
        {page === 'capture' && (
          <CapturePage
            photo={photo}
            setPhoto={setPhoto}
            opciones={opciones}
            setOpciones={(next) => {
              setOpciones(next);
              setOpcionesGeneracion(null);
            }}
            canGenerate={canGenerate}
            onGenerate={handleGenerate}
          />
        )}
        {page === 'generate' && photo && opcionesGeneracion && (
          <GeneratePage
            apiKey={apiKey}
            photo={photo}
            opciones={opcionesGeneracion}
            onBack={handleBackToCapture}
            onDone={resetAndGoHome}
          />
        )}
      </main>

      <IdleScreenOverlay />
    </div>
  );
}
