import { useState, useCallback, useEffect } from 'react';
import { AppState, MixpanelRequest } from '../types';
import { MIXPANEL_API_PATTERN } from '../constants';
import { Theme } from '../components/Toolbar';
import {
  getRequestType,
  getUrlParams,
  getPostDataParam,
  decodeProperties,
  downloadJson,
} from '../helpers/mixpanel.helpers';
import {
  getSavedCustomHost,
  saveCustomHost,
  getSavedTheme,
  saveTheme,
  THEME_CYCLE,
} from '../helpers/storage.helpers';
import { applyTheme } from '../helpers/theme.helpers';

const initialState: AppState = {
  requests: {},
  selectedKey: null,
  count: 0,
  customAPIHost: '',
  omitMixpanelProperties: true,
  isRecording: true,
  isBatched: false,
};

export function useAppState() {
  const [state, setState] = useState<AppState>(initialState);
  const [theme, setTheme] = useState<Theme>('auto');
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    getSavedCustomHost().then((host) => {
      setState((s) => ({ ...s, customAPIHost: host }));
    });
    getSavedTheme().then((t) => {
      setTheme(t);
      applyTheme(t);
    });
  }, []);

  const isRequestValid = useCallback(
    (request: chrome.devtools.network.Request, customAPIHost: string): boolean => {
      const url = request.request.url;
      if (!url) return false;
      if (MIXPANEL_API_PATTERN.test(url)) return true;
      if (customAPIHost && url.includes(customAPIHost)) return true;
      return false;
    },
    []
  );

  const handleRequest = useCallback(
    (request: chrome.devtools.network.Request) => {
      setState((prev) => {
        if (!prev.isRecording || !isRequestValid(request, prev.customAPIHost)) {
          return prev;
        }

        try {
          const method = request.request.method;
          const urlParams = getUrlParams(request);
          const type = getRequestType(request.request.url);
          let newState = { ...prev };

          const addEntry = (parsed: MixpanelRequest['data']): AppState => {
            const count = newState.count + 1;
            const key = `event-${count}`;
            const entry: MixpanelRequest = { ...urlParams, type, data: parsed };
            return {
              ...newState,
              count,
              requests: { ...newState.requests, [key]: entry },
              selectedKey: newState.selectedKey ?? key,
            };
          };

          const isValidItem = (item: unknown): boolean => {
            if (!item || typeof item !== 'object') return false;
            const obj = item as Record<string, unknown>;
            if (type === 'track') return typeof obj['event'] === 'string';
            return Object.keys(obj).some((k) => k.startsWith('$') || k !== 'token');
          };

          if (method === 'GET') {
            const encoded = urlParams['data'] ?? '';
            const parsed = decodeProperties(encoded) as MixpanelRequest['data'];
            if (isValidItem(parsed)) {
              newState = addEntry(parsed);
            }
          } else if (method === 'POST') {
            const encoded = getPostDataParam(request);
            const parsed = decodeProperties(encoded);

            if (Array.isArray(parsed)) {
              newState = { ...newState, isBatched: true };
              for (const item of parsed) {
                if (isValidItem(item)) {
                  newState = addEntry(item as MixpanelRequest['data']);
                }
              }
            } else if (isValidItem(parsed)) {
              newState = addEntry(parsed as MixpanelRequest['data']);
            }
          }

          return newState;
        } catch (err) {
          console.error('handleRequest error:', err);
          return prev;
        }
      });
    },
    [isRequestValid]
  );

  const handleToggleRecording = useCallback(() => {
    setState((s) => ({ ...s, isRecording: !s.isRecording }));
  }, []);

  const handleClearAll = useCallback(() => {
    setState((s) => ({
      ...s,
      requests: {},
      selectedKey: null,
      count: 0,
      isBatched: false,
    }));
  }, []);

  const handleToggleProperties = useCallback(() => {
    setState((s) => ({ ...s, omitMixpanelProperties: !s.omitMixpanelProperties }));
  }, []);

  const handleDownload = useCallback(() => {
    downloadJson(state.requests, 'mixpanel-events.json');
  }, [state.requests]);

  const handleCustomHostChange = useCallback((value: string) => {
    const host = value.trim().toLowerCase();
    setState((s) => ({ ...s, customAPIHost: host }));
    saveCustomHost(host);
  }, []);

  const handleSelectEvent = useCallback((key: string) => {
    setState((s) => ({ ...s, selectedKey: key }));
  }, []);

  const handleCycleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = THEME_CYCLE[(THEME_CYCLE.indexOf(prev) + 1) % THEME_CYCLE.length];
      applyTheme(next);
      saveTheme(next);
      return next;
    });
  }, []);

  const handleToggleHelp = useCallback(() => {
    setShowHelp((v) => !v);
  }, []);

  return {
    state,
    theme,
    showHelp,
    handleRequest,
    handleToggleRecording,
    handleClearAll,
    handleToggleProperties,
    handleDownload,
    handleCustomHostChange,
    handleSelectEvent,
    handleCycleTheme,
    handleToggleHelp,
  };
}
