import { Component, Input, OnInit, TemplateRef } from '@angular/core';
import { RingEvent, ProcessEventResponse } from '@ringface/data';
import { Observable } from 'rxjs';
import { isObservable } from "rxjs";
import { HttpClient } from '@angular/common/http';
import { BffService } from '../services/bff.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'ringface-days-events',
  templateUrl: './days-events.component.html',
  styleUrls: ['./days-events.component.scss']
})
export class DaysEventsComponent implements OnInit {

  @Input() events: Observable<RingEvent[]>;
  @Input() date:Date;

  tagPersonModal: BsModalRef;
  selectedEvent: RingEvent;



  constructor(
    private httpClient: HttpClient,
    private bffService: BffService,
    private modalService: BsModalService
  ) {

  }

  ngOnInit(): void {
    console.log(`Init DaysEvents. Events type is observable: ${isObservable(this.events)}`)
  }

  onProcessEvent(event:RingEvent){
    console.log(`Will start processing event ${event.eventName}`);
    event.processingTriggered = true;
    this.bffService.processEvent(event)
    .subscribe(
      response => {
        console.log(response);
        this.events = this.bffService.events(this.date);
      },
      error => {
        event.processingTriggered = false;
      }
    );
  }

  onTagPersonButtonClicked(event:RingEvent, template: TemplateRef<any>){
    this.selectedEvent = event;
    this.tagPersonModal = this.modalService.show(template);
  }

  onPersonTagged(){
    console.log(`onPersonTagged, refreshing events for ${this.date}`);
    this.events = this.bffService.events(this.date);
  }

  /**
   * ./data/videos/20210322-141301.mp4 -> 20210322-141301.mp4
   */
  videoLink(event: RingEvent){
    return '/api/videos/' + event.videoFileName.replace(/^.*[\\\/]/, '');
  }

}



