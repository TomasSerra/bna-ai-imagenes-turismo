import { afterEach, describe, expect, it, vi } from 'vitest';
import handler from './send-email';

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe('send-email', () => {
  it('usa la nueva terminología en el email sin template', async () => {
    vi.stubEnv('BREVO_API_KEY', 'test-key');
    vi.stubEnv('BREVO_SENDER_EMAIL', 'sender@example.com');
    vi.stubEnv('PUBLIC_BASE_URL', 'https://turismo.example.com');
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(
      new Response(JSON.stringify({ messageId: 'message-1' }), {
        status: 201,
        headers: { 'Content-Type': 'application/json' },
      }),
    );
    vi.stubGlobal('fetch', fetchMock);
    const json = vi.fn();
    const response = {
      status: vi.fn().mockReturnThis(),
      json,
      setHeader: vi.fn(),
    };

    await handler(
      {
        method: 'POST',
        body: {
          email: 'traveler@example.com',
          mediaType: 'image',
          mediaUrl: 'https://images.example.com/result.jpg',
        },
      },
      response,
    );

    const request = fetchMock.mock.calls[0][1];
    const payload = JSON.parse(String(request?.body)) as {
      textContent: string;
      htmlContent: string;
    };
    expect(payload.textContent).toContain('Tu foto soñada está lista');
    expect(payload.htmlContent).toContain('Tu foto soñada');
    expect(payload.textContent).not.toContain('postal');
    expect(response.status).toHaveBeenCalledWith(200);
  });
});
