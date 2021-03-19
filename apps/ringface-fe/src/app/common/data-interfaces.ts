import { RingEvent } from '@ringface/data';
import { Observable } from 'rxjs';

export interface DaysData {
  processingTriggered?: boolean;
  name: string;
  date: Date;
  events?: Observable<RingEvent[]>;
}
