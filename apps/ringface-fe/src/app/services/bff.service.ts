import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RingEvent,DownloadFromRingResponse, FittingResult, UnknownPerson, TagPersonRequest, TagPersonResponse } from '@ringface/data';
import { yyyymmdd } from '../common/utils'
import { share, catchError, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class BffService {


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

  tagPerson(eventName: string, unknownPerson: UnknownPerson, newName: string) {
    const tagPersonRequest = {eventName, unknownPerson, newName} as TagPersonRequest;
    return this.httpClient.post<TagPersonResponse>(`/api/tag-person/`, tagPersonRequest).pipe(
      tap(_ => console.log(`tagged ${unknownPerson} to ${newName}`)),
      catchError(this.handleError<TagPersonResponse>())
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      console.error(error);


      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

}
