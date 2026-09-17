import React from 'react';
import {
  Volume2,
  Compass,
  History,
  Sparkles,
} from 'lucide-react';

export default function Sidebar({
  isOpen,
  activeView = 'studio',
  onSelectView,
  historyCount = 0,
}) {
  if (!isOpen) return null;

  return (
    <aside className="vox-sidebar">
      {/* Workspace Brand / Header */}
      <div className="workspace-switcher simple">
        <div className="workspace-icon-box">
          <Sparkles size={16} />
        </div>
        <div className="workspace-info">
          <span className="workspace-title">Audio Studio</span>
          <span className="workspace-sub">Open Source Edition</span>
        </div>
      </div>

      <div className="sidebar-nav-scroll">
        <div className="sidebar-section-header">Navigation</div>
        <div className="sidebar-menu-group">
          <button
            type="button"
            className={`sidebar-item ${activeView === 'studio' ? 'active' : ''}`}
            onClick={() => onSelectView('studio')}
            title="Text to Speech Studio"
          >
            <Volume2 size={16} />
            <span>Text to Speech</span>
          </button>
          <button
            type="button"
            className={`sidebar-item ${activeView === 'voices' ? 'active' : ''}`}
            onClick={() => onSelectView('voices')}
            title="Browse all 320+ neural voices"
          >
            <Compass size={16} />
            <span>Browse 320+ Voices</span>
          </button>
          <button
            type="button"
            className={`sidebar-item ${activeView === 'history' ? 'active' : ''}`}
            onClick={() => onSelectView('history')}
            title="View generated speech history"
          >
            <History size={16} />
            <span>Speech History</span>
            {historyCount > 0 && (
              <span className="sidebar-count-badge">{historyCount}</span>
            )}
          </button>
        </div>
      </div>
    </aside>
  );
}
