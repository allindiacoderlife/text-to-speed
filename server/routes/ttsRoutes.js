import express from 'express';
import { getHealth, getVoices, generateSpeech } from '../controllers/ttsController.js';

const router = express.Router();

router.get('/health', getHealth);
router.get('/voices', getVoices);
router.post('/tts', generateSpeech);

export default router;
