/**
 * API Service for communicating with the Text-to-Speech backend
 */

const API_BASE = import.meta.env.VITE_API_URL || '/api';

export async function fetchHealth() {
  const response = await fetch(`${API_BASE}/health`);
  if (!response.ok) {
    throw new Error(`Health check failed: ${response.statusText}`);
  }
  return response.json();
}

export async function fetchVoices() {
  const response = await fetch(`${API_BASE}/voices`);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || "Failed to fetch voices list");
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
  const response = await fetch(`${API_BASE}/tts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
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
    throw new Error(data.error || "Failed to generate speech");
  }

  return data;
}
