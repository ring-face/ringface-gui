import { RingEvent } from '@ringface/data';
import {MongoClient, Db} from 'mongodb';

const mongoUrl = buildMongoUrl();
export var db:Db;




export enum CollectionName {
  ClassificationResult = "ClassificationResult",
  RingEvent = "RingEvent",
  ProcessingResult = "ProcessingResult"
}
MongoClient.connect(mongoUrl).then(
  mongoClient => {
    db = mongoClient.db("ringfacedb");

    // db.collection("testcollection").insertOne({ a: 1 });
    db.collection(CollectionName.RingEvent).find().toArray()
    .then(results => {
      console.log(results)
    })
    .catch(error => console.error(error));

    // mongoClient.close();
  }
);

function buildMongoUrl(){
  return `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PW}@${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/ringfacedb`
}


export async function saveToDb(collectionName:CollectionName, obj:any){
  await db.collection(collectionName).insertOne(obj)
}

export async function saveListToDb(collectionName:CollectionName, obj:any[]){
  await db.collection(collectionName).insertMany(obj)
}

export async function loadEventsForDay(dayAsyyyymmdd:string) {
  console.log(`Loading events from db for ${dayAsyyyymmdd}`);
  const query = { date: dayAsyyyymmdd };
  return await db.collection<RingEvent>(CollectionName.RingEvent).find(query).toArray();
}
