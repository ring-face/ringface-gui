
import { IftttEvent, ProcessingResult, RingEvent} from '@ringface/data';
import { downloadEvents } from './downloader-service'
import * as moment from 'moment';
import { processEvent } from './classifier-service';
import axios from 'axios';





/**
 * Processing an ding event involves the following steps
 * pre: IFTTT has triggered this method with the data in the event object
 * - download the video of the event via the connector microservice
 * - run the face recognition on the event via the classifier microservice
 * - trigger IFTTT to deliver a push notification to the smartphone with the name of the recognised person
 */
export async function processIftttEvent(event: IftttEvent){
  const momentDate = moment(event.createdAt, 'MMM DD, YYYY at hh:mmA');

  // "April 11, 2021 at 03:57PM" -> "20210411-135700"
  const expectedEventName = momentDate.subtract(2,'h').format("YYYYMMDD-HHmmss")
  const eventDate = momentDate.subtract(2,'h').format("YYYYMMDD")
  const { doorbellName } = event;

  console.log(`Will download and process IFTTT event ${expectedEventName} from device ${doorbellName}`);

  // loop until new event was downloaded for one minute
  var i = 1;
  function downloadLoop() {
    setTimeout(async function() {
      console.log(`Attempting download of ${expectedEventName} for the ${i} time`);
      const newRingEvents = await downloadEvents(eventDate);
      if (newRingEvents.length > 0) {
        processNewEvents(newRingEvents, expectedEventName);
      } else {
        i++;
        if (i < 10) {           //  max 10 times
          downloadLoop();
        } else {
          console.log("Can not find new event in ring. Giving up.");
        }
      }
    }, 6000)
  }

  setTimeout(downloadLoop, 10000); // wait 10 sec before triggering


}

async function processNewEvents(newRingEvents: RingEvent[], expectedEventName:string) {
  console.log(`downloaded new events ${newRingEvents}`);

  // sync loop to be able to await
  for (let i = 0; i < newRingEvents.length; i++){
    console.log(`Will start recognition on`, newRingEvents[i]);
    const processingResult = await processEvent(newRingEvents[i]);
    console.log("Processing result:" , processingResult);

    pushNotificationIfttt(newRingEvents[i], processingResult, expectedEventName)
  }
}

function pushNotificationIfttt(ringEvent:RingEvent, processingResult: ProcessingResult, expectedEventName: string) {
  if (! process.env.IFTTT_EVENT || ! process.env.IFTTT_KEY){
    console.error("IFTTT_EVENT and IFTTT_KEY env variables are not defined. Will not push event.");
    return;
  }

  const eventMoment = moment(ringEvent.createdAt);
  if (eventMoment.isAfter(moment().subtract(10, 'm'))){
    const url = `https://maker.ifttt.com/trigger/${process.env.IFTTT_EVENT}/with/key/${process.env.IFTTT_KEY}`;

    var body;
    // tagged known
    if (processingResult.recognisedPersons.length > 0){
      body = {
        "value1":processingResult.recognisedPersons.join(" ") + " at your door ",
        "value2":eventMoment.fromNow() // time of the event
      };
    }
    // tagged unknown
    else if (processingResult.unknownPersons.length > 0){
      body = {
        "value1":processingResult.unknownPersons.length + " unknown person at your door ",
        "value2":eventMoment.fromNow() // time of the event
      };
    }
    else {
      body = {
        "value1":"Face not detected ",
        "value2":eventMoment.fromNow() // time of the event
      };
    }


    console.log(`Calling URL: ${url} with`, body);
    axios.post(url, body);
  }
  else {
    console.warn("will not push old event", processingResult);
  }
}


