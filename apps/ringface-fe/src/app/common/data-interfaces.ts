import { RingEvent } from '@ringface/data';
import { Observable } from 'rxjs';

export interface DaysData {
  name: string;
  date: Date;
  events?: Observable<RingEvent[]>;
}