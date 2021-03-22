
import * as express from 'express';
import * as fs from 'fs';
import { RingEvent, DownloadFromRingResponse, ProcessEventResponse, ProcessingResult, FittingResult, TagPersonRequest, PersonImages, TagPersonResponse} from '@ringface/data'
import { environment } from '../environments/environment'
import * as path from 'path';
import * as glob from 'glob';
import { processEvent, triggerClassification } from './classifier-service';
import { downloadEvents } from './downloader-service';
import * as database from './database';

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
  const baseDir = '/Users/csaba/dev_ring/repo/ring-connector/';
  // console.log(`getting image ${imagePath}`);
  res.sendFile(baseDir + imagePath);
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


