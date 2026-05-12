export interface MixpanelEventData {
  event: string;
  properties: Record<string, unknown>;
}

export interface MixpanelRequest {
  data: MixpanelEventData;
  [key: string]: unknown;
}

export interface AppState {
  requests: Record<string, MixpanelRequest>;
  selectedKey: string | null;
  count: number;
  customAPIHost: string;
  omitMixpanelProperties: boolean;
  isRecording: boolean;
  isBatched: boolean;
}
