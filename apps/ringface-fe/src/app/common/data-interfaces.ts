import { UnprocessedEvent } from '@ringface/data';

export interface DaysData {
  name: string;
  date: Date;
  events: UnprocessedEvent[];
}
