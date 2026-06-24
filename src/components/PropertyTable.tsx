import { useRef, useState, useEffect } from 'react';
import { MixpanelRequest } from '../types';
import { MIXPANEL_PROPERTIES } from '../constants';

interface PropertyTableProps {
  selectedKey: string | null;
  requests: Record<string, MixpanelRequest>;
  omitMixpanelProperties: boolean;
}

export function PropertyTable({
  selectedKey,
  requests,
  omitMixpanelProperties,
}: PropertyTableProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onScroll = () => setShowScrollTop(el.scrollTop > 500);
    el.addEventListener('scroll', onScroll);
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  // Reset scroll position when selection changes
  useEffect(() => {
    containerRef.current?.scrollTo({ top: 0 });
    setShowScrollTop(false);
  }, [selectedKey]);

  if (!selectedKey || !requests[selectedKey]) {
    return (
      <div className="property-table-empty">
        <p>Select an event to view its properties.</p>
      </div>
    );
  }

  const req = requests[selectedKey];
  const data = req.data as Record<string, unknown>;
  const isTrack = req.type === 'track';
  const eventName = isTrack ? (data['event'] as string) : undefined;
  const properties: Record<string, unknown> = isTrack
    ? (data['properties'] as Record<string, unknown>) ?? {}
    : data;

  const PEOPLE_META_KEYS = ['$token', '$distinct_id', '$group_key', '$group_id', '$had_persisted_distinct_id'];

  const visibleEntries = Object.entries(properties).filter(([key]) => {
    if (!isTrack && PEOPLE_META_KEYS.includes(key)) return false;
    if (omitMixpanelProperties && MIXPANEL_PROPERTIES.includes(key)) return false;
    return true;
  });

  const headerLabel = eventName ?? (req.type === 'groups' ? '[groups]' : '[people]');

  return (
    <div className="property-table-wrapper" ref={containerRef}>
      <table className="property-table">
        <thead>
          <tr>
            <th colSpan={2} className="property-table-event-name">
              {headerLabel}
            </th>
          </tr>
          <tr>
            <th>Property</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          {visibleEntries.map(([key, value]) => (
            <tr key={key}>
              <td className="prop-key">{key}</td>
              <td className="prop-value">
                {typeof value === 'object'
                  ? JSON.stringify(value, null, 2)
                  : String(value)}
              </td>
            </tr>
          ))}
          {visibleEntries.length === 0 && (
            <tr>
              <td colSpan={2} className="property-table-empty-row">
                No properties to display.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {showScrollTop && (
        <button
          className="scroll-top-btn"
          title="Scroll to top"
          onClick={() => containerRef.current?.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path
              fillRule="evenodd"
              d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      )}
    </div>
  );
}
