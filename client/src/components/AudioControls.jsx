import React from 'react';
import { Sliders, Gauge, Music, Volume2, RotateCcw } from 'lucide-react';

export default function AudioControls({
  rate,
  pitch,
  volume,
  onChangeRate,
  onChangePitch,
  onChangeVolume,
  onReset,
  disabled = false,
}) {
  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">
          <Sliders size={18} /> Audio Customization
        </h2>
        <button
          type="button"
          className="btn-icon"
          onClick={onReset}
          disabled={disabled}
          title="Reset to default settings"
        >
          <RotateCcw size={13} />
          <span>Reset</span>
        </button>
      </div>

      <div className="controls-grid">
        {/* Speed / Rate */}
        <div className="slider-container">
          <div className="slider-header">
            <span className="slider-title">
              <Gauge size={14} /> Speed
            </span>
            <span className="slider-val">{Number(rate).toFixed(1)}x</span>
          </div>
          <input
            type="range"
            min="0.5"
            max="2.0"
            step="0.1"
            className="range-input"
            value={rate}
            onChange={(e) => onChangeRate(parseFloat(e.target.value))}
            disabled={disabled}
          />
          <div className="slider-ticks">
            <span>0.5x Slow</span>
            <span>1.0x Normal</span>
            <span>2.0x Fast</span>
          </div>
        </div>

        {/* Pitch */}
        <div className="slider-container">
          <div className="slider-header">
            <span className="slider-title">
              <Music size={14} /> Pitch
            </span>
            <span className="slider-val">
              {pitch > 0 ? `+${pitch}Hz` : `${pitch}Hz`}
            </span>
          </div>
          <input
            type="range"
            min="-50"
            max="50"
            step="5"
            className="range-input"
            value={pitch}
            onChange={(e) => onChangePitch(parseInt(e.target.value, 10))}
            disabled={disabled}
          />
          <div className="slider-ticks">
            <span>-50Hz Deep</span>
            <span>0Hz Default</span>
            <span>+50Hz High</span>
          </div>
        </div>

        {/* Volume */}
        <div className="slider-container">
          <div className="slider-header">
            <span className="slider-title">
              <Volume2 size={14} /> Volume
            </span>
            <span className="slider-val">{volume}%</span>
          </div>
          <input
            type="range"
            min="10"
            max="100"
            step="5"
            className="range-input"
            value={volume}
            onChange={(e) => onChangeVolume(parseInt(e.target.value, 10))}
            disabled={disabled}
          />
          <div className="slider-ticks">
            <span>10% Soft</span>
            <span>100% Full</span>
          </div>
        </div>
      </div>
    </div>
  );
}
