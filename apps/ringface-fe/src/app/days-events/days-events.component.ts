import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ringface-days-events',
  templateUrl: './days-events.component.html',
  styleUrls: ['./days-events.component.scss']
})
export class DaysEventsComponent implements OnInit {

  events = EVENTS;

  constructor() { }

  ngOnInit(): void {
  }

}

const EVENTS: ProcessedEvent[] =  [{
  "id": 6937995083683256159,
  "createdAt": "20210310-120421",
  "answered": false,
  "kind": "ding",
  "duration": 31.0
},
{
  "id": 6938074484743657311,
  "createdAt": "20210310-171228",
  "answered": true,
  "kind": "ding",
  "duration": 19.0
}]

interface ProcessedEvent{
  id: number,
  createdAt: string,
  answered: boolean,
  kind: string,
  duration: number
}
