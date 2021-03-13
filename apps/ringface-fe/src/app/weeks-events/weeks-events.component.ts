import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { UnprocessedEvent } from '@ringface/data';
import { DaysData } from '../common/data-interfaces';
import { share } from 'rxjs/operators'


@Component({
  selector: 'ringface-weeks-events',
  templateUrl: './weeks-events.component.html',
  styleUrls: ['./weeks-events.component.scss']
})
export class WeeksEventsComponent implements OnInit {
  MAX_DAYS = 7;
  WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday',
    'Friday', 'Saturday'];
  days = [] as DaysData[];



  constructor(
    private httpClient: HttpClient
  ) {
    const actDate = new Date();

    for(let i = 0; i < this.MAX_DAYS; i++) {
      const newDate = new Date(actDate);
      this.days.push(
        {
          name:this.WEEKDAYS[newDate.getDay()],
          date: newDate}
      );
      actDate.setDate(actDate.getDate() - 1);
    }
    this.days[0].name = "Today"
  }

  ngOnInit(): void {
    this.days.forEach(daysData => {
      daysData.events = this.httpClient.get<UnprocessedEvent[]>(`/api/unprocessed-events/${yyyymmdd(daysData.date)}`).pipe(share());

      // .subscribe(
      //   eventList => {
      //     console.log(`Got ${eventList} for ${daysData.name}`);
      //     if (eventList){
      //       daysData.events = eventList;

      //     }
      //   }
      // );
    });
  }

}

function yyyymmdd(date: Date) {
  const mm = date.getMonth() + 1; // getMonth() is zero-based
  const dd = date.getDate();

  return [date.getFullYear(),
          (mm>9 ? '' : '0') + mm,
          (dd>9 ? '' : '0') + dd
         ].join('');
};

