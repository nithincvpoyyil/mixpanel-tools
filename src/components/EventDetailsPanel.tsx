import { AppState } from '../types';
import { EventList } from './EventList';
import { PropertyTable } from './PropertyTable';

interface EventDetailsPanelProps {
  count: number;
  requests: AppState['requests'];
  selectedKey: string | null;
  omitMixpanelProperties: boolean;
  onSelect: (key: string) => void;
}

export function EventDetailsPanel({
  count,
  requests,
  selectedKey,
  omitMixpanelProperties,
  onSelect,
}: EventDetailsPanelProps) {
  return (
    <>
      <div className="panel panel--events">
        <h3 className="panel-header">Events ({count})</h3>
        <div className="panel-body">
          <EventList requests={requests} selectedKey={selectedKey} onSelect={onSelect} />
        </div>
      </div>
      <div className="panel panel--properties">
        <h3 className="panel-header">Properties</h3>
        <PropertyTable
          selectedKey={selectedKey}
          requests={requests}
          omitMixpanelProperties={omitMixpanelProperties}
        />
      </div>
    </>
  );
}
