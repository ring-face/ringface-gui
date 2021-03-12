import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';

import { AlertModule } from 'ngx-bootstrap/alert';
import { AccordionModule } from 'ngx-bootstrap/accordion'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DaysEventsComponent } from './days-events/days-events.component';
import { HttpClientModule } from '@angular/common/http';
import { WeeksEventsComponent } from './weeks-events/weeks-events.component';


@NgModule({
  declarations: [
    AppComponent,
    DaysEventsComponent,
    WeeksEventsComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AlertModule.forRoot(),
    AccordionModule.forRoot(),
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
