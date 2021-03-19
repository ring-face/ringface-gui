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
  newName:string;
  knownPersons :string[]=[
    "initialising",
  ]
  buttonDisabled = false;

  constructor(
    private bffService: BffService
  ) { }

  ngOnInit(): void {
    this.bffService.mostRecentFitting().subscribe(fittingResult => {
      console.log(`fitting result retrieved`, fittingResult);
      this.knownPersons = fittingResult.persons.map( personImages => personImages.personName);
    });
  }

  onTag(unknownPerson: UnknownPerson){
    console.log(`Unknown person will be tagged as ${this.newName}`);
    this.bffService.tagPerson(this.event.eventName, unknownPerson, this.newName).subscribe(response =>{
      unknownPerson.name = this.newName;
      this.buttonDisabled = true;
    });
  }

}
