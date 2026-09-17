import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import ttsRoutes from './routes/ttsRoutes.js';
import { ensureAudioDir, cleanupOldAudioFiles } from './utils/cleanup.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Ensure public audio storage directory exists
ensureAudioDir();

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
}));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve static audio files
app.use('/audio', express.static(path.join(__dirname, 'public', 'audio')));

// API Routes
app.use('/api', ttsRoutes);

// Root test route
app.get('/', (req, res) => {
  res.json({
    message: 'Text-to-Speech API Server is running',
    endpoints: {
      health: 'GET /api/health',
      voices: 'GET /api/voices',
      generate: 'POST /api/tts',
    },
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, error: 'Endpoint not found' });
});

// Periodic cleanup of audio files (runs every 30 minutes)
cleanupOldAudioFiles();
setInterval(() => {
  cleanupOldAudioFiles();
}, 30 * 60 * 1000);

// Start server
app.listen(PORT, () => {
  console.log(`===========================================`);
  console.log(`🚀 TTS Server running on http://localhost:${PORT}`);
  console.log(`🎙️  Health check: http://localhost:${PORT}/api/health`);
  console.log(`🔊 Voices list:  http://localhost:${PORT}/api/voices`);
  console.log(`===========================================`);
});
