
import * as express from 'express';
import { readdirSync, readFileSync } from 'fs';
import { UnprocessedEvent } from '@ringface/data';


const app = express();

app.get('/api', (req, res) => {
  res.send({ message: 'Welcome to ringface-bff!' });
});

app.get('/api/processed-events', (req, res) => {

})

app.get('/api/unprocessed-events', (req, res) => {
  const unprocessedDir = '/Users/csaba/dev_ring/repo/ring-connector/data/events/unprocessed';

  const events = readdirSync(unprocessedDir, { withFileTypes: true })
    .filter(eventDir => eventDir.isDirectory())
    .map(eventDir => {
      const eventDirPath = unprocessedDir + "/" + eventDir.name;
      const fileEnt = readdirSync(eventDirPath, { withFileTypes: true })
        .find(file => file.name.endsWith("json"));
      const eventFilePath = eventDirPath + "/" + fileEnt.name;
      console.log(`reading event from ${eventFilePath}`)
      var jsonDataString = readFileSync(eventFilePath, 'utf8');
      return JSON.parse(jsonDataString);
    }) as UnprocessedEvent[];

    res.send(events);
})

const port = process.env.port || 3333;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});
server.on('error', console.error);
