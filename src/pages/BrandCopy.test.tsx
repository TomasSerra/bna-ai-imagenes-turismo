import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { HomePage } from '@/pages/HomePage';
import { ImagePage } from '@/pages/ImagePage';

afterEach(() => {
  cleanup();
  window.history.replaceState({}, '', '/');
});

describe('textos de campaña', () => {
  it('muestra Viajá por Argentina en la portada', () => {
    render(<HomePage onStart={vi.fn()} />);

    expect(screen.getByRole('heading', { name: '¡Viajá por Argentina!' })).toBeInTheDocument();
    expect(screen.queryByText(/Descubrí Argentina/i)).not.toBeInTheDocument();
  });

  it('muestra Tu foto soñada en la descarga pública', () => {
    window.history.replaceState({}, '', '/descargar');
    render(<ImagePage />);

    expect(screen.getByRole('heading', { name: 'Tu foto soñada' })).toBeInTheDocument();
    expect(screen.queryByText(/Tu postal argentina/i)).not.toBeInTheDocument();
  });
});
