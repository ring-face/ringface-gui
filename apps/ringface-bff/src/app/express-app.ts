
import * as express from 'express';
import * as fs from 'fs';
import { RingEvent, DownloadFromRingResponse, ProcessEventResponse, ProcessingResult, FittingResult, TagPersonRequest} from '@ringface/data'
import { environment, dirStructure } from '../environments/environment'
import * as path from 'path';
import * as glob from 'glob';

const request = require('request');

export const app = express();

app.use(express.json());


app.get('/api', (req, res) => {
  res.send({ message: 'Welcome to ringface-bff!' });
});



app.post('/api/process-event', (req, res) => {

  console.log(`will start recognition on`, req.body);

  var options = {
    uri: `${environment.ringRecogniserBaseUrl}/recognition/local-video`,
    method: 'POST',
    json: req.body
  };

  request.post(options, function (error, response, backendResponse) {
    if (!error && response.statusCode == 200) {
      console.log("Response from backend. ", backendResponse);
      // const backendResponse = JSON.parse(body);
      const response = {...backendResponse} as ProcessEventResponse;
      res.send(backendResponse);

    }
  });

})

app.get('/api/trigger-download-from-ring/:day', (req, res) => {
  console.log(`Will download new ring events for ${req.params.day}`);

  request(`${environment.ringConnectorBaseUrl}/connector/download/${req.params.day}`, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      console.log("Response from backend. ", body);
      const responseArray = JSON.parse(body) as [];
      const response = { eventCount: responseArray.length } as DownloadFromRingResponse;
      res.send(response);

    }
  });

})

/**
 * day param of format yyyymmdd
 */
app.get('/api/events/:day', (req, res) => {

  console.log(`Requesting data for ${req.params.day}`);

  const events = fs.readdirSync(dirStructure.unprocessedDir, { withFileTypes: true })

    .filter(eventDir => eventDir.isDirectory() && eventDir.name.startsWith(req.params.day))
    .map(eventDir => {
      const eventDirPath = dirStructure.unprocessedDir + "/" + eventDir.name;
      const fileEnt = fs.readdirSync(eventDirPath, { withFileTypes: true })
        .find(file => file.name.endsWith("json"));
      const eventFilePath = eventDirPath + "/" + fileEnt.name;
      console.log(`reading event from ${eventFilePath}`)
      var jsonDataString = fs.readFileSync(eventFilePath, 'utf8');
      const unprocessedEvent = JSON.parse(jsonDataString) as RingEvent;

      const processingResult = findProcessingResult(unprocessedEvent.eventName) as ProcessingResult;
      if(processingResult){
        unprocessedEvent.status = "PROCESSED";
        unprocessedEvent.processingResult = processingResult;
      } else {
        unprocessedEvent.status = "UNPROCESSED";
      }

      return unprocessedEvent;
    }) as RingEvent[];

    res.send(events);
})

app.get('/api/images/*', (req, res) => {
  const imagePath = req.path.substring(12);
  const baseDir = '/Users/csaba/dev_ring/repo/ring-connector/';
  console.log(`getting image ${imagePath}`);
  res.sendFile(baseDir + imagePath);
});

app.get('/api/most-recent-fitting/', (req, res) => {
  res.send(loadMostRecentFitting());
});

function findProcessingResult(eventName:string):ProcessingResult{
  const eventDirPath = dirStructure.processedDir + "/" + eventName;

  if (fs.existsSync(eventDirPath)) {

      var jsonDataString = fs.readFileSync(eventDirPath + "/processingResult.json", 'utf8');
      const processingResult = JSON.parse(jsonDataString) as ProcessingResult;
      return processingResult;

  } else {
      return undefined;
  }

}

function loadMostRecentFitting() {

  const recentFittingJson = glob.sync(dirStructure.classifier + "/*.json").reduce((last, current) => {

      let currentFileDate = new Date(fs.statSync(current).mtime);
      let lastFileDate = new Date(fs.statSync(last).mtime);

      return ( currentFileDate.getTime() > lastFileDate.getTime() ) ? current: last;
  });

  var jsonDataString = fs.readFileSync(recentFittingJson, 'utf8');
  const recentFitting = JSON.parse(jsonDataString) as FittingResult;

  return recentFitting;
}

app.post('/api/tag-person', (req, res) => {
  const tagPersonRequest: TagPersonRequest = req.body;
  console.log('Tagging: ', tagPersonRequest);
  res.send({message:`Tagged to ${tagPersonRequest.newName}`});
});
