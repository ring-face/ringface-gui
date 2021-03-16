import { Component, Input, OnInit } from '@angular/core';
import { RingEvent, UnknownPerson } from '@ringface/data';
import { BffService } from '../services/bff.service';

@Component({
  selector: 'ringface-tag-person',
  templateUrl: './tag-person.component.html',
  styleUrls: ['./tag-person.component.scss']
})
export class TagPersonComponent implements OnInit {

  @Input() event: RingEvent;
  knownPersons :string[]=[
    "initialising",
  ]

  constructor(
    private bffService: BffService
  ) { }

  ngOnInit(): void {
    this.bffService.mostRecentFitting().subscribe(fittingResult => {
      console.log(`fitting result retrieved`, fittingResult);
      this.knownPersons = Object.keys(fittingResult.persons);
    });
  }

  onTag(unknownPerson: UnknownPerson){
    console.log(`Unknown person tagged to ${unknownPerson.name}`);
  }

}
