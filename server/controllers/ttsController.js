import { MsEdgeTTS, OUTPUT_FORMAT } from 'msedge-tts';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { ensureAudioDir } from '../utils/cleanup.js';

let cachedVoices = null;
let lastVoicesFetch = 0;
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Health check endpoint
 */
export const getHealth = (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'Text-to-Speech API (Powered by Edge Neural TTS)',
  });
};

/**
 * Get available voices, categorized by locale and language
 */
export const getVoices = async (req, res) => {
  try {
    const now = Date.now();
    if (!cachedVoices || now - lastVoicesFetch > CACHE_TTL) {
      const tts = new MsEdgeTTS();
      const rawVoices = await tts.getVoices();
      tts.close();

      // Clean and normalize voice objects
      cachedVoices = rawVoices.map((v) => ({
        id: v.ShortName,
        name: v.FriendlyName || v.ShortName,
        shortName: v.ShortName,
        gender: v.Gender,
        locale: v.Locale,
        localeName: v.LocaleName || v.Locale,
        personalities: v.VoiceTag?.VoicePersonalities || [],
      }));

      // Sort by LocaleName, then gender
      cachedVoices.sort((a, b) => a.localeName.localeCompare(b.localeName));
      lastVoicesFetch = now;
    }

    // Extract unique languages for filter UI
    const languages = Array.from(
      new Map(cachedVoices.map((v) => [v.locale, { locale: v.locale, name: v.localeName }])).values()
    );

    res.status(200).json({
      success: true,
      count: cachedVoices.length,
      languages,
      voices: cachedVoices,
    });
  } catch (error) {
    console.error('Error fetching voices:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve voice list',
      details: error.message,
    });
  }
};

/**
 * Generate speech from text
 */
export const generateSpeech = async (req, res) => {
  try {
    const {
      text,
      voice = 'en-US-JennyNeural',
      rate = 1.0,
      pitch = 0,
      volume = 100,
    } = req.body;

    // Validation
    if (!text || typeof text !== 'string' || text.trim() === '') {
      return res.status(400).json({
        success: false,
        error: 'Text is required and cannot be empty.',
      });
    }

    const maxChars = parseInt(process.env.MAX_TEXT_LENGTH || '2000', 10);
    if (text.length > maxChars) {
      return res.status(400).json({
        success: false,
        error: `Text exceeds maximum allowed length of ${maxChars} characters.`,
      });
    }

    const audioDir = ensureAudioDir();
    const fileId = `${Date.now()}-${crypto.randomBytes(4).toString('hex')}`;
    const fileName = `tts-${fileId}.mp3`;
    const filePath = path.join(audioDir, fileName);

    // Format prosody options
    const parsedRate = parseFloat(rate) || 1.0;
    const parsedPitchHz = parseInt(pitch, 10) || 0;
    const pitchStr = parsedPitchHz >= 0 ? `+${parsedPitchHz}Hz` : `${parsedPitchHz}Hz`;
    const parsedVolume = Math.min(Math.max(parseInt(volume, 10) || 100, 0), 100);

    const tts = new MsEdgeTTS();
    await tts.setMetadata(voice, OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3);

    const { audioStream } = tts.toStream(text.trim(), {
      rate: parsedRate,
      pitch: pitchStr,
      volume: parsedVolume,
    });

    // Buffer audio in memory for serverless (Vercel) compatibility
    const chunks = [];
    await new Promise((resolve, reject) => {
      audioStream.on('data', (chunk) => chunks.push(chunk));
      audioStream.on('end', () => {
        tts.close();
        resolve();
      });
      audioStream.on('error', (err) => {
        tts.close();
        reject(err);
      });
    });

    const audioBuffer = Buffer.concat(chunks);
    const base64Audio = `data:audio/mp3;base64,${audioBuffer.toString('base64')}`;

    // Optionally write to disk if running in persistent local development
    if (!process.env.VERCEL) {
      try {
        const audioDir = ensureAudioDir();
        const filePath = path.join(audioDir, fileName);
        fs.writeFileSync(filePath, audioBuffer);
      } catch (e) {
        // Disk write is optional fallback
      }
    }

    return res.status(200).json({
      success: true,
      audioUrl: base64Audio,
      fileName,
      sizeBytes: audioBuffer.length,
      text: text.trim(),
      voice,
      rate: parsedRate,
      pitch: pitchStr,
      charCount: text.trim().length,
      wordCount: text.trim().split(/\s+/).filter(Boolean).length,
      createdAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error generating speech:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to generate speech. Please check your parameters and try again.',
      details: error.message,
    });
  }
};
