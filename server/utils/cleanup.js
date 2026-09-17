import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const AUDIO_DIR = path.join(__dirname, '..', 'public', 'audio');

// Ensure audio directory exists
export const ensureAudioDir = () => {
  if (!fs.existsSync(AUDIO_DIR)) {
    fs.mkdirSync(AUDIO_DIR, { recursive: true });
  }
  return AUDIO_DIR;
};

// Clean audio files older than maxAgeMs (default: 1 hour)
export const cleanupOldAudioFiles = (maxAgeMs = 60 * 60 * 1000) => {
  try {
    ensureAudioDir();
    const now = Date.now();
    const files = fs.readdirSync(AUDIO_DIR);

    for (const file of files) {
      if (file.endsWith('.mp3')) {
        const filePath = path.join(AUDIO_DIR, file);
        const stats = fs.statSync(filePath);
        if (now - stats.mtimeMs > maxAgeMs) {
          fs.unlinkSync(filePath);
          console.log(`[Cleanup] Removed expired audio file: ${file}`);
        }
      }
    }
  } catch (error) {
    console.error('[Cleanup] Error during audio cleanup:', error.message);
  }
};
