import { StrictMode } from 'react';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { generateImage } from '@/lib/flux';
import { GeneratePage } from '@/pages/GeneratePage';
import type { OpcionesGeneracion } from '@/types';

vi.mock('@/lib/flux', () => ({ generateImage: vi.fn() }));
vi.mock('react-confetti', () => ({ default: () => null }));
vi.mock('qrcode.react', () => ({ QRCodeSVG: () => <svg aria-label="Código QR" /> }));
vi.mock('@/components/EmailSendDialog', () => ({
  EmailSendDialog: () => <button type="button">Enviar por email</button>,
}));

const opciones: OpcionesGeneracion = {
  destino: 'ushuaia',
  estilo: 'pixar',
  variante: 'pinguino',
};

const defaultProps = {
  apiKey: 'fal_test_key',
  photo: { base64: 'selfie-base64', dataUrl: 'data:image/jpeg;base64,selfie-base64' },
  opciones,
  onBack: vi.fn(),
  onDone: vi.fn(),
};

const generateImageMock = vi.mocked(generateImage);

beforeEach(() => {
  Object.defineProperty(URL, 'createObjectURL', {
    configurable: true,
    value: vi.fn(() => 'blob:generated-image'),
  });
  Object.defineProperty(URL, 'revokeObjectURL', {
    configurable: true,
    value: vi.fn(),
  });
  vi.spyOn(console, 'warn').mockImplementation(() => undefined);
  defaultProps.onBack.mockReset();
  defaultProps.onDone.mockReset();
});

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe('GeneratePage', () => {
  it('mantiene carga y resultado dentro de una pantalla fija sin scroll', async () => {
    let resolveGeneration!: (value: {
      blob: Blob;
      url: string;
    }) => void;
    generateImageMock.mockReturnValue(
      new Promise((resolve) => {
        resolveGeneration = resolve;
      }),
    );

    const { container } = render(<GeneratePage {...defaultProps} />);
    const page = container.firstElementChild;

    expect(page).toHaveClass('h-dvh', 'w-dvw', 'overflow-hidden');
    expect(screen.getByText('Creando tu viaje')).toBeInTheDocument();

    resolveGeneration({
      blob: new Blob(['image'], { type: 'image/jpeg' }),
      url: 'https://example.com/generated.jpg',
    });

    expect(await screen.findByText('Tu foto soñada')).toBeInTheDocument();
    expect(page).toHaveClass('h-dvh', 'w-dvw', 'overflow-hidden');
  });

  it('completa la generación y muestra las opciones de entrega', async () => {
    generateImageMock.mockResolvedValue({
      blob: new Blob(['image'], { type: 'image/jpeg' }),
      url: 'https://example.com/generated.jpg',
    });

    render(<GeneratePage {...defaultProps} />);

    expect(await screen.findByText('Escaneá para llevártela')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Imagen turística generada' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Enviar por email' })).toBeInTheDocument();
    expect(generateImageMock).toHaveBeenCalledTimes(1);
  });

  it('evita una segunda solicitud bajo StrictMode', async () => {
    generateImageMock.mockResolvedValue({
      blob: new Blob(['image'], { type: 'image/jpeg' }),
      url: 'https://example.com/generated.jpg',
    });

    render(
      <StrictMode>
        <GeneratePage {...defaultProps} />
      </StrictMode>,
    );

    await screen.findByText('Escaneá para llevártela');
    expect(generateImageMock).toHaveBeenCalledTimes(1);
  });

  it('reintenta un error conservando exactamente el mismo prompt y variante', async () => {
    generateImageMock
      .mockRejectedValueOnce(new Error('fallo temporal'))
      .mockResolvedValueOnce({
        blob: new Blob(['image'], { type: 'image/jpeg' }),
        url: 'https://example.com/generated.jpg',
      });

    render(<GeneratePage {...defaultProps} />);

    fireEvent.click(await screen.findByRole('button', { name: /Reintentar/i }));
    await screen.findByText('Escaneá para llevártela');

    expect(generateImageMock).toHaveBeenCalledTimes(2);
    const firstPrompt = generateImageMock.mock.calls[0][0].prompt;
    const retryPrompt = generateImageMock.mock.calls[1][0].prompt;
    expect(retryPrompt).toBe(firstPrompt);
    expect(firstPrompt).toContain('Magellanic penguin');
    await waitFor(() => expect(screen.queryByText(/fallo temporal/i)).not.toBeInTheDocument());
  });
});
