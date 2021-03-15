import { Component, Input, OnInit } from '@angular/core';
import { RingEvent } from '@ringface/data';

@Component({
  selector: 'ringface-tag-person',
  templateUrl: './tag-person.component.html',
  styleUrls: ['./tag-person.component.scss']
})
export class TagPersonComponent implements OnInit {

  @Input() event: RingEvent;

  constructor() { }

  ngOnInit(): void {
  }

}
