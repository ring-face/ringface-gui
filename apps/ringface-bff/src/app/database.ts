import { PersonImages, ProcessingResult, RingEvent, TagPersonRequest} from '@ringface/data';
import {MongoClient, Db, connect} from 'mongodb';
import logger  from './logger';

const mongoUrl = buildMongoUrl();
export var db:Db;

const LATEST_IN_COLLECTION = {sort:{$natural:-1}};


connectToDb();



export enum CollectionName {
  ClassificationResult = "ClassificationResult",
  RingEvent = "RingEvent",
  ProcessingResult = "ProcessingResult",
  PersonImages = "PersonImages"
}


function connectToDb() {
  MongoClient.connect(mongoUrl)
    .then((mongoClient) => {
      logger.warn("Database connecting");
      db = mongoClient.db('ringfacedb');
      logger.warn("Database connected");
      ensureConstraints();
    })
    .catch((error) => {
      logger.error('Could not connect to the database. Will retry');
      setTimeout(connectToDb, 2000);
    });
}

function ensureConstraints(){
  db.collection(CollectionName.ProcessingResult).createIndex({"eventName":1}, {unique:true});
  db.collection(CollectionName.RingEvent).createIndex({"videoFileName":1}, {unique:true});
  db.collection(CollectionName.PersonImages).createIndex({"personName":1}, {unique:true});

}

function buildMongoUrl(){
  const dbUrl =  `mongodb://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/ringfacedb`;
  logger.debug(`will connect to db on ${dbUrl.replace(process.env.MONGO_PASSWORD, 'xxxxx')}`);
  return dbUrl;

}


export async function saveToDb(collectionName:CollectionName, obj:any){
  await db.collection(collectionName).insertOne(obj)
}

export async function saveListToDb(collectionName:CollectionName, obj:any[]){
  await db.collection(collectionName).insertMany(obj)
}

export async function loadRingEventsForDay(dayAsyyyymmdd:string) {
  logger.debug(`Loading events from db for ${dayAsyyyymmdd}`);
  const query1 = { date: dayAsyyyymmdd };
  const ringEvents = await db.collection<RingEvent>(CollectionName.RingEvent).find(query1).sort({"eventName": -1}).toArray();
  for (const ringEvent of ringEvents){
    const query2 = {eventName: ringEvent.eventName};
    const processingResult = await db.collection<ProcessingResult>(CollectionName.ProcessingResult).findOne(query2, LATEST_IN_COLLECTION);
    if (processingResult){
      logger.debug(`Add processing result to event ${ringEvent.eventName}`, processingResult);
      ringEvent.processingResult = processingResult;
      ringEvent.status = 'PROCESSED';
    }
  }

  logger.debug(`Returning ${ringEvents.length} events from db for ${dayAsyyyymmdd}`);
  return ringEvents;
}

export async function loadLatestClassificationResult(){

  const classificationResult = await db.collection<any>(CollectionName.ClassificationResult).findOne({}, LATEST_IN_COLLECTION);

  return classificationResult;

}
export async function addToPersonImages(personName: string, imagePaths: string[]) {
  const personImages = await db.collection<PersonImages>(CollectionName.PersonImages).findOne({personName:personName});
  if (! personImages){
    logger.debug(`creating new person ${personName}`);
    await db.collection<PersonImages>(CollectionName.PersonImages).insertOne({personName:personName, imagePaths:imagePaths});
  } else {
    logger.debug(`adding to existing person ${personName}`);
    await db.collection<PersonImages>(CollectionName.PersonImages).updateOne(
      {personName:personName},
      { $addToSet: { imagePaths: { $each: imagePaths }}}
    );
  }
}

/**
 * add the name as recognisedPerson and remove the unknown person
 */
export async function updateProcessingResult(tagPersonRequest: TagPersonRequest) {

  const processingResult = await db.collection<ProcessingResult>(CollectionName.ProcessingResult).findOne({eventName:tagPersonRequest.eventName});

  processingResult.unknownPersons = processingResult.unknownPersons.filter(unknownPerson => unknownPerson.name != tagPersonRequest.unknownPerson.name);
  if(! processingResult.recognisedPersons.includes(tagPersonRequest.newName)){
    processingResult.recognisedPersons.push(tagPersonRequest.newName);
  }
  await db.collection<ProcessingResult>(CollectionName.ProcessingResult).save(processingResult);
  logger.log("updated the ProcessingResult to ", processingResult);
}

export async function loadAllPersonImages() {
  return await db.collection<PersonImages>(CollectionName.PersonImages).find().toArray();
}

