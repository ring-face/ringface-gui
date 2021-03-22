import { PersonImages, ProcessingResult, RingEvent, TagPersonRequest} from '@ringface/data';
import {MongoClient, Db} from 'mongodb';

const mongoUrl = buildMongoUrl();
export var db:Db;

const LATEST_IN_COLLECTION = {sort:{$natural:-1}};






export enum CollectionName {
  ClassificationResult = "ClassificationResult",
  RingEvent = "RingEvent",
  ProcessingResult = "ProcessingResult",
  PersonImages = "PersonImages"
}
MongoClient.connect(mongoUrl)
.then(
  mongoClient => {
    db = mongoClient.db("ringfacedb");

    ensureConstraints();

  }
)
.catch(error => {
  console.error("Could not connect to the database", error);
  process.kill(process.pid, 'SIGTERM')
});

function ensureConstraints(){
  db.collection(CollectionName.ProcessingResult).createIndex({"eventName":1}, {unique:true});
  db.collection(CollectionName.RingEvent).createIndex({"videoFileName":1}, {unique:true});
  db.collection(CollectionName.PersonImages).createIndex({"personName":1}, {unique:true});

}

function buildMongoUrl(){
  return `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PW}@${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/ringfacedb`
}


export async function saveToDb(collectionName:CollectionName, obj:any){
  await db.collection(collectionName).insertOne(obj)
}

export async function saveListToDb(collectionName:CollectionName, obj:any[]){
  await db.collection(collectionName).insertMany(obj)
}

export async function loadRingEventsForDay(dayAsyyyymmdd:string) {
  console.log(`Loading events from db for ${dayAsyyyymmdd}`);
  const query1 = { date: dayAsyyyymmdd };
  const ringEvents = await db.collection<RingEvent>(CollectionName.RingEvent).find(query1).toArray();
  for (const ringEvent of ringEvents){
    const query2 = {eventName: ringEvent.eventName};
    const processingResult = await db.collection<ProcessingResult>(CollectionName.ProcessingResult).findOne(query2, LATEST_IN_COLLECTION);
    if (processingResult){
      console.log(`Add processing result to event ${ringEvent.eventName}`, processingResult);
      ringEvent.processingResult = processingResult;
      ringEvent.status = 'PROCESSED';
    }
  }

  console.log(`Returning ${ringEvents.length} events from db for ${dayAsyyyymmdd}`);
  return ringEvents;
}

export async function loadLatestClassificationResult(){

  const classificationResult = await db.collection<any>(CollectionName.ClassificationResult).findOne({}, LATEST_IN_COLLECTION);

  return classificationResult;

}
export async function addToPersonImages(personName: string, imagePaths: string[]) {
  const personImages = await db.collection<PersonImages>(CollectionName.PersonImages).findOne({personName:personName});
  if (! personImages){
    console.log(`creating new person ${personName}`);
    await db.collection<PersonImages>(CollectionName.PersonImages).insertOne({personName:personName, imagePaths:imagePaths});
  } else {
    console.log(`adding to existing person ${personName}`);
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
  console.log("updated the ProcessingResult to ", processingResult);
}

export async function loadAllPersonImages() {
  return await db.collection<PersonImages>(CollectionName.PersonImages).find().toArray();
}

