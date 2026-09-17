import React from 'react';
import { Type, Trash2, Sparkles, Copy, Check } from 'lucide-react';

const PRESETS = [
  {
    label: '✨ Welcome Intro',
    text: 'Hello! Welcome to VoxCraft, a modern full-stack text to speech web application built with React and Node.js.',
    locale: 'en-US',
  },
  {
    label: '🇮🇳 Hindi (नमस्ते)',
    text: 'नमस्ते! टेक्स्ट-टू-स्पीच एप्लिकेशन में आपका स्वागत है। यह कृत्रिम बुद्धिमत्ता आधारित स्वाभाविक आवाज़ है।',
    locale: 'hi-IN',
  },
  {
    label: '🇮🇳 Gujarati (નમસ્તે)',
    text: 'નમસ્તે! ટેક્સ્ટ-ટુ-સ્પીચ એપ્લિકેશનમાં આપનું સ્વાગત છે. તમે કોઈપણ ટેક્સ્ટને સરળતાથી ઓડિયોમાં રૂપાંતરિત કરી શકો છો.',
    locale: 'gu-IN',
  },
  {
    label: '🇪🇸 Spanish (Hola)',
    text: '¡Hola! Bienvenido a la aplicación de conversión de texto a voz. Esta es una voz natural generada en tiempo real.',
    locale: 'es-ES',
  },
  {
    label: '🇫🇷 French (Bonjour)',
    text: 'Bonjour! Bienvenue dans le studio de synthèse vocale. Transformez vos textes en fichiers audio de haute qualité.',
    locale: 'fr-FR',
  },
];

export default function TextInput({
  text,
  onChange,
  onSelectPreset,
  maxLength = 2000,
  disabled = false,
}) {
  const [copied, setCopied] = React.useState(false);

  const charCount = text.length;
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const isNearLimit = charCount > maxLength * 0.9;

  const handleClear = () => {
    onChange('');
  };

  const handleCopy = () => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">
          <Type size={18} /> Enter Text
        </h2>
        <div className="textarea-actions">
          <button
            type="button"
            className="btn-icon"
            onClick={handleCopy}
            disabled={!text}
            title="Copy text"
          >
            {copied ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
          <button
            type="button"
            className="btn-icon"
            onClick={handleClear}
            disabled={!text || disabled}
            title="Clear text"
          >
            <Trash2 size={14} />
            <span>Clear</span>
          </button>
        </div>
      </div>

      <div className="textarea-wrapper">
        <textarea
          className="text-input-field"
          placeholder="Type or paste text here to convert into natural speech..."
          value={text}
          onChange={(e) => onChange(e.target.value.slice(0, maxLength))}
          disabled={disabled}
        />
        <div className="textarea-footer">
          <div className="stats-group">
            <span className="stat-item">
              Words: <span className="stat-value">{wordCount}</span>
            </span>
          </div>
          <div className="stats-group">
            <span className={`stat-item ${isNearLimit ? 'stat-warning' : ''}`}>
              Characters: <span className="stat-value">{charCount}</span> / {maxLength}
            </span>
          </div>
        </div>
      </div>

      <div className="preset-section">
        <span className="preset-label">Quick Sample Prompts:</span>
        <div className="preset-chips">
          {PRESETS.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              className="preset-chip"
              onClick={() => onSelectPreset(preset.text, preset.locale)}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
