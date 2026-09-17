import React, { useState } from 'react';
import {
  PanelLeftClose,
  PanelLeft,
  Check,
  Share2,
  Sparkles,
} from 'lucide-react';

export default function TopNav({ sidebarOpen, onToggleSidebar, isOnline }) {
  const [copiedShare, setCopiedShare] = useState(false);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2000);
  };

  return (
    <header className="vox-topnav">
      <div className="topnav-left">
        <button
          type="button"
          className="topnav-icon-btn"
          onClick={onToggleSidebar}
          title={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          {sidebarOpen ? <PanelLeftClose size={18} /> : <PanelLeft size={18} />}
        </button>

        <div className="vox-brand">
          <div className="vox-logo-icon">
            <span className="logo-sparkle">✦</span>
          </div>
          <span className="vox-brand-name">Voxera</span>
        </div>

        <div className="breadcrumb-divider">/</div>
        <span className="breadcrumb-current">Text to Speech</span>
      </div>

      <div className="topnav-right">
        {/* Real Status Badge */}
        <div className="credit-pill free-badge" title="100% Free & Open Source TTS">
          <Sparkles size={12} />
          <span className="credit-count">Free & Unlimited</span>
        </div>

        {/* Working Share Button */}
        <button
          type="button"
          className="btn-topnav-pill"
          onClick={handleShare}
          title="Copy studio link"
        >
          {copiedShare ? <Check size={14} color="#10b981" /> : <Share2 size={14} />}
          <span>{copiedShare ? 'Copied Link!' : 'Share'}</span>
        </button>

        {/* Backend Online Status Indicator */}
        <div
          className="user-avatar-wrap"
          title={isOnline ? 'Backend Online (Edge Neural TTS)' : 'Backend Disconnected'}
        >
          <img
            src="/assets/meghan.jpg"
            alt="User"
            className="user-avatar-img"
          />
          <span className={`online-status-dot ${isOnline ? 'online' : 'offline'}`} />
        </div>
      </div>
    </header>
  );
}
