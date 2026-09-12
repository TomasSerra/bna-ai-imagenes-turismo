import { Check, MoveHorizontal } from 'lucide-react';
import { Chip } from '@/components/ui/chip';
import { DESTINOS, ESTILOS } from '@/lib/options';
import type { Opciones } from '@/types';

interface OptionsFormProps {
  value: Opciones;
  onChange: (next: Opciones) => void;
  disabled?: boolean;
}

export function OptionsForm({ value, onChange, disabled }: OptionsFormProps) {
  return (
    <div className="space-y-5">
      <section aria-labelledby="destino-label">
        <div className="mb-3 flex items-end justify-between gap-4">
          <h3 id="destino-label" className="text-xl font-kievit-black leading-none text-white sm:text-2xl">
            Elegí tu destino
          </h3>
          <p className="flex shrink-0 items-center gap-1 text-sm font-medium text-white/75 sm:gap-1.5 sm:text-base">
            <MoveHorizontal aria-hidden className="size-4 sm:size-5" /> Deslizá
            <span className="hidden sm:inline"> para explorar</span>
          </p>
        </div>
        <div
          role="region"
          aria-label="Carrusel de destinos turísticos"
          aria-roledescription="carrusel"
          className="-mx-1 overflow-hidden px-1"
        >
          <div
            role="radiogroup"
            aria-labelledby="destino-label"
            className="flex touch-pan-x snap-x snap-mandatory gap-3 overflow-x-auto overflow-y-hidden pb-3 pr-[12%] scroll-smooth overscroll-x-contain"
          >
            {DESTINOS.map((destino) => {
              const selected = value.destino === destino.id;
              return (
                <button
                  key={destino.id}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  disabled={disabled}
                  onClick={() => onChange({ ...value, destino: destino.id })}
                  className={`group relative w-[46%] min-w-36 max-w-64 shrink-0 snap-start overflow-hidden rounded-2xl border-2 text-left shadow-lg transition-all focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#4ed8f4] disabled:pointer-events-none disabled:opacity-50 sm:w-[31%] sm:min-w-40 ${
                    selected
                      ? 'border-[#4ed8f4] bg-[#006da8] text-white ring-4 ring-[#4ed8f4]/35'
                      : 'border-white/55 bg-white text-[#003b70] hover:border-white'
                  }`}
                >
                  <span className="relative block aspect-square overflow-hidden bg-[radial-gradient(circle_at_30%_20%,#52d8f2_0%,#0c79b7_46%,#003b70_100%)]">
                    <img
                      src={destino.imageSrc}
                      alt=""
                      className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    {selected && (
                      <span className="absolute right-2 top-2 flex size-8 items-center justify-center rounded-full bg-white text-[#006da8] shadow-md">
                        <Check className="size-5 stroke-[3]" />
                      </span>
                    )}
                  </span>
                  <span
                    className={`flex min-h-14 items-center justify-center px-2 py-2 text-center text-base font-kievit-black leading-tight sm:min-h-16 sm:text-lg ${
                      selected ? 'text-white' : 'text-[#003b70]'
                    }`}
                  >
                    {destino.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section aria-labelledby="estilo-label">
        <h3 id="estilo-label" className="mb-3 text-xl font-kievit-black leading-none text-white sm:text-2xl">
          Elegí un estilo
        </h3>
        <div role="radiogroup" aria-labelledby="estilo-label" className="grid grid-cols-2 gap-3">
          {ESTILOS.map((estilo) => (
            <Chip
              key={estilo.id}
              icon={estilo.icon}
              label={estilo.label}
              selected={value.estilo === estilo.id}
              disabled={disabled}
              onClick={() => onChange({ ...value, estilo: estilo.id })}
              className="h-14 w-full justify-center px-2 text-base sm:px-3 sm:text-lg"
            />
          ))}
        </div>
      </section>
    </div>
  );
}
