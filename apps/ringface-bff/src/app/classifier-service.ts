import { environment } from '../environments/environment';
import { saveToDb, CollectionName } from './database';

import axios from 'axios';
import { ProcessingResult, RingEvent } from '@ringface/data';



export async function triggerClassification(){

  const backendResponse = await axios.get(`${environment.ringRecogniserBaseUrl}/classifier/run`);
  const data = backendResponse.data;
  console.log("Response from backend /classifier/run", data);

  await saveToDb(CollectionName.ClassificationResult, data);

  return data

}

export async function processEvent(event: RingEvent){
  const backendResponse = await axios.post<ProcessingResult>(`${environment.ringRecogniserBaseUrl}/recognition/local-video`, event);
  const processingResult = backendResponse.data;
  console.log("processEvent response from /classifier/run", processingResult);

  await saveToDb(CollectionName.ProcessingResult, processingResult);


  return processingResult;
}


