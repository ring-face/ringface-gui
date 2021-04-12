
import { IftttEvent, RingEvent} from '@ringface/data';
import { downloadEvents } from './downloader-service'
import * as moment from 'moment';
import { processEvent } from './classifier-service';






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
        processNewEvents(newRingEvents);
      } else {
        i++;
        if (i < 10) {           //  max 10 times
          downloadLoop();
        }
      }
    }, 6000)
  }

  setTimeout(downloadLoop, 10000); // wait 10 sec before triggering


}

async function processNewEvents(newRingEvents: RingEvent[]) {
  console.log(`downloaded new events ${newRingEvents}`);

  // sync loop to be able to await
  for (let i = 0; i < newRingEvents.length; i++){
    console.log(`Will start recognition on`, newRingEvents[i]);
    const processingResult = await processEvent(newRingEvents[i]);
    console.log("Processing result:" , processingResult);
  }
}

