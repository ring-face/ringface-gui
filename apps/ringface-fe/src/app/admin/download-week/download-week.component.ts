import { Component, OnInit } from '@angular/core';
import { DownloadAndProcessProgress } from '@ringface/data';
import { BffService } from '../../services/bff.service';

@Component({
  selector: 'ringface-download-week',
  templateUrl: './download-week.component.html',
  styleUrls: ['./download-week.component.scss']
})
export class DownloadWeekComponent implements OnInit {

  downloadActive = false;
  weekDownloadProgress: DownloadAndProcessProgress;

  constructor(
    private bff:BffService
  ) { }

  ngOnInit(): void {
    this.refreshStatus();
  }

  refreshStatus(){
    this.bff.downloadWeekStatus().subscribe(weekDownloadProgress => {
      console.log(`Download week status`, weekDownloadProgress);
      this.downloadActive = null != weekDownloadProgress;
      this.weekDownloadProgress = weekDownloadProgress;

      if (this.downloadActive){
        setTimeout(() => {
          this.refreshStatus();
        }, 500);
      }
    });
  }

  onStartButtonClicked(){
    this.bff.downloadWeek();
    this.refreshStatus();
  }

}
