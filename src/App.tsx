import { useState, useCallback, useEffect } from 'react';
import { AppState, MixpanelRequest } from './types';
import { MIXPANEL_API_PATTERN } from './constants';
import { useMixpanelListener } from './hooks/useMixpanelListener';
import { Toolbar } from './components/Toolbar';
import { EventList } from './components/EventList';
import { PropertyTable } from './components/PropertyTable';

const STORAGE_KEY = 'SAVED_URL_KEY';

const BASE64_REGEX =
  /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;

const initialState: AppState = {
  requests: {},
  selectedKey: null,
  count: 0,
  customAPIHost: '',
  omitMixpanelProperties: true,
  isRecording: true,
  isBatched: false,
};

function getUrlParams(request: chrome.devtools.network.Request): Record<string, string> {
  return (request.request.queryString ?? []).reduce<Record<string, string>>(
    (acc, { name, value }) => {
      acc[name] = value;
      return acc;
    },
    {}
  );
}

function getPostDataParam(request: chrome.devtools.network.Request): string {
  const params = request.request.postData?.params ?? [];
  const dataParam = params.find((p) => p.name === 'data');
  return dataParam?.value ?? '';
}

function decodeProperties(encoded: string): unknown {
  const decoded = decodeURIComponent(encoded);
  const str = BASE64_REGEX.test(decoded) ? atob(decoded) : decoded;
  return JSON.parse(str);
}

async function getSavedCustomHost(): Promise<string> {
  try {
    const result = await chrome.storage.sync.get(STORAGE_KEY);
    const value = result[STORAGE_KEY];
    return typeof value === 'string' ? value : '';
  } catch {
    return '';
  }
}

async function saveCustomHost(host: string): Promise<void> {
  try {
    await chrome.storage.sync.set({ [STORAGE_KEY]: host });
  } catch {
    // storage unavailable (e.g. during dev outside extension context)
  }
}

function downloadJson(data: unknown, filename: string): void {
  const url =
    'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(data, null, 2));
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

export default function App() {
  const [state, setState] = useState<AppState>(initialState);

  useEffect(() => {
    getSavedCustomHost().then((host) => {
      setState((s) => ({ ...s, customAPIHost: host }));
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
          let newState = { ...prev };

          const addEntry = (parsed: MixpanelRequest['data']): AppState => {
            const count = newState.count + 1;
            const key = `event-${count}`;
            const entry: MixpanelRequest = { ...urlParams, data: parsed };
            return {
              ...newState,
              count,
              requests: { ...newState.requests, [key]: entry },
              selectedKey: newState.selectedKey ?? key,
            };
          };

          if (method === 'GET') {
            const encoded = urlParams['data'] ?? '';
            const properties = decodeProperties(encoded) as MixpanelRequest['data'];
            if (properties?.event) {
              newState = addEntry(properties);
            }
          } else if (method === 'POST') {
            const encoded = getPostDataParam(request);
            const properties = decodeProperties(encoded);

            if (Array.isArray(properties)) {
              newState = { ...newState, isBatched: true };
              for (const item of properties) {
                const typed = item as MixpanelRequest['data'];
                if (typed?.event) {
                  newState = addEntry(typed);
                }
              }
            } else {
              const typed = properties as MixpanelRequest['data'];
              if (typed?.event) {
                newState = addEntry(typed);
              }
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

  useMixpanelListener(handleRequest);

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

  return (
    <div className="app">
      <Toolbar
        isRecording={state.isRecording}
        omitMixpanelProperties={state.omitMixpanelProperties}
        isBatched={state.isBatched}
        customAPIHost={state.customAPIHost}
        onToggleRecording={handleToggleRecording}
        onClearAll={handleClearAll}
        onToggleProperties={handleToggleProperties}
        onDownload={handleDownload}
        onCustomHostChange={handleCustomHostChange}
      />
      <main className="main-layout">
        <div className="panel panel--events">
          <h3 className="panel-header">Events ({state.count})</h3>
          <div className="panel-body">
            <EventList
              requests={state.requests}
              selectedKey={state.selectedKey}
              onSelect={handleSelectEvent}
            />
          </div>
        </div>
        <div className="panel panel--properties">
          <h3 className="panel-header">Properties</h3>
          <PropertyTable
            selectedKey={state.selectedKey}
            requests={state.requests}
            omitMixpanelProperties={state.omitMixpanelProperties}
          />
        </div>
      </main>
    </div>
  );
}
