import { Component, OnInit } from '@angular/core';
import { RingEvent } from '@ringface/data';
import { Observable } from 'rxjs';
import { DaysData } from '../common/data-interfaces';
import { BffService } from '../services/bff.service';

@Component({
  selector: 'ringface-all-events',
  templateUrl: './all-events.component.html',
  styleUrls: ['./all-events.component.scss'],
})
export class AllEventsComponent implements OnInit {
  ringEvents: Observable<RingEvent[]>;

  constructor(private bffService: BffService) {}

  ngOnInit(): void {
    this.ringEvents = this.bffService.eventsAll();
    // .subscribe( allRingEvents => {
    //   console.log(`Loaded ${allRingEvents.length} events`);
    //   this.ringEvents = allRingEvents;
    // })
  }

  /**
   * ./data/videos/20210322-141301.mp4 -> 20210322-141301.mp4
   */
  videoLink(event: RingEvent) {
    return '/api/videos/' + event.videoFileName.replace(/^.*[\\\/]/, '');
  }
}
