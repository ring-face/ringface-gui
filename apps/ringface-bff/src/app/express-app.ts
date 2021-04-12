
import { IftttEvent, RingEvent, TagPersonRequest, TagPersonResponse, DownloadAndProcessProgress } from '@ringface/data';
import { yyyymmdd } from '@ringface/data';

import * as express from 'express';
import { processEvent, triggerClassification } from './classifier-service';
import { processIftttEvent } from './ifttt-service';
import * as database from './database';
import { downloadEvents } from './downloader-service';
import * as  listEndpoints from 'express-list-endpoints';
import { version } from '../../../../package.json';

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


let todayProgress:DownloadAndProcessProgress = undefined;
app.get("/api/poll-and-process/today", async (req, res) => {
  if (todayProgress){
    res.status(204).send(todayProgress);

  }
  else {
    todayProgress = {startTime: new Date()};
    const todayAsyyyymmdd = yyyymmdd(todayProgress.startTime);
    try{
      downloadAndProcess(todayAsyyyymmdd, todayProgress);


      console.log(`Finished the poll cycle for ${todayProgress.startTime}`);
      res.send(
        todayProgress
      );
    }
    catch (err){
      console.error(err);
      res.status(500).send({error: err});
    }
    finally{
      todayProgress = undefined;
    }

  }
});



let weekProgress:DownloadAndProcessProgress = undefined;
app.get('/api/download-and-process/week', async (req, res) => {

  if (weekProgress){
    res.status(204).send(weekProgress);

  }
  else {
    weekProgress = {startTime: new Date()};
    try{
      console.log(`Started the week download at ${weekProgress.startTime}`);
      res.send(
        weekProgress
      );

      const actDate = new Date();
      for(let i = 0; i < 7; i++) {
        const dayString = yyyymmdd(actDate);

        await downloadAndProcess(dayString, weekProgress);

        actDate.setDate(actDate.getDate() - 1);

      }
    }
    catch (err){
      console.error(err);
    }
    finally{
      weekProgress = undefined;
    }

  }
});

async function downloadAndProcess(dayAsyyyymmdd:string, progressCollector:DownloadAndProcessProgress){
  progressCollector.processedDay = dayAsyyyymmdd;
  console.log(`Fetching new events for ${dayAsyyyymmdd}`);
  progressCollector.events = await downloadEvents(dayAsyyyymmdd);
  console.log(`Downloaded ${progressCollector.events.length}. Will start processing them sequentially`);
  progressCollector.processingResult = [];

  // sync loop to be able to await
  for (let i = 0; i < progressCollector.events.length; i++){
    console.log(`Will start recognition on`, progressCollector.events[i]);
    progressCollector.processingResult.push(await processEvent(progressCollector.events[i]));
  }
}

app.get('/api/download-and-process/week/status', (req, res) => {

  if (weekProgress){
    res.send(weekProgress);
  }
  else {
    res.sendStatus(204);
  }
});

app.post('/api/ifttt/event', (req, res) => {
  try{
    const event = req.body as IftttEvent;

    console.log(`recieved IFTTT event`, event);
    res.sendStatus(200);

    processIftttEvent(event);
  }
  catch (err){
    console.error(`/api/ifttt/event failed`, err);
    res.status(500).send({error: err});
  }
});

console.log(listEndpoints(app));
console.log("Version: ", version);
