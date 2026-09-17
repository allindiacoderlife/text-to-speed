import React from 'react';
import { Volume2, Sparkles, Radio } from 'lucide-react';

export default function Header({ isOnline }) {
  return (
    <header className="app-header">
      <div className="logo-brand">
        <div className="logo-icon-wrapper">
          <Volume2 size={24} />
        </div>
        <div>
          <div className="logo-title">
            VoxCraft <span className="logo-badge">Open Source TTS</span>
          </div>
          <div className="logo-subtitle">
            Natural Neural Speech Synthesis with Instant Audio Download
          </div>
        </div>
      </div>

      <div className="header-badges">
        <div className="engine-pill">
          <span className="dot-indicator" style={{ backgroundColor: isOnline ? '#10b981' : '#ef4444' }} />
          <span>{isOnline ? 'Backend Online (Edge Neural)' : 'Connecting...'}</span>
        </div>
      </div>
    </header>
  );
}
