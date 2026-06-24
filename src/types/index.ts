export type MixpanelRequestType = 'track' | 'engage' | 'groups';

export interface MixpanelEventData {
  event: string;
  properties: Record<string, unknown>;
}

export interface MixpanelPeopleData {
  $token?: string;
  $distinct_id?: string;
  [operation: string]: unknown;
}

export interface MixpanelGroupData {
  $token?: string;
  $group_key?: string;
  $group_id?: unknown;
  [operation: string]: unknown;
}

export interface MixpanelRequest {
  type: MixpanelRequestType;
  data: MixpanelEventData | MixpanelPeopleData | MixpanelGroupData;
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

// Engage operations that mean people profile updates
export const ENGAGE_OPERATIONS = ['$set', '$set_once', '$unset', '$add', '$append', '$union', '$remove', '$delete'] as const;
export type EngageOperation = typeof ENGAGE_OPERATIONS[number];
