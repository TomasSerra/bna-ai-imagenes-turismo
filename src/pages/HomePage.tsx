import { ArrowRight } from "lucide-react";

interface HomePageProps {
  onStart: () => void;
}

export function HomePage({ onStart }: HomePageProps) {
  return (
    <div className="relative flex h-dvh w-dvw flex-col items-center overflow-hidden bg-[url('/bg-home.png')] bg-cover bg-center bg-no-repeat text-white">
      <div
        aria-hidden
        className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,47,91,0.72)_0%,rgba(0,79,133,0.2)_34%,rgba(0,27,54,0.1)_62%,rgba(0,23,48,0.66)_100%)]"
      />

      <div className="relative z-10 flex w-full flex-1 flex-col items-center px-5 pt-[3dvh] text-center sm:px-8">
        <img
          src="/logo-bna.png"
          alt="Banco Nación"
          className="w-[min(76vw,400px)] drop-shadow-[0_4px_18px_rgba(0,29,61,0.45)] sm:w-[min(72vw,400px)]"
        />
        <h1 className="mt-4 text-center text-[clamp(3.25rem,17vw,4.375rem)] font-kievit-black leading-[0.92] text-white drop-shadow-[0_6px_20px_rgba(0,31,62,0.58)] sm:mt-7 sm:text-7xl">
          ¡Descubrí
          <br />
          Argentina!
        </h1>
        <p className="mt-4 w-full max-w-3xl text-[clamp(1.35rem,6.5vw,1.875rem)] font-medium leading-tight text-white drop-shadow-[0_3px_12px_rgba(0,29,61,0.8)] sm:mt-6 sm:w-[88%] sm:text-4xl">
          Convertite en protagonista de sus destinos más increíbles
        </p>
      </div>

      <div className="relative z-10 flex w-full justify-center px-5 pb-[6dvh] sm:px-8">
        <button
          type="button"
          onClick={onStart}
          className="group flex min-h-20 w-full max-w-2xl items-center justify-center gap-3 rounded-full border-2 border-white bg-white px-8 py-4 text-3xl font-kievit-black tracking-wide text-[#003b70] shadow-[0_18px_50px_rgba(0,28,56,0.42)] transition-transform active:scale-[0.97] sm:min-h-24 sm:w-[82%] sm:gap-4 sm:px-12 sm:py-6 sm:text-4xl"
        >
          EMPEZAR
          <ArrowRight className="size-9 transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </div>
  );
}
