import React, { useState, useEffect, useRef } from 'react';
import TopNav from './components/TopNav';
import Sidebar from './components/Sidebar';
import StudioCanvas from './components/StudioCanvas';
import RightPanel from './components/RightPanel';
import BottomPlayerBar from './components/BottomPlayerBar';
import Alert from './components/Alert';
import { fetchVoices, generateSpeech, fetchHealth } from './services/api';

const STORAGE_KEY = 'voxera_speech_history';

const FEATURED_VOICES = [
  {
    id: 'en-US-GuyNeural',
    displayName: 'Jax',
    tagline: 'Calm & mature',
    avatar: '/assets/jax.jpg',
    gender: 'Male',
    locale: 'en-US',
  },
  {
    id: 'en-US-JennyNeural',
    displayName: 'Meghan',
    tagline: 'Friendly and comforting',
    avatar: '/assets/meghan.jpg',
    gender: 'Female',
    locale: 'en-US',
  },
  {
    id: 'en-US-AriaNeural',
    displayName: 'Aether',
    tagline: 'Rich & expressive',
    avatar: '/assets/aether.jpg',
    gender: 'Female',
    locale: 'en-US',
  },
];

const DEFAULT_EDITOR_TEXT =
  'Did you know the human voice is one of the most expressive instruments in the world? With just tone, pace, and emotion, a voice can explain complex ideas, tell powerful stories, and guide people through an experience.';

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isOnline, setIsOnline] = useState(false);
  const [languages, setLanguages] = useState([]);
  const [allVoices, setAllVoices] = useState([]);

  // Voice Selection
  const [activeVoice, setActiveVoice] = useState(FEATURED_VOICES[1]); // Default to Meghan
  const [selectedLocale, setSelectedLocale] = useState('en-US');

  // Text content
  const [editorText, setEditorText] = useState(DEFAULT_EDITOR_TEXT);

  // Real Audio Controls
  const [speed, setSpeed] = useState(1.0); // 0.5 - 2.0
  const [pitch, setPitch] = useState(0); // -50Hz to +50Hz
  const [volume, setVolume] = useState(100); // 10% - 100%

  // Panel & View States
  const [panelTab, setPanelTab] = useState('settings');
  const [showAllVoices, setShowAllVoices] = useState(false);

  const handleSelectSidebarView = (view) => {
    if (view === 'studio') {
      setPanelTab('settings');
      setShowAllVoices(false);
    } else if (view === 'voices') {
      setPanelTab('settings');
      setShowAllVoices(true);
    } else if (view === 'history') {
      setPanelTab('history');
    }
  };

  const activeSidebarView =
    panelTab === 'history' ? 'history' : showAllVoices ? 'voices' : 'studio';

  // Generation & Audio Playback State
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [currentAudio, setCurrentAudio] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const audioRef = useRef(null);

  // History State
  const [history, setHistory] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Check health and load voices
  useEffect(() => {
    let mounted = true;
    async function loadData() {
      try {
        const health = await fetchHealth();
        if (mounted) setIsOnline(health.status === 'ok');

        const voiceRes = await fetchVoices();
        if (mounted && voiceRes.success) {
          setLanguages(voiceRes.languages);
          setAllVoices(voiceRes.voices);
        }
      } catch (err) {
        console.error('Connection failed:', err);
        if (mounted) {
          setIsOnline(false);
          setErrorMessage('Connecting to TTS server on port 5000...');
        }
      }
    }
    loadData();
    return () => {
      mounted = false;
    };
  }, []);

  // Update volume on audio element
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  // Audio Player Event Handlers
  const togglePlay = () => {
    if (!audioRef.current || !currentAudio) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration || 0);
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const handleSeek = (timeSecs) => {
    if (audioRef.current) {
      const validTime = Math.max(0, Math.min(timeSecs, duration));
      audioRef.current.currentTime = validTime;
      setCurrentTime(validTime);
    }
  };

  const handleRewind = () => {
    handleSeek(currentTime - 5);
  };

  const handleForward = () => {
    handleSeek(currentTime + 5);
  };

  const handleResetControls = () => {
    setSpeed(1.0);
    setPitch(0);
    setVolume(100);
  };

  // Generate Voice action
  const handleGenerateVoice = async () => {
    const textToSpeak = editorText.trim();
    if (!textToSpeak) {
      setErrorMessage('Please enter some text to generate speech.');
      return;
    }

    setErrorMessage(null);
    setIsGenerating(true);

    try {
      const result = await generateSpeech({
        text: textToSpeak,
        voice: activeVoice.id,
        rate: speed,
        pitch: pitch,
        volume: volume,
      });

      if (result.success) {
        setCurrentAudio(result);

        // Update history
        const updated = [result, ...history.filter((h) => h.fileName !== result.fileName)].slice(0, 20);
        setHistory(updated);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        } catch (e) {
          console.warn('localStorage error', e);
        }

        // Auto-play generated audio
        if (audioRef.current) {
          audioRef.current.src = result.audioUrl;
          audioRef.current.load();
          audioRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
        }
      }
    } catch (err) {
      console.error('Speech generation error:', err);
      setErrorMessage(err.message || 'Generation failed. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSelectLocale = (locale) => {
    setSelectedLocale(locale);
    // Find voices matching this locale
    const matching = allVoices.filter((v) => v.locale === locale);
    if (matching.length > 0) {
      const topVoice = matching[0];
      setActiveVoice({
        id: topVoice.id,
        displayName: topVoice.name.split('-')[0].trim(),
        tagline: `${topVoice.localeName} (${topVoice.gender})`,
        avatar: topVoice.gender === 'Female' ? '/assets/meghan.jpg' : '/assets/jax.jpg',
        gender: topVoice.gender,
        locale: topVoice.locale,
      });
    }
  };

  const handleSelectFeaturedVoice = (v) => {
    setActiveVoice(v);
    setSelectedLocale(v.locale);
  };

  const handleSelectAnyVoiceId = (voiceId) => {
    const found = allVoices.find((v) => v.id === voiceId);
    if (found) {
      setActiveVoice({
        id: found.id,
        displayName: found.name.split('-')[0].trim(),
        tagline: `${found.localeName} (${found.gender})`,
        avatar: found.gender === 'Female' ? '/assets/meghan.jpg' : '/assets/jax.jpg',
        gender: found.gender,
        locale: found.locale,
      });
      setSelectedLocale(found.locale);
    }
  };

  const handlePlayHistoryItem = (item) => {
    setCurrentAudio(item);
    setEditorText(item.text);
    if (audioRef.current) {
      audioRef.current.src = item.audioUrl;
      audioRef.current.load();
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    }
  };

  const handleDeleteHistoryItem = (fileName) => {
    const updated = history.filter((h) => h.fileName !== fileName);
    setHistory(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  return (
    <div className="vox-app-shell">
      {/* Hidden native audio element */}
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleAudioEnded}
      />

      {/* Top Navigation Bar */}
      <TopNav
        sidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        isOnline={isOnline}
      />

      {/* Main Studio Body */}
      <div className="vox-studio-body">
        <Sidebar
          isOpen={sidebarOpen}
          activeView={activeSidebarView}
          historyCount={history.length}
          onSelectView={handleSelectSidebarView}
        />

        <main className="vox-main-content">
          <Alert message={errorMessage} onClose={() => setErrorMessage(null)} />

          <div className="vox-content-columns">
            {/* Center Canvas */}
            <StudioCanvas
              activeVoice={activeVoice}
              editorText={editorText}
              onChangeEditorText={setEditorText}
              onGenerateVoice={handleGenerateVoice}
              isGenerating={isGenerating}
              languages={languages}
              selectedLocale={selectedLocale}
              onSelectLocale={handleSelectLocale}
              isPlaying={isPlaying}
            />

            {/* Right Settings & History Panel */}
            <RightPanel
              activeVoice={activeVoice}
              onSelectVoiceCard={handleSelectFeaturedVoice}
              featuredVoices={FEATURED_VOICES}
              speed={speed}
              onChangeSpeed={setSpeed}
              pitch={pitch}
              onChangePitch={setPitch}
              volume={volume}
              onChangeVolume={setVolume}
              onResetControls={handleResetControls}
              history={history}
              onPlayHistory={handlePlayHistoryItem}
              onDeleteHistory={handleDeleteHistoryItem}
              allVoices={allVoices}
              onSelectVoiceId={handleSelectAnyVoiceId}
              languages={languages}
              selectedLocale={selectedLocale}
              onSelectLocale={handleSelectLocale}
              activeTab={panelTab}
              onTabChange={setPanelTab}
              showAllVoices={showAllVoices}
              onToggleShowAllVoices={setShowAllVoices}
            />
          </div>
        </main>
      </div>

      {/* Persistent Bottom Audio Player Bar */}
      <BottomPlayerBar
        audioData={currentAudio}
        activeVoice={activeVoice}
        isPlaying={isPlaying}
        onTogglePlay={togglePlay}
        currentTime={currentTime}
        duration={duration}
        onSeek={handleSeek}
        onRewind={handleRewind}
        onForward={handleForward}
        volume={volume}
        onChangeVolume={setVolume}
      />
    </div>
  );
}
