import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RingEvent,DownloadFromRingResponse, FittingResult } from '@ringface/data';
import { yyyymmdd } from '../common/utils'
import { share } from 'rxjs/operators';



@Injectable({
  providedIn: 'root'
})
export class EventService {

  constructor(
    private httpClient: HttpClient
  ) { }

  public triggerDownloadFromRing(date:Date){
      const dateToDownload = yyyymmdd(date);

      return this.httpClient.get<DownloadFromRingResponse>(`/api/trigger-download-from-ring/${dateToDownload}`);
  }

  public events(date: Date) {
    return this.httpClient.get<RingEvent[]>(`/api/events/${yyyymmdd(date)}`).pipe(share());
  }

  public mostRecentFitting() {
    return this.httpClient.get<FittingResult>('/api/most-recent-fitting/');
  }

}
