import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import TextInput from './components/TextInput';
import VoiceSelector from './components/VoiceSelector';
import AudioControls from './components/AudioControls';
import AudioPlayer from './components/AudioPlayer';
import HistoryList from './components/HistoryList';
import Alert from './components/Alert';
import { fetchVoices, generateSpeech, fetchHealth } from './services/api';
import { Wand2, Loader2 } from 'lucide-react';

const STORAGE_KEY = 'voxcraft_speech_history';

export default function App() {
  const [isOnline, setIsOnline] = useState(false);
  const [languages, setLanguages] = useState([]);
  const [voices, setVoices] = useState([]);
  const [selectedLocale, setSelectedLocale] = useState('en-US');
  const [selectedVoice, setSelectedVoice] = useState('en-US-JennyNeural');

  // Input states
  const [text, setText] = useState(
    'Hello! Welcome to VoxCraft, a full-stack text-to-speech application built with React, Node.js, and free neural AI voices.'
  );

  // Audio customization controls
  const [rate, setRate] = useState(1.0);
  const [pitch, setPitch] = useState(0);
  const [volume, setVolume] = useState(100);

  // Execution & playback states
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentAudio, setCurrentAudio] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  // History state
  const [history, setHistory] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Load voices and check backend status on mount
  useEffect(() => {
    let isMounted = true;

    async function init() {
      try {
        const health = await fetchHealth();
        if (isMounted) setIsOnline(health.status === 'ok');

        const voiceData = await fetchVoices();
        if (isMounted && voiceData.success) {
          setLanguages(voiceData.languages);
          setVoices(voiceData.voices);

          // Default to US English or first available
          const defaultLang = voiceData.languages.find((l) => l.locale === 'en-US') || voiceData.languages[0];
          if (defaultLang) {
            setSelectedLocale(defaultLang.locale);
            const matchingVoices = voiceData.voices.filter((v) => v.locale === defaultLang.locale);
            if (matchingVoices.length > 0) {
              setSelectedVoice(matchingVoices[0].id);
            }
          }
        }
      } catch (err) {
        console.error('Initialization error:', err);
        if (isMounted) {
          setIsOnline(false);
          setErrorMessage('Could not connect to Text-to-Speech server. Please verify backend is running on port 5000.');
        }
      }
    }

    init();
    return () => {
      isMounted = false;
    };
  }, []);

  // When locale changes, update selected voice to first voice in that language
  const handleLocaleChange = (locale) => {
    setSelectedLocale(locale);
    const matching = voices.filter((v) => v.locale === locale);
    if (matching.length > 0) {
      setSelectedVoice(matching[0].id);
    }
  };

  // Handle Preset selection
  const handlePresetSelect = (presetText, presetLocale) => {
    setText(presetText);
    if (presetLocale) {
      const exists = languages.some((l) => l.locale === presetLocale);
      if (exists) {
        handleLocaleChange(presetLocale);
      }
    }
  };

  // Reset audio settings
  const handleResetControls = () => {
    setRate(1.0);
    setPitch(0);
    setVolume(100);
  };

  // Generate speech handler
  const handleGenerate = async () => {
    if (!text || text.trim() === '') {
      setErrorMessage('Please enter some text before generating speech.');
      return;
    }

    setErrorMessage(null);
    setIsGenerating(true);

    try {
      const result = await generateSpeech({
        text: text.trim(),
        voice: selectedVoice,
        rate,
        pitch,
        volume,
      });

      if (result.success) {
        setCurrentAudio(result);

        // Add to history
        const updated = [result, ...history.filter((h) => h.fileName !== result.fileName)].slice(0, 15);
        setHistory(updated);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        } catch (e) {
          console.warn('Failed to save to localStorage', e);
        }
      }
    } catch (err) {
      console.error('Generation error:', err);
      setErrorMessage(err.message || 'Speech generation failed. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  // History handlers
  const handleSelectHistoryItem = (item) => {
    setCurrentAudio(item);
    setText(item.text);
    if (item.voice) {
      const voiceObj = voices.find((v) => v.id === item.voice);
      if (voiceObj) {
        setSelectedLocale(voiceObj.locale);
        setSelectedVoice(voiceObj.id);
      }
    }
  };

  const handleDeleteHistoryItem = (fileName) => {
    const updated = history.filter((item) => item.fileName !== fileName);
    setHistory(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const handleClearHistory = () => {
    setHistory([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <div className="app-container">
      <Header isOnline={isOnline} />

      <Alert message={errorMessage} onClose={() => setErrorMessage(null)} />

      <main className="main-grid">
        {/* Left Column: Text Input, Player, History */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <TextInput
            text={text}
            onChange={setText}
            onSelectPreset={handlePresetSelect}
            disabled={isGenerating}
            maxLength={2000}
          />

          {/* Audio Player for generated speech */}
          {currentAudio && <AudioPlayer audioData={currentAudio} />}

          {/* History of past generations */}
          <HistoryList
            items={history}
            onSelect={handleSelectHistoryItem}
            onDelete={handleDeleteHistoryItem}
            onClearAll={handleClearHistory}
          />
        </section>

        {/* Right Column: Voice & Language, Audio Controls, Generate Button */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <VoiceSelector
            languages={languages}
            voices={voices}
            selectedLocale={selectedLocale}
            selectedVoice={selectedVoice}
            onSelectLocale={handleLocaleChange}
            onSelectVoice={setSelectedVoice}
            loading={!isOnline && voices.length === 0}
          />

          <AudioControls
            rate={rate}
            pitch={pitch}
            volume={volume}
            onChangeRate={setRate}
            onChangePitch={setPitch}
            onChangeVolume={setVolume}
            onReset={handleResetControls}
            disabled={isGenerating}
          />

          <button
            type="button"
            className="btn-generate"
            onClick={handleGenerate}
            disabled={isGenerating || !text.trim()}
          >
            {isGenerating ? (
              <>
                <Loader2 size={20} className="spin-loader" />
                <span>Synthesizing Audio...</span>
              </>
            ) : (
              <>
                <Wand2 size={20} />
                <span>Generate Speech</span>
              </>
            )}
          </button>
        </aside>
      </main>
    </div>
  );
}
