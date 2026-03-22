export const api = {
  async post<T>(path: string, body: unknown): Promise<T> {
    const res = await fetch(path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const message = await extractErrorMessage(res);
      throw new Error(message);
    }
    return res.json() as Promise<T>;
  },
};

async function extractErrorMessage(res: Response): Promise<string> {
  const text = await res.text().catch(() => '');
  let message = text || String(res.status);

  // attempt to parse the response as JSON and extract .error
  try {
    const json = JSON.parse(text);
    if (json?.error) message = json.error; // API should provide .error property
  } catch {}

  return message;
}
