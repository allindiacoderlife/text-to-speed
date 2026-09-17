import React, { useState } from 'react';
import {
  Globe,
  Loader2,
  Copy,
  Check,
  Trash2,
  ChevronDown,
  Volume2,
  Sparkles,
} from 'lucide-react';

const QUICK_PROMPTS = [
  {
    label: '🇺🇸 English',
    locale: 'en-US',
    text: 'Did you know the human voice is one of the most expressive instruments in the world? With just tone, pace, and emotion, a voice can explain complex ideas and tell powerful stories.',
  },
  {
    label: '🇮🇳 Hindi',
    locale: 'hi-IN',
    text: 'नमस्ते! आधुनिक वाक् तकनीक के साथ, आप किसी भी टेक्स्ट को स्वाभाविक मानव आवाज़ में बदल सकते हैं।',
  },
  {
    label: '🇮🇳 Gujarati',
    locale: 'gu-IN',
    text: 'નમસ્તે! આધુનિક ભાષણ ટેકનોલોજી સાથે, તમે કોઈપણ ટેક્સ્ટને સરળતાથી ઓડિયોમાં રૂપાંતરિત કરી શકો છો.',
  },
  {
    label: '🇪🇸 Spanish',
    locale: 'es-ES',
    text: '¡Hola! Con la tecnología de voz moderna, el texto se convierte en audio de forma natural y fluida.',
  },
  {
    label: '🇫🇷 French',
    locale: 'fr-FR',
    text: 'Bonjour! Grâce à la synthèse vocale moderne, vos écrits prennent vie avec une voix naturelle et chaleureuse.',
  },
];

export default function StudioCanvas({
  activeVoice,
  editorText,
  onChangeEditorText,
  onGenerateVoice,
  isGenerating,
  languages = [],
  selectedLocale,
  onSelectLocale,
  isPlaying,
}) {
  const [showLangPicker, setShowLangPicker] = useState(false);
  const [copied, setCopied] = useState(false);

  const charCount = editorText.length;
  const wordCount = editorText.trim() ? editorText.trim().split(/\s+/).length : 0;
  const currentLangObj = languages.find((l) => l.locale === selectedLocale) || {
    name: 'English (United States)',
    locale: 'en-US',
  };

  const handleQuickPrompt = (prompt) => {
    onChangeEditorText(prompt.text);
    if (prompt.locale !== selectedLocale) {
      onSelectLocale(prompt.locale);
    }
  };

  const handleCopy = () => {
    if (!editorText) return;
    navigator.clipboard.writeText(editorText);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleClear = () => {
    onChangeEditorText('');
  };

  return (
    <div className="vox-canvas">
      {/* Studio Active Voice Header */}
      <div className="canvas-voice-bar">
        <div className="canvas-speaker-profile">
          <div className="canvas-speaker-avatar">
            <img
              src={activeVoice.avatar || '/assets/meghan.jpg'}
              alt={activeVoice.displayName}
            />
            {isPlaying && <span className="speaker-playing-pulse" />}
          </div>
          <div className="canvas-speaker-details">
            <div className="canvas-speaker-name-row">
              <h3 className="canvas-speaker-title">{activeVoice.displayName}</h3>
              <span className="canvas-voice-locale-badge">
                {currentLangObj.name?.split('(')[0]?.trim()}
              </span>
            </div>
            <span className="canvas-speaker-subtitle">{activeVoice.tagline}</span>
          </div>
        </div>

        {/* Quick Language Sample Chips */}
        <div className="canvas-quick-chips">
          <span className="quick-chips-label">Samples:</span>
          {QUICK_PROMPTS.map((qp) => (
            <button
              key={qp.locale}
              type="button"
              className={`chip-lang-quick ${selectedLocale === qp.locale ? 'active' : ''}`}
              onClick={() => handleQuickPrompt(qp)}
              title={`Load ${qp.label} sample script`}
            >
              {qp.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Studio Script Editor */}
      <div className="studio-editor-box">
        {/* Editor Toolbar */}
        <div className="editor-top-toolbar">
          <span className="editor-area-title">Script Editor</span>

          <div className="editor-toolbar-actions">
            <button
              type="button"
              className="toolbar-btn"
              onClick={handleCopy}
              disabled={!editorText}
              title="Copy text"
            >
              {copied ? <Check size={13} color="#10b981" /> : <Copy size={13} />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
            <button
              type="button"
              className="toolbar-btn"
              onClick={handleClear}
              disabled={!editorText || isGenerating}
              title="Clear text"
            >
              <Trash2 size={13} />
              <span>Clear</span>
            </button>
          </div>
        </div>

        {/* Text Area */}
        <div className="editor-textarea-wrap">
          <textarea
            className="editor-textarea-full"
            value={editorText}
            onChange={(e) => onChangeEditorText(e.target.value.slice(0, 2000))}
            placeholder="Type or paste any text here to generate natural speech..."
            disabled={isGenerating}
          />
        </div>

        {/* Bottom Bar inside Editor */}
        <div className="editor-bottom-bar">
          <div className="editor-tags-left">
            {/* Active Speaker Pill */}
            <div className="editor-tag-pill">
              <img
                src={activeVoice.avatar || '/assets/jax.jpg'}
                alt="Speaker"
                className="pill-avatar-img"
              />
              <span className="pill-name">{activeVoice.displayName}</span>
            </div>

            {/* Language Selector Pill */}
            <div className="editor-lang-wrap">
              <button
                type="button"
                className="editor-tag-pill clickable"
                onClick={() => setShowLangPicker(!showLangPicker)}
                title="Select language"
              >
                <Globe size={14} />
                <span>{currentLangObj.name?.split('(')[0]?.trim() || 'English'}</span>
                <ChevronDown size={12} style={{ opacity: 0.6 }} />
              </button>

              {showLangPicker && (
                <div className="lang-popover-dropdown">
                  <div className="popover-header">
                    <span>Select Language ({languages.length})</span>
                    <button
                      type="button"
                      className="popover-close-btn"
                      onClick={() => setShowLangPicker(false)}
                    >
                      ✕
                    </button>
                  </div>
                  <div className="popover-scroll">
                    {languages.map((lang) => (
                      <button
                        key={lang.locale}
                        type="button"
                        className={`popover-item ${lang.locale === selectedLocale ? 'active' : ''}`}
                        onClick={() => {
                          onSelectLocale(lang.locale);
                          setShowLangPicker(false);
                        }}
                      >
                        {lang.name} ({lang.locale})
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="editor-actions-right">
            <span className="editor-stat-count">
              {wordCount} words • {charCount} / 2,000 characters
            </span>

            <button
              type="button"
              className="btn-generate-voice"
              onClick={onGenerateVoice}
              disabled={isGenerating || !editorText.trim()}
            >
              {isGenerating ? (
                <>
                  <Loader2 size={16} className="spin-loader" />
                  <span>Synthesizing...</span>
                </>
              ) : (
                <>
                  <Sparkles size={15} />
                  <span>Generate Voice</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
