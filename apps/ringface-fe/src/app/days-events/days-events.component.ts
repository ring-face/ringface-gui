import { Component, Input, OnInit } from '@angular/core';
import { RingEvent, ProcessEventResponse } from '@ringface/data';
import { Observable } from 'rxjs';
import { DaysData } from '../common/data-interfaces';
import { isObservable } from "rxjs";
import { HttpClient } from '@angular/common/http';
import { EventService } from '../services/event-service.service';

@Component({
  selector: 'ringface-days-events',
  templateUrl: './days-events.component.html',
  styleUrls: ['./days-events.component.scss']
})
export class DaysEventsComponent implements OnInit {

  @Input() events: Observable<RingEvent[]>;
  @Input() date:Date;


  constructor(
    private httpClient: HttpClient,
    private eventService: EventService
  ) {

  }

  ngOnInit(): void {
    console.log(`Init DaysEvents. Events type is observable: ${isObservable(this.events)}`)
  }

  processEvent(event:RingEvent){
    console.log(`Will start processing event ${event.eventName}`);
    this.httpClient.post<ProcessEventResponse>(`/api/process-event`, event)
    .subscribe( response => {
      console.log(response);
      this.events = this.eventService.events(this.date);
    });
  }

}



