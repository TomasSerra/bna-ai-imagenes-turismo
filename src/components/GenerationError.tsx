import {
  AlertTriangle,
  FileWarning,
  KeyRound,
  ServerCrash,
  ShieldAlert,
  Timer,
  WifiOff,
} from 'lucide-react';
import type { FriendlyError, FriendlyErrorKind } from '@/lib/errors';

const ICONS: Record<FriendlyErrorKind, typeof WifiOff> = {
  connection: WifiOff,
  authentication: KeyRound,
  'rate-limit': Timer,
  input: ShieldAlert,
  timeout: Timer,
  server: ServerCrash,
  response: FileWarning,
  unknown: AlertTriangle,
};

interface GenerationErrorProps {
  error: FriendlyError;
}

/**
 * Card de error del flujo de generación con la identidad visual de BNA.
 * No incluye botón de acción: el botón "Reintentar" vive en cada GeneratePage.
 */
export function GenerationError({ error }: GenerationErrorProps) {
  const Icon = ICONS[error.kind];

  return (
    <div className="flex h-full w-full items-center justify-center p-6">
      <div className="flex w-full max-w-sm flex-col items-center gap-4 rounded-3xl border-2 border-[#66d9ef] bg-white px-8 py-10 text-center shadow-xl">
        <div className="flex size-20 items-center justify-center rounded-full bg-[#dff7fc] text-[#005b91]">
          <Icon className="size-10" />
        </div>
        <h3 className="text-2xl font-kievit-black tracking-wide text-[#003b70]">
          {error.title}
        </h3>
        <p className="text-lg leading-snug text-[#31536c]">{error.description}</p>
        <code className="rounded-md bg-[#dff7fc] px-3 py-1.5 font-mono text-sm font-bold tracking-wide text-[#003b70]">
          {error.code}
        </code>
      </div>
    </div>
  );
}
