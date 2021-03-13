
import * as express from 'express';
import { readdirSync, readFileSync } from 'fs';
import { UnprocessedEvent, DownloadFromRingResponse, ProcessEventResponse } from '@ringface/data'
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
      const unprocessedEvent = JSON.parse(jsonDataString);
      unprocessedEvent.status = "UNPROCESSED";
      return unprocessedEvent;
    }) as UnprocessedEvent[];

    res.send(events);
})
