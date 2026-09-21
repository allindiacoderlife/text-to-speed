/**
 * API Service for communicating with the Text-to-Speech backend
 */

function getApiBase() {
  const envUrl = import.meta.env.VITE_API_URL;
  let base = envUrl || (import.meta.env.PROD ? 'https://text-to-speed-three.vercel.app/api' : '/api');

  // Strip all trailing slashes to prevent double slash "//" 308 redirects on Vercel
  base = base.trim().replace(/\/+$/, '');

  // If provided domain doesn't end with /api, ensure /api is included
  if (!base.endsWith('/api') && base.startsWith('http')) {
    base = `${base}/api`;
  }

  return base;
}

const API_BASE = getApiBase();

function endpointUrl(path) {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE}${cleanPath}`;
}

export async function fetchHealth() {
  const response = await fetch(endpointUrl('/health'));
  if (!response.ok) {
    throw new Error(`Health check failed: ${response.statusText}`);
  }
  return response.json();
}

export async function fetchVoices() {
  const response = await fetch(endpointUrl('/voices'));
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to fetch voices list');
  }
  return response.json();
}

export async function generateSpeech({
  text,
  voice,
  rate = 1.0,
  pitch = 0,
  volume = 100,
}) {
  const response = await fetch(endpointUrl('/tts'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text,
      voice,
      rate,
      pitch,
      volume,
    }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || 'Failed to generate speech');
  }

  return data;
}
