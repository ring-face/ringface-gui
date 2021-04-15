import { Component, Host, Input, OnInit } from '@angular/core';
import { RingEvent, UnknownPerson } from '@ringface/data';
import { DaysEventsComponent } from '../days-events/days-events.component';
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
    "NO_PERSON_TAGGED_YET",
  ]
  buttonDisabled = false;
  parent: DaysEventsComponent;

  constructor(
    private bffService: BffService,
    @Host() parent: DaysEventsComponent
  ) {
    this.parent = parent;
  }

  ngOnInit(): void {
    console.log("will tag persons in event: ", this.event);

    this.bffService.mostRecentFitting().subscribe(fittingResult => {
      console.log(`fitting result retrieved`, fittingResult);
      if (fittingResult){
        this.knownPersons = fittingResult.persons.map( personImages => personImages.personName);
      }
    });
  }

  onTag(unknownPerson: UnknownPerson){
    console.log(`Unknown person will be tagged as ${this.newName}`);
    this.bffService.tagPerson(this.event.eventName, unknownPerson, this.newName).subscribe(response =>{
      unknownPerson.name = this.newName;
      unknownPerson.buttonDisabled = true;
      this.parent.onPersonTagged();
    });
  }

  onDelete(unknownPerson: UnknownPerson){
    console.log(`Unknown person ${unknownPerson.name} will be deleted`);
    this.bffService.deleteUnknown(this.event.eventName, unknownPerson).subscribe(response => {
      unknownPerson.buttonDisabled = true;
      this.parent.onUnknownDeleted();
    });

  }

}
