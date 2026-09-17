import React, { useState, useMemo } from 'react';
import {
  Sliders,
  History as HistoryIcon,
  Play,
  Volume2,
  Trash2,
  Download,
  Search,
  RotateCcw,
} from 'lucide-react';

const QUICK_LANGUAGES = [
  { locale: 'en-US', label: 'English', flag: '🇺🇸' },
  { locale: 'hi-IN', label: 'Hindi', flag: '🇮🇳' },
  { locale: 'gu-IN', label: 'Gujarati', flag: '🇮🇳' },
  { locale: 'mr-IN', label: 'Marathi', flag: '🇮🇳' },
  { locale: 'es-ES', label: 'Spanish', flag: '🇪🇸' },
  { locale: 'fr-FR', label: 'French', flag: '🇫🇷' },
  { locale: 'de-DE', label: 'German', flag: '🇩🇪' },
  { locale: 'ja-JP', label: 'Japanese', flag: '🇯🇵' },
];

export default function RightPanel({
  activeVoice,
  onSelectVoiceCard,
  featuredVoices = [],
  speed,
  onChangeSpeed,
  pitch,
  onChangePitch,
  volume,
  onChangeVolume,
  onResetControls,
  history = [],
  onPlayHistory,
  onDeleteHistory,
  allVoices = [],
  onSelectVoiceId,
  languages = [],
  selectedLocale = 'en-US',
  onSelectLocale,
  activeTab = 'settings',
  onTabChange,
  showAllVoices = false,
  onToggleShowAllVoices,
}) {
  const [langSearch, setLangSearch] = useState('');

  // Filtered languages based on search input
  const filteredLanguages = useMemo(() => {
    if (!langSearch.trim()) return languages;
    const query = langSearch.toLowerCase();
    return languages.filter(
      (l) =>
        l.name.toLowerCase().includes(query) ||
        l.locale.toLowerCase().includes(query)
    );
  }, [languages, langSearch]);

  // Voices filtered for selected language
  const localeVoices = useMemo(() => {
    if (!selectedLocale) return allVoices;
    return allVoices.filter((v) => v.locale === selectedLocale);
  }, [allVoices, selectedLocale]);

  return (
    <aside className="vox-rightpanel">
      {/* Top Tabs */}
      <div className="panel-tab-header">
        <button
          type="button"
          className={`panel-tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => onTabChange ? onTabChange('settings') : null}
        >
          <Sliders size={14} />
          <span>Voice & Audio</span>
        </button>
        <button
          type="button"
          className={`panel-tab-btn ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => onTabChange ? onTabChange('history') : null}
        >
          <HistoryIcon size={14} />
          <span>History</span>
          {history.length > 0 && <span className="tab-count-pill">{history.length}</span>}
        </button>
      </div>

      <div className="panel-content-scroll">
        {activeTab === 'settings' ? (
          <>
            {/* Language & Accent Selection */}
            <div className="settings-section">
              <div className="section-label-row">
                <span className="section-label">Language & Accent</span>
                <span className="section-lang-count">
                  {languages.length > 0 ? `${languages.length} languages` : 'Loading...'}
                </span>
              </div>

              {/* Quick Language Chips */}
              <div className="quick-lang-chips">
                {QUICK_LANGUAGES.map((item) => (
                  <button
                    key={item.locale}
                    type="button"
                    className={`quick-chip ${selectedLocale === item.locale ? 'active' : ''}`}
                    onClick={() => onSelectLocale(item.locale)}
                  >
                    <span>{item.flag}</span>
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>

              {/* Language Search & Select Box */}
              <div className="lang-picker-box">
                <div className="lang-search-field">
                  <Search size={13} className="lang-search-icon" />
                  <input
                    type="text"
                    placeholder="Search 140+ languages..."
                    value={langSearch}
                    onChange={(e) => setLangSearch(e.target.value)}
                    className="lang-search-input"
                  />
                </div>

                <select
                  className="vox-select-full lang-dropdown"
                  value={selectedLocale}
                  onChange={(e) => onSelectLocale(e.target.value)}
                >
                  {filteredLanguages.map((lang) => (
                    <option key={lang.locale} value={lang.locale}>
                      {lang.name} ({lang.locale})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Voice Cards */}
            <div className="settings-section">
              <div className="section-label-row">
                <span className="section-label">
                  Voice {selectedLocale !== 'en-US' ? `(${localeVoices.length} available)` : ''}
                </span>
                <button
                  type="button"
                  className="btn-text-link"
                  onClick={() => onToggleShowAllVoices ? onToggleShowAllVoices(!showAllVoices) : null}
                >
                  {showAllVoices ? 'Show featured' : 'Browse all voices'}
                </button>
              </div>

              {/* If on English (US) and not browsing all, show the 3 featured cards */}
              {!showAllVoices && selectedLocale === 'en-US' ? (
                <div className="voice-cards-grid">
                  {featuredVoices.map((voice) => {
                    const isSelected = activeVoice.id === voice.id;
                    return (
                      <div
                        key={voice.id}
                        className={`voice-card-thumb ${isSelected ? 'selected' : ''}`}
                        onClick={() => onSelectVoiceCard(voice)}
                      >
                        <div className="thumb-img-wrapper">
                          <img
                            src={voice.avatar}
                            alt={voice.displayName}
                            className="thumb-img"
                          />
                          <button
                            type="button"
                            className="thumb-play-preview"
                            title="Select this voice"
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectVoiceCard(voice);
                            }}
                          >
                            <Volume2 size={12} />
                          </button>
                        </div>
                        <div className="thumb-card-info">
                          <h4 className="thumb-voice-name">{voice.displayName}</h4>
                          <span className="thumb-voice-sub">{voice.tagline}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                /* Language-specific or All Voices dropdown */
                <div className="all-voices-dropdown-wrap">
                  <select
                    className="vox-select-full"
                    value={activeVoice.id}
                    onChange={(e) => onSelectVoiceId(e.target.value)}
                  >
                    {(showAllVoices ? allVoices : localeVoices).map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.gender === 'Female' ? '👩' : '👨'} {v.name.split('-')[0].trim()} ({v.gender}) - {v.localeName}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Real Audio Customization Sliders */}
            <div className="settings-section">
              <div className="section-label-row">
                <span className="section-label">Audio Customization</span>
                <button
                  type="button"
                  className="btn-text-link"
                  onClick={onResetControls}
                  title="Reset to default audio settings"
                >
                  <RotateCcw size={11} style={{ marginRight: '3px' }} />
                  Reset
                </button>
              </div>

              {/* Speed / Rate */}
              <div className="vox-slider-block">
                <div className="slider-label-row">
                  <span className="slider-label-name">Speed (Rate)</span>
                  <span className="slider-label-val">{speed.toFixed(1)}x</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="2.0"
                  step="0.1"
                  value={speed}
                  onChange={(e) => onChangeSpeed(parseFloat(e.target.value))}
                  className="vox-range-input"
                />
                <div className="slider-endpoints">
                  <span>0.5x Slow</span>
                  <span>1.0x Normal</span>
                  <span>2.0x Fast</span>
                </div>
              </div>

              {/* Pitch / Tone */}
              <div className="vox-slider-block">
                <div className="slider-label-row">
                  <span className="slider-label-name">Pitch (Tone)</span>
                  <span className="slider-label-val">
                    {pitch > 0 ? `+${pitch}Hz` : `${pitch}Hz`}
                  </span>
                </div>
                <input
                  type="range"
                  min="-50"
                  max="50"
                  step="5"
                  value={pitch}
                  onChange={(e) => onChangePitch(parseInt(e.target.value, 10))}
                  className="vox-range-input"
                />
                <div className="slider-endpoints">
                  <span>-50Hz Deep</span>
                  <span>0Hz Default</span>
                  <span>+50Hz High</span>
                </div>
              </div>

              {/* Volume */}
              <div className="vox-slider-block">
                <div className="slider-label-row">
                  <span className="slider-label-name">Volume</span>
                  <span className="slider-label-val">{volume}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  step="5"
                  value={volume}
                  onChange={(e) => onChangeVolume(parseInt(e.target.value, 10))}
                  className="vox-range-input"
                />
                <div className="slider-endpoints">
                  <span>10% Soft</span>
                  <span>100% Max</span>
                </div>
              </div>
            </div>
          </>
        ) : (
          /* History Tab */
          <div className="history-tab-content">
            {history.length === 0 ? (
              <div className="empty-state-panel">
                No generated speeches yet. Convert text on the left to see your history here!
              </div>
            ) : (
              history.map((item) => (
                <div key={item.fileName} className="history-card-item">
                  <p className="history-snippet">"{item.text}"</p>
                  <div className="history-footer">
                    <span className="history-meta-sub">
                      {item.voice?.split('-')[2]?.replace('Neural', '') || item.voice} • {item.charCount} chars
                    </span>
                    <div className="history-btns">
                      <button
                        type="button"
                        className="btn-history-round"
                        onClick={() => onPlayHistory(item)}
                        title="Replay this speech"
                      >
                        <Play size={12} fill="currentColor" />
                      </button>
                      <a
                        href={item.audioUrl}
                        download={item.fileName}
                        className="btn-history-round"
                        title="Download MP3"
                      >
                        <Download size={12} />
                      </a>
                      <button
                        type="button"
                        className="btn-history-round danger"
                        onClick={() => onDeleteHistory(item.fileName)}
                        title="Delete from history"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </aside>
  );
}
