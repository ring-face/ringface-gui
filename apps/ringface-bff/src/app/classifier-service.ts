import { environment } from '../environments/environment';
import { CollectionName } from './database';
import * as database from './database';
import axios from 'axios';
import { ProcessingResult, RingEvent, FitClassifierRequest, PersonImages} from '@ringface/data';
import logger  from './logger';





export async function triggerClassification(){

  const fitClassifierRequest = {
    persons: await database.loadAllPersonImages()
  };

  if (fitClassifierRequest.persons.length > 1){

    logger.debug("Triggering classifier/fit for ", fitClassifierRequest);

    const backendResponse = await axios.post(`http://${process.env.CLASSIFIER_HOST}:5001/classifier/fit`, fitClassifierRequest);
    const data = backendResponse.data;
    logger.debug("Response from backend /classifier/run", data);

    await database.saveToDb(CollectionName.ClassificationResult, data);

    return data
  }
  else {
    logger.debug("Not enough data to trigger the re-classification");
    return Promise.resolve();
  }


}

export async function processEvent(event: RingEvent){
  const backendResponse = await axios.post<ProcessingResult>(`http://${process.env.CLASSIFIER_HOST}:5001/recognition/local-video`, event);
  const processingResult = backendResponse.data;
  logger.debug("processEvent response from /classifier/run", processingResult);

  await database.saveToDb(CollectionName.ProcessingResult, processingResult);


  return processingResult;
}

