import { environment } from '../environments/environment';
import { saveToDb, CollectionName } from './database';

import axios from 'axios';



export async function triggerClassification(){

  const backendResponse = await axios.get(`${environment.ringRecogniserBaseUrl}/classifier/run`);
  const data = backendResponse.data;
  console.log("Response from backend /classifier/run", data);

  await saveToDb(CollectionName.ClassificationResult, data);

  return data

}
