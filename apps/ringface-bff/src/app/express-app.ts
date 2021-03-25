
import { ProcessingResult, RingEvent, TagPersonRequest, TagPersonResponse } from '@ringface/data';
import { yyyymmdd } from '@ringface/data';
import { Timestamp } from 'bson';

import * as express from 'express';
import { processEvent, triggerClassification } from './classifier-service';
import * as database from './database';
import { downloadEvents } from './downloader-service';

const request = require('request');

export const app = express();

app.use(express.json());


app.get('/api', (req, res) => {
  res.send({ message: 'Welcome to ringface-bff!' });
});

app.get('/api/trigger-classification', async (req, res) => {
  try{
    const data = await triggerClassification();
    res.send(data);
  }
  catch (err){
    console.error(`saving the backend reponse failed`, err);
    res.sendStatus(500);
  }
});


app.get('/api/trigger-download-from-ring/:day', async (req, res) => {
  console.log(`Will download new ring events for ${req.params.day}`);

  try{
    const events = await downloadEvents(req.params.day);
    res.send(events);
  }
  catch (err){
    console.error(err);
    res.status(500).send({error: err});
  }

})

app.get('/api/events/:day', async (req, res) => {
  console.log(`Requesting events for ${req.params.day}`);
  try{
    const events =  await database.loadRingEventsForDay(req.params.day);
    res.send(events);
  } catch (err){
    console.error(err);
    res.status(500).send({error: err});
  }
});

app.post('/api/process-event', async (req, res) => {



  try{
    const event = req.body as RingEvent;

    console.log(`will start recognition on`, event);
    const processingResult = await processEvent(event);
    res.send(processingResult);
  }
  catch (err){
    console.error(`api/process-event failed`, err);
    res.status(500).send({error: err});
  }
});


app.get('/api/images/*', (req, res) => {
  const imagePath = req.path.substring(12);
  console.log(`getting image ${imagePath}`);

  res.sendFile(imagePath, { root: process.env.DATA_DIR });

});

app.get('/api/most-recent-fitting/', async (req, res) => {
  try{
    res.send(await database.loadLatestClassificationResult());
  }
  catch (err){
    console.error(err);
    res.status(500).send({error: err});
  }});


app.post('/api/tag-person', async (req, res) => {
    const tagPersonRequest: TagPersonRequest = req.body;
    console.log('Tagging: ', tagPersonRequest);

    await database.addToPersonImages(tagPersonRequest.newName, tagPersonRequest.unknownPerson.imagePaths)
    await database.updateProcessingResult(tagPersonRequest);

    console.log('Tagging finished: ', tagPersonRequest);
    res.send({message:`Tagged to ${tagPersonRequest.newName}`} as TagPersonResponse);

    triggerClassification();

});


app.use("/api/videos", express.static(process.env.DATA_DIR + 'data/videos'));

app.get('/api/person-images', async (req, res) => {
  try{
    console.log('Loading all person images');

    res.send(await database.loadAllPersonImages());
  }
  catch (err){
    console.error(err);
    res.status(500).send({error: err});
  }}
);

let pollActive:ActivePoll = undefined;
app.get("/api/poll-and-process/today", async (req, res) => {
  if (pollActive){
    res.status(204).send(pollActive);

  }
  else {
    pollActive = {startTime: new Date()};
    const todayAsyyyymmdd = yyyymmdd(pollActive.startTime);
    try{
      console.log(`Polling for new events for ${todayAsyyyymmdd}`);
      pollActive.events = await downloadEvents(todayAsyyyymmdd);
      console.log(`Downloaded ${pollActive.events.length}. Will start processing them sequentially`);
      pollActive.processingResult = [];

      // sync loop to be able to await
      for (let i = 0; i < pollActive.events.length; i++){
        console.log(`Will start recognition on`, pollActive.events[i]);
        pollActive.processingResult.push(await processEvent(pollActive.events[i]));
      }


      console.log(`Finished the poll cycle for ${pollActive.startTime}`);
      res.send(
        pollActive
      );
    }
    catch (err){
      console.error(err);
      res.status(500).send({error: err});
    }
    finally{
      pollActive = undefined;
    }

  }
});

interface ActivePoll{
  processingResult?: ProcessingResult[];
  events?: RingEvent[];
  startTime: Date,

}
