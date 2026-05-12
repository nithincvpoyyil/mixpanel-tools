import { useEffect } from 'react';
import { devToolsNetworkListener } from '../utils/devtool.util';

export function useMixpanelListener(
  onRequest: (request: chrome.devtools.network.Request) => void
): void {
  useEffect(() => {
    try {
      devToolsNetworkListener(onRequest);
    } catch (e) {
      console.error('useMixpanelListener:', e);
    }
    // Listener is added once and lives for the panel's lifetime.
    // chrome.devtools.network does not expose a removeListener in the type
    // definitions but the underlying API supports it — we cast to any to clean up.
    return () => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (chrome.devtools.network.onRequestFinished as any).removeListener(
          onRequest
        );
      } catch {
        // ignore cleanup errors in environments without chrome API
      }
    };
  // onRequest reference is stable (wrapped in useCallback in App.tsx)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
