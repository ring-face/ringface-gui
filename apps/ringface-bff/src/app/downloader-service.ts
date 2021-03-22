import { environment } from '../environments/environment';
import * as database from './database';
import {CollectionName} from './database';
import { RingEvent } from '@ringface/data';

import axios from 'axios';

export async function downloadEvents(day:string) {


  const downloadedEventsRingIds = await (await database.loadRingEventsForDay(day)).map(ringEvent => ringEvent.ringId);
  const url = `http://${process.env.CONNECTOR_HOST}:5000/connector/download/${day}`;
  console.log(`Calling URL: ${url}`);
  const backendResponse = await axios.post<RingEvent[]>(url, downloadedEventsRingIds);
  const ringEvents = backendResponse.data;

  console.log("Response from backend. ", ringEvents);

  if (ringEvents.length > 0){
    await database.saveListToDb(CollectionName.RingEvent, ringEvents);
  }

  return ringEvents;

}
