import { environment } from '../environments/environment';
import { saveListToDb, CollectionName } from './database';
import { RingEvent } from '@ringface/data';

import axios from 'axios';

export async function downloadEvents(day:string) {


  const backendResponse = await axios.get<RingEvent[]>(`${environment.ringConnectorBaseUrl}/connector/download/${day}`);
  const data = backendResponse.data;

  console.log("Response from backend. ", data);

  await saveListToDb(CollectionName.RingEvent, data);

  return data;

}
