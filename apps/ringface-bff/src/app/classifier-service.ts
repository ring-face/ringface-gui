
import * as request from 'request';
import { environment } from '../environments/environment';



export function triggerClassification(){
  var options = {
    uri: `${environment.ringRecogniserBaseUrl}/classifier/run`,
    method: 'GET'
  };

  request(options, function (error, response, backendResponse) {
    if (!error && response.statusCode == 200) {
      console.log("Response from backend /classifier/run", backendResponse);

    }
  });
}
