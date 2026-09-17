import React from 'react';
import { History, Play, Trash2, Clock, Download } from 'lucide-react';

export default function HistoryList({
  items = [],
  onSelect,
  onDelete,
  onClearAll,
}) {
  return (
    <div className="card" style={{ marginTop: '24px' }}>
      <div className="card-header">
        <h2 className="card-title">
          <History size={18} /> Recent Speeches
        </h2>
        {items.length > 0 && (
          <button
            type="button"
            className="btn-icon"
            onClick={onClearAll}
            title="Clear history"
          >
            <Trash2 size={13} />
            <span>Clear</span>
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="empty-history">
          No generated speeches yet. Convert text to speech above to build your history!
        </div>
      ) : (
        <div className="history-container">
          {items.map((item) => (
            <div key={item.fileName} className="history-item">
              <p className="history-text">"{item.text}"</p>
              <div className="history-meta">
                <span>
                  {item.voice.split('-')[2]?.replace('Neural', '') || item.voice} • {item.charCount} chars
                </span>
                <div className="history-actions">
                  <button
                    type="button"
                    className="btn-history-play"
                    onClick={() => onSelect(item)}
                    title="Load and play this speech"
                  >
                    <Play size={12} fill="currentColor" style={{ marginLeft: '1px' }} />
                  </button>
                  <button
                    type="button"
                    className="btn-icon"
                    onClick={() => onDelete(item.fileName)}
                    title="Remove from history"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
