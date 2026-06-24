import { MixpanelRequest, ENGAGE_OPERATIONS } from '../types';

interface EventListProps {
  requests: Record<string, MixpanelRequest>;
  selectedKey: string | null;
  onSelect: (key: string) => void;
}

function getEntryLabel(req: MixpanelRequest): string {
  const data = req.data as Record<string, unknown>;
  if (req.type === 'track') {
    return typeof data['event'] === 'string' ? data['event'] : '(unknown event)';
  }
  const op = ENGAGE_OPERATIONS.find((k) => k in data);
  const prefix = req.type === 'groups' ? 'groups' : 'people';
  return op ? `[${prefix}] ${op}` : `[${prefix}]`;
}

export function EventList({ requests, selectedKey, onSelect }: EventListProps) {
  const entries = Object.entries(requests);

  if (entries.length === 0) {
    return (
      <div className="event-list-empty">
        <p>No events recorded yet.</p>
        <p>Navigate to a page that uses Mixpanel to see events here.</p>
      </div>
    );
  }

  return (
    <ul className="event-list">
      {entries.map(([key, req], index) => (
        <li
          key={key}
          className={`event-item${selectedKey === key ? ' event-item--active' : ''}${req.type !== 'track' ? ' event-item--people' : ''}`}
          onClick={() => onSelect(key)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && onSelect(key)}
        >
          <span className="event-index">{index + 1}.</span>
          <span className="event-name">{getEntryLabel(req)}</span>
        </li>
      ))}
    </ul>
  );
}
