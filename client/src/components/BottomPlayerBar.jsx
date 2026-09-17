import React, { useState } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Download,
  FastForward,
  Rewind,
} from 'lucide-react';

const WAVEFORM_HEIGHTS = [
  8, 12, 18, 10, 14, 22, 16, 26, 20, 30, 24, 18, 28, 22, 16, 24, 32, 28,
  18, 26, 22, 14, 20, 28, 34, 26, 20, 28, 22, 16, 24, 30, 22, 18, 24, 16,
  20, 14, 22, 18, 12, 16, 10, 14, 8, 12, 6, 10, 4,
];

export default function BottomPlayerBar({
  audioData,
  activeVoice,
  isPlaying,
  onTogglePlay,
  currentTime,
  duration,
  onSeek,
  onRewind,
  onForward,
  volume,
  onChangeVolume,
}) {
  const [isMuted, setIsMuted] = useState(false);

  const formatTime = (secs) => {
    if (isNaN(secs) || secs < 0) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handleWaveformClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.min(Math.max(clickX / rect.width, 0), 1);
    if (duration > 0) {
      onSeek(ratio * duration);
    }
  };

  return (
    <div className="vox-bottom-player-bar">
      {/* Left: Speaker Identity */}
      <div className="player-left-identity">
        <div className="player-avatar-box">
          <img
            src={activeVoice.avatar || '/assets/meghan.jpg'}
            alt={activeVoice.displayName}
            className="player-avatar-img"
          />
        </div>
        <div className="player-voice-meta">
          <span className="player-voice-name">{activeVoice.displayName}</span>
          <span className="player-voice-tagline">
            {audioData ? `${audioData.wordCount || ''} words generated` : activeVoice.tagline}
          </span>
        </div>
      </div>

      {/* Center: Playback & Waveform */}
      <div className="player-center-controls">
        <div className="player-btn-group">
          <button
            type="button"
            className="player-sub-btn"
            onClick={onRewind}
            disabled={!audioData}
            title="Rewind 5 seconds"
          >
            <Rewind size={15} />
          </button>

          <button
            type="button"
            className="player-play-btn"
            onClick={onTogglePlay}
            disabled={!audioData}
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <Pause size={17} fill="currentColor" />
            ) : (
              <Play size={17} fill="currentColor" style={{ marginLeft: '2px' }} />
            )}
          </button>

          <button
            type="button"
            className="player-sub-btn"
            onClick={onForward}
            disabled={!audioData}
            title="Forward 5 seconds"
          >
            <FastForward size={15} />
          </button>
        </div>

        {/* Timestamp & Waveform */}
        <span className="player-timestamp current">{formatTime(currentTime)}</span>

        <div
          className="player-waveform-track"
          onClick={handleWaveformClick}
          title={audioData ? 'Click to seek position' : 'Generate voice to play'}
        >
          {WAVEFORM_HEIGHTS.map((h, i) => {
            const barProgress = (i / WAVEFORM_HEIGHTS.length) * 100;
            const isFilled = barProgress <= progressPercent;
            return (
              <span
                key={i}
                className={`waveform-bar ${isFilled ? 'filled' : ''} ${isPlaying ? 'animating' : ''}`}
                style={{
                  height: `${h}px`,
                  animationDelay: `${(i % 5) * 0.15}s`,
                }}
              />
            );
          })}
        </div>

        <span className="player-timestamp duration">
          {duration > 0 ? formatTime(duration) : '0:00'}
        </span>
      </div>

      {/* Right: Volume & Download */}
      <div className="player-right-options">
        <button
          type="button"
          className="player-option-btn"
          onClick={() => setIsMuted(!isMuted)}
          title={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? <VolumeX size={16} color="#ef4444" /> : <Volume2 size={16} />}
        </button>

        <div className="player-mini-vol">
          <input
            type="range"
            min="0"
            max="100"
            value={isMuted ? 0 : volume}
            onChange={(e) => {
              onChangeVolume(parseInt(e.target.value, 10));
              if (isMuted) setIsMuted(false);
            }}
            className="mini-volume-slider"
            title={`Volume: ${volume}%`}
          />
        </div>

        {audioData?.audioUrl ? (
          <a
            href={audioData.audioUrl}
            download={audioData.fileName || 'speech-audio.mp3'}
            className="player-option-btn highlight"
            title="Download Audio MP3"
          >
            <Download size={16} />
          </a>
        ) : (
          <button
            type="button"
            className="player-option-btn"
            title="No audio generated yet"
            disabled
          >
            <Download size={16} />
          </button>
        )}
      </div>
    </div>
  );
}
