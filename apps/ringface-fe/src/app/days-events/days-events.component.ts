import { Component, Input, OnInit } from '@angular/core';
import { ProcessedEvent } from '@ringface/data';
import { Observable } from 'rxjs';
import { DaysData } from '../common/data-interfaces';
import { isObservable } from "rxjs";


@Component({
  selector: 'ringface-days-events',
  templateUrl: './days-events.component.html',
  styleUrls: ['./days-events.component.scss']
})
export class DaysEventsComponent implements OnInit {

  @Input() events: Observable<ProcessedEvent[]>;


  constructor(
  ) {

  }

  ngOnInit(): void {
    console.log(`Init DaysEvents. Events type is observable: ${isObservable(this.events)}`)
  }

}



