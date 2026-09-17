import React, { useMemo } from 'react';
import { Globe, User, ChevronDown } from 'lucide-react';

export default function VoiceSelector({
  languages = [],
  voices = [],
  selectedLocale,
  selectedVoice,
  onSelectLocale,
  onSelectVoice,
  loading = false,
}) {
  // Filter voices that match the selected locale
  const filteredVoices = useMemo(() => {
    if (!selectedLocale) return voices;
    return voices.filter((v) => v.locale === selectedLocale);
  }, [voices, selectedLocale]);

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">
          <Globe size={18} /> Voice & Language
        </h2>
      </div>

      <div className="controls-grid">
        {/* Language Selection */}
        <div className="form-group">
          <label className="form-label" htmlFor="language-select">
            <span>Language</span>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              {languages.length} available
            </span>
          </label>
          <div className="select-wrapper">
            <select
              id="language-select"
              className="custom-select"
              value={selectedLocale}
              onChange={(e) => onSelectLocale(e.target.value)}
              disabled={loading || languages.length === 0}
            >
              {languages.map((lang) => (
                <option key={lang.locale} value={lang.locale}>
                  {lang.name} ({lang.locale})
                </option>
              ))}
            </select>
            <ChevronDown size={16} className="select-icon" />
          </div>
        </div>

        {/* Voice Selection */}
        <div className="form-group">
          <label className="form-label" htmlFor="voice-select">
            <span>Voice</span>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              {filteredVoices.length} voice{filteredVoices.length === 1 ? '' : 's'}
            </span>
          </label>
          <div className="select-wrapper">
            <select
              id="voice-select"
              className="custom-select"
              value={selectedVoice}
              onChange={(e) => onSelectVoice(e.target.value)}
              disabled={loading || filteredVoices.length === 0}
            >
              {filteredVoices.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.gender === 'Female' ? '👩' : '👨'} {v.name.split('-')[0].trim()} ({v.gender})
                </option>
              ))}
            </select>
            <ChevronDown size={16} className="select-icon" />
          </div>
        </div>
      </div>
    </div>
  );
}
