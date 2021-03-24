import { Component, OnInit } from '@angular/core';
import { PersonImages } from '@ringface/data';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { BffService } from '../services/bff.service';

@Component({
  selector: 'ringface-persons',
  templateUrl: './persons.component.html',
  styleUrls: ['./persons.component.scss']
})
export class PersonsComponent implements OnInit {

  persons$: Observable<PersonImages[]>;


  constructor(
    private bffService: BffService
  ) { }

  ngOnInit(): void {
    console.log(`Loading persons`)

    this.persons$ = this.bffService.loadAllPersonImages().pipe(
      tap((res) => {
        console.log(`Loaded ${res.length} persons`)
      })
    );
  }

}
