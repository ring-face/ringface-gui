import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { UnprocessedEvent } from '@ringface/data';


interface DaysData {
  name: string,
  date: Date,
  events: UnprocessedEvent[]
}

@Component({
  selector: 'ringface-weeks-events',
  templateUrl: './weeks-events.component.html',
  styleUrls: ['./weeks-events.component.scss']
})
export class WeeksEventsComponent implements OnInit {
  MAX_DAYS = 7;
  WEEKDAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday',
    'Friday', 'Saterday', 'Sunday'];
  days = [] as DaysData[];



  constructor(
    private httpClient: HttpClient
  ) {
    const today = new Date();

    for(let i = 0; i < this.MAX_DAYS; i++) {
      const newDate = new Date(today.setDate(today.getDate() - 1));
      this.days.push(
        {
          name:this.WEEKDAYS[newDate.getDay()],
          date: newDate,
          events:[] }
      );
    }
    this.days[0].name = "Today"
  }

  ngOnInit(): void {
    this.days.forEach(daysData => {
      this.httpClient.get<UnprocessedEvent[]>(`/api/unprocessed-events/${yyyymmdd(daysData.date)}`).subscribe(
        eventList => {
          console.log(`Got ${eventList} for ${daysData.name}`)
          daysData.events = eventList;
        }
      );
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

