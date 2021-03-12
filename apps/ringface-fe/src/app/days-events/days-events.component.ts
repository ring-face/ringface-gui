import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { UnprocessedEvent } from '@ringface/data';

@Component({
  selector: 'ringface-days-events',
  templateUrl: './days-events.component.html',
  styleUrls: ['./days-events.component.scss']
})
export class DaysEventsComponent implements OnInit {

  events:UnprocessedEvent[];

  constructor(
    private httpClient:HttpClient
  ) { }

  ngOnInit(): void {
    this.httpClient.get<UnprocessedEvent[]>('/api/unprocessed-events').subscribe(
      eventList => this.events = eventList
    );
  }

}



