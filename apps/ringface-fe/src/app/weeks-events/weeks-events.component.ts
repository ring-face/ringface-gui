import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { UnprocessedEvent,DownloadFromRingResponse } from '@ringface/data';
import { DaysData } from '../common/data-interfaces';
import { share } from 'rxjs/operators'
import { yyyymmdd } from '../common/utils'


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
      this.refreshDay(daysData);

    });
  }

  private refreshDay(daysData: DaysData) {
    daysData.events = this.httpClient.get<UnprocessedEvent[]>(`/api/unprocessed-events/${yyyymmdd(daysData.date)}`).pipe(share());
  }

  onDownloadEventsFromRing(daysData: DaysData){
    const dateToDownload = yyyymmdd(daysData.date);
    console.log(`Trigger download of new ring events for ${dateToDownload}`)
    this.httpClient.get<DownloadFromRingResponse>(`/api/trigger-download-from-ring/${dateToDownload}`)
      .subscribe(response => {
        console.log(`Ring download finished with ${response.eventCount} events, refreshing ${dateToDownload}`);
        this.refreshDay(daysData);
      });
  }

}


