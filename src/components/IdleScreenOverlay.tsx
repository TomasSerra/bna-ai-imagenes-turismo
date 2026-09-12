import { useEffect, useRef, useState } from 'react';
import { Hand } from 'lucide-react';

const IDLE_MS = 3 * 60 * 1000;
const ACTIVITY_EVENTS = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'wheel'] as const;

export function IdleScreenOverlay() {
  const [visible, setVisible] = useState(false);
  const timeoutRef = useRef<number | null>(null);
  const visibleRef = useRef(visible);
  visibleRef.current = visible;

  useEffect(() => {
    const clearTimer = () => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };

    const scheduleIdle = () => {
      clearTimer();
      timeoutRef.current = window.setTimeout(() => setVisible(true), IDLE_MS);
    };

    const handleActivity = () => {
      if (visibleRef.current) setVisible(false);
      scheduleIdle();
    };

    ACTIVITY_EVENTS.forEach((eventName) => {
      window.addEventListener(eventName, handleActivity, { passive: true, capture: true });
    });
    scheduleIdle();

    return () => {
      clearTimer();
      ACTIVITY_EVENTS.forEach((eventName) => {
        window.removeEventListener(eventName, handleActivity, { capture: true } as EventListenerOptions);
      });
    };
  }, []);

  if (!visible) return null;

  return (
    <button
      type="button"
      aria-label="Continuar experiencia"
      className="fixed inset-0 z-[9999] h-dvh w-dvw overflow-hidden bg-[url('/bg-home.png')] bg-cover bg-center bg-no-repeat text-white"
      onContextMenu={(event) => event.preventDefault()}
    >
      <span className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,47,91,0.72),rgba(0,31,65,0.24)_45%,rgba(0,23,48,0.82))]" />
      <span className="relative flex h-full w-full flex-col items-center justify-between px-8 pb-[8dvh] pt-[4dvh]">
        <img src="/logo-bna.png" alt="Banco Nación" className="w-[min(72vw,400px)] drop-shadow-xl" />
        <span className="flex w-[82%] max-w-2xl items-center justify-center gap-4 rounded-full border-2 border-white bg-white px-10 py-6 text-4xl font-kievit-black text-[#003b70] shadow-2xl">
          <Hand className="size-9" />
          Tocá para comenzar
        </span>
      </span>
    </button>
  );
}
