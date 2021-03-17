import {MongoClient, Db} from 'mongodb';

const mongoUrl = buildMongoUrl();
export var db:Db;

export enum CollectionName {
  ClassificationResult = "ClassificationResult",

}
MongoClient.connect(mongoUrl).then(
  mongoClient => {
    db = mongoClient.db("ringfacedb");

    // db.collection("testcollection").insertOne({ a: 1 });
    db.collection('testcollection').find().toArray()
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
