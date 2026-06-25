import React from 'react';

export type Theme = 'light' | 'dark' | 'auto';

interface ToolbarProps {
  isRecording: boolean;
  omitMixpanelProperties: boolean;
  isBatched: boolean;
  customAPIHost: string;
  theme: Theme;
  showHelp: boolean;
  onToggleRecording: () => void;
  onClearAll: () => void;
  onToggleProperties: () => void;
  onDownload: () => void;
  onCustomHostChange: (value: string) => void;
  onCustomHostCommit: (value: string) => void;
  onCycleTheme: () => void;
  onToggleHelp: () => void;
}

function BrandLink() {
  return (
    <a
      href="https://github.com/nithincvpoyyil/mixpanel-tools"
      target="_blank"
      rel="noreferrer"
      className="toolbar-brand"
    >
      <img src="./assets/images/logo.png" alt="Mixpanel Tools" className="toolbar-logo" />
      <span>Mixpanel Tools</span>
    </a>
  );
}

function RecordingButton({ isRecording, onClick }: { isRecording: boolean; onClick: () => void }) {
  return (
    <button
      className="toolbar-btn"
      title={isRecording ? 'Pause recording' : 'Start recording'}
      onClick={onClick}
    >
      <span className={`led-dot${isRecording ? ' led-dot--active' : ''}`} />
      {isRecording ? 'Recording' : 'Paused'}
    </button>
  );
}

function ClearButton({ onClick }: { onClick: () => void }) {
  return (
    <button className="toolbar-btn" title="Clear all events" onClick={onClick}>
      <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
        <path
          fillRule="evenodd"
          d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
          clipRule="evenodd"
        />
      </svg>
      Clear
    </button>
  );
}

function PropertiesToggleButton({
  omitMixpanelProperties,
  onClick,
}: {
  omitMixpanelProperties: boolean;
  onClick: () => void;
}) {
  return (
    <button
      className={`toolbar-btn${omitMixpanelProperties ? ' toolbar-btn--active' : ''}`}
      title="Toggle Mixpanel system properties visibility"
      onClick={onClick}
    >
      <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        {omitMixpanelProperties ? (
          <>
            <path
              fillRule="evenodd"
              d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z"
              clipRule="evenodd"
            />
            <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
          </>
        ) : (
          <>
            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
            <path
              fillRule="evenodd"
              d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
              clipRule="evenodd"
            />
          </>
        )}
      </svg>
      {omitMixpanelProperties ? 'Mixpanel Props: Hidden' : 'Mixpanel Props: Shown'}
    </button>
  );
}

function DownloadButton({ onClick }: { onClick: () => void }) {
  return (
    <button className="toolbar-btn" title="Download recorded events as JSON" onClick={onClick}>
      <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path
          fillRule="evenodd"
          d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
          clipRule="evenodd"
        />
      </svg>
      Download
    </button>
  );
}

function CustomHostInput({
  value,
  onChange,
  onCommit,
}: {
  value: string;
  onChange: (value: string) => void;
  onCommit: (value: string) => void;
}) {
  return (
    <div className="toolbar-input-group">
      <input
        type="text"
        className="toolbar-input"
        placeholder="self-hosted URL (e.g. http://url:port)"
        title="Add self-hosted Mixpanel proxy URL (string match, not regex)"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={(e) => onCommit(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && onCommit((e.target as HTMLInputElement).value)}
      />
      <svg className="toolbar-input-icon" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path
          fillRule="evenodd"
          d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
          clipRule="evenodd"
        />
      </svg>
    </div>
  );
}

const THEME_LABELS: Record<Theme, string> = {
  light: 'Light',
  dark: 'Dark',
  auto: 'Auto',
};

const THEME_TITLES: Record<Theme, string> = {
  light: 'Light mode (click for Dark)',
  dark: 'Dark mode (click for Auto)',
  auto: 'Auto (system) mode (click for Light)',
};

function ThemeCycleButton({ theme, onClick }: { theme: Theme; onClick: () => void }) {
  return (
    <button className="toolbar-btn" title={THEME_TITLES[theme]} onClick={onClick}>
      {theme === 'light' && (
        /* Sun */
        <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path
            fillRule="evenodd"
            d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
            clipRule="evenodd"
          />
        </svg>
      )}
      {theme === 'dark' && (
        /* Moon */
        <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
        </svg>
      )}
      {theme === 'auto' && (
        /* Computer / monitor — system preference */
        <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path
            fillRule="evenodd"
            d="M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-2.22l.123.489.804.321A1 1 0 0113 17H7a1 1 0 01-.707-1.707l.804-.321.123-.489H5a2 2 0 01-2-2V5zm5.771 7H5V5h10v7H8.771z"
            clipRule="evenodd"
          />
        </svg>
      )}
      {THEME_LABELS[theme]}
    </button>
  );
}

function HelpButton({ isActive, onClick }: { isActive: boolean; onClick: () => void }) {
  return (
    <button
      className={`toolbar-btn${isActive ? ' toolbar-btn--active' : ''}`}
      title={isActive ? 'Close help' : 'Open help'}
      onClick={onClick}
    >
      <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path
          fillRule="evenodd"
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
          clipRule="evenodd"
        />
      </svg>
      Help
    </button>
  );
}

function BatchBadge() {
  return (
    <span className="toolbar-badge" title="Batch requests are enabled">
      Batch Requests Enabled
    </span>
  );
}

export const Toolbar = React.memo(function Toolbar({
  isRecording,
  omitMixpanelProperties,
  isBatched,
  customAPIHost,
  theme,
  showHelp,
  onToggleRecording,
  onClearAll,
  onToggleProperties,
  onDownload,
  onCustomHostChange,
  onCustomHostCommit,
  onCycleTheme,
  onToggleHelp,
}: ToolbarProps) {
  return (
    <nav className="toolbar">
      <BrandLink />
      <RecordingButton isRecording={isRecording} onClick={onToggleRecording} />
      <ClearButton onClick={onClearAll} />
      <PropertiesToggleButton omitMixpanelProperties={omitMixpanelProperties} onClick={onToggleProperties} />
      <DownloadButton onClick={onDownload} />
      <CustomHostInput value={customAPIHost} onChange={onCustomHostChange} onCommit={onCustomHostCommit} />
      {isBatched && <BatchBadge />}
      <ThemeCycleButton theme={theme} onClick={onCycleTheme} />
      <HelpButton isActive={showHelp} onClick={onToggleHelp} />
    </nav>
  );
});
