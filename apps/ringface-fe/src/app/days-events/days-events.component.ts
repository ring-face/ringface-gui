import { Component, Input, OnInit } from '@angular/core';
import { ProcessedEvent, UnprocessedEvent, ProcessEventResponse } from '@ringface/data';
import { Observable } from 'rxjs';
import { DaysData } from '../common/data-interfaces';
import { isObservable } from "rxjs";
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'ringface-days-events',
  templateUrl: './days-events.component.html',
  styleUrls: ['./days-events.component.scss']
})
export class DaysEventsComponent implements OnInit {

  @Input() events: Observable<ProcessedEvent[]>;


  constructor(
    private httpClient: HttpClient
  ) {

  }

  ngOnInit(): void {
    console.log(`Init DaysEvents. Events type is observable: ${isObservable(this.events)}`)
  }

  processEvent(event:UnprocessedEvent){
    console.log(`Will start processing event ${event.eventName}`);
    this.httpClient.post<ProcessEventResponse>(`/api/process-event`, event)
    .subscribe( response => {
      console.log(response);
      // TODO: refres the day
    });
  }

}



