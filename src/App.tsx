import { useAppState } from './hooks/useAppState';
import { useMixpanelListener } from './hooks/useMixpanelListener';
import { Toolbar } from './components/Toolbar';
import { EventDetailsPanel } from './components/EventDetailsPanel';
import { HelpPanel } from './components/HelpPanel';

export default function App() {
  const {
    state,
    theme,
    showHelp,
    handleRequest,
    handleToggleRecording,
    handleClearAll,
    handleToggleProperties,
    handleDownload,
    handleCustomHostChange,
    handleCustomHostCommit,
    handleSelectEvent,
    handleCycleTheme,
    handleToggleHelp,
  } = useAppState();

  useMixpanelListener(handleRequest);

  return (
    <div className="app">
      <Toolbar
        isRecording={state.isRecording}
        omitMixpanelProperties={state.omitMixpanelProperties}
        isBatched={state.isBatched}
        customAPIHost={state.customAPIHost}
        theme={theme}
        showHelp={showHelp}
        onToggleRecording={handleToggleRecording}
        onClearAll={handleClearAll}
        onToggleProperties={handleToggleProperties}
        onDownload={handleDownload}
        onCustomHostChange={handleCustomHostChange}
        onCustomHostCommit={handleCustomHostCommit}
        onCycleTheme={handleCycleTheme}
        onToggleHelp={handleToggleHelp}
      />
      <main className="main-layout">
        {showHelp ? (
          <HelpPanel onClose={handleToggleHelp} />
        ) : (
          <EventDetailsPanel
            count={state.count}
            requests={state.requests}
            selectedKey={state.selectedKey}
            omitMixpanelProperties={state.omitMixpanelProperties}
            onSelect={handleSelectEvent}
          />
        )}
      </main>
    </div>
  );
}
