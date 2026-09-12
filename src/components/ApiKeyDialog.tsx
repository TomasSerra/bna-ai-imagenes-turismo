import { useState } from 'react';
import { ExternalLink, KeyRound } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ApiKeyDialogProps {
  open: boolean;
  onSave: (key: string) => void;
  onClose?: () => void;
  initialKey?: string;
}

export function ApiKeyDialog({ open, onSave, onClose, initialKey = '' }: ApiKeyDialogProps) {
  const [value, setValue] = useState(initialKey);

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!o) onClose?.();
      }}
    >
      <DialogContent hideClose={!onClose} className="max-h-[calc(100dvh-2rem)] gap-5 overflow-y-auto p-5 text-white sm:max-w-2xl sm:gap-6 sm:p-8">
        <DialogHeader className="space-y-3">
          <DialogTitle className="flex items-center gap-2 text-2xl sm:gap-3 sm:text-3xl">
            <KeyRound className="size-7 shrink-0 sm:size-8" />
            Conectá tu cuenta de fal.ai
          </DialogTitle>
          <DialogDescription className="text-base leading-relaxed text-white/80 sm:text-lg">
            Pegá tu API key de fal.ai. Se guarda solo en tu navegador y nunca sale
            de tu equipo.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <Label htmlFor="api-key" className="text-lg sm:text-xl">
            API key
          </Label>
          <Input
            id="api-key"
            type="password"
            autoComplete="off"
            placeholder="fal_..."
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && value.trim()) onSave(value.trim());
            }}
            className="h-12 px-4 py-3 text-lg sm:h-14 sm:text-xl"
          />
          <a
            href="https://fal.ai/dashboard/keys"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-white/80 hover:text-white sm:text-base"
          >
            Obtené una clave en fal.ai/dashboard/keys <ExternalLink className="size-5" />
          </a>
        </div>

        <DialogFooter className="gap-3 sm:space-x-0">
          {onClose && (
            <Button variant="ghost" onClick={onClose} className="h-12 px-6 text-lg sm:h-14 sm:text-xl">
              Cancelar
            </Button>
          )}
          <Button
            disabled={!value.trim()}
            onClick={() => onSave(value.trim())}
            className="h-12 px-6 text-lg sm:h-14 sm:text-xl"
          >
            Guardar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
