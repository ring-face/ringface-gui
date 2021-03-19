import { Component, OnInit } from '@angular/core';
import { DaysData } from '../common/data-interfaces';
import { BffService } from '../services/bff.service';


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
    private bffService: BffService
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
    daysData.events =  this.bffService.events(daysData.date);
  }

  onDownloadEventsFromRing(daysData: DaysData){
    daysData.processingTriggered = true;
    this.bffService.triggerDownloadFromRing(daysData.date)
      .subscribe(response => {
        console.log(`Ring download finished with ${response.eventCount} events, refreshing ${daysData.date}`);
        this.refreshDay(daysData);
      });
  }

}


