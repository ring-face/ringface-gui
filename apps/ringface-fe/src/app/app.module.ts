import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';

import { AlertModule } from 'ngx-bootstrap/alert';
import { AccordionModule } from 'ngx-bootstrap/accordion'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DaysEventsComponent } from './days-events/days-events.component';
import { HttpClientModule } from '@angular/common/http';
import { WeeksEventsComponent } from './weeks-events/weeks-events.component';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TagPersonComponent } from './tag-person/tag-person.component';




@NgModule({
  declarations: [
    AppComponent,
    DaysEventsComponent,
    WeeksEventsComponent,
    TagPersonComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AlertModule.forRoot(),
    AccordionModule.forRoot(),
    CarouselModule.forRoot(),
    ModalModule.forRoot(),
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
