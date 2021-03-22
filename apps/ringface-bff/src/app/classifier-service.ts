import { environment } from '../environments/environment';
import { CollectionName } from './database';
import * as database from './database';

import axios from 'axios';
import { ProcessingResult, RingEvent, FitClassifierRequest, PersonImages} from '@ringface/data';





export async function triggerClassification(){

  const fitClassifierRequest = {
    persons: await database.loadAllPersonImages()
  };

  if (fitClassifierRequest.persons.length > 1){

    console.log("Triggering classifier/fit for ", fitClassifierRequest);

    const backendResponse = await axios.post(`${environment.ringRecogniserBaseUrl}/classifier/fit`, fitClassifierRequest);
    const data = backendResponse.data;
    console.log("Response from backend /classifier/run", data);

    await database.saveToDb(CollectionName.ClassificationResult, data);

    return data
  }
  else {
    console.log("Not enough data to trigger the re-classification");
    return Promise.resolve();
  }


}

export async function processEvent(event: RingEvent){
  const backendResponse = await axios.post<ProcessingResult>(`${environment.ringRecogniserBaseUrl}/recognition/local-video`, event);
  const processingResult = backendResponse.data;
  console.log("processEvent response from /classifier/run", processingResult);

  await database.saveToDb(CollectionName.ProcessingResult, processingResult);


  return processingResult;
}

