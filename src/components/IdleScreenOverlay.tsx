import { useEffect, useRef, useState } from 'react';

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
      aria-label="Salir del salvapantallas y continuar la experiencia"
      className="fixed inset-0 z-[9999] h-dvh w-dvw overflow-hidden bg-black"
      onContextMenu={(event) => event.preventDefault()}
    >
      <img
        src="/screen-save.webp"
        alt=""
        className="h-full w-full object-cover"
      />
    </button>
  );
}
