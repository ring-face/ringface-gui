import { environment } from '../environments/environment';
import * as database from './database';
import {CollectionName} from './database';
import { RingEvent } from '@ringface/data';

import axios from 'axios';

export async function downloadEvents(day:string) {

  const downloadedEventsRingIds = await (await database.loadRingEventsForDay(day)).map(ringEvent => ringEvent.ringId);
  const backendResponse = await axios.post<RingEvent[]>(`${environment.ringConnectorBaseUrl}/connector/download/${day}`, downloadedEventsRingIds);
  const ringEvents = backendResponse.data;

  console.log("Response from backend. ", ringEvents);

  if (ringEvents.length > 0){
    await database.saveListToDb(CollectionName.RingEvent, ringEvents);
  }

  return ringEvents;

}
