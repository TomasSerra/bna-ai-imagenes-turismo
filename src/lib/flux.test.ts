import { afterEach, describe, expect, it, vi } from 'vitest';
import { generateImage } from '@/lib/flux';

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('generateImage', () => {
  it('envía una sola copia de la selfie cuando no hay otra referencia', async () => {
    const fetchMock = vi
      .fn<typeof fetch>()
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ request_id: 'request-1' }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      )
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ status: 'COMPLETED' }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      )
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ images: [{ url: 'https://example.com/result.jpg' }] }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      )
      .mockResolvedValueOnce(
        new Response(new Blob(['generated-image'], { type: 'image/jpeg' }), { status: 200 }),
      );
    vi.stubGlobal('fetch', fetchMock);

    await generateImage({
      apiKey: 'fal_test_key',
      prompt: 'Create a portrait',
      inputImageBase64: 'selfie-base64',
    });

    const submitInit = fetchMock.mock.calls[0][1];
    const submitBody = JSON.parse(String(submitInit?.body)) as { image_urls: string[] };

    expect(submitBody.image_urls).toEqual(['data:image/jpeg;base64,selfie-base64']);
  });
});
