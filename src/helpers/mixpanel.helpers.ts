import { MixpanelRequestType } from '../types';

const BASE64_REGEX =
  /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;

export function getRequestType(url: string): MixpanelRequestType {
  if (/\/engage/i.test(url)) return 'engage';
  if (/\/groups/i.test(url)) return 'groups';
  return 'track';
}

export function getUrlParams(request: chrome.devtools.network.Request): Record<string, string> {
  return (request.request.queryString ?? []).reduce<Record<string, string>>(
    (acc, { name, value }) => {
      acc[name] = value;
      return acc;
    },
    {}
  );
}

export function getPostDataParam(request: chrome.devtools.network.Request): string {
  const postData = request.request.postData;
  if (!postData) return '';
  // Form-encoded body: params array is populated
  const params = postData.params ?? [];
  const dataParam = params.find((p) => p.name === 'data');
  if (dataParam?.value) return dataParam.value;
  // Raw body: may be form-encoded text ("data=<value>") or bare JSON
  const raw = postData.text ?? '';
  const match = raw.match(/(?:^|&)data=([^&]*)/);
  // Return the raw match value (still URL-encoded) so decodeProperties can handle it uniformly
  return match ? match[1] : raw;
}

export function decodeProperties(encoded: string): unknown {
  const decoded = decodeURIComponent(encoded);
  const str = BASE64_REGEX.test(decoded) ? atob(decoded) : decoded;
  return JSON.parse(str);
}

export function downloadJson(data: unknown, filename: string): void {
  const url =
    'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(data, null, 2));
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
}
