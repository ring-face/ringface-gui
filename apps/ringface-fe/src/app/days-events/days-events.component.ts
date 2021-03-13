import { Component, Input, OnInit } from '@angular/core';
import { DaysData } from '../common/data-interfaces';

@Component({
  selector: 'ringface-days-events',
  templateUrl: './days-events.component.html',
  styleUrls: ['./days-events.component.scss']
})
export class DaysEventsComponent implements OnInit {

  @Input() daysData?: DaysData;


  constructor(
    // private httpClient:HttpClient
  ) {
    console.log('Constructed');

  }

  ngOnInit(): void {
    console.log(`Init DaysEvents for ${this.daysData.name} and events ${this.daysData.events}`)
    // this.httpClient.get<UnprocessedEvent[]>('/api/unprocessed-events').subscribe(
    //   eventList => this.events = eventList
    // );
  }

}



