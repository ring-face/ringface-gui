
import * as express from 'express';
import { readdirSync, readFileSync, existsSync } from 'fs';
import { UnprocessedEvent, DownloadFromRingResponse, ProcessEventResponse, ProcessingResult } from '@ringface/data'
import { environment } from './environments/environment'

const request = require('request');

export const app = express();

app.use(express.json());


app.get('/api', (req, res) => {
  res.send({ message: 'Welcome to ringface-bff!' });
});

app.get('/api/processed-events', (req, res) => {

})


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
app.get('/api/unprocessed-events/:day', (req, res) => {
  const unprocessedDir = '/Users/csaba/dev_ring/repo/ring-connector/data/events/unprocessed';

  console.log(`Requesting data for ${req.params.day}`);

  const events = readdirSync(unprocessedDir, { withFileTypes: true })

    .filter(eventDir => eventDir.isDirectory() && eventDir.name.startsWith(req.params.day))
    .map(eventDir => {
      const eventDirPath = unprocessedDir + "/" + eventDir.name;
      const fileEnt = readdirSync(eventDirPath, { withFileTypes: true })
        .find(file => file.name.endsWith("json"));
      const eventFilePath = eventDirPath + "/" + fileEnt.name;
      console.log(`reading event from ${eventFilePath}`)
      var jsonDataString = readFileSync(eventFilePath, 'utf8');
      const unprocessedEvent = JSON.parse(jsonDataString) as UnprocessedEvent;

      const processingResult = findProcessingResult(unprocessedEvent.eventName) as ProcessingResult;
      if(processingResult){
        unprocessedEvent.status = "PROCESSED";
        unprocessedEvent.processingResult = processingResult;
      } else {
        unprocessedEvent.status = "UNPROCESSED";
      }

      return unprocessedEvent;
    }) as UnprocessedEvent[];

    res.send(events);
})

function findProcessingResult(eventName:string):ProcessingResult{
  const processedDir = '/Users/csaba/dev_ring/repo/ring-connector/data/events/processed';
  const eventDirPath = processedDir + "/" + eventName;

if (existsSync(eventDirPath)) {

    var jsonDataString = readFileSync(eventDirPath + "/processingResult.json", 'utf8');
    const processingResult = JSON.parse(jsonDataString) as ProcessingResult;
    return processingResult;

} else {
    return undefined;
}

}
