export const MIXPANEL_PROPERTIES: string[] = [
  '$os',
  '$browser',
  '$referrer',
  '$referring_domain',
  '$current_url',
  '$browser_version',
  '$screen_height',
  '$screen_width',
  'mp_lib',
  '$lib_version',
  'distinct_id',
  '$initial_referrer',
  '$initial_referring_domain',
  'token',
  '$duration',
  '$__c',
  '$user_id',
  '$insert_id',
  '$device_id',
  '$anon_distinct_id',
];

// Matches Mixpanel API endpoints including EU, IPv6, and JS SDK variants
export const MIXPANEL_API_PATTERN =
  /\/\/(ipv6-)?(api)(-js)?(-eu)?\.mixpanel\.com\/(track|engage)/i;
