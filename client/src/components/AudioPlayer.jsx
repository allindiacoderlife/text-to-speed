import React, { useRef, useState, useEffect } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Download,
  CheckCircle2,
  Radio,
} from 'lucide-react';

export default function AudioPlayer({ audioData }) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
      setCurrentTime(0);
      setDuration(0);
      // Auto-play newly generated audio
      audioRef.current.load();
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(() => {
        // Autoplay may be blocked by browser policy until user gesture
        setIsPlaying(false);
      });
    }
  }, [audioData?.audioUrl]);

  if (!audioData) return null;

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
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

  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const handleSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    if (audioRef.current && duration > 0) {
      audioRef.current.currentTime = pos * duration;
      setCurrentTime(pos * duration);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const formatTime = (secs) => {
    if (isNaN(secs) || secs < 0) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;
  const fileSizeKB = audioData.sizeBytes ? (audioData.sizeBytes / 1024).toFixed(1) : null;

  return (
    <div className="card player-card">
      <audio
        ref={audioRef}
        src={audioData.audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
      />

      <div className="player-meta">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="voice-badge">
            <Radio size={13} /> {audioData.voice}
          </span>
          {fileSizeKB && (
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              MP3 • {fileSizeKB} KB
            </span>
          )}
        </div>

        {/* Animated soundwave bars */}
        <div className="soundwave-container" title={isPlaying ? 'Playing' : 'Paused'}>
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className={`wave-bar ${isPlaying ? 'wave-playing' : ''}`}
            />
          ))}
        </div>
      </div>

      {/* Progress seeker */}
      <div className="player-progress-bar" onClick={handleSeek}>
        <div
          className="player-progress-fill"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <div className="player-time-row">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>

      {/* Controls Row */}
      <div className="player-controls-row">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            type="button"
            className="player-main-btn"
            onClick={togglePlay}
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause size={22} fill="currentColor" /> : <Play size={22} fill="currentColor" style={{ marginLeft: '3px' }} />}
          </button>

          <button
            type="button"
            className="btn-icon"
            onClick={toggleMute}
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <VolumeX size={18} color="#ef4444" /> : <Volume2 size={18} />}
          </button>
        </div>

        <div className="player-secondary-group">
          <a
            href={audioData.audioUrl}
            download={audioData.fileName || 'voxcraft-audio.mp3'}
            className="btn-download"
            title="Download generated MP3 file"
          >
            <Download size={16} />
            <span>Download Audio</span>
          </a>
        </div>
      </div>
    </div>
  );
}
